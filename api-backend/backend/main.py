"""
FastAPI Main Application
Travel India API with Supabase Integration
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from typing import List, Optional, Dict, Any
import httpx
import asyncio

# Use the simpler models to avoid Pydantic version issues
try:
    from .models import (
        Destination, 
        DestinationCreate, 
        DestinationUpdate,
        ChatMessage,
        ChatResponse,
        SystemStatus
    )
except ImportError:
    # Fallback to simpler models
    from .models_simple import (
        Destination, 
        DestinationCreate, 
        DestinationUpdate,
        ChatMessage,
        ChatResponse,
        SystemStatus
    )

from .database import SupabaseClient
from .services import TravelService, AIService

# Load environment variables
load_dotenv(".env.fastapi")

# Initialize FastAPI app
app = FastAPI(
    title="Travel India API",
    description="FastAPI backend for Travel India with Supabase integration",
    version="1.0.0",
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
        "message": "🇮🇳 Travel India FastAPI Backend",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "🟢 Active",
        "features": [
            "🏛️ Destination Management",
            "🤖 AI Travel Assistant", 
            "🔍 Smart Search",
            "📊 Analytics Dashboard"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Supabase connection
        supabase_status = await supabase_client.test_connection()
        
        return {
            "status": "🟢 Healthy",
            "database": "🟢 Connected" if supabase_status else "🟡 Mock Mode",
            "timestamp": travel_service.get_current_timestamp(),
            "services": {
                "fastapi": "🟢 Running",
                "supabase": "🟢 Connected" if supabase_status else "🟡 Disconnected",
                "ai": "🟢 Available"
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
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching destinations: {str(e)}")

@app.get("/api/destinations/{destination_id}")
async def get_destination(destination_id: int):
    """Get a specific destination by ID"""
    try:
        destination = await travel_service.get_destination_by_id(destination_id)
        if not destination:
            raise HTTPException(status_code=404, detail="Destination not found")
        return {"destination": destination}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching destination: {str(e)}")

@app.post("/api/destinations")
async def create_destination(destination_data: dict):
    """Create a new destination"""
    try:
        # Validate required fields
        required_fields = ['name', 'location', 'state', 'description', 'category', 'rating', 'price_from']
        for field in required_fields:
            if field not in destination_data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        new_destination = await travel_service.create_destination_dict(destination_data)
        return {"destination": new_destination, "message": "Destination created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating destination: {str(e)}")

@app.put("/api/destinations/{destination_id}")
async def update_destination(destination_id: int, destination_data: dict):
    """Update an existing destination"""
    try:
        updated_destination = await travel_service.update_destination_dict(destination_id, destination_data)
        if not updated_destination:
            raise HTTPException(status_code=404, detail="Destination not found")
        return {"destination": updated_destination, "message": "Destination updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating destination: {str(e)}")

@app.delete("/api/destinations/{destination_id}")
async def delete_destination(destination_id: int):
    """Delete a destination"""
    try:
        success = await travel_service.delete_destination(destination_id)
        if not success:
            raise HTTPException(status_code=404, detail="Destination not found")
        return {"message": "Destination deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting destination: {str(e)}")

# Search endpoints
@app.get("/api/search/destinations")
async def search_destinations(
    query: str = Query(..., description="Search query"),
    limit: Optional[int] = Query(10, description="Number of results to return")
):
    """Search destinations by name, location, or description"""
    try:
        results = await travel_service.search_destinations(query, limit)
        return {
            "query": query,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching destinations: {str(e)}")

# AI Chat endpoints
@app.post("/api/chat")
async def chat_with_ai(chat_data: dict):
    """Chat with AI travel assistant"""
    try:
        message = chat_data.get('message', '')
        conversation_history = chat_data.get('conversation_history', [])
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Get destinations data for context
        destinations = await travel_service.get_destinations(limit=20)
        
        # Process with AI service
        response = await ai_service.process_message(
            message,
            conversation_history,
            destinations
        )
        
        return {
            "response": response,
            "success": True,
            "provider": "FastAPI + Supabase",
            "timestamp": travel_service.get_current_timestamp()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

# System status endpoint
@app.get("/api/system-status")
async def get_system_status():
    """Get system status information"""
    try:
        # Test database connection
        db_connected = await supabase_client.test_connection()
        
        # Count destinations
        destinations_count = 0
        if db_connected:
            destinations = await travel_service.get_destinations(limit=1000)
            destinations_count = len(destinations)
        
        return {
            "database": {
                "supabase": {
                    "connected": db_connected,
                    "destinations": destinations_count,
                    "mode": "live_data" if db_connected else "mock_data"
                }
            },
            "ai": {
                "groq": {
                    "configured": bool(os.getenv("GROQ_API_KEY")),
                    "available": True,
                    "model": "llama-3.1-70b-versatile"
                },
                "fastapi": {
                    "active": True,
                    "version": "1.0.0"
                }
            },
            "system": {
                "timestamp": travel_service.get_current_timestamp(),
                "mode": "FastAPI + Supabase",
                "version": "1.0.0"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting system status: {str(e)}")

# Analytics endpoints
@app.get("/api/analytics/popular-destinations")
async def get_popular_destinations(limit: Optional[int] = Query(5, description="Number of popular destinations")):
    """Get most popular destinations by rating"""
    try:
        destinations = await travel_service.get_destinations(limit=100)
        popular = sorted(destinations, key=lambda x: x.rating, reverse=True)[:limit]
        return {
            "popular_destinations": popular,
            "count": len(popular)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting popular destinations: {str(e)}")

@app.get("/api/analytics/budget-ranges")
async def get_budget_ranges():
    """Get budget analysis across all destinations"""
    try:
        destinations = await travel_service.get_destinations(limit=1000)
        
        if not destinations:
            return {"budget_analysis": "No data available"}
        
        prices = [dest.price_from for dest in destinations]
        
        analysis = {
            "min_price": min(prices),
            "max_price": max(prices),
            "avg_price": sum(prices) // len(prices),
            "budget_ranges": {
                "budget": len([p for p in prices if p < 15000]),
                "mid_range": len([p for p in prices if 15000 <= p < 30000]),
                "luxury": len([p for p in prices if p >= 30000])
            },
            "total_destinations": len(destinations)
        }
        
        return {"budget_analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing budget ranges: {str(e)}")

# Additional utility endpoints
@app.get("/api/categories")
async def get_categories():
    """Get all available destination categories"""
    return {
        "categories": ["Heritage", "Nature", "Beach", "Spiritual", "Adventure"],
        "descriptions": {
            "Heritage": "Historical sites, monuments, and cultural landmarks",
            "Nature": "Natural landscapes, wildlife, and outdoor experiences",
            "Beach": "Coastal destinations with beaches and water activities",
            "Spiritual": "Religious sites, temples, and spiritual experiences",
            "Adventure": "Trekking, sports, and adventure activities"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
