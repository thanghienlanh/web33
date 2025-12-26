@echo off
echo ==========================================
echo   Deploy and Verify Contract (Windows)
echo ==========================================
echo.

REM Build package
echo [1/5] Building package...
sui move build

if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Build successful!
echo.

REM Publish to testnet
echo [2/5] Publishing to testnet...
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

REM Extract Package ID from output (this is a simplified version)
echo [3/5] Note: Copy the Package ID from above output
echo Example: PackageID: 0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b
echo.

REM Verify source code
echo [4/5] Verifying source code...
sui client verify-source --verify-deps

if %errorlevel% neq 0 (
    echo Verification failed, but deployment was successful!
    echo You can still manually verify on SuiScan
)

echo.

REM Final instructions
echo [5/5] Next steps:
echo.
echo 1. Copy the Package ID from deployment output above
echo 2. Add to frontend/.env.local:
echo    VITE_SUI_PACKAGE_ID=0x{your_package_id}
echo 3. To verify on SuiScan:
echo    - Go to https://testnet.suiscan.xyz/
echo    - Search your Package ID
echo    - Click "Verify Contract"
echo    - Upload sui-contracts/sources/ folder
echo 4. Restart frontend dev server
echo.
echo ✅ Deploy and verification check completed!
echo.
pause
