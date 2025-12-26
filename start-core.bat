@echo off
echo Starting Core Services (Backend + Frontend)...
echo.

start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Done! Frontend: http://localhost:5173
pause

