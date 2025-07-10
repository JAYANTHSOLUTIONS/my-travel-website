"""
Simplified Pydantic Models for FastAPI
Compatible with all Pydantic versions
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
import re

class DestinationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    location: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=10, max_length=1000)
    image_url: Optional[str] = None
    category: str
    rating: float = Field(..., ge=0, le=5)
    price_from: int = Field(..., ge=0)
    featured: bool = False
    
    @validator('category')
    def validate_category(cls, v):
        allowed_categories = ['Heritage', 'Nature', 'Beach', 'Spiritual', 'Adventure']
        if v not in allowed_categories:
            raise ValueError(f'Category must be one of: {", ".join(allowed_categories)}')
        return v

class DestinationCreate(DestinationBase):
    pass

class DestinationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    location: Optional[str] = Field(None, min_length=1, max_length=100)
    state: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=10, max_length=1000)
    image_url: Optional[str] = None
    category: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    price_from: Optional[int] = Field(None, ge=0)
    featured: Optional[bool] = None
    
    @validator('category')
    def validate_category(cls, v):
        if v is not None:
            allowed_categories = ['Heritage', 'Nature', 'Beach', 'Spiritual', 'Adventure']
            if v not in allowed_categories:
                raise ValueError(f'Category must be one of: {", ".join(allowed_categories)}')
        return v

class Destination(DestinationBase):
    id: int
    created_at: Optional[Union[datetime, str]] = None
    
    class Config:
        from_attributes = True
        # For older Pydantic versions
        orm_mode = True

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
