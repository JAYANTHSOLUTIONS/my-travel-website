#!/bin/bash

echo "🚀 Starting Travel India FastAPI Backend..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install -r requirements.txt

# Start server
echo "🌐 Starting server..."
python3 start_fastapi.py
