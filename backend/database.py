"""
Supabase Database Client
Handles all database operations
"""

import os
from supabase import create_client, Client
from typing import List, Dict, Any, Optional
import asyncio
from datetime import datetime

class SupabaseClient:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.anon_key = os.getenv("SUPABASE_ANON_KEY")
        self.service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not self.url or not self.anon_key:
            print("⚠️ Supabase credentials not found. Using mock data mode.")
            self.client = None
        else:
            try:
                # Use service role key for admin operations, fallback to anon key
                key = self.service_role_key or self.anon_key
                self.client: Client = create_client(self.url, key)
                print("✅ Supabase client initialized")
            except Exception as e:
                print(f"❌ Failed to initialize Supabase client: {e}")
                self.client = None
    
    async def test_connection(self) -> bool:
        """Test the Supabase connection"""
        if not self.client:
            return False
        
        try:
            # Try to fetch one record to test connection
            result = self.client.table("destinations").select("id").limit(1).execute()
            return True
        except Exception as e:
            print(f"❌ Supabase connection test failed: {e}")
            return False
    
    async def get_destinations(
        self, 
        limit: int = 20, 
        featured: Optional[bool] = None,
        category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get destinations with optional filters"""
        if not self.client:
            return self._get_mock_destinations()
        
        try:
            query = self.client.table("destinations").select("*")
            
            if featured is not None:
                query = query.eq("featured", featured)
            
            if category:
                query = query.eq("category", category)
            
            result = query.limit(limit).execute()
            return result.data
        except Exception as e:
            print(f"❌ Error fetching destinations: {e}")
            return self._get_mock_destinations()
    
    async def get_destination_by_id(self, destination_id: int) -> Optional[Dict[str, Any]]:
        """Get a specific destination by ID"""
        if not self.client:
            mock_data = self._get_mock_destinations()
            return next((dest for dest in mock_data if dest["id"] == destination_id), None)
        
        try:
            result = self.client.table("destinations").select("*").eq("id", destination_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"❌ Error fetching destination {destination_id}: {e}")
            return None
    
    async def create_destination(self, destination_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new destination"""
        if not self.client:
            raise Exception("Database not available in mock mode")
        
        try:
            result = self.client.table("destinations").insert(destination_data).execute()
            return result.data[0]
        except Exception as e:
            print(f"❌ Error creating destination: {e}")
            raise
    
    async def update_destination(self, destination_id: int, destination_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing destination"""
        if not self.client:
            raise Exception("Database not available in mock mode")
        
        try:
            result = self.client.table("destinations").update(destination_data).eq("id", destination_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"❌ Error updating destination {destination_id}: {e}")
            raise
    
    async def delete_destination(self, destination_id: int) -> bool:
        """Delete a destination"""
        if not self.client:
            raise Exception("Database not available in mock mode")
        
        try:
            result = self.client.table("destinations").delete().eq("id", destination_id).execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"❌ Error deleting destination {destination_id}: {e}")
            raise
    
    async def search_destinations(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search destinations by text"""
        if not self.client:
            mock_data = self._get_mock_destinations()
            query_lower = query.lower()
            return [
                dest for dest in mock_data 
                if query_lower in dest["name"].lower() 
                or query_lower in dest["location"].lower()
                or query_lower in dest["description"].lower()
            ][:limit]
        
        try:
            # Use text search or multiple OR conditions
            result = self.client.table("destinations").select("*").or_(
                f"name.ilike.%{query}%,location.ilike.%{query}%,description.ilike.%{query}%"
            ).limit(limit).execute()
            return result.data
        except Exception as e:
            print(f"❌ Error searching destinations: {e}")
            return []
    
    def _get_mock_destinations(self) -> List[Dict[str, Any]]:
        """Return mock destination data when database is not available"""
        return [
            {
                "id": 1,
                "name": "Taj Mahal",
                "location": "Agra",
                "state": "Uttar Pradesh",
                "description": "One of the Seven Wonders of the World, this ivory-white marble mausoleum is a symbol of eternal love.",
                "image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500",
                "category": "Heritage",
                "rating": 4.8,
                "price_from": 15000,
                "featured": True,
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 2,
                "name": "Kerala Backwaters",
                "location": "Alleppey",
                "state": "Kerala",
                "description": "Experience the serene beauty of Kerala's backwaters on a traditional houseboat cruise.",
                "image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500",
                "category": "Nature",
                "rating": 4.7,
                "price_from": 12000,
                "featured": True,
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 3,
                "name": "Golden Temple",
                "location": "Amritsar",
                "state": "Punjab",
                "description": "The holiest Gurdwara of Sikhism, known for its stunning golden architecture and spiritual atmosphere.",
                "image_url": "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500",
                "category": "Spiritual",
                "rating": 4.9,
                "price_from": 8000,
                "featured": True,
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 4,
                "name": "Goa Beaches",
                "location": "Panaji",
                "state": "Goa",
                "description": "Pristine beaches, vibrant nightlife, and Portuguese colonial architecture make Goa a perfect getaway.",
                "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500",
                "category": "Beach",
                "rating": 4.6,
                "price_from": 10000,
                "featured": True,
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 5,
                "name": "Jaipur City Palace",
                "location": "Jaipur",
                "state": "Rajasthan",
                "description": "Explore the Pink City's royal heritage with magnificent palaces, forts, and vibrant bazaars.",
                "image_url": "https://images.unsplash.com/photo-1599661046827-dacde2a11954?w=500",
                "category": "Heritage",
                "rating": 4.5,
                "price_from": 11000,
                "featured": True,
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 6,
                "name": "Himalayan Trek",
                "location": "Manali",
                "state": "Himachal Pradesh",
                "description": "Adventure through the majestic Himalayas with breathtaking views and thrilling trekking experiences.",
                "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
                "category": "Adventure",
                "rating": 4.8,
                "price_from": 18000,
                "featured": True,
                "created_at": "2024-01-01T00:00:00Z"
            }
        ]
