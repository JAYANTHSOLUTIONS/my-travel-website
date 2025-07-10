"""
Alternative backend runner with better import handling
"""

import sys
import os
from pathlib import Path

def setup_python_path():
    """Setup Python path for proper imports"""
    current_dir = Path(__file__).parent.absolute()
    backend_dir = current_dir / "backend"
    
    # Add directories to Python path
    paths_to_add = [
        str(current_dir),
        str(backend_dir),
    ]
    
    for path in paths_to_add:
        if path not in sys.path:
            sys.path.insert(0, path)
    
    print(f"📁 Current directory: {current_dir}")
    print(f"📁 Backend directory: {backend_dir}")
    print(f"🐍 Python path updated")

def main():
    """Main function to run FastAPI"""
    print("🚀 Travel India FastAPI Backend Launcher")
    print("=" * 50)
    
    # Setup paths
    setup_python_path()
    
    # Load environment variables
    try:
        from dotenv import load_dotenv
        load_dotenv(".env.fastapi")
        print("✅ Environment variables loaded")
    except ImportError:
        print("⚠️ python-dotenv not installed, using system environment")
    
    # Import and run
    try:
        import uvicorn
        from backend.main import app
        
        host = os.getenv("FASTAPI_HOST", "localhost")
        port = int(os.getenv("FASTAPI_PORT", 8000))
        
        print(f"🌐 Starting server on {host}:{port}")
        print(f"📖 API Documentation: http://{host}:{port}/docs")
        print(f"🔧 Alternative Docs: http://{host}:{port}/redoc")
        print("=" * 50)
        
        uvicorn.run(
            app,
            host=host,
            port=port,
            reload=True
        )
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("\n🔧 Troubleshooting steps:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Check file structure:")
        print("   - backend/main.py")
        print("   - backend/database.py")
        print("   - backend/services.py")
        print("   - backend/models_simple.py")
        print("3. Verify you're in the project root directory")
        print("4. Make sure backend/__init__.py exists")
        
    except Exception as e:
        print(f"❌ Startup error: {e}")

if __name__ == "__main__":
    main()
