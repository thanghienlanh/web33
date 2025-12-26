@echo off
echo ==========================================
echo   Push Project to GitHub
echo ==========================================
echo.

REM Kiểm tra git status
echo [1/4] Checking git status...
git status --short
echo.

REM Add remote (thay YOUR_USERNAME và YOUR_REPO)
echo [2/4] Adding GitHub remote...
echo Please replace YOUR_USERNAME and YOUR_REPO with your actual GitHub info
echo.
echo Example: https://github.com/johndoe/ai-nft-marketplace.git
echo.
set /p GITHUB_URL="Enter your GitHub repository URL: "

if "%GITHUB_URL%"=="" (
    echo Error: GitHub URL is required!
    pause
    exit /b 1
)

git remote add origin %GITHUB_URL%
echo.

REM Rename branch to main
echo [3/4] Setting up main branch...
git branch -M main
echo.

REM Push to GitHub
echo [4/4] Pushing to GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ❌ Push failed! Possible issues:
    echo - Repository URL is incorrect
    echo - Authentication failed (need GitHub token)
    echo - Branch already exists on remote
    echo.
    echo Try: git push -u origin main --force
    echo.
) else (
    echo.
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 🌐 Your repository: %GITHUB_URL%
    echo.
)

pause
