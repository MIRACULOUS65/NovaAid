@echo off
echo ============================================
echo Starting NovaAid - All Services
echo ============================================
echo.
echo Starting Backend on port 3001...
echo Starting User Portal (Frontend) on port 3000...
echo Starting NGO Portal on port 3002...
echo.
echo ============================================

REM Start Backend
start "NovaAid Backend" cmd /k "cd /d "%~dp0BACKEND\novaaid-app-backend" && npm run dev"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Start User Portal (Frontend)
start "NovaAid User Portal" cmd /k "cd /d "%~dp0FRONTEND\novaaid-app" && npm run dev"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Start NGO Portal
start "NovaAid NGO Portal" cmd /k "cd /d "%~dp0FRONTEND\NGO SECTION\ngo-portal" && npm run dev"

echo.
echo ============================================
echo All services are starting!
echo ============================================
echo.
echo Backend:      http://localhost:3001
echo User Portal:  http://localhost:3000
echo NGO Portal:   http://localhost:3002
echo.
echo Press any key to close this window...
pause >nul
