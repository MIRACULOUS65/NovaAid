@echo off
echo Starting Main NovaAid App on port 3000...
cd novaaid-app
start cmd /k "npm run dev"
echo.
echo Main app is starting at http://localhost:3000
echo.
echo Navigate to http://localhost:3000/role-select to test the NGO redirect
pause
