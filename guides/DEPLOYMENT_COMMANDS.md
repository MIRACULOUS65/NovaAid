# 🎯 Copy-Paste Deployment Commands

Quick reference for deployment commands. Copy and paste directly into your terminal.

---

## 📦 Setup (One-time)

```bash
# Install CLIs globally
npm i -g vercel @railway/cli

# Login to Vercel
vercel login

# Login to Railway
railway login
```

---

## 🚂 Backend Deployment (Railway)

### Navigate to backend
```bash
cd "d:/Refugee Lifeline/NovaAid/BACKEND/novaaid-app-backend"
```

### Initialize Railway project
```bash
railway init
```

### Set environment variables (via CLI)
```bash
# Critical: Set Firebase service accounts via Railway dashboard instead
# These are too large for CLI

# Clerk
railway variables set CLERK_SECRET_KEY="your_clerk_secret_key"
railway variables set CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
railway variables set CLERK_FRONTEND_API="your_clerk_frontend_api"

# Celo
railway variables set CELO_ALFAJORES_RPC="https://alfajores-forno.celo-testnet.org"
railway variables set OPERATOR_PRIVATE_KEY="0xyour_private_key"
railway variables set CUSD_ADDRESS_ALFAJORES="0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

# Daily.co
railway variables set DAILY_API_KEY="your_daily_api_key"
railway variables set DAILY_BASE_URL="https://api.daily.co"

# Server config
railway variables set PORT="3001"
railway variables set NODE_ENV="production"
```

### Deploy
```bash
railway up
```

### Get deployment URL
```bash
railway open
# Copy the URL from the dashboard
```

### View logs
```bash
railway logs
```

### Health check
```bash
# Replace with your Railway URL
curl https://your-app.up.railway.app/health
```

---

## ▲ Main App Deployment (Vercel)

### Navigate to main app
```bash
cd "d:/Refugee Lifeline/NovaAid/FRONTEND/novaaid-app"
```

### Deploy to production
```bash
vercel --prod
```

**Follow prompts:**
- Set up and deploy? **Y**
- Which scope? *Select your account*
- Link to existing project? **N** (first time) or **Y** (re-deploy)
- Project name? **novaaid-main-app**
- Directory? **./**
- Override settings? **N**

### Add environment variables (via CLI)
```bash
# Clerk
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# Paste value when prompted

vercel env add CLERK_SECRET_KEY
# Paste value when prompted

# Firebase Public
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY

# Blockchain
vercel env add NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS
vercel env add NEXT_PUBLIC_SEMAPHORE_VERIFIER_ADDRESS
vercel env add NEXT_PUBLIC_CELO_NETWORK

# Backend
vercel env add NEXT_PUBLIC_BACKEND_API_URL

# Daily.co
vercel env add NEXT_PUBLIC_DAILY_API_KEY
```

### Redeploy with environment variables
```bash
vercel --prod
```

### View logs
```bash
vercel logs
```

---

## 🏢 NGO Portal Deployment (Vercel)

### Navigate to NGO portal
```bash
cd "d:/Refugee Lifeline/NovaAid/FRONTEND/NGO SECTION/ngo-portal"
```

### Deploy
```bash
vercel --prod
```

**Project name**: **novaaid-ngo-portal**

### Add same environment variables as main app
```bash
# Use same commands as main app section above
# Or add via dashboard: https://vercel.com/dashboard
```

---

## 🔍 Fraud Detection Deployment (Vercel)

### Navigate to fraud detection
```bash
cd "d:/Refugee Lifeline/NovaAid/AI-ML/fraud"
```

### Deploy
```bash
vercel --prod
```

**Project name**: **novaaid-fraud-detection**

### Add Vite environment variables
```bash
# Note: VITE_ prefix instead of NEXT_PUBLIC_
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

---

## 🔄 Update & Redeploy Commands

### Update backend
```bash
cd "d:/Refugee Lifeline/NovaAid/BACKEND/novaaid-app-backend"
# Make your changes
railway up
```

### Update main app
```bash
cd "d:/Refugee Lifeline/NovaAid/FRONTEND/novaaid-app"
# Make your changes
vercel --prod
```

### Update NGO portal
```bash
cd "d:/Refugee Lifeline/NovaAid/FRONTEND/NGO SECTION/ngo-portal"
# Make your changes
vercel --prod
```

### Update fraud detection
```bash
cd "d:/Refugee Lifeline/NovaAid/AI-ML/fraud"
# Make your changes
vercel --prod
```

---

## 📊 Monitoring Commands

### Railway (Backend)

```bash
# View logs
railway logs

# View logs with follow (live)
railway logs -f

# View environment variables
railway variables

# Open Railway dashboard
railway open

# Check project status
railway status
```

### Vercel (Frontend)

```bash
# View recent logs
vercel logs

# View logs for specific deployment
vercel logs [deployment-url]

# List all deployments
vercel ls

# List environment variables
vercel env ls

# Open Vercel dashboard
vercel open
```

---

## 🧪 Testing Commands

### Backend health check
```bash
# Replace with your actual Railway URL
curl https://your-backend.up.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-01-..."}
```

### Backend API test
```bash
# Test merkle root endpoint
curl https://your-backend.up.railway.app/api/merkle/root
```

### Frontend check
```bash
# Check if frontend is accessible
curl -I https://your-frontend.vercel.app
```

### Full API test
```bash
# Create video room
curl -X POST https://your-backend.up.railway.app/api/video/create-room \
  -H "Content-Type: application/json" \
  -d '{"properties": {"enable_chat": true}}'
```

---

## 🗑️ Cleanup Commands

### Remove Railway deployment
```bash
railway down
```

### Remove Vercel deployment
```bash
vercel remove [project-name]
```

---

## 🔧 Troubleshooting Commands

### Check build logs (Railway)
```bash
railway logs --build
```

### Check runtime logs (Railway)
```bash
railway logs --runtime
```

### Check deployment logs (Vercel)
```bash
vercel logs --since=1h
```

### Inspect environment (Railway)
```bash
railway run printenv
```

### Inspect environment (Vercel)
```bash
vercel env pull .env.local
```

---

## 🚀 One-Command Full Deployment

Create this script: `quick-deploy.sh`

```bash
#!/bin/bash

echo "🚀 NovaAid Full Deployment Starting..."

# Backend
echo "📦 Deploying Backend..."
cd "BACKEND/novaaid-app-backend"
railway up
cd ../..

# Main App
echo "🎨 Deploying Main App..."
cd "FRONTEND/novaaid-app"
vercel --prod
cd ../..

# NGO Portal
echo "🏢 Deploying NGO Portal..."
cd "FRONTEND/NGO SECTION/ngo-portal"
vercel --prod
cd ../../..

# Fraud Detection
echo "🔍 Deploying Fraud Detection..."
cd "AI-ML/fraud"
vercel --prod
cd ../..

echo "✅ All deployments complete!"
```

Run with:
```bash
bash quick-deploy.sh
```

---

## 📝 Environment Variable Commands

### Export from local to file
```bash
# Railway
railway variables > railway-vars.txt

# Vercel (pull to .env.local)
vercel env pull .env.local
```

### Import from file
```bash
# Railway (manual - set each one)
cat railway-vars.txt

# Vercel (use dashboard or CLI add)
# Must add each variable individually
```

---

## 🔐 Security Commands

### Rotate Railway variables
```bash
railway variables set OLD_VAR="new_value"
railway up  # Redeploy with new value
```

### Rotate Vercel variables
```bash
vercel env rm OLD_VAR
vercel env add OLD_VAR
vercel --prod  # Redeploy with new value
```

### Check for exposed secrets
```bash
# In your project root
git log -p | grep -i "password\|secret\|key" | head -20
```

---

## 📊 Status Dashboard URLs

```bash
# Railway
echo "Railway: https://railway.app/dashboard"

# Vercel
echo "Vercel: https://vercel.com/dashboard"

# Clerk
echo "Clerk: https://dashboard.clerk.com"

# Firebase
echo "Firebase: https://console.firebase.google.com"

# Daily.co
echo "Daily: https://dashboard.daily.co"
```

---

## 💡 Pro Tips

### Auto-deployment setup

**Railway** (GitHub integration):
```bash
# Connect in Railway dashboard
# Pushes to main will auto-deploy
```

**Vercel** (Git integration):
```bash
# Link repository in Vercel dashboard
# Every push creates preview deployment
# Merges to main deploy to production
```

### Preview deployments

```bash
# Vercel preview (before production)
vercel

# Check preview URL
vercel ls
```

### Rollback deployment

```bash
# Railway: Use dashboard to rollback
railway open

# Vercel: Rollback from dashboard
vercel open
```

---

## 🎯 Quick Reference Card

| Task | Command |
|------|---------|
| Deploy backend | `railway up` |
| Deploy frontend | `vercel --prod` |
| View backend logs | `railway logs` |
| View frontend logs | `vercel logs` |
| Add env var (Railway) | `railway variables set KEY="value"` |
| Add env var (Vercel) | `vercel env add KEY` |
| Open dashboard (Railway) | `railway open` |
| Open dashboard (Vercel) | `vercel open` |
| Health check | `curl [URL]/health` |
| Rollback | Use dashboard |

---

**Save this file for quick reference during deployment!** 📌

For detailed explanations, see `PRODUCTION_DEPLOYMENT.md`
