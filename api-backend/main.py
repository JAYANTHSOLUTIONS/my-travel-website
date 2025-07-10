"""
FastAPI Main Application
Travel India API with Supabase Integration
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from typing import List, Optional
import httpx

from backend.database import SupabaseClient
from backend.models import (
    Destination, 
    DestinationCreate, 
    DestinationUpdate,
    ChatMessage,
    ChatResponse,
    SystemStatus
)
from backend.services import TravelService, AIService

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
        "message": "Travel India FastAPI Backend",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Supabase connection
        supabase_status = await supabase_client.test_connection()
        
        return {
            "status": "healthy",
            "database": "connected" if supabase_status else "disconnected",
            "timestamp": travel_service.get_current_timestamp()
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": travel_service.get_current_timestamp()
            }
        )

# Destination endpoints
@app.get("/api/destinations", response_model=List[Destination])
async def get_destinations(
    limit: Optional[int] = 20,
    featured: Optional[bool] = None,
    category: Optional[str] = None
):
    """Get all destinations with optional filters"""
    try:
        destinations = await travel_service.get_destinations(
            limit=limit,
            featured=featured,
            category=category
        )
        return destinations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/destinations/{destination_id}", response_model=Destination)
async def get_destination(destination_id: int):
    """Get a specific destination by ID"""
    try:
        destination = await travel_service.get_destination_by_id(destination_id)
        if not destination:
            raise HTTPException(status_code=404, detail="Destination not found")
        return destination
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/destinations", response_model=Destination)
async def create_destination(destination: DestinationCreate):
    """Create a new destination"""
    try:
        new_destination = await travel_service.create_destination(destination)
        return new_destination
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/destinations/{destination_id}", response_model=Destination)
async def update_destination(destination_id: int, destination: DestinationUpdate):
    """Update an existing destination"""
    try:
        updated_destination = await travel_service.update_destination(destination_id, destination)
        if not updated_destination:
            raise HTTPException(status_code=404, detail="Destination not found")
        return updated_destination
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
        raise HTTPException(status_code=500, detail=str(e))

# Search endpoints
@app.get("/api/search/destinations")
async def search_destinations(
    query: str,
    limit: Optional[int] = 10
):
    """Search destinations by name, location, or description"""
    try:
        results = await travel_service.search_destinations(query, limit)
        return {"query": query, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI Chat endpoints
@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(message: ChatMessage):
    """Chat with AI travel assistant"""
    try:
        # Get destinations data for context
        destinations = await travel_service.get_destinations(limit=20)
        
        # Process with AI service
        response = await ai_service.process_message(
            message.message,
            message.conversation_history,
            destinations
        )
        
        return ChatResponse(
            response=response,
            success=True,
            provider="FastAPI + Supabase",
            timestamp=travel_service.get_current_timestamp()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# System status endpoint
@app.get("/api/system-status", response_model=SystemStatus)
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
        
        return SystemStatus(
            database={
                "supabase": {
                    "connected": db_connected,
                    "destinations": destinations_count,
                    "mode": "live_data" if db_connected else "mock_data"
                }
            },
            ai={
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
            system={
                "timestamp": travel_service.get_current_timestamp(),
                "mode": "FastAPI + Supabase",
                "version": "1.0.0"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analytics endpoints
@app.get("/api/analytics/popular-destinations")
async def get_popular_destinations(limit: Optional[int] = 5):
    """Get most popular destinations by rating"""
    try:
        destinations = await travel_service.get_destinations(limit=100)
        popular = sorted(destinations, key=lambda x: x.rating, reverse=True)[:limit]
        return {"popular_destinations": popular}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
            }
        }
        
        return {"budget_analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
