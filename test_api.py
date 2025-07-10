"""
FastAPI Test Script
Test your Travel India API endpoints
"""

import httpx
import asyncio
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

async def test_api():
    """Test all API endpoints"""
    print("🧪 Testing Travel India FastAPI Backend")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        
        # Test 1: Root endpoint
        print("\n1️⃣ Testing Root Endpoint...")
        try:
            response = await client.get(f"{BASE_URL}/")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Root: {data['message']}")
                print(f"   Status: {data['status']}")
            else:
                print(f"❌ Root failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Root error: {e}")
        
        # Test 2: Health check
        print("\n2️⃣ Testing Health Check...")
        try:
            response = await client.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health: {data['status']}")
                print(f"   Database: {data['database']}")
                if 'services' in data:
                    for service, status in data['services'].items():
                        print(f"   {service}: {status}")
            else:
                print(f"❌ Health check failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Health error: {e}")
        
        # Test 3: Get destinations
        print("\n3️⃣ Testing Destinations Endpoint...")
        try:
            response = await client.get(f"{BASE_URL}/api/destinations?limit=3")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Destinations: Found {data['count']} destinations")
                for dest in data['destinations'][:2]:
                    name = dest.get('name') if isinstance(dest, dict) else getattr(dest, 'name', 'Unknown')
                    location = dest.get('location') if isinstance(dest, dict) else getattr(dest, 'location', 'Unknown')
                    price = dest.get('price_from') if isinstance(dest, dict) else getattr(dest, 'price_from', 0)
                    print(f"   • {name} ({location}) - ₹{price:,}+")
            else:
                print(f"❌ Destinations failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Destinations error: {e}")
        
        # Test 4: Search destinations
        print("\n4️⃣ Testing Search Endpoint...")
        try:
            response = await client.get(f"{BASE_URL}/api/search/destinations?query=taj&limit=2")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Search: Found {data['count']} results for '{data['query']}'")
                for dest in data['results'][:1]:
                    name = dest.get('name') if isinstance(dest, dict) else getattr(dest, 'name', 'Unknown')
                    print(f"   • {name}")
            else:
                print(f"❌ Search failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Search error: {e}")
        
        # Test 5: AI Chat
        print("\n5️⃣ Testing AI Chat Endpoint...")
        try:
            chat_data = {
                "message": "Tell me about Kerala backwaters",
                "conversation_history": []
            }
            response = await client.post(f"{BASE_URL}/api/chat", json=chat_data)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ AI Chat: {data['success']}")
                print(f"   Provider: {data['provider']}")
                print(f"   Response preview: {data['response'][:100]}...")
            else:
                print(f"❌ AI Chat failed: {response.status_code}")
        except Exception as e:
            print(f"❌ AI Chat error: {e}")
        
        # Test 6: System Status
        print("\n6️⃣ Testing System Status...")
        try:
            response = await client.get(f"{BASE_URL}/api/system-status")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ System Status:")
                print(f"   Database connected: {data['database']['supabase']['connected']}")
                print(f"   Destinations count: {data['database']['supabase']['destinations']}")
                print(f"   AI configured: {data['ai']['groq']['configured']}")
                print(f"   System mode: {data['system']['mode']}")
            else:
                print(f"❌ System status failed: {response.status_code}")
        except Exception as e:
            print(f"❌ System status error: {e}")
        
        # Test 7: Categories
        print("\n7️⃣ Testing Categories Endpoint...")
        try:
            response = await client.get(f"{BASE_URL}/api/categories")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Categories: {', '.join(data['categories'])}")
            else:
                print(f"❌ Categories failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Categories error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 API Testing Complete!")
    print(f"📖 Visit {BASE_URL}/docs for interactive API documentation")
    print(f"🔧 Visit {BASE_URL}/redoc for alternative documentation")

if __name__ == "__main__":
    asyncio.run(test_api())
