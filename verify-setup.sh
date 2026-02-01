#!/bin/bash

# GIA Setup Verification Script for macOS/Linux

echo ""
echo "======================================"
echo "  GIA - Setup Verification"
echo "======================================"
echo ""

PASS=0
FAIL=0

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    echo "[PASS] Node.js installed"
    ((PASS++))
else
    echo "[FAIL] Node.js NOT found. Install from https://nodejs.org/"
    ((FAIL++))
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    echo "[PASS] npm installed"
    ((PASS++))
else
    echo "[FAIL] npm NOT found"
    ((FAIL++))
fi

# Check Python
echo "Checking Python..."
if command -v python3 &> /dev/null; then
    echo "[PASS] Python 3 installed"
    ((PASS++))
else
    echo "[FAIL] Python 3 NOT found. Install from https://www.python.org/"
    ((FAIL++))
fi

# Check Git
echo "Checking Git..."
if command -v git &> /dev/null; then
    echo "[PASS] Git installed"
    ((PASS++))
else
    echo "[FAIL] Git NOT found (optional)"
    ((FAIL++))
fi

# Check web dependencies
echo "Checking web dependencies..."
if [ -d "web/node_modules" ]; then
    echo "[PASS] Frontend dependencies installed"
    ((PASS++))
else
    echo "[FAIL] Frontend dependencies NOT installed. Run: cd web && npm install"
    ((FAIL++))
fi

# Check api dependencies
echo "Checking api dependencies..."
if python3 -c "import fastapi" 2>/dev/null; then
    echo "[PASS] Backend dependencies installed"
    ((PASS++))
else
    echo "[FAIL] Backend dependencies NOT installed. Run: pip install -r api/requirements.txt"
    ((FAIL++))
fi

# Check .env files
echo "Checking configuration files..."
if [ -f "web/.env.local" ]; then
    echo "[PASS] web/.env.local exists"
    ((PASS++))
else
    echo "[FAIL] web/.env.local NOT found. Create it with Firebase credentials."
    ((FAIL++))
fi

if [ -f "api/.env" ]; then
    echo "[PASS] api/.env exists"
    ((PASS++))
else
    echo "[FAIL] api/.env NOT found. Create it with Firebase and Razorpay credentials."
    ((FAIL++))
fi

echo ""
echo "======================================"
echo "  Verification Results"
echo "======================================"
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "All checks passed! You're ready to run:"
    echo ""
    echo "  Terminal 1: cd web && npm run dev"
    echo "  Terminal 2: cd api && python -m uvicorn main:app --reload"
    echo ""
    echo "Then visit http://localhost:3000"
else
    echo "Please fix the issues above before continuing."
fi

echo ""
