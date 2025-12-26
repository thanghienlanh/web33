@echo off
echo Starting TríTuệMarket...
echo.

echo Starting Hardhat Node...
start "Hardhat Node" cmd /k "cd contracts && npx hardhat node"

timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Done! Check the opened windows.
echo Frontend: http://localhost:3000
pause

