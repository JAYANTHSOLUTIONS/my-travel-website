"""
Simple API Dashboard
Monitor your FastAPI backend status
"""

import httpx
import asyncio
import time
from datetime import datetime

async def get_api_status():
    """Get comprehensive API status"""
    try:
        async with httpx.AsyncClient() as client:
            # Test basic connectivity
            health_response = await client.get("http://localhost:8000/health", timeout=5.0)
            system_response = await client.get("http://localhost:8000/api/system-status", timeout=5.0)
            destinations_response = await client.get("http://localhost:8000/api/destinations?limit=1", timeout=5.0)
            
            return {
                "online": True,
                "health": health_response.json() if health_response.status_code == 200 else None,
                "system": system_response.json() if system_response.status_code == 200 else None,
                "destinations": destinations_response.json() if destinations_response.status_code == 200 else None,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
    except Exception as e:
        return {
            "online": False,
            "error": str(e),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

def print_dashboard(status):
    """Print a nice dashboard"""
    # Clear screen (works on most terminals)
    print("\033[2J\033[H")
    
    print("🚀 Travel India FastAPI Dashboard")
    print("=" * 50)
    print(f"⏰ Last Updated: {status['timestamp']}")
    print()
    
    if not status['online']:
        print("🔴 API Status: OFFLINE")
        print(f"❌ Error: {status.get('error', 'Unknown error')}")
        print()
        print("💡 Make sure your FastAPI server is running:")
        print("   python start_fastapi.py")
        return
    
    print("🟢 API Status: ONLINE")
    print()
    
    # Health Status
    if status['health']:
        health = status['health']
        print("🏥 Health Check:")
        print(f"   Status: {health.get('status', 'Unknown')}")
        print(f"   Database: {health.get('database', 'Unknown')}")
        if 'services' in health:
            for service, service_status in health['services'].items():
                print(f"   {service.title()}: {service_status}")
        print()
    
    # System Status
    if status['system']:
        system = status['system']
        print("⚙️ System Information:")
        print(f"   Mode: {system['system']['mode']}")
        print(f"   Version: {system['system']['version']}")
        
        # Database info
        db_info = system['database']['supabase']
        print(f"   Database: {'🟢 Connected' if db_info['connected'] else '🟡 Mock Mode'}")
        print(f"   Destinations: {db_info['destinations']}")
        
        # AI info
        ai_info = system['ai']
        groq_status = "🟢 Configured" if ai_info['groq']['configured'] else "🟡 Not Configured"
        print(f"   AI (Groq): {groq_status}")
        print()
    
    # Destinations Status
    if status['destinations']:
        dest_info = status['destinations']
        print("🏛️ Destinations API:")
        print(f"   Available: {dest_info.get('count', 0)} destinations")
        if dest_info.get('destinations'):
            first_dest = dest_info['destinations'][0]
            name = first_dest.get('name') if isinstance(first_dest, dict) else getattr(first_dest, 'name', 'Unknown')
            print(f"   Sample: {name}")
        print()
    
    # Quick Links
    print("🔗 Quick Links:")
    print("   📖 API Docs: http://localhost:8000/docs")
    print("   🔧 Admin Panel: http://localhost:8000/redoc")
    print("   ❤️ Health Check: http://localhost:8000/health")
    print("   🏛️ Destinations: http://localhost:8000/api/destinations")
    print()
    
    # Instructions
    print("💡 Commands:")
    print("   • Press Ctrl+C to exit")
    print("   • Run 'python test_api.py' to test all endpoints")
    print("   • Run 'python configure_supabase.py' to setup database")

async def run_dashboard():
    """Run the live dashboard"""
    print("Starting API Dashboard...")
    print("Press Ctrl+C to exit")
    
    try:
        while True:
            status = await get_api_status()
            print_dashboard(status)
            await asyncio.sleep(5)  # Update every 5 seconds
    except KeyboardInterrupt:
        print("\n\n👋 Dashboard stopped. Goodbye!")

if __name__ == "__main__":
    asyncio.run(run_dashboard())
