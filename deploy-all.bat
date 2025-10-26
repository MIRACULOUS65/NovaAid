@echo off
echo ========================================
echo  NovaAid Full Deployment Script
echo ========================================
echo.

echo This script will help you deploy all NovaAid components.
echo Make sure you have:
echo  - Vercel CLI installed (npm i -g vercel)
echo  - Railway CLI installed (npm i -g @railway/cli)
echo  - Logged in to both services
echo.
pause

echo.
echo ========================================
echo Step 1: Deploy Backend to Railway
echo ========================================
cd "BACKEND\novaaid-app-backend"
echo Current directory: %CD%
echo.
echo Please ensure you have set all environment variables in Railway dashboard.
echo Visit: https://railway.app/dashboard
echo.
pause

echo Deploying backend...
call railway up
if errorlevel 1 (
    echo Backend deployment failed!
    pause
    exit /b 1
)

echo.
echo Backend deployed! Copy the Railway URL and press any key to continue...
pause

cd ..\..

echo.
echo ========================================
echo Step 2: Deploy Main App to Vercel
echo ========================================
cd "FRONTEND\novaaid-app"
echo Current directory: %CD%
echo.
echo Make sure to add all environment variables in Vercel dashboard after deployment.
echo.
pause

echo Deploying main app...
call vercel --prod
if errorlevel 1 (
    echo Main app deployment failed!
    pause
    exit /b 1
)

cd ..\..

echo.
echo ========================================
echo Step 3: Deploy NGO Portal to Vercel
echo ========================================
cd "FRONTEND\NGO SECTION\ngo-portal"
echo Current directory: %CD%
echo.
pause

echo Deploying NGO portal...
call vercel --prod
if errorlevel 1 (
    echo NGO portal deployment failed!
    pause
    exit /b 1
)

cd ..\..\..

echo.
echo ========================================
echo Step 4: Deploy Fraud Detection to Vercel
echo ========================================
cd "AI-ML\fraud"
echo Current directory: %CD%
echo.
pause

echo Deploying fraud detection app...
call vercel --prod
if errorlevel 1 (
    echo Fraud detection deployment failed!
    pause
    exit /b 1
)

cd ..\..

echo.
echo ========================================
echo  Deployment Complete! 
echo ========================================
echo.
echo All components have been deployed successfully!
echo.
echo Next steps:
echo 1. Add environment variables in Vercel dashboard for each frontend
echo 2. Update CORS settings in backend with frontend URLs
echo 3. Update Clerk dashboard with production URLs
echo 4. Test all deployments
echo.
echo See PRODUCTION_DEPLOYMENT.md for detailed instructions.
echo.
pause
