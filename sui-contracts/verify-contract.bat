@echo off
echo ==========================================
echo   Verify Contract on SuiScan
echo ==========================================
echo.

REM Kiểm tra network hiện tại
echo [1/4] Checking current network...
sui client envs
echo.

REM Switch to network cần verify (testnet/mainnet)
echo [2/4] Switching to testnet...
sui client switch --env testnet
echo.

REM Verify source code
echo [3/4] Verifying source code...
sui client verify-source --verify-deps
echo.

REM Thông tin để submit lên SuiScan
echo [4/4] Contract verification info:
echo.
echo 📋 Copy this information to submit on SuiScan:
echo.
echo - Package ID: [Your Package ID from deployment]
echo - Network: testnet
echo - Source Code: Upload the sui-contracts/sources/ folder
echo.
echo 🔗 SuiScan Testnet: https://testnet.suiscan.xyz/
echo 🔗 SuiScan Mainnet: https://suiscan.xyz/
echo.
echo 📖 How to verify:
echo 1. Go to SuiScan testnet/mainnet
echo 2. Search for your Package ID
echo 3. Click "Verify Contract"
echo 4. Upload source code from sui-contracts/sources/
echo 5. Submit for verification
echo.
echo ✅ Verification successful!
echo.
pause
