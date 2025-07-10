"""
Simple FastAPI Startup Script
Run this from the project root directory
"""

import uvicorn
import os
import sys
from pathlib import Path

# Add current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(".env.fastapi")

def main():
    print("🚀 Starting Travel India FastAPI Backend...")
    print("📁 Project directory:", current_dir)
    
    # Check if backend directory exists
    backend_dir = current_dir / "backend"
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        print("💡 Make sure you're running this from the project root")
        return
    
    host = os.getenv("FASTAPI_HOST", "localhost")
    port = int(os.getenv("FASTAPI_PORT", 8000))
    
    print(f"🌐 Server: http://{host}:{port}")
    print(f"📖 API Docs: http://{host}:{port}/docs")
    print(f"🔧 Admin Panel: http://{host}:{port}/redoc")
    
    try:
        # Import the app with backend prefix
        from backend.main import app
        
        uvicorn.run(
            app,
            host=host,
            port=port,
            reload=True,
            reload_dirs=[str(backend_dir)]
        )
    except ImportError as e:
        print(f"❌ Failed to import backend: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure all dependencies are installed: pip install -r requirements.txt")
        print("2. Check that backend/__init__.py exists")
        print("3. Verify you're in the correct directory")
        print("4. Try: python -m backend.main")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    main()
