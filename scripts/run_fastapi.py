"""
FastAPI Server Runner
Run this script to start the FastAPI backend server
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.fastapi")

if __name__ == "__main__":
    host = os.getenv("FASTAPI_HOST", "localhost")
    port = int(os.getenv("FASTAPI_PORT", 8000))
    reload = os.getenv("FASTAPI_RELOAD", "true").lower() == "true"
    
    print(f"🚀 Starting FastAPI server on {host}:{port}")
    print(f"📖 API Documentation: http://{host}:{port}/docs")
    print(f"🔄 Auto-reload: {reload}")
    
    uvicorn.run(
        "backend.main:app",
        host=host,
        port=port,
        reload=reload
    )
