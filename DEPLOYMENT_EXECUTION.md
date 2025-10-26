# 🚀 NovaAid Deployment Execution Guide

**Status**: Ready to Deploy  
**Date**: $(Get-Date -Format "yyyy-MM-dd")  
**CLIs Verified**: ✅ Vercel 48.3.0 | ✅ Railway 4.10.0

---

## 📋 Pre-Deployment Checklist

### ✅ Verified Ready
- [x] Vercel CLI installed and version confirmed
- [x] Railway CLI installed and version confirmed
- [x] All `vercel.json` configurations in place
- [x] `railway.json` configuration exists
- [x] Project structure validated

### 🔑 Required Before Deploy
- [ ] Vercel account logged in: `vercel login`
- [ ] Railway account logged in: `railway login`
- [ ] Firebase service account JSON files ready
- [ ] Clerk API keys available
- [ ] Blockchain contract addresses (if deployed)
- [ ] Daily.co API key (optional)

---

## 🎯 Deployment Sequence

### Step 1️⃣: Deploy Backend to Railway (15 minutes)

```powershell
# Navigate to backend
cd "BACKEND/novaaid-app-backend"

# Login to Railway (if not already)
railway login

# Initialize Railway project
railway init

# Link to existing project or create new one
# Follow the prompts
```

**Add Environment Variables in Railway Dashboard:**
1. Go to https://railway.app/dashboard
2. Select your project
3. Click **Variables** tab
4. Add these variables:

```env
FIREBASE_SERVICE_ACCOUNT_JSON=<paste entire serviceAccountKey.json>
FIREBASE_ZK_SERVICE_ACCOUNT_JSON=<paste entire zkServiceAccountKey.json>
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_FRONTEND_API=<your-clerk-frontend-api>
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=0x<your-private-key>
CUSD_ADDRESS_ALFAJORES=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
VERIFIER_CONTRACT_ADDRESS=<your-verifier-address>
VERIFIED_PAYMENTS_CONTRACT_ADDRESS=<your-payments-address>
DAILY_API_KEY=<your-daily-key>
DAILY_BASE_URL=https://api.daily.co
PORT=3001
NODE_ENV=production
```

**Deploy Backend:**
```powershell
railway up
```

**Save Railway URL**: Copy the deployment URL (e.g., `https://novaaid-backend.up.railway.app`)

---

### Step 2️⃣: Deploy Main App to Vercel (10 minutes)

```powershell
# Navigate to main app
cd "../../FRONTEND/novaaid-app"

# Login to Vercel (if not already)
vercel login

# Deploy to production
vercel --prod
```

**Follow prompts:**
- Project name: `novaaid-main-app`
- Directory: `./`
- Override settings: `N`

**Add Environment Variables in Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select `novaaid-main-app`
3. Settings → Environment Variables
4. Add all variables from your local `.env.local`:
   - Clerk keys (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
   - Firebase config (all NEXT_PUBLIC_FIREBASE_*)
   - Firebase Admin (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
   - Blockchain addresses (NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS, etc.)
   - **NEXT_PUBLIC_BACKEND_API_URL** = Your Railway URL from Step 1
   - NEXT_PUBLIC_DAILY_API_KEY

**Redeploy after adding variables:**
```powershell
vercel --prod
```

**Save Vercel URL**: Copy the deployment URL

---

### Step 3️⃣: Deploy NGO Portal to Vercel (10 minutes)

```powershell
# Navigate to NGO portal
cd "../NGO SECTION/ngo-portal"

# Deploy to production
vercel --prod
```

**Follow prompts:**
- Project name: `novaaid-ngo-portal`

**Add Environment Variables** (same as main app):
- All Clerk variables
- All Firebase variables
- Backend API URL
- Daily.co API key
- MongoDB URI (if using)

**Redeploy:**
```powershell
vercel --prod
```

**Save Vercel URL**: Copy the deployment URL

---

### Step 4️⃣: Deploy Fraud Detection to Vercel (10 minutes)

```powershell
# Navigate to fraud detection
cd "../../../AI-ML/fraud"

# Deploy to production
vercel --prod
```

**Follow prompts:**
- Project name: `novaaid-fraud-detection`

**Add Environment Variables** (Note: VITE_ prefix!):
```env
VITE_FIREBASE_API_KEY=<your-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

**Redeploy:**
```powershell
vercel --prod
```

**Save Vercel URL**: Copy the deployment URL

---

### Step 5️⃣: Update Backend CORS (5 minutes)

**Update CORS in `BACKEND/novaaid-app-backend/index.js`:**

Replace line 19:
```javascript
app.use(cors());
```

With:
```javascript
app.use(cors({
  origin: [
    'https://novaaid-main-app.vercel.app',
    'https://novaaid-ngo-portal.vercel.app',
    'https://novaaid-fraud-detection.vercel.app',
    'http://localhost:3000',
    'http://localhost:3002'
  ],
  credentials: true
}));
```

**Redeploy Backend:**
```powershell
cd "../../BACKEND/novaaid-app-backend"
railway up
```

---

### Step 6️⃣: Update Clerk Settings (3 minutes)

1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to **Domains** or **DNS**
4. Add these domains:
   - `novaaid-main-app.vercel.app`
   - `novaaid-ngo-portal.vercel.app`
5. Update **Redirect URLs** if needed

---

### Step 7️⃣: Test Deployments (5 minutes)

**Backend Health Check:**
```powershell
curl https://your-backend.up.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-..."}
```

**Frontend Checks:**
- Visit Main App URL
- Visit NGO Portal URL
- Visit Fraud Detection URL
- Test authentication flow
- Test wallet connection
- Test video calling

---

## 📊 Deployment URLs Summary

After successful deployment, document your URLs:

```
Main App:          https://novaaid-main-app.vercel.app
NGO Portal:        https://novaaid-ngo-portal.vercel.app
Fraud Detection:   https://novaaid-fraud-detection.vercel.app
Backend API:       https://novaaid-backend.up.railway.app
```

---

## 🐛 Troubleshooting

### Build Failures
```powershell
# Check logs
railway logs           # For backend
vercel logs            # For frontend

# Test build locally
npm run build
```

### Environment Variable Issues
- Ensure all variables are added in correct environment (Production)
- For Next.js: Client vars need `NEXT_PUBLIC_` prefix
- For Vite: Client vars need `VITE_` prefix
- For Railway: Use Dashboard to add JSON variables

### CORS Errors
- Verify backend CORS includes all frontend URLs
- Check protocol (https vs http)
- Ensure credentials: true is set

### Authentication Issues
- Verify Clerk domains are added
- Check API keys are production keys
- Test login flow in incognito mode

---

## 🎯 Post-Deployment Tasks

- [ ] Test all authentication flows
- [ ] Verify database connections
- [ ] Test blockchain interactions
- [ ] Test video calling
- [ ] Monitor Railway logs
- [ ] Monitor Vercel logs
- [ ] Set up monitoring/alerts
- [ ] Update documentation with live URLs
- [ ] Share URLs with team

---

## 📞 Support Resources

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Firebase Console**: https://console.firebase.google.com

---

## 🔄 Redeployment Commands

**Backend:**
```powershell
cd "BACKEND/novaaid-app-backend"
railway up
```

**Main App:**
```powershell
cd "FRONTEND/novaaid-app"
vercel --prod
```

**NGO Portal:**
```powershell
cd "FRONTEND/NGO SECTION/ngo-portal"
vercel --prod
```

**Fraud Detection:**
```powershell
cd "AI-ML/fraud"
vercel --prod
```

---

**🎉 Ready to deploy! Follow the steps above in order.**

**Estimated Total Time**: 45-60 minutes
