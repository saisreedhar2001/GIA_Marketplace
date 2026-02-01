#!/bin/bash

# GIA Development Server Launcher for macOS/Linux

echo ""
echo "======================================"
echo "  GIA - Development Servers"
echo "======================================"
echo ""
echo "This script will start two development servers:"
echo "1. Frontend (Next.js) on http://localhost:3000"
echo "2. Backend (FastAPI) on http://localhost:8000"
echo ""
echo "Make sure you have configured:"
echo "- web/.env.local"
echo "- api/.env"
echo ""

# Check if dependencies are installed
if [ ! -d "web/node_modules" ]; then
    echo "ERROR: Frontend dependencies not installed. Run setup.sh first."
    exit 1
fi

if [ ! -d "api/venv" ] && ! python3 -c "import fastapi" 2>/dev/null; then
    echo "ERROR: Backend dependencies not installed. Run setup.sh first."
    exit 1
fi

echo "Starting servers..."
echo ""

# Start frontend in background
echo "Starting frontend server..."
cd web
npm run dev &
FRONTEND_PID=$!

# Start backend in background
echo "Starting backend server..."
cd ../api
python3 -m uvicorn main:app --reload &
BACKEND_PID=$!

cd ..

echo ""
echo "======================================"
echo "  Servers Running"
echo "======================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Process IDs:"
echo "Frontend: $FRONTEND_PID"
echo "Backend:  $BACKEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
