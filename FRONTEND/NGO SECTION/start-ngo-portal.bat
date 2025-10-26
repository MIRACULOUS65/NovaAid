@echo off
echo Starting NGO Portal on port 3001...
cd ngo-portal
start cmd /k "npm run dev"
echo.
echo NGO Portal is starting at http://localhost:3001
echo.
echo To also start the main NovaAid app, run start-main-app.bat
pause
