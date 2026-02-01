#!/bin/bash

# GIA Marketplace Setup Script for macOS/Linux

echo ""
echo "======================================"
echo "  GIA - Great India Arts Setup"
echo "======================================"
echo ""

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi
echo "Node.js is installed:"
node --version

echo ""

# Check Python
echo "Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed. Please install it from https://www.python.org/"
    exit 1
fi
echo "Python is installed:"
python3 --version

echo ""
echo "======================================"
echo "  Installing Frontend Dependencies"
echo "======================================"
cd web
echo "Installing npm packages..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
echo "Frontend dependencies installed successfully"
cd ..

echo ""
echo "======================================"
echo "  Installing Backend Dependencies"
echo "======================================"
cd api
echo "Installing Python packages..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
echo "Backend dependencies installed successfully"
cd ..

echo ""
echo "======================================"
echo "  Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Configure .env files:"
echo "   - web/.env.local (with Firebase credentials)"
echo "   - api/.env (with Firebase and Razorpay credentials)"
echo ""
echo "2. Run the development servers:"
echo ""
echo "   Terminal 1 (Frontend):"
echo "   cd web"
echo "   npm run dev"
echo ""
echo "   Terminal 2 (Backend):"
echo "   cd api"
echo "   python -m uvicorn main:app --reload"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
