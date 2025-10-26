# Environment Variables Checklist 📋

Use this checklist to ensure all environment variables are properly configured for deployment.

---

## 🚂 Railway (Backend)

Project: `novaaid-app-backend`  
Dashboard: https://railway.app/dashboard

### Required Variables

- [ ] **FIREBASE_SERVICE_ACCOUNT_JSON**
  - Value: Entire JSON content from `serviceAccountKey.json`
  - Format: `{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}`

- [ ] **FIREBASE_ZK_SERVICE_ACCOUNT_JSON**
  - Value: Entire JSON content from `zkServiceAccountKey.json`
  - Format: `{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}`

- [ ] **CLERK_SECRET_KEY**
  - Value: `sk_test_xxxxx` or `sk_live_xxxxx`
  - Get from: Clerk Dashboard → API Keys

- [ ] **CLERK_PUBLISHABLE_KEY**
  - Value: `pk_test_xxxxx` or `pk_live_xxxxx`
  - Get from: Clerk Dashboard → API Keys

- [ ] **CLERK_FRONTEND_API**
  - Value: `clerk.yourapp.com` or your Clerk frontend API
  - Get from: Clerk Dashboard → API Keys

- [ ] **CELO_ALFAJORES_RPC**
  - Value: `https://alfajores-forno.celo-testnet.org`
  - For mainnet: `https://forno.celo.org`

- [ ] **OPERATOR_PRIVATE_KEY**
  - Value: `0x...` (your wallet private key)
  - ⚠️ **NEVER commit this to Git!**

- [ ] **CUSD_ADDRESS_ALFAJORES**
  - Value: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`
  - For mainnet: `0x765DE816845861e75A25fCA122bb6898B8B1282a`

- [ ] **VERIFIER_CONTRACT_ADDRESS**
  - Value: Address from blockchain deployment
  - Get from: `BLOCKCHAIN/novaaid-app-blockchain/deployments/`

- [ ] **VERIFIED_PAYMENTS_CONTRACT_ADDRESS**
  - Value: Address from blockchain deployment
  - Get from: `BLOCKCHAIN/novaaid-app-blockchain/deployments/`

- [ ] **DAILY_API_KEY**
  - Value: Your Daily.co API key
  - Get from: https://dashboard.daily.co

- [ ] **DAILY_BASE_URL**
  - Value: `https://api.daily.co`

- [ ] **PORT**
  - Value: `3001`

- [ ] **NODE_ENV**
  - Value: `production`

---

## ▲ Vercel - Main App

Project: `novaaid-main-app`  
Dashboard: https://vercel.com/dashboard

### Clerk Authentication

- [ ] **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
  - Value: `pk_test_xxxxx`
  - Environment: Production, Preview, Development

- [ ] **CLERK_SECRET_KEY**
  - Value: `sk_test_xxxxx`
  - Environment: Production, Preview, Development
  - ⚠️ Server-side only (no NEXT_PUBLIC prefix)

### Firebase Client (Public)

- [ ] **NEXT_PUBLIC_FIREBASE_API_KEY**
  - Value: `AIzaSy...`
  - Get from: Firebase Console → Project Settings → Your apps

- [ ] **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**
  - Value: `your-project.firebaseapp.com`

- [ ] **NEXT_PUBLIC_FIREBASE_PROJECT_ID**
  - Value: `your-project-id`

- [ ] **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**
  - Value: `your-project.appspot.com`

- [ ] **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**
  - Value: `123456789`

- [ ] **NEXT_PUBLIC_FIREBASE_APP_ID**
  - Value: `1:123456789:web:xxxxx`

### Firebase Admin (Server-side)

- [ ] **FIREBASE_PROJECT_ID**
  - Value: Same as public project ID
  - ⚠️ No NEXT_PUBLIC prefix

- [ ] **FIREBASE_CLIENT_EMAIL**
  - Value: `firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com`
  - Get from: `serviceAccountKey.json`

- [ ] **FIREBASE_PRIVATE_KEY**
  - Value: `-----BEGIN PRIVATE KEY-----\nYour\nMultiline\nKey\nHere\n-----END PRIVATE KEY-----\n`
  - Get from: `serviceAccountKey.json`
  - ⚠️ **Keep quotes and \n characters as-is!**

### Blockchain

- [ ] **NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS**
  - Value: Contract address from deployment

- [ ] **NEXT_PUBLIC_SEMAPHORE_VERIFIER_ADDRESS**
  - Value: Verifier contract address

- [ ] **NEXT_PUBLIC_CELO_NETWORK**
  - Value: `alfajores` (testnet) or `celo` (mainnet)

- [ ] **NEXT_PUBLIC_CUSD_ADDRESS**
  - Value: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1` (Alfajores)

### Backend API

- [ ] **NEXT_PUBLIC_BACKEND_API_URL**
  - Value: `https://your-backend.up.railway.app`
  - Get from: Railway deployment URL

### Daily.co Video

- [ ] **NEXT_PUBLIC_DAILY_API_KEY**
  - Value: Your Daily.co API key
  - Get from: https://dashboard.daily.co

---

## ▲ Vercel - NGO Portal

Project: `novaaid-ngo-portal`  
Dashboard: https://vercel.com/dashboard

### Same as Main App, Plus:

- [ ] **MONGODB_URI** (if using MongoDB)
  - Value: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
  - Get from: MongoDB Atlas

- [ ] **NEXT_PUBLIC_DAILY_API_KEY**
  - Value: Same Daily.co key as main app

All other variables same as Main App ☝️

---

## ▲ Vercel - Fraud Detection

Project: `novaaid-fraud-detection`  
Dashboard: https://vercel.com/dashboard

### Firebase (Note: VITE_ prefix for Vite projects!)

- [ ] **VITE_FIREBASE_API_KEY**
  - Value: `AIzaSy...`

- [ ] **VITE_FIREBASE_AUTH_DOMAIN**
  - Value: `your-project.firebaseapp.com`

- [ ] **VITE_FIREBASE_PROJECT_ID**
  - Value: `your-project-id`

- [ ] **VITE_FIREBASE_STORAGE_BUCKET**
  - Value: `your-project.appspot.com`

- [ ] **VITE_FIREBASE_MESSAGING_SENDER_ID**
  - Value: `123456789`

- [ ] **VITE_FIREBASE_APP_ID**
  - Value: `1:123456789:web:xxxxx`

---

## 📝 How to Add Variables

### Railway Dashboard Method

1. Go to https://railway.app/dashboard
2. Select your project
3. Click **Variables** tab
4. Click **+ New Variable**
5. Enter name and value
6. Click **Add**
7. Redeploy: `railway up`

### Vercel Dashboard Method

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Enter variable name
5. Enter value
6. Select environments (Production, Preview, Development)
7. Click **Save**
8. Redeploy from **Deployments** tab

### CLI Method (Railway)

```bash
railway variables set VARIABLE_NAME="value"
```

### CLI Method (Vercel)

```bash
vercel env add VARIABLE_NAME
# Then paste the value when prompted
```

---

## 🔐 Security Tips

1. **Never commit secrets to Git**
   - Add `.env` to `.gitignore`
   - Never hardcode API keys in code

2. **Use different keys for development and production**
   - Separate Firebase projects
   - Separate Clerk applications
   - Separate blockchain networks

3. **Rotate keys regularly**
   - Change API keys every 90 days
   - Generate new service accounts if compromised

4. **Restrict API access**
   - Set domain restrictions in Firebase
   - Configure allowed origins in Clerk
   - Use Railway's private networking when possible

5. **Monitor usage**
   - Check Firebase usage dashboard
   - Review Clerk active users
   - Monitor Railway metrics

---

## ✅ Verification Checklist

After adding all variables:

- [ ] Backend health check works: `curl https://your-backend.railway.app/health`
- [ ] Frontend loads without errors
- [ ] Authentication works (Clerk login)
- [ ] Firebase connection works (check console)
- [ ] Blockchain connection works (wallet connect)
- [ ] Video calling works (Daily.co)
- [ ] No errors in Railway logs
- [ ] No errors in Vercel logs

---

## 🆘 Common Issues

**"Firebase initialization failed"**
- Check JSON format of service account
- Ensure no extra spaces or line breaks
- Verify project ID matches

**"Clerk authentication failed"**
- Verify publishable key starts with `pk_`
- Verify secret key starts with `sk_`
- Check domain is added in Clerk dashboard

**"FIREBASE_PRIVATE_KEY error"**
- Must include `\n` characters
- Must be wrapped in quotes
- Should have `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

**"Contract not found"**
- Verify contract addresses are correct
- Check network matches (alfajores vs mainnet)
- Ensure contracts are deployed

---

## 📚 Where to Find Values

| Variable | Location |
|----------|----------|
| Clerk Keys | https://dashboard.clerk.com → API Keys |
| Firebase Config | Firebase Console → Project Settings → Your apps |
| Service Account | Firebase Console → Project Settings → Service Accounts |
| Daily.co API Key | https://dashboard.daily.co/developers |
| Contract Addresses | `BLOCKCHAIN/novaaid-app-blockchain/deployments/` |
| Railway URL | Railway Dashboard → Deployments |
| Vercel URL | Vercel Dashboard → Domains |

---

## 🎯 Pro Tips

1. **Copy from existing .env files** - Most values are already in your local `.env` files
2. **Use .env.example** - Reference the example files in each project
3. **Test locally first** - Ensure everything works locally before deploying
4. **One service at a time** - Deploy and test backend, then frontends
5. **Check logs immediately** - Watch deployment logs for errors

---

**See `PRODUCTION_DEPLOYMENT.md` for full deployment guide.**
