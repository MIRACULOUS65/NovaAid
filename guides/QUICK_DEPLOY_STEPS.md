# Quick Deploy Steps - NovaAid 🚀

Follow these steps in order for fastest deployment.

## ⚡ Prerequisites (5 minutes)

```bash
# Install CLIs
npm i -g vercel @railway/cli

# Login to services
vercel login
railway login
```

## 📦 Step 1: Deploy Backend (10 minutes)

```bash
cd "BACKEND/novaaid-app-backend"
railway init
```

**Add these variables in Railway Dashboard:**
```env
FIREBASE_SERVICE_ACCOUNT_JSON={paste entire serviceAccountKey.json content}
FIREBASE_ZK_SERVICE_ACCOUNT_JSON={paste entire zkServiceAccountKey.json content}
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=0xyourkey
DAILY_API_KEY=your_daily_key
PORT=3001
NODE_ENV=production
```

```bash
railway up
```

**Copy the Railway URL** (e.g., `https://yourapp.up.railway.app`)

## 🎨 Step 2: Deploy Main App (5 minutes)

```bash
cd "FRONTEND/novaaid-app"
vercel --prod
```

Project name: `novaaid-main-app`

**Add environment variables in Vercel Dashboard** (copy from `.env.local`):
- All Clerk variables
- All Firebase variables
- `NEXT_PUBLIC_BACKEND_API_URL` = your Railway URL
- All blockchain contract addresses

## 🏢 Step 3: Deploy NGO Portal (5 minutes)

```bash
cd "FRONTEND/NGO SECTION/ngo-portal"
vercel --prod
```

Project name: `novaaid-ngo-portal`

Add same environment variables as main app.

## 🔍 Step 4: Deploy Fraud Detection (5 minutes)

```bash
cd "AI-ML/fraud"
vercel --prod
```

Project name: `novaaid-fraud-detection`

Add Firebase variables with `VITE_` prefix.

## ✅ Step 5: Connect Services (5 minutes)

### Update Backend CORS

Edit `BACKEND/novaaid-app-backend/index.js`:

```javascript
app.use(cors({
  origin: [
    'https://novaaid-main-app.vercel.app',
    'https://novaaid-ngo-portal.vercel.app',
    'https://novaaid-fraud-detection.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Redeploy:
```bash
railway up
```

### Update Clerk

Go to Clerk Dashboard → Domains:
- Add `novaaid-main-app.vercel.app`
- Add `novaaid-ngo-portal.vercel.app`

## 🎉 Done!

Your apps are live at:
- **Main App**: https://novaaid-main-app.vercel.app
- **NGO Portal**: https://novaaid-ngo-portal.vercel.app
- **Fraud Detection**: https://novaaid-fraud-detection.vercel.app
- **Backend API**: https://yourapp.up.railway.app

Test the health endpoint:
```bash
curl https://yourapp.up.railway.app/health
```

---

**Total Time**: ~30 minutes

**See `PRODUCTION_DEPLOYMENT.md` for detailed troubleshooting and configuration.**
