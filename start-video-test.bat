@echo off
echo ============================================
echo NovaAid Video Calling - Starting All Services
echo ============================================
echo.

echo Starting Backend (Port 3001)...
start "NovaAid Backend" cmd /k "cd /d "d:\Refugee Lifeline\NovaAid\BACKEND\novaaid-app-backend" && npm run dev"
timeout /t 3 /nobreak > nul

echo Starting User Portal (Port 3000)...
start "NovaAid User Portal" cmd /k "cd /d "d:\Refugee Lifeline\NovaAid\FRONTEND\novaaid-app" && npm run dev"
timeout /t 3 /nobreak > nul

echo Starting NGO Portal (Port 3002)...
start "NovaAid NGO Portal" cmd /k "cd /d "d:\Refugee Lifeline\NovaAid\FRONTEND\NGO SECTION\ngo-portal" && npm run dev"

echo.
echo ============================================
echo All services starting...
echo.
echo Backend:      http://localhost:3001
echo User Portal:  http://localhost:3000
echo NGO Portal:   http://localhost:3002
echo.
echo Test Room URLs:
echo User:  http://localhost:3000/video/room/test-room-123
echo NGO:   http://localhost:3002/video/room/test-room-123
echo.
echo Press any key to close this window...
echo ============================================
pause > nul
