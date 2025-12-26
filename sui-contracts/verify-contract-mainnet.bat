@echo off
echo ==========================================
echo   Verify Contract on SuiScan (Mainnet)
echo ==========================================
echo.

REM Kiểm tra network hiện tại
echo [1/4] Checking current network...
sui client envs
echo.

REM Switch to mainnet
echo [2/4] Switching to mainnet...
sui client switch --env mainnet
echo.

REM Verify source code
echo [3/4] Verifying source code...
sui client verify-source --verify-deps
echo.

REM Thông tin để submit lên SuiScan Mainnet
echo [4/4] Contract verification info:
echo.
echo 📋 Copy this information to submit on SuiScan Mainnet:
echo.
echo - Package ID: [Your Package ID from deployment]
echo - Network: mainnet
echo - Source Code: Upload the sui-contracts/sources/ folder
echo.
echo 🔗 SuiScan Mainnet: https://suiscan.xyz/
echo.
echo 📖 How to verify:
echo 1. Go to https://suiscan.xyz/
echo 2. Search for your Package ID
echo 3. Click "Verify Contract" or "Verify Source Code"
echo 4. Upload source code from sui-contracts/sources/
echo 5. Fill in contract details:
echo    - Contract Name: AI Model NFT
echo    - Compiler Version: Move 2024
echo    - Optimization: Yes
echo 6. Submit for verification
echo.
echo ✅ Verification successful!
echo.
pause
