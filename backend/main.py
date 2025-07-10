"""
FastAPI Main Application
Travel India API with Supabase and OpenAI Integration
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from typing import List, Optional, Dict, Any
import httpx
import asyncio
import sys
from pathlib import Path

# Add the parent directory to Python path for backend imports
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

# Load environment variables
load_dotenv(".env.fastapi")

# Import with error handling - use backend.module imports
try:
    from backend.database import SupabaseClient
    from backend.services import TravelService, AIService
    print("✅ Successfully imported database and services modules")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("💡 Make sure you're running from the project root directory")
    # Create minimal fallback classes
    class SupabaseClient:
        async def test_connection(self): return False
    class TravelService:
        def __init__(self, client): pass
        async def get_destinations(self, limit=20): return []
        def get_current_timestamp(self): return "2024-01-01T00:00:00"
    class AIService:
        async def process_message(self, *args, **kwargs): 
            return "Service temporarily unavailable. Please check backend configuration."

# Try to import models with fallback
try:
    from backend.models_simple import (
        Destination, 
        DestinationCreate, 
        DestinationUpdate,
        ChatMessage,
        ChatResponse,
        SystemStatus
    )
    print("✅ Successfully imported models")
except ImportError:
    print("⚠️ Models not available, using basic dict responses")
    # Create basic model classes
    class BaseModel:
        pass
    Destination = DestinationCreate = DestinationUpdate = BaseModel
    ChatMessage = ChatResponse = SystemStatus = BaseModel

# Initialize FastAPI app
app = FastAPI(
    title="Travel India API with OpenAI",
    description="FastAPI backend for Travel India with Supabase and OpenAI integration",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
supabase_client = SupabaseClient()
travel_service = TravelService(supabase_client)
ai_service = AIService()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🇮🇳 Travel India FastAPI Backend with OpenAI",
        "version": "2.0.0",
        "docs": "/docs",
        "status": "🟢 Active",
        "features": [
            "🏛️ Live Supabase Database Integration",
            "🤖 OpenAI-Powered Smart Travel Assistant", 
            "🔍 Intelligent Destination Search",
            "📊 Real-time Analytics Dashboard",
            "💰 Smart Budget Planning",
            "📅 AI-Generated Itineraries"
        ],
        "ai_model": "OpenAI GPT-3.5-turbo",
        "database": "Supabase PostgreSQL"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Supabase connection
        supabase_status = await supabase_client.test_connection()
        
        # Test OpenAI connection
        openai_status = bool(os.getenv("OPENAI_API_KEY"))
        
        return {
            "status": "🟢 Healthy",
            "database": "🟢 Connected" if supabase_status else "🟡 Mock Mode",
            "ai_service": "🟢 OpenAI Ready" if openai_status else "🟡 Local Mode",
            "timestamp": travel_service.get_current_timestamp(),
            "services": {
                "fastapi": "🟢 Running",
                "supabase": "🟢 Connected" if supabase_status else "🟡 Disconnected",
                "openai": "🟢 Configured" if openai_status else "🟡 Not Configured",
                "database_mode": "live_data" if supabase_status else "mock_data"
            }
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "🔴 Unhealthy",
                "error": str(e),
                "timestamp": travel_service.get_current_timestamp()
            }
        )

# AI Chat endpoints with OpenAI
@app.post("/api/chat")
async def chat_with_ai(chat_data: dict):
    """Chat with OpenAI-powered travel assistant"""
    try:
        message = chat_data.get('message', '')
        conversation_history = chat_data.get('conversation_history', [])
        user_preferences = chat_data.get('user_preferences', {})
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        print(f"🤖 Processing chat message: {message[:50]}...")
        
        # Get destinations data for context
        destinations = await travel_service.get_destinations(limit=50)
        
        # Process with OpenAI service
        response = await ai_service.process_message(
            message,
            conversation_history,
            destinations,
            travel_service,  # Pass travel service for database queries
            user_preferences
        )
        
        return {
            "response": response,
            "success": True,
            "provider": "OpenAI + FastAPI + Supabase",
            "timestamp": travel_service.get_current_timestamp(),
            "ai_model": "gpt-3.5-turbo",
            "database_destinations": len(destinations)
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

# Destination endpoints
@app.get("/api/destinations")
async def get_destinations(
    limit: Optional[int] = Query(20, description="Number of destinations to return"),
    featured: Optional[bool] = Query(None, description="Filter by featured status"),
    category: Optional[str] = Query(None, description="Filter by category")
):
    """Get all destinations with optional filters"""
    try:
        destinations = await travel_service.get_destinations(
            limit=limit,
            featured=featured,
            category=category
        )
        return {
            "destinations": destinations,
            "count": len(destinations),
            "filters": {
                "limit": limit,
                "featured": featured,
                "category": category
            },
            "message": f"Found {len(destinations)} destinations"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching destinations: {str(e)}")

# System status endpoint
@app.get("/api/system-status")
async def get_system_status():
    """Get comprehensive system status information"""
    try:
        # Test database connection
        db_connected = await supabase_client.test_connection()
        
        # Count destinations
        destinations_count = 0
        if db_connected:
            destinations = await travel_service.get_destinations(limit=1000)
            destinations_count = len(destinations)
        
        # Check OpenAI status
        openai_configured = bool(os.getenv("OPENAI_API_KEY"))
        
        return {
            "database": {
                "supabase": {
                    "connected": db_connected,
                    "destinations": destinations_count,
                    "mode": "live_data" if db_connected else "mock_data",
                    "status": "🟢 Connected" if db_connected else "🟡 Mock Mode"
                }
            },
            "ai": {
                "openai": {
                    "configured": openai_configured,
                    "available": True,
                    "model": "gpt-3.5-turbo",
                    "status": "🟢 Ready" if openai_configured else "🟡 Not Configured"
                },
                "features": [
                    "Smart intent analysis",
                    "Database-aware responses", 
                    "Personalized recommendations",
                    "Budget optimization",
                    "Itinerary generation"
                ]
            },
            "system": {
                "timestamp": travel_service.get_current_timestamp(),
                "mode": "OpenAI + FastAPI + Supabase",
                "version": "2.0.0",
                "status": "🟢 Operational",
                "uptime": "Active"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting system status: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
