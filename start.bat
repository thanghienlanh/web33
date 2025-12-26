@echo off
echo ========================================
echo   TríTuệMarket - Starting Project
echo ========================================
echo.

echo [1/3] Starting Hardhat Node...
start "Hardhat Node" cmd /k "cd contracts && npx hardhat node"
timeout /t 5 /nobreak >nul

echo [2/3] Deploying Smart Contracts...
start "Deploy Contracts" cmd /k "cd contracts && timeout /t 3 /nobreak >nul && npx hardhat run scripts/deploy.ts --network localhost && pause"

echo [3/3] Starting Frontend...
timeout /t 3 /nobreak >nul
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Project Started Successfully!
echo ========================================
echo.
echo   Hardhat Node: http://127.0.0.1:8545
echo   Frontend:     http://localhost:3000
echo.
echo   Note: Wait for contracts to deploy,
echo   then update .env.local with addresses
echo.
pause

