@echo off
REM GIA Marketplace Setup Script for Windows

echo.
echo ======================================
echo  GIA - Great India Arts Setup
echo ======================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install it from https://nodejs.org/
    exit /b 1
)
echo Node.js is installed: 
node --version

echo.
REM Check Python
echo Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed. Please install it from https://www.python.org/
    exit /b 1
)
echo Python is installed:
python --version

echo.
echo ======================================
echo  Installing Frontend Dependencies
echo ======================================
cd web
echo Installing npm packages...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    exit /b 1
)
echo Frontend dependencies installed successfully
cd ..

echo.
echo ======================================
echo  Installing Backend Dependencies
echo ======================================
cd api
echo Installing Python packages...
call pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    exit /b 1
)
echo Backend dependencies installed successfully
cd ..

echo.
echo ======================================
echo  Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Configure .env files:
echo    - web/.env.local (with Firebase credentials)
echo    - api/.env (with Firebase and Razorpay credentials)
echo.
echo 2. Run the development servers:
echo.
echo    Terminal 1 (Frontend):
echo    cd web
echo    npm run dev
echo.
echo    Terminal 2 (Backend):
echo    cd api
echo    python -m uvicorn main:app --reload
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
pause
