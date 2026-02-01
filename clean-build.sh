#!/bin/bash

# GIA Clean Build Script for macOS/Linux

echo ""
echo "======================================"
echo "  GIA - Clean Build Cache"
echo "======================================"
echo ""

echo "Cleaning frontend..."
cd web

echo "Removing .next cache..."
rm -rf .next

echo "Clearing npm cache..."
npm cache clean --force

echo "Reinstalling dependencies..."
npm install

cd ..

echo ""
echo "Cleaning backend..."
cd api

echo "Clearing Python cache..."
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null
find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null

cd ..

echo ""
echo "======================================"
echo "  Clean complete!"
echo "======================================"
echo ""
echo "Next: Run your development servers"
echo "  Terminal 1: cd web && npm run dev"
echo "  Terminal 2: cd api && python -m uvicorn main:app --reload"
echo ""
