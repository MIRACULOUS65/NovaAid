@echo off
REM NovaAid Deployment Helper Script
REM This script helps you deploy NovaAid to Vercel and Railway

echo ========================================
echo   NovaAid Deployment Helper
echo ========================================
echo.

echo This script will guide you through deploying NovaAid
echo.
echo Prerequisites:
echo - Railway CLI installed (npm install -g @railway/cli)
echo - Vercel CLI installed (npm install -g vercel)
echo - Git repository pushed to GitHub
echo - All API keys ready (Clerk, Firebase, Daily.co)
echo.

pause

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Railway CLI not found!
    echo Install it with: npm install -g @railway/cli
    pause
    exit /b 1
)

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI not found!
    echo Install it with: npm install -g vercel
    pause
    exit /b 1
)

echo.
echo ========================================
echo   STEP 1: Deploy Backend to Railway
echo ========================================
echo.

echo Navigating to backend directory...
cd /d "%~dp0BACKEND\novaaid-app-backend"

echo.
echo Opening Railway login...
railway login

echo.
echo Initializing Railway project...
echo (Choose: Create new project, name it 'novaaid-backend')
railway init

echo.
echo Now set your environment variables in Railway dashboard:
echo https://railway.app/dashboard
echo.
echo Required variables:
echo - PORT=3001
echo - NODE_ENV=production
echo - FIREBASE_PROJECT_ID
echo - FIREBASE_CLIENT_EMAIL
echo - FIREBASE_PRIVATE_KEY
echo - FIREBASE_DATABASE_URL
echo - CLERK_SECRET_KEY
echo - CLERK_PUBLISHABLE_KEY
echo - DAILY_API_KEY
echo - DAILY_BASE_URL
echo - ALLOWED_ORIGINS
echo.
pause

echo.
echo Deploying backend to Railway...
railway up

echo.
echo Getting Railway backend URL...
railway domain

echo.
echo [IMPORTANT] Copy your Railway URL and save it!
echo You'll need it for frontend deployment.
echo.
pause

echo.
echo ========================================
echo   STEP 2: Deploy Refugee Portal
echo ========================================
echo.

cd /d "%~dp0FRONTEND\novaaid-app"

echo.
echo Deploying Refugee Portal to Vercel...
echo (Project name: novaaid-app)
vercel

echo.
echo After deployment, go to Vercel dashboard and set environment variables:
echo https://vercel.com/dashboard
echo.
echo Required variables:
echo - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo - CLERK_SECRET_KEY
echo - NEXT_PUBLIC_BACKEND_URL (your Railway URL)
echo - NEXT_PUBLIC_CONTRACT_ADDRESS
echo - NEXT_PUBLIC_CHAIN_ID
echo - NEXT_PUBLIC_RPC_URL
echo.
pause

echo.
echo Deploying to production...
vercel --prod

echo.
echo [IMPORTANT] Copy your Vercel URL and save it!
echo.
pause

echo.
echo ========================================
echo   STEP 3: Deploy NGO Portal
echo ========================================
echo.

cd /d "%~dp0FRONTEND\NGO SECTION\ngo-portal"

echo.
echo Deploying NGO Portal to Vercel...
echo (Project name: novaaid-ngo-portal)
vercel

echo.
echo Set the same environment variables as Refugee Portal.
echo.
pause

echo.
echo Deploying to production...
vercel --prod

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.

echo Now update Railway CORS with your Vercel URLs:
echo 1. Go to Railway dashboard
echo 2. Update ALLOWED_ORIGINS variable
echo 3. Restart the service
echo.
echo Test your deployment:
echo 1. Visit your Refugee Portal URL
echo 2. Visit your NGO Portal URL
echo 3. Test backend health endpoint
echo.

pause

echo.
echo For detailed instructions, see DEPLOY_NOW.md
echo.
pause
