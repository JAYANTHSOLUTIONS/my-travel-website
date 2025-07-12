import os
from pathlib import Path
from openai import OpenAI
from langgraph.graph import StateGraph
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client
from dotenv import load_dotenv

# ✅ Load environment variables from .env.local using absolute path
dotenv_path = Path(__file__).resolve().parent / ".env.local"
load_dotenv(dotenv_path)

# ✅ Secure keys
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# ✅ Debug print (optional, remove after confirming)
print("🔐 SUPABASE_URL:", SUPABASE_URL)
print("🔐 OPENROUTER_API_KEY:", "✅ Loaded" if OPENROUTER_API_KEY else "❌ Missing")

# ✅ Validate environment variables
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials missing.")
if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY missing.")

# ✅ Initialize Supabase and OpenRouter clients
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
openrouter_client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY
)

# ✅ Agent state model
class AgentState(BaseModel):
    messages: List[dict]

# ✅ Format destination info into prompt
def format_prompt(user_query: str, destinations: List[dict]) -> str:
    if not destinations:
        return f"The user asked: '{user_query}'\nBut no destination data is available."

    context = "\n".join([
        f"- {d['name']} in {d['location']}, {d['state']}: {d.get('description', '')}"
        for d in destinations
    ])

    return (
        f"You are a helpful travel assistant.\n"
        f"The user asked: '{user_query}'\n\n"
        f"Here are destination listings from the travel database:\n{context}\n\n"
        f"Now respond intelligently to the user's query using this data. Be natural, friendly, and specific."
    )

# ✅ DeepSeek via OpenRouter call
def call_deepseek(prompt: str) -> Optional[str]:
    try:
        response = openrouter_client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"🚨 DeepSeek API error:", e)
        return None

# ✅ Main query handler node
def query_node(state: AgentState) -> AgentState:
    user_query = state.messages[-1]["content"]
    print(f"📩 User query: {user_query}")

    try:
        result = supabase_client.table("destinations").select("*").execute()
        destinations = result.data if hasattr(result, "data") else []
    except Exception as e:
        print(f"❌ Supabase fetch error:", e)
        state.messages.append({
            "role": "assistant",
            "content": "Sorry, I couldn't fetch destination data due to a server error."
        })
        return state

    prompt = format_prompt(user_query, destinations)
    answer = call_deepseek(prompt)

    if not answer:
        answer = "Sorry, I couldn't generate a response right now. Please try again."

    state.messages.append({"role": "assistant", "content": answer})
    return state

# ✅ Build LangGraph
def build_graph():
    builder = StateGraph(AgentState)
    builder.add_node("query_node", query_node)
    builder.set_entry_point("query_node")
    builder.set_finish_point("query_node")
    return builder.compile()
