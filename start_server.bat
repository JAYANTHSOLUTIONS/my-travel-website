@echo off
echo 🚀 Starting Travel India FastAPI Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Install dependencies if needed
echo 📦 Installing dependencies...
pip install -r requirements.txt

REM Load environment and start server
echo 🌐 Starting server...
python start_fastapi.py

pause
