"""
Business Logic Services
Travel and AI services for the FastAPI backend
"""

import os
import httpx
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
import json

from .database import SupabaseClient

# Try to import models, fallback to simple dict operations
try:
    from .models import Destination, DestinationCreate, DestinationUpdate
    USE_MODELS = True
except ImportError:
    try:
        from .models_simple import Destination, DestinationCreate, DestinationUpdate
        USE_MODELS = True
    except ImportError:
        USE_MODELS = False

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
    
    async def create_destination(self, destination: Any) -> Union[Dict[str, Any], Any]:
        """Create a new destination using Pydantic model"""
        if USE_MODELS:
            data = await self.db.create_destination(destination.dict())
            return Destination(**data)
        else:
            raise Exception("Models not available, use create_destination_dict instead")
    
    async def create_destination_dict(self, destination_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new destination using dictionary data"""
        # Validate required fields
        required_fields = ['name', 'location', 'state', 'description', 'category', 'rating', 'price_from']
        for field in required_fields:
            if field not in destination_data:
                raise ValueError(f"Missing required field: {field}")
        
        # Validate category
        allowed_categories = ['Heritage', 'Nature', 'Beach', 'Spiritual', 'Adventure']
        if destination_data['category'] not in allowed_categories:
            raise ValueError(f"Category must be one of: {', '.join(allowed_categories)}")
        
        # Validate rating
        if not (0 <= destination_data['rating'] <= 5):
            raise ValueError("Rating must be between 0 and 5")
        
        # Validate price
        if destination_data['price_from'] < 0:
            raise ValueError("Price must be non-negative")
        
        data = await self.db.create_destination(destination_data)
        return data
    
    async def update_destination(self, destination_id: int, destination: Any) -> Optional[Union[Dict[str, Any], Any]]:
        """Update an existing destination using Pydantic model"""
        if USE_MODELS:
            # Only include non-None fields
            update_data = {k: v for k, v in destination.dict().items() if v is not None}
            data = await self.db.update_destination(destination_id, update_data)
            return Destination(**data) if data else None
        else:
            raise Exception("Models not available, use update_destination_dict instead")
    
    async def update_destination_dict(self, destination_id: int, destination_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing destination using dictionary data"""
        # Validate category if provided
        if 'category' in destination_data:
            allowed_categories = ['Heritage', 'Nature', 'Beach', 'Spiritual', 'Adventure']
            if destination_data['category'] not in allowed_categories:
                raise ValueError(f"Category must be one of: {', '.join(allowed_categories)}")
        
        # Validate rating if provided
        if 'rating' in destination_data:
            if not (0 <= destination_data['rating'] <= 5):
                raise ValueError("Rating must be between 0 and 5")
        
        # Validate price if provided
        if 'price_from' in destination_data:
            if destination_data['price_from'] < 0:
                raise ValueError("Price must be non-negative")
        
        data = await self.db.update_destination(destination_id, destination_data)
        return data
    
    async def delete_destination(self, destination_id: int) -> bool:
        """Delete a destination"""
        return await self.db.delete_destination(destination_id)
    
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
    
    def get_current_timestamp(self) -> str:
        """Get current timestamp as ISO string"""
        return datetime.now().isoformat()

class AIService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
    
    async def process_message(
        self, 
        message: str, 
        conversation_history: List[Dict[str, str]], 
        destinations: List[Any]
    ) -> str:
        """Process user message and generate AI response"""
        
        # Analyze intent
        intent = self._analyze_intent(message)
        
        # Convert destinations to dict format for processing
        destinations_data = []
        for dest in destinations:
            if hasattr(dest, 'dict'):
                destinations_data.append(dest.dict())
            elif hasattr(dest, '__dict__'):
                destinations_data.append(dest.__dict__)
            else:
                destinations_data.append(dest)
        
        # Build context with destinations data
        context = self._build_context(message, intent, destinations_data, conversation_history)
        
        if self.groq_api_key:
            return await self._generate_with_groq(context, message)
        else:
            return self._generate_local_response(intent, destinations_data, message)
    
    def _analyze_intent(self, message: str) -> Dict[str, Any]:
        """Analyze user intent from message"""
        message_lower = message.lower()
        
        intent_type = "general"
        entities = []
        
        # Intent detection
        if "itinerary" in message_lower or "plan" in message_lower:
            intent_type = "itinerary"
        elif any(word in message_lower for word in ["budget", "cost", "price", "money"]):
            intent_type = "budget"
        elif any(word in message_lower for word in ["food", "eat", "cuisine", "restaurant"]):
            intent_type = "food"
        elif any(word in message_lower for word in ["culture", "festival", "tradition"]):
            intent_type = "culture"
        elif any(word in message_lower for word in ["weather", "season", "best time"]):
            intent_type = "timing"
        
        # Entity extraction (destinations)
        destination_keywords = [
            "delhi", "agra", "jaipur", "mumbai", "goa", "kerala", "rajasthan",
            "himalayas", "manali", "taj mahal", "backwaters", "golden triangle"
        ]
        
        for keyword in destination_keywords:
            if keyword in message_lower:
                entities.append(keyword)
                if intent_type == "general":
                    intent_type = "destination"
        
        return {
            "type": intent_type,
            "entities": entities,
            "confidence": 0.8
        }
    
    def _build_context(
        self, 
        message: str, 
        intent: Dict[str, Any], 
        destinations: List[Dict[str, Any]],
        conversation_history: List[Dict[str, str]]
    ) -> str:
        """Build context for AI response generation"""
        
        destinations_text = "\n".join([
            f"- {dest.get('name', 'Unknown')} in {dest.get('location', 'Unknown')}, {dest.get('state', 'Unknown')}: {dest.get('description', 'No description')} "
            f"(₹{dest.get('price_from', 0)}+ | Rating: {dest.get('rating', 0)} | Category: {dest.get('category', 'Unknown')})"
            for dest in destinations[:10]
        ])
        
        history_text = "\n".join([
            f"{msg.get('role', 'user')}: {msg.get('content', '')}"
            for msg in conversation_history[-3:]
        ])
        
        context = f"""You are ARIA, an expert India travel assistant with access to real destination data.

Current conversation:
- User query: {message}
- Intent: {intent['type']}
- Detected entities: {', '.join(intent['entities']) if intent['entities'] else 'none'}

Available destinations:
{destinations_text}

Recent conversation:
{history_text}

Guidelines:
- Be conversational and helpful
- Use real data from destinations provided
- Include specific prices, ratings, and details
- Provide actionable recommendations
- Use emojis and formatting for better readability
"""
        return context
    
    async def _generate_with_groq(self, context: str, message: str) -> str:
        """Generate response using Groq API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.groq_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama-3.1-70b-versatile",
                        "messages": [
                            {"role": "system", "content": context},
                            {"role": "user", "content": message}
                        ],
                        "max_tokens": 1000,
                        "temperature": 0.7
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    raise Exception(f"Groq API error: {response.status_code}")
                    
        except Exception as e:
            print(f"❌ Groq API error: {e}")
            return "I'm having trouble connecting to the AI service. Please try again later."
    
    def _generate_local_response(self, intent: Dict[str, Any], destinations: List[Dict[str, Any]], message: str) -> str:
        """Generate local response based on intent"""
        intent_type = intent["type"]
        
        if intent_type == "destination":
            return self._generate_destination_response(destinations, intent["entities"])
        elif intent_type == "budget":
            return self._generate_budget_response(destinations)
        elif intent_type == "food":
            return self._generate_food_response()
        elif intent_type == "culture":
            return self._generate_culture_response()
        elif intent_type == "timing":
            return self._generate_timing_response()
        else:
            return self._generate_general_response(destinations)
    
    def _generate_destination_response(self, destinations: List[Dict[str, Any]], entities: List[str]) -> str:
        """Generate destination-specific response"""
        if entities:
            # Find matching destinations
            matching = [
                dest for dest in destinations
                if any(entity in dest.get('name', '').lower() or entity in dest.get('location', '').lower() 
                      for entity in entities)
            ]
            
            if matching:
                dest = matching[0]
                return f"""🏛️ **{dest.get('name', 'Unknown')}** in {dest.get('location', 'Unknown')}, {dest.get('state', 'Unknown')}

{dest.get('description', 'No description available')}

**💰 Starting Price**: ₹{dest.get('price_from', 0):,} onwards
**⭐ Rating**: {dest.get('rating', 0)}/5.0
**🏷️ Category**: {dest.get('category', 'Unknown')}

This destination is perfect for travelers looking for {dest.get('category', 'unknown').lower()} experiences. Would you like me to help plan a detailed itinerary? 🎯"""
        
        # General destination recommendations
        top_destinations = sorted(destinations, key=lambda x: x.get('rating', 0), reverse=True)[:3]
        dest_list = "\n".join([
            f"• **{dest.get('name', 'Unknown')}** ({dest.get('location', 'Unknown')}) - ₹{dest.get('price_from', 0):,}+ | ⭐{dest.get('rating', 0)}"
            for dest in top_destinations
        ])
        
        return f"""🇮🇳 **Top Recommended Destinations:**

{dest_list}

These are our highest-rated destinations. Which one interests you most? 🎯"""
    
    def _generate_budget_response(self, destinations: List[Dict[str, Any]]) -> str:
        """Generate budget-related response"""
        if not destinations:
            return "I don't have current pricing data available. Please try again later."
        
        prices = [dest.get('price_from', 0) for dest in destinations if dest.get('price_from', 0) > 0]
        if not prices:
            return "No pricing data available for destinations."
            
        min_price = min(prices)
        max_price = max(prices)
        avg_price = sum(prices) // len(prices)
        
        return f"""💰 **India Travel Budget Guide**

**💸 Price Ranges:**
• Budget Travel: ₹{min_price:,} - ₹{avg_price//2:,} per person
• Mid-Range: ₹{avg_price//2:,} - ₹{avg_price*2:,} per person  
• Luxury Travel: ₹{avg_price*2:,}+ per person

**📊 Average Costs:**
• Accommodation: 35% of budget
• Food: 25% of budget
• Transport: 25% of budget
• Activities: 15% of budget

**💡 Money-Saving Tips:**
• Travel during shoulder seasons (Sept-Oct, Feb-March)
• Book trains in advance for better prices
• Try local street food and thalis
• Stay in homestays or budget hotels

Would you like a detailed budget breakdown for a specific destination? 💳"""
    
    def _generate_food_response(self) -> str:
        """Generate food-related response"""
        return """🍽️ **Indian Cuisine - A Culinary Journey**

**🌶️ Regional Specialties:**
• **North India**: Butter Chicken, Naan, Kebabs, Chole Bhature
• **South India**: Dosa, Idli, Sambar, Coconut Curry
• **West India**: Vada Pav, Dhokla, Gujarati Thali
• **East India**: Fish Curry, Rosogolla, Mishti Doi

**🍛 Must-Try Experiences:**
• Street food tours in Delhi and Mumbai
• Traditional thali meals
• Cooking classes in Kerala or Rajasthan
• Spice market visits

**💡 Food Safety Tips:**
• Eat at busy places with high turnover
• Drink bottled or boiled water
• Try vegetarian options for safer choices
• Start with mild spices and build tolerance

Which region's cuisine interests you most? 🍛"""
    
    def _generate_culture_response(self) -> str:
        """Generate culture-related response"""
        return """🎭 **India's Rich Cultural Heritage**

**🎊 Major Festivals:**
• **Diwali** (Oct-Nov): Festival of lights
• **Holi** (March): Festival of colors
• **Durga Puja** (Sept-Oct): Bengali celebration
• **Pushkar Fair** (Nov): Rajasthan's cultural extravaganza

**🏛️ Cultural Experiences:**
• Classical dance performances (Bharatanatyam, Kathak)
• Traditional music concerts
• Art and craft workshops
• Temple architecture tours

**💡 Cultural Etiquette:**
• Dress modestly at religious sites
• Remove shoes before entering temples
• Ask permission before photographing people
• Learn basic greetings in local languages

Would you like to know about cultural experiences in a specific region? 🪔"""
    
    def _generate_timing_response(self) -> str:
        """Generate timing/weather response"""
        return """🌤️ **Best Times to Visit India**

**🏙️ North India (Delhi, Agra, Rajasthan):**
• **Best**: October to March (cool & pleasant)
• **Avoid**: May-June (extreme heat 45°C+)

**🏝️ South India (Kerala, Tamil Nadu):**
• **Best**: November to February (warm but comfortable)
• **Monsoon**: June-September (heavy rainfall)

**🏔️ Himalayas (Manali, Shimla):**
• **Best**: March-June, September-November
• **Avoid**: December-February (heavy snow)

**🏖️ Beaches (Goa, Andamans):**
• **Best**: November to February (perfect weather)
• **Avoid**: June-September (monsoon season)

**💡 Travel Tips:**
• Book 2-3 months ahead for peak season
• Shoulder seasons offer good weather + fewer crowds
• Monsoon brings lush landscapes but travel disruptions

When are you planning to visit? 📅"""
    
    def _generate_general_response(self, destinations: List[Dict[str, Any]]) -> str:
        """Generate general welcome response"""
        featured = [dest for dest in destinations if dest.get('featured', False)][:4]
        
        if not featured:
            featured = destinations[:4]
        
        dest_list = "\n".join([
            f"• **{dest.get('name', 'Unknown')}** ({dest.get('location', 'Unknown')}) - {dest.get('category', 'Unknown')} | ⭐{dest.get('rating', 0)} | ₹{dest.get('price_from', 0):,}+"
            for dest in featured
        ])
        
        return f"""🇮🇳 **Welcome to ARIA - Your AI India Travel Assistant!**

I'm powered by FastAPI and connected to live Supabase data! Here are some featured destinations:

{dest_list}

**🤖 I can help you with:**
• 🏛️ Detailed destination information with real prices
• 💰 Budget planning and cost analysis  
• 📅 Custom itinerary creation
• 🍛 Food and cultural recommendations
• 🌤️ Best travel timing advice

**💬 Try asking me:**
• "Tell me about Kerala backwaters"
• "What's the budget for 10 days in Rajasthan?"
• "Plan a Golden Triangle itinerary"
• "Best time to visit Goa beaches?"

What would you like to explore about incredible India? 🎯✨"""
