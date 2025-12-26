@echo off
echo ========================================
echo   Cloudflare Tunnel - Frontend
echo ========================================
echo.
echo   Exposing: http://localhost:3000
echo.
echo   Make sure frontend is running first!
echo   (npm run dev in frontend folder)
echo.
echo ========================================
echo.

cloudflared tunnel --url http://localhost:3000

pause

