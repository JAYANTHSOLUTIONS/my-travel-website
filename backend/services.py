"""
Business Logic Services
Travel and AI services with OpenAI integration
"""

import os
import httpx
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
import json
import sys
from pathlib import Path

# Add parent directory to path for backend imports
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

from backend.database import SupabaseClient

# Try to import models, fallback to simple dict operations
try:
    from backend.models_simple import Destination, DestinationCreate, DestinationUpdate
    USE_MODELS = True
except ImportError:
    USE_MODELS = False
    print("⚠️ Models not available, using dict operations")

# ARIA System Prompt for consistent personality
ARIA_SYSTEM_PROMPT = """You are ARIA, an intelligent travel assistant for the website Travel India AI.

🎯 Your mission is to:
- Help users explore India's destinations
- Recommend places, prices, categories (nature, adventure, heritage, spiritual, etc.)
- Plan itineraries, estimate costs, and give tips
- Use live destination data from the backend when available

👤 Personality:
- Warm, friendly, and talks like a helpful local guide
- Understands what user asked earlier (memory/context-aware)
- Don't repeat information unless asked
- Ask helpful follow-up questions when needed

🧠 Behavior:
- If a user mentions a place (e.g., Kerala), and later says "show dates", remember the previous place.
- Always format prices as ₹ and show categories, ratings, and tips in a clean style.
- Keep responses under 100 words unless user asks for more details.
- Never repeat the same intro twice unless the user resets.

🧾 Example output format:
🏛️ **{Destination Name}** in {Location}
💰 Starting at: ₹{Price} | ⭐ {Rating}/5.0 | 🏷️ {Category}

**Why Visit:**
{Short description or highlights}

**💡 Travel Tips:**
• {Tip 1}
• {Tip 2}

Always be helpful, natural, and context-aware."""

class TravelService:
    def __init__(self, supabase_client: SupabaseClient):
        self.db = supabase_client
    
    async def get_destinations(
        self, 
        limit: int = 20, 
        featured: Optional[bool] = None,
        category: Optional[str] = None
    ) -> List[Union[Dict[str, Any], Any]]:
        """Get destinations with optional filters"""
        data = await self.db.get_destinations(limit, featured, category)
        
        if USE_MODELS:
            try:
                return [Destination(**dest) for dest in data]
            except Exception as e:
                print(f"⚠️ Model conversion failed, returning raw data: {e}")
                return data
        else:
            return data
    
    async def get_destination_by_id(self, destination_id: int) -> Optional[Union[Dict[str, Any], Any]]:
        """Get a specific destination by ID"""
        data = await self.db.get_destination_by_id(destination_id)
        
        if not data:
            return None
            
        if USE_MODELS:
            try:
                return Destination(**data)
            except Exception as e:
                print(f"⚠️ Model conversion failed, returning raw data: {e}")
                return data
        else:
            return data
    
    async def search_destinations(self, query: str, limit: int = 10) -> List[Union[Dict[str, Any], Any]]:
        """Search destinations by text"""
        data = await self.db.search_destinations(query, limit)
        
        if USE_MODELS:
            try:
                return [Destination(**dest) for dest in data]
            except Exception as e:
                print(f"⚠️ Model conversion failed, returning raw data: {e}")
                return data
        else:
            return data
    
    async def get_destinations_by_category(self, category: str, limit: int = 10) -> List[Union[Dict[str, Any], Any]]:
        """Get destinations by specific category"""
        return await self.get_destinations(limit=limit, category=category)
    
    async def get_budget_destinations(self, max_budget: int, limit: int = 10) -> List[Union[Dict[str, Any], Any]]:
        """Get destinations within budget range"""
        all_destinations = await self.get_destinations(limit=100)
        budget_destinations = []
        
        for dest in all_destinations:
            price = dest.get('price_from') if isinstance(dest, dict) else getattr(dest, 'price_from', 0)
            if price <= max_budget:
                budget_destinations.append(dest)
        
        return budget_destinations[:limit]
    
    async def get_top_rated_destinations(self, limit: int = 10) -> List[Union[Dict[str, Any], Any]]:
        """Get highest rated destinations"""
        all_destinations = await self.get_destinations(limit=100)
        sorted_destinations = sorted(
            all_destinations, 
            key=lambda x: x.get('rating') if isinstance(x, dict) else getattr(x, 'rating', 0), 
            reverse=True
        )
        return sorted_destinations[:limit]
    
    def get_current_timestamp(self) -> str:
        """Get current timestamp as ISO string"""
        return datetime.now().isoformat()

class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.base_url = "https://api.openai.com/v1/chat/completions"
        self.model = "gpt-3.5-turbo"
    
    async def process_message(
        self, 
        message: str, 
        conversation_history: List[Dict[str, str]], 
        destinations: List[Any],
        travel_service: TravelService,
        user_preferences: Optional[Dict[str, Any]] = None
    ) -> str:
        """Process user message with OpenAI and live database data"""
        
        # Analyze intent and extract entities
        intent = await self._analyze_intent_with_ai(message, user_preferences or {})
        
        # Fetch relevant data based on intent
        relevant_data = await self._fetch_relevant_data(intent, travel_service)
        
        # Convert destinations to dict format for processing
        destinations_data = self._convert_destinations_to_dict(destinations)
        
        # Build comprehensive context
        context = self._build_enhanced_context(
            message, intent, destinations_data, relevant_data, 
            conversation_history, user_preferences or {}
        )
        
        if self.api_key:
            return await self._generate_with_openai(context, message, conversation_history)
        else:
            return self._generate_enhanced_local_response(intent, destinations_data, relevant_data, message)
    
    async def _analyze_intent_with_ai(self, message: str, user_preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Use AI to analyze user intent more accurately"""
        if self.api_key:
            try:
                intent_prompt = f"""
                Analyze this travel query and extract:
                1. Intent type (destination, budget, itinerary, food, culture, timing, general)
                2. Specific destinations mentioned
                3. Budget range if mentioned
                4. Duration if mentioned
                5. Travel preferences (adventure, culture, relaxation, etc.)
                6. Is this a contextual query referring to previous conversation?
                
                Query: "{message}"
                Previous context: {json.dumps(user_preferences)}
                
                Respond in JSON format:
                {{
                    "intent_type": "string",
                    "destinations": ["list of destinations"],
                    "budget_range": "number or null",
                    "duration": "number or null",
                    "preferences": ["list of preferences"],
                    "contextual": "boolean",
                    "specific_questions": ["list of specific questions"]
                }}
                """
                
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        self.base_url,
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": self.model,
                            "messages": [{"role": "user", "content": intent_prompt}],
                            "max_tokens": 300,
                            "temperature": 0.3
                        },
                        timeout=10.0
                    )
                    
                    if response.status_code == 200:
                        ai_response = response.json()["choices"][0]["message"]["content"]
                        try:
                            return json.loads(ai_response)
                        except json.JSONDecodeError:
                            pass
            except Exception as e:
                print(f"⚠️ AI intent analysis failed: {e}")
        
        # Fallback to rule-based analysis
        return self._analyze_intent_rule_based(message, user_preferences)
    
    def _analyze_intent_rule_based(self, message: str, user_preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Rule-based intent analysis as fallback"""
        message_lower = message.lower()
        
        # Check for contextual queries
        contextual_queries = [
            "show dates", "when to visit", "best time", "weather", "climate",
            "how much", "cost", "price", "budget", "itinerary", "plan",
            "tell me more", "details", "more info"
        ]
        
        is_contextual = (any(query in message_lower for query in contextual_queries) and 
                        user_preferences.get('lastMentionedDestination'))
        
        intent_type = "general"
        destinations = []
        budget_range = None
        duration = None
        preferences = []
        
        # Intent detection
        if is_contextual and user_preferences.get('lastMentionedDestination'):
            destinations.append(user_preferences['lastMentionedDestination'])
            if any(word in message_lower for word in ["date", "time", "weather"]):
                intent_type = "timing"
            elif any(word in message_lower for word in ["cost", "budget", "price"]):
                intent_type = "budget"
            elif any(word in message_lower for word in ["plan", "itinerary"]):
                intent_type = "itinerary"
            else:
                intent_type = "destination"
        elif "itinerary" in message_lower or "plan" in message_lower:
            intent_type = "itinerary"
        elif any(word in message_lower for word in ["budget", "cost", "price", "money", "afford"]):
            intent_type = "budget"
        elif any(word in message_lower for word in ["food", "eat", "cuisine", "restaurant", "dish"]):
            intent_type = "food"
        elif any(word in message_lower for word in ["culture", "festival", "tradition", "history"]):
            intent_type = "culture"
        elif any(word in message_lower for word in ["weather", "season", "best time", "when to visit"]):
            intent_type = "timing"
        
        # Extract destinations
        destination_keywords = [
            "delhi", "agra", "jaipur", "mumbai", "goa", "kerala", "rajasthan",
            "himalayas", "manali", "taj mahal", "backwaters", "golden triangle",
            "amritsar", "golden temple", "ladakh", "kashmir", "udaipur", "jodhpur"
        ]
        
        for keyword in destination_keywords:
            if keyword in message_lower:
                destinations.append(keyword)
                if intent_type == "general":
                    intent_type = "destination"
        
        # Extract budget
        import re
        budget_match = re.search(r'₹?(\d+(?:,\d+)*)', message)
        if budget_match:
            budget_range = int(budget_match.group(1).replace(',', ''))
        
        # Extract duration
        duration_match = re.search(r'(\d+)\s*days?', message_lower)
        if duration_match:
            duration = int(duration_match.group(1))
        
        # Extract preferences
        if "adventure" in message_lower:
            preferences.append("adventure")
        if "culture" in message_lower:
            preferences.append("culture")
        if "beach" in message_lower:
            preferences.append("beach")
        if "spiritual" in message_lower:
            preferences.append("spiritual")
        if "nature" in message_lower:
            preferences.append("nature")
        
        return {
            "intent_type": intent_type,
            "destinations": destinations,
            "budget_range": budget_range,
            "duration": duration,
            "preferences": preferences,
            "contextual": is_contextual,
            "specific_questions": []
        }
    
    async def _fetch_relevant_data(self, intent: Dict[str, Any], travel_service: TravelService) -> Dict[str, Any]:
        """Fetch relevant data from database based on intent"""
        relevant_data = {}
        
        try:
            # Always get some general destinations
            relevant_data["all_destinations"] = await travel_service.get_destinations(limit=20)
            
            # Fetch data based on intent type
            if intent["intent_type"] == "budget" and intent.get("budget_range"):
                relevant_data["budget_destinations"] = await travel_service.get_budget_destinations(
                    intent["budget_range"], limit=10
                )
            
            if intent["intent_type"] == "destination" and intent.get("destinations"):
                # Search for specific destinations
                search_results = []
                for dest_name in intent["destinations"]:
                    results = await travel_service.search_destinations(dest_name, limit=3)
                    search_results.extend(results)
                relevant_data["searched_destinations"] = search_results
            
            # Get top rated destinations for recommendations
            relevant_data["top_rated"] = await travel_service.get_top_rated_destinations(limit=5)
            
            # Get destinations by categories if preferences are mentioned
            if intent.get("preferences"):
                category_map = {
                    "adventure": "Adventure",
                    "culture": "Heritage",
                    "beach": "Beach",
                    "spiritual": "Spiritual",
                    "nature": "Nature"
                }
                
                for pref in intent["preferences"]:
                    if pref in category_map:
                        category_destinations = await travel_service.get_destinations_by_category(
                            category_map[pref], limit=5
                        )
                        relevant_data[f"{pref}_destinations"] = category_destinations
        
        except Exception as e:
            print(f"⚠️ Error fetching relevant data: {e}")
        
        return relevant_data
    
    def _convert_destinations_to_dict(self, destinations: List[Any]) -> List[Dict[str, Any]]:
        """Convert destinations to dictionary format"""
        destinations_data = []
        for dest in destinations:
            if hasattr(dest, 'dict'):
                destinations_data.append(dest.dict())
            elif hasattr(dest, '__dict__'):
                destinations_data.append(dest.__dict__)
            else:
                destinations_data.append(dest)
        return destinations_data
    
    def _build_enhanced_context(
        self, 
        message: str, 
        intent: Dict[str, Any], 
        destinations: List[Dict[str, Any]],
        relevant_data: Dict[str, Any],
        conversation_history: List[Dict[str, str]],
        user_preferences: Dict[str, Any]
    ) -> str:
        """Build comprehensive context for AI response"""
        
        # Format destinations data
        destinations_text = "\n".join([
            f"- {dest.get('name', 'Unknown')} in {dest.get('location', 'Unknown')}, {dest.get('state', 'Unknown')}: "
            f"{dest.get('description', 'No description')[:100]}... "
            f"(₹{dest.get('price_from', 0):,}+ | Rating: {dest.get('rating', 0)} | Category: {dest.get('category', 'Unknown')})"
            for dest in destinations[:10]
        ])
        
        # Format relevant data
        relevant_info = ""
        if relevant_data.get("budget_destinations"):
            budget_dests = relevant_data["budget_destinations"][:3]
            relevant_info += f"\nBudget-friendly options:\n"
            for dest in budget_dests:
                name = dest.get('name') if isinstance(dest, dict) else getattr(dest, 'name', 'Unknown')
                price = dest.get('price_from') if isinstance(dest, dict) else getattr(dest, 'price_from', 0)
                relevant_info += f"- {name}: ₹{price:,}+\n"
        
        if relevant_data.get("searched_destinations"):
            search_dests = relevant_data["searched_destinations"][:3]
            relevant_info += f"\nSpecific destinations found:\n"
            for dest in search_dests:
                name = dest.get('name') if isinstance(dest, dict) else getattr(dest, 'name', 'Unknown')
                location = dest.get('location') if isinstance(dest, dict) else getattr(dest, 'location', 'Unknown')
                relevant_info += f"- {name} in {location}\n"
        
        # Format conversation history
        history_text = "\n".join([
            f"{msg.get('role', 'user')}: {msg.get('content', '')}"
            for msg in conversation_history[-5:]  # Last 5 messages
        ])
        
        context = f"""{ARIA_SYSTEM_PROMPT}

CURRENT QUERY ANALYSIS:
- User message: "{message}"
- Intent type: {intent['intent_type']}
- Contextual query: {intent.get('contextual', False)}
- Destinations mentioned: {', '.join(intent.get('destinations', [])) or 'None'}
- Budget range: ₹{intent.get('budget_range', 'Not specified'):,} {'' if intent.get('budget_range') else ''}
- Duration: {intent.get('duration', 'Not specified')} days
- Preferences: {', '.join(intent.get('preferences', [])) or 'None'}

USER PREFERENCES:
- Budget: ₹{user_preferences.get('budget', 'Not specified')}
- Duration: {user_preferences.get('duration', 'Not specified')} days
- Interests: {', '.join(user_preferences.get('interests', [])) or 'None'}
- Last mentioned destination: {user_preferences.get('lastMentionedDestination', 'None')}

LIVE DATABASE DESTINATIONS:
{destinations_text}

RELEVANT DATA FROM DATABASE:
{relevant_info}

RECENT CONVERSATION:
{history_text}

INSTRUCTIONS:
- Follow the exact format specified in the system prompt
- Be context-aware and remember previous mentions
- Keep responses concise (under 100 words) unless more details requested
- Always include real data from the Supabase database
- Format prices as ₹ with proper formatting
- Use emojis as specified in the format
- If contextual query, refer to previously mentioned destinations
- Never repeat the same intro twice
"""
        return context
    
    async def _generate_with_openai(self, context: str, message: str, conversation_history: List[Dict[str, str]]) -> str:
        """Generate response using OpenAI API"""
        try:
            # Prepare messages for OpenAI
            messages = [
                {"role": "system", "content": context}
            ]
            
            # Add conversation history
            for msg in conversation_history[-5:]:  # Last 5 messages
                role = "user" if msg.get("role") == "user" else "assistant"
                messages.append({"role": role, "content": msg.get("content", "")})
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": messages,
                        "max_tokens": 800,
                        "temperature": 0.7,
                        "presence_penalty": 0.1,
                        "frequency_penalty": 0.1
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    ai_response = data["choices"][0]["message"]["content"]
                    print(f"✅ OpenAI response generated successfully")
                    return ai_response
                else:
                    error_data = response.json() if response.headers.get('content-type') == 'application/json' else {}
                    error_msg = error_data.get('error', {}).get('message', f'HTTP {response.status_code}')
                    raise Exception(f"OpenAI API error: {error_msg}")
                    
        except Exception as e:
            print(f"❌ OpenAI API error: {e}")
            return f"I'm having trouble connecting to the AI service right now. However, I can still help you with travel information! Please try rephrasing your question, and I'll do my best to assist you with the destination data I have available."
    
    def _generate_enhanced_local_response(
        self, 
        intent: Dict[str, Any], 
        destinations: List[Dict[str, Any]], 
        relevant_data: Dict[str, Any],
        message: str
    ) -> str:
        """Generate enhanced local response using database data"""
        intent_type = intent["intent_type"]
        
        if intent_type == "destination":
            return self._generate_destination_response_enhanced(destinations, relevant_data, intent)
        elif intent_type == "budget":
            return self._generate_budget_response_enhanced(destinations, relevant_data, intent)
        elif intent_type == "itinerary":
            return self._generate_itinerary_response_enhanced(destinations, relevant_data, intent)
        elif intent_type == "food":
            return self._generate_food_response()
        elif intent_type == "culture":
            return self._generate_culture_response()
        elif intent_type == "timing":
            return self._generate_timing_response()
        else:
            return self._generate_general_response_enhanced(destinations, relevant_data)
    
    def _generate_destination_response_enhanced(
        self, 
        destinations: List[Dict[str, Any]], 
        relevant_data: Dict[str, Any],
        intent: Dict[str, Any]
    ) -> str:
        """Generate enhanced destination response with database data"""
        
        # Use searched destinations if available
        target_destinations = relevant_data.get("searched_destinations", [])
        if not target_destinations and intent.get("destinations"):
            # Fallback to general search
            target_destinations = [
                dest for dest in destinations
                if any(entity.lower() in dest.get('name', '').lower() or 
                      entity.lower() in dest.get('location', '').lower()
                      for entity in intent["destinations"])
            ]
        
        if target_destinations:
            dest = target_destinations[0]
            return f"""🏛️ **{dest.get('name', 'Unknown')}** in {dest.get('location', 'Unknown')}
💰 Starting at: ₹{dest.get('price_from', 0):,} | ⭐ {dest.get('rating', 0)}/5.0 | 🏷️ {dest.get('category', 'Unknown')}

**Why Visit:**
{dest.get('description', 'No description available')[:120]}...

**💡 Travel Tips:**
{self._get_destination_tips(dest)}

Need timing or budget details? 🎯"""
        
        # Show top destinations if no specific match
        top_destinations = relevant_data.get("top_rated", destinations[:3])
        dest_list = "\n".join([
            f"• **{dest.get('name', 'Unknown')}** - ₹{dest.get('price_from', 0):,}+ | ⭐{dest.get('rating', 0)}"
            for dest in top_destinations[:3]
        ])
        
        return f"""🇮🇳 **Top destinations:**

{dest_list}

Which interests you? 🎯"""
    
    def _generate_budget_response_enhanced(
        self, 
        destinations: List[Dict[str, Any]], 
        relevant_data: Dict[str, Any],
        intent: Dict[str, Any]
    ) -> str:
        """Generate enhanced budget response with database data"""
        budget = intent.get("budget_range", 50000)
        duration = intent.get("duration", 7)
        
        # Use budget destinations from database
        budget_destinations = relevant_data.get("budget_destinations", [])
        if not budget_destinations:
            # Fallback to filtering all destinations
            budget_destinations = [
                dest for dest in destinations 
                if dest.get('price_from', 0) <= budget
            ][:3]
        
        if budget_destinations:
            dest_list = "\n".join([
                f"• **{dest.get('name', 'Unknown')}** - ₹{dest.get('price_from', 0):,}+ | ⭐{dest.get('rating', 0)}"
                for dest in budget_destinations[:3]
            ])
        else:
            dest_list = "Consider increasing budget or off-season travel."
        
        return f"""💰 **Budget ₹{budget:,} for {duration} days:**

{dest_list}

**💡 Budget breakdown:**
• Accommodation: 35% (₹{int(budget * 0.35):,})
• Food & Transport: 50% (₹{int(budget * 0.5):,})
• Activities: 15% (₹{int(budget * 0.15):,})

Which destination interests you? 🎯"""
    
    def _generate_itinerary_response_enhanced(
        self, 
        destinations: List[Dict[str, Any]], 
        relevant_data: Dict[str, Any],
        intent: Dict[str, Any]
    ) -> str:
        """Generate enhanced itinerary response with database data"""
        duration = intent.get("duration", 7)
        budget = intent.get("budget_range", 40000)
        
        # Select destinations based on preferences and budget
        suitable_destinations = relevant_data.get("budget_destinations", destinations[:3])
        
        if not suitable_destinations:
            return "Tell me your budget and interests for a perfect itinerary! 🎯"
        
        # Create itinerary
        itinerary_parts = []
        days_per_dest = max(1, duration // len(suitable_destinations[:2]))
        
        for i, dest in enumerate(suitable_destinations[:2]):
            start_day = i * days_per_dest + 1
            end_day = min((i + 1) * days_per_dest, duration) if i == 0 else duration
            
            itinerary_parts.append(f"""**Days {start_day}-{end_day}: {dest.get('name', 'Unknown')}**
₹{dest.get('price_from', 0):,}+ | ⭐{dest.get('rating', 0)} | {dest.get('category', 'Unknown')}""")
        
        itinerary = "\n\n".join(itinerary_parts)
        
        return f"""📅 **{duration}-day itinerary:**

{itinerary}

**💡 Pro tip:** Book trains early for better prices!

Need specific destination details? 🎯"""
    
    def _generate_general_response_enhanced(self, destinations: List[Dict[str, Any]], relevant_data: Dict[str, Any]) -> str:
        """Generate enhanced general response with database data"""
        featured_destinations = [dest for dest in destinations if dest.get('featured', False)][:3]
        if not featured_destinations:
            featured_destinations = destinations[:3]
        
        dest_list = "\n".join([
            f"• **{dest.get('name', 'Unknown')}** - ₹{dest.get('price_from', 0):,}+ | ⭐{dest.get('rating', 0)}"
            for dest in featured_destinations
        ])
        
        return f"""🇮🇳 **Featured destinations:**

{dest_list}

**🤖 I can help with:**
• Destination details & prices
• Budget planning
• Itinerary creation
• Best travel times

What interests you? 🎯"""
    
    def _get_destination_tips(self, dest: Dict[str, Any]) -> str:
        """Get destination-specific tips"""
        category = dest.get('category', 'Unknown')
        tips = {
            'Heritage': '• Visit early morning\n• Hire local guides\n• Respect photography rules',
            'Nature': '• Comfortable shoes essential\n• Best in pleasant weather\n• Book eco-stays',
            'Beach': '• Sunscreen mandatory\n• Try local seafood\n• Respect dress codes',
            'Spiritual': '• Dress modestly\n• Remove shoes at temples\n• Maintain silence',
            'Adventure': '• Book activities ahead\n• Check weather\n• Follow safety rules'
        }
        return tips.get(category, '• Plan ahead\n• Try local experiences\n• Stay flexible')
    
    def _generate_food_response(self) -> str:
        """Generate food-related response"""
        return """🍽️ **Indian cuisine highlights:**

**🌶️ North:** Butter Chicken, Naan, Kebabs
**🥥 South:** Dosa, Idli, Coconut Curry
**🦐 Coastal:** Fish Curry, Seafood

**💡 Food tips:**
• Try thalis for variety
• Street food at busy places
• Start mild, build spice tolerance

Which region's food interests you? 🍛"""
    
    def _generate_culture_response(self) -> str:
        """Generate culture-related response"""
        return """🎭 **Cultural experiences:**

**🎊 Festivals:** Diwali (Oct-Nov), Holi (Mar)
**🏛️ Heritage:** Rajasthan palaces, Kerala arts
**🎨 Crafts:** Block printing, weaving

**💡 Culture tips:**
• Dress modestly at temples
• Ask before photographing
• Learn basic local greetings

Which cultural aspect interests you? 🪔"""
    
    def _generate_timing_response(self) -> str:
        """Generate timing/weather response"""
        return """🌤️ **India travel timing:**

**🏙️ North (Delhi, Rajasthan):** Oct-Mar
**🏝️ South (Kerala, Goa):** Nov-Feb  
**🏔️ Mountains:** Mar-Jun, Sep-Nov
**🏖️ Beaches:** Nov-Feb

Which region interests you? 🎯"""

# Update the main AIService class to use OpenAI
class AIService(OpenAIService):
    """Main AI Service class using OpenAI"""
    pass
