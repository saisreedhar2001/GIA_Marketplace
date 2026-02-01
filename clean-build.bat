@echo off
REM GIA Clean Build Script for Windows

echo.
echo ======================================
echo  GIA - Clean Build Cache
echo ======================================
echo.

echo Cleaning frontend...
cd web

echo Removing .next cache...
rmdir /s /q .next 2>nul

echo Clearing npm cache...
call npm cache clean --force

echo Installing dependencies...
call npm install

cd ..

echo.
echo Cleaning backend...
cd api

echo Clearing Python cache...
rmdir /s /q __pycache__ 2>nul
rmdir /s /q .pytest_cache 2>nul

cd ..

echo.
echo ======================================
echo  Clean complete!
echo ======================================
echo.
echo Next: Run your development servers
echo  Terminal 1: cd web && npm run dev
echo  Terminal 2: cd api && python -m uvicorn main:app --reload
echo.
pause
