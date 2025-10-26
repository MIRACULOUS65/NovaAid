# 🚀 NovaAid Deployment Quick Reference

## ✅ Pre-Flight Status
- [x] Vercel CLI: v48.3.0 installed
- [x] Railway CLI: v4.10.0 installed
- [x] All config files ready

## 🎯 Deployment Commands

### 1. Backend → Railway
```powershell
cd "BACKEND/novaaid-app-backend"
railway login
railway init
# Add env vars in Railway Dashboard
railway up
```

### 2. Main App → Vercel
```powershell
cd "FRONTEND/novaaid-app"
vercel login
vercel --prod
# Add env vars in Vercel Dashboard
```

### 3. NGO Portal → Vercel
```powershell
cd "FRONTEND/NGO SECTION/ngo-portal"
vercel --prod
# Add env vars in Vercel Dashboard
```

### 4. Fraud Detection → Vercel
```powershell
cd "AI-ML/fraud"
vercel --prod
# Add env vars in Vercel Dashboard
```

### 5. Update Backend CORS
```powershell
cd "BACKEND/novaaid-app-backend"
# Copy index.production.js to index.js
cp index.production.js index.js
railway up
```

## 🔑 Critical Environment Variables

### Railway (Backend)
```
FIREBASE_SERVICE_ACCOUNT_JSON
FIREBASE_ZK_SERVICE_ACCOUNT_JSON
CLERK_SECRET_KEY
CLERK_PUBLISHABLE_KEY
CELO_ALFAJORES_RPC
OPERATOR_PRIVATE_KEY
DAILY_API_KEY
PORT=3001
NODE_ENV=production
```

### Vercel (Frontend)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_FIREBASE_* (all)
NEXT_PUBLIC_BACKEND_API_URL
NEXT_PUBLIC_DAILY_API_KEY
```

### Vercel (Fraud Detection)
```
VITE_FIREBASE_* (all)
```

## 📊 Expected URLs

```
Main:       https://novaaid-main-app.vercel.app
NGO:        https://novaaid-ngo-portal.vercel.app
Fraud:      https://novaaid-fraud-detection.vercel.app
Backend:    https://[project].up.railway.app
```

## ✅ Health Check
```powershell
curl https://[your-backend].up.railway.app/health
```

## 📚 Detailed Guides
- **Full Guide**: `DEPLOYMENT_EXECUTION.md`
- **Environment Vars**: `guides/ENV_VARIABLES_CHECKLIST.md`
- **Production Guide**: `guides/PRODUCTION_DEPLOYMENT.md`

## ⏱️ Estimated Time
Total: 45-60 minutes
- Backend: 15 min
- Main App: 10 min
- NGO Portal: 10 min
- Fraud Detection: 10 min
- CORS + Testing: 10 min

## 🆘 Quick Troubleshooting

**Build fails?** → Check `npm run build` locally first
**CORS errors?** → Update backend CORS with frontend URLs
**Auth fails?** → Add domains in Clerk Dashboard
**Env vars not working?** → Redeploy after adding them
