@echo off
echo ========================================
echo Starting NovaAid Applications
echo ========================================
echo.

echo [1/2] Starting Main NovaAid App (port 3000)...
cd novaaid-app
start "NovaAid Main App" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [2/2] Starting NGO Portal (port 3002)...
cd ..\ngo-portal
start "NGO Portal" cmd /k "npm run dev"

echo.
echo ========================================
echo Both applications are starting!
echo ========================================
echo.
echo Main App:   http://localhost:3000
echo NGO Portal: http://localhost:3002
echo.
echo Test the flow at: http://localhost:3000/role-select
echo.
pause
