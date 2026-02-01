@echo off
REM GIA Development Server Launcher for Windows

echo.
echo ======================================
echo  GIA - Development Servers
echo ======================================
echo.
echo This script will open two terminals:
echo 1. Frontend (Next.js) on http://localhost:3000
echo 2. Backend (FastAPI) on http://localhost:8000
echo.
echo Make sure you have configured:
echo - web/.env.local
echo - api/.env
echo.
pause

REM Open frontend terminal
start cmd /k "cd web && npm run dev"

REM Wait a moment for first terminal to open
timeout /t 2

REM Open backend terminal
start cmd /k "cd api && python -m uvicorn main:app --reload"

echo.
echo Servers starting in separate windows...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
