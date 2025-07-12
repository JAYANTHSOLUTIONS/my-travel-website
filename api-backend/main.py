from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from agent import build_graph, supabase_client  # <- ✅ import supabase client from agent.py

app = FastAPI()
graph = build_graph()

# Enable CORS (relax for now, tighten in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root endpoint to avoid 404 on GET /
@app.get("/")
async def root():
    return {
        "message": "Welcome to Travel Agent AI API. Use POST /query with {'question': 'your question'}"
    }

# ✅ Input model for /query
class QueryRequest(BaseModel):
    question: str

# ✅ POST /query — AI travel planner endpoint
@app.post("/query")
async def run_agent(request: QueryRequest):
    user_input = request.question
    initial_state = {
        "messages": [{"role": "user", "content": user_input}]
    }
    result = graph.invoke(initial_state)
    return {"response": result["messages"][-1]["content"]}

# ✅ NEW: GET /destinations — all places from Supabase
@app.get("/destinations")
async def get_all_destinations():
    try:
        response = supabase_client.table("destinations").select("*").execute()
        return JSONResponse(content={"destinations": response.data})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ✅ NEW: GET /destinations/{category} — filtered by category
@app.get("/destinations/{category}")
async def get_destinations_by_category(category: str):
    try:
        category = category.capitalize()  # Normalize category input
        response = supabase_client.table("destinations").select("*").eq("category", category).execute()
        return JSONResponse(content={"destinations": response.data})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
