@echo off
REM GIA Setup Verification Script for Windows

echo.
echo ======================================
echo  GIA - Setup Verification
echo ======================================
echo.

setlocal enabledelayedexpansion
set PASS=0
set FAIL=0

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] Node.js installed
    set /a PASS+=1
) else (
    echo [FAIL] Node.js NOT found. Install from https://nodejs.org/
    set /a FAIL+=1
)

REM Check npm
echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] npm installed
    set /a PASS+=1
) else (
    echo [FAIL] npm NOT found
    set /a FAIL+=1
)

REM Check Python
echo Checking Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] Python installed
    set /a PASS+=1
) else (
    echo [FAIL] Python NOT found. Install from https://www.python.org/
    set /a FAIL+=1
)

REM Check Git
echo Checking Git...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] Git installed
    set /a PASS+=1
) else (
    echo [FAIL] Git NOT found (optional)
    set /a FAIL+=1
)

REM Check web dependencies
echo Checking web dependencies...
if exist "web\node_modules" (
    echo [PASS] Frontend dependencies installed
    set /a PASS+=1
) else (
    echo [FAIL] Frontend dependencies NOT installed. Run: cd web && npm install
    set /a FAIL+=1
)

REM Check api dependencies
echo Checking api dependencies...
pip show fastapi >nul 2>&1
if %errorlevel% equ 0 (
    echo [PASS] Backend dependencies installed
    set /a PASS+=1
) else (
    echo [FAIL] Backend dependencies NOT installed. Run: pip install -r api/requirements.txt
    set /a FAIL+=1
)

REM Check .env files
echo Checking configuration files...
if exist "web\.env.local" (
    echo [PASS] web/.env.local exists
    set /a PASS+=1
) else (
    echo [FAIL] web/.env.local NOT found. Create it with Firebase credentials.
    set /a FAIL+=1
)

if exist "api\.env" (
    echo [PASS] api/.env exists
    set /a PASS+=1
) else (
    echo [FAIL] api/.env NOT found. Create it with Firebase and Razorpay credentials.
    set /a FAIL+=1
)

echo.
echo ======================================
echo  Verification Results
echo ======================================
echo Passed: %PASS%
echo Failed: %FAIL%
echo.

if %FAIL% equ 0 (
    echo All checks passed! You're ready to run:
    echo.
    echo  Terminal 1: cd web ^&^& npm run dev
    echo  Terminal 2: cd api ^&^& python -m uvicorn main:app --reload
    echo.
    echo Then visit http://localhost:3000
) else (
    echo Please fix the issues above before continuing.
)

echo.
pause
