# 🚀 NovaAid Deployment - Ready to Execute

**Status**: Configuration Extracted ✅  
**Blockchain Contract**: `0x8a3a92E1207de2eBA6EF3AB14d2e02b93A6884c5`  
**CORS**: Updated ✅

---

## 📦 Step 1: Deploy Backend to Railway

### 1.1 Navigate and Login
```powershell
cd "BACKEND/novaaid-app-backend"
railway login
```

### 1.2 Initialize Railway Project
```powershell
railway init
```
Choose option to create new project or link existing.

### 1.3 Add Environment Variables in Railway Dashboard

**Go to**: https://railway.app/dashboard → Your Project → Variables

**Required Variables**:

```env
# Server Config
PORT=3001
NODE_ENV=production

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_BXfKQB53bJkM3q5GRS0kIMiSY2tuUA3a4SRTtVzsJY
CLERK_PUBLISHABLE_KEY=pk_test_ZGFyaW5nLW9wb3NzdW0tOC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_FRONTEND_API=daring-opossum-8.clerk.accounts.dev

# Celo Blockchain
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
CUSD_ADDRESS_ALFAJORES=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
VERIFIER_CONTRACT_ADDRESS=0x8a3a92E1207de2eBA6EF3AB14d2e02b93A6884c5
VERIFIED_PAYMENTS_CONTRACT_ADDRESS=0x8a3a92E1207de2eBA6EF3AB14d2e02b93A6884c5

# Daily.co Video
DAILY_BASE_URL=https://api.daily.co

# 🔑 YOU NEED TO ADD MANUALLY:
# OPERATOR_PRIVATE_KEY=0x<your-wallet-private-key>
# DAILY_API_KEY=<your-daily-api-key>
# FIREBASE_SERVICE_ACCOUNT_JSON=<paste entire serviceAccountKey.json content>
# FIREBASE_ZK_SERVICE_ACCOUNT_JSON=<paste entire zkServiceAccountKey.json content>
```

⚠️ **IMPORTANT**: For Firebase service accounts:
- Open `serviceAccountKey.json` and `zkServiceAccountKey.json`
- Copy the ENTIRE JSON content (all text from `{` to `}`)
- Paste as environment variable values

### 1.4 Deploy Backend
```powershell
railway up
```

### 1.5 Get Railway URL
After deployment, Railway will provide a URL like:
```
https://novaaid-backend-production.up.railway.app
```

**📝 SAVE THIS URL** - you'll need it for frontend deployment!

### 1.6 Test Backend
```powershell
curl https://your-railway-url.up.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-10-26...","environment":"production"}
```

---

## 🎨 Step 2: Deploy Main App to Vercel

### 2.1 Navigate and Deploy
```powershell
cd "../../FRONTEND/novaaid-app"
vercel login
vercel --prod
```

**Prompts**:
- Project name: `novaaid-main-app`
- Directory: `./`
- Override settings: `N`

### 2.2 Add Environment Variables in Vercel

**Go to**: https://vercel.com/dashboard → novaaid-main-app → Settings → Environment Variables

**Add these variables** (select Production, Preview, Development):

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGFyaW5nLW9wb3NzdW0tOC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_BXfKQB53bJkM3q5GRS0kIMiSY2tuUA3a4SRTtVzsJY

# Firebase Client
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nova-aid-43305
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nova-aid-43305.firebaseapp.com

# Firebase Admin
FIREBASE_PROJECT_ID=nova-aid-43305
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@nova-aid-43305.iam.gserviceaccount.com

# Blockchain
NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS=0x8a3a92E1207de2eBA6EF3AB14d2e02b93A6884c5
NEXT_PUBLIC_SEMAPHORE_VERIFIER_ADDRESS=0x8a3a92E1207de2eBA6EF3AB14d2e02b93A6884c5
NEXT_PUBLIC_CELO_NETWORK=alfajores
NEXT_PUBLIC_CUSD_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1

# Backend API - USE YOUR RAILWAY URL FROM STEP 1.5
NEXT_PUBLIC_BACKEND_API_URL=https://your-railway-url.up.railway.app

# 🔑 YOU NEED TO GET FROM FIREBASE CONSOLE:
# NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...

# 🔑 YOU NEED FROM YOUR .env FILE:
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# 🔑 YOU NEED TO ADD:
# NEXT_PUBLIC_DAILY_API_KEY=<your-daily-key>
```

### 2.3 Redeploy
```powershell
vercel --prod
```

---

## 🏢 Step 3: Deploy NGO Portal

```powershell
cd "../NGO SECTION/ngo-portal"
vercel --prod
```

**Project name**: `novaaid-ngo-portal`

**Add same environment variables as Main App in Vercel Dashboard**

---

## 🔍 Step 4: Deploy Fraud Detection

```powershell
cd "../../../AI-ML/fraud"
vercel --prod
```

**Project name**: `novaaid-fraud-detection`

**Add these variables in Vercel Dashboard**:
```env
VITE_FIREBASE_PROJECT_ID=nova-aid-43305
VITE_FIREBASE_AUTH_DOMAIN=nova-aid-43305.firebaseapp.com

# 🔑 YOU NEED TO GET FROM FIREBASE CONSOLE:
# VITE_FIREBASE_API_KEY=AIzaSy...
# VITE_FIREBASE_STORAGE_BUCKET=nova-aid-43305.appspot.com
# VITE_FIREBASE_MESSAGING_SENDER_ID=...
# VITE_FIREBASE_APP_ID=...
```

---

## ✅ Step 5: Update Clerk Domains

1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to **Domains**
4. Add:
   - `novaaid-main-app.vercel.app`
   - `novaaid-ngo-portal.vercel.app`

---

## 🎯 Step 6: Test Everything

### Backend Health
```powershell
curl https://your-railway-url.up.railway.app/health
```

### Frontend Apps
- Main App: `https://novaaid-main-app.vercel.app`
- NGO Portal: `https://novaaid-ngo-portal.vercel.app`
- Fraud Detection: `https://novaaid-fraud-detection.vercel.app`

---

## 📊 Deployment URLs

After completion, document your URLs:

```
Main App:          https://novaaid-main-app.vercel.app
NGO Portal:        https://novaaid-ngo-portal.vercel.app
Fraud Detection:   https://novaaid-fraud-detection.vercel.app
Backend API:       https://[your-railway-url].up.railway.app
```

---

## 🔑 Missing Information You Need to Provide

1. **OPERATOR_PRIVATE_KEY**: Your wallet private key (keep secret!)
2. **DAILY_API_KEY**: From https://dashboard.daily.co
3. **FIREBASE_API_KEY**: From Firebase Console → Project Settings → Web API Key
4. **Firebase Service Account JSONs**: Content of `serviceAccountKey.json` and `zkServiceAccountKey.json`
5. **FIREBASE_PRIVATE_KEY**: From your .env file (the full multi-line key)

---

**Ready to start? Follow Step 1 above!** 🚀
