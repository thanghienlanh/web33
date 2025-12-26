@echo off
echo ========================================
echo   TríTuệMarket - Starting All Services
echo ========================================
echo.

echo [1/3] Starting Backend...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Starting AI Service...
start "AI Service" cmd /k "cd ai-service && python main.py"

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo   Backend:    http://localhost:3001
echo   Frontend:   http://localhost:5173
echo   AI Service: http://localhost:8000
echo.
echo   Open browser: http://localhost:5173
echo.
pause

