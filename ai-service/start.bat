@echo off
echo Starting AI Image Generation Service...
echo.

cd /d %~dp0

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting service on http://localhost:8000
echo.

python main.py

pause

