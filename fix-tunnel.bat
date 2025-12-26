@echo off
echo ========================================
echo   Fix Cloudflare Tunnel 502 Error
echo ========================================
echo.

echo Checking if frontend is running on port 3000...
netstat -ano | findstr :3000

echo.
echo If you see port 3000 above, frontend is running.
echo.
echo Testing local access...
echo Open http://localhost:3000 in your browser first!
echo.
pause

echo.
echo Starting Cloudflare Tunnel with 127.0.0.1...
cloudflared tunnel --url http://127.0.0.1:3000

pause

