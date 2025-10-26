@echo off
echo ============================================
echo  Starting Alert Creation System on Port 3004
echo ============================================
echo.
echo Make sure you have already started:
echo   1. Backend (port 3001)
echo   2. NGO Portal (port 3002)
echo.
echo Starting alert creation server...
echo.
cd refugee_aid
python -m server
