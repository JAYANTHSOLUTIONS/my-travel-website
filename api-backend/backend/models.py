"""
Pydantic Models for FastAPI
Data validation and serialization models
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class DestinationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    location: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=10, max_length=1000)
    image_url: Optional[str] = None
    category: str = Field(..., pattern="^(Heritage|Nature|Beach|Spiritual|Adventure)$")
    rating: float = Field(..., ge=0, le=5)
    price_from: int = Field(..., ge=0)
    featured: bool = False

class DestinationCreate(DestinationBase):
    pass

class DestinationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    location: Optional[str] = Field(None, min_length=1, max_length=100)
    state: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=10, max_length=1000)
    image_url: Optional[str] = None
    category: Optional[str] = Field(None, pattern="^(Heritage|Nature|Beach|Spiritual|Adventure)$")
    rating: Optional[float] = Field(None, ge=0, le=5)
    price_from: Optional[int] = Field(None, ge=0)
    featured: Optional[bool] = None

class Destination(DestinationBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    conversation_history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    response: str
    success: bool
    provider: str
    timestamp: str

class SystemStatus(BaseModel):
    database: Dict[str, Any]
    ai: Dict[str, Any]
    system: Dict[str, Any]

class SearchResult(BaseModel):
    query: str
    results: List[Destination]

class BudgetAnalysis(BaseModel):
    min_price: int
    max_price: int
    avg_price: int
    budget_ranges: Dict[str, int]

class PopularDestinations(BaseModel):
    popular_destinations: List[Destination]
