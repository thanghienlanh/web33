@echo off
echo ==========================================
echo   Deploy AI Model NFT Package
echo ==========================================
echo.

REM Build package
echo [1/3] Building package...
sui move build

if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Build successful!
echo.

REM Publish to testnet
echo [2/3] Publishing to testnet...
echo Note: Make sure you have SUI in your wallet for gas fees
echo.

sui client publish --gas-budget 100000000

if %errorlevel% neq 0 (
    echo Publish failed!
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   Deployment Successful!
echo ==========================================
echo.
echo Next steps:
echo 1. Copy the Package ID from above
echo 2. Add to frontend/.env.local:
echo    VITE_SUI_PACKAGE_ID=0x{package_id}
echo 3. Verify contract on SuiScan (optional):
echo    - Go to https://testnet.suiscan.xyz/
echo    - Search your Package ID
echo    - Click "Verify Contract"
echo    - Upload sui-contracts/sources/ folder
echo 4. Restart frontend dev server
echo.
echo 📋 For automated deploy + verify, use: deploy-and-verify.bat (Windows) or ./deploy-and-verify.bat (Linux/Mac)
echo.
pause
