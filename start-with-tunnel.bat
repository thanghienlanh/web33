@echo off
echo ========================================
echo   TríTuệMarket - Start with Tunnel
echo ========================================
echo.

echo [1/4] Starting Hardhat Node...
start "Hardhat Node" cmd /k "cd contracts && npx hardhat node"
timeout /t 3 /nobreak >nul

echo [2/4] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo [3/4] Waiting for Frontend to start (10 seconds)...
timeout /t 10 /nobreak >nul

echo [4/4] Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cmd /k "cloudflared tunnel --url http://localhost:3000"

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo   Local Frontend: http://localhost:3000
echo   Hardhat Node:   http://127.0.0.1:8545
echo.
echo   Check Cloudflare Tunnel window for public URL
echo   (Wait a few seconds for URL to appear)
echo.
pause

