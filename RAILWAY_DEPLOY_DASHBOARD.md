# 🚂 Railway Dashboard Deployment Guide

## Quick Steps to Deploy Backend

### 1️⃣ Open Railway Project
**URL**: https://railway.com/project/5201c1aa-1f7d-4f07-8c96-ed7fe2a9caf8

---

### 2️⃣ Create New Service

Click **"+ New"** button in the dashboard

You have two options:

#### Option A: Deploy from GitHub (Recommended)
1. Click **"GitHub Repo"**
2. Connect your GitHub account if not already connected
3. Select your NovaAid repository
4. Railway will ask for root directory: Enter `BACKEND/novaaid-app-backend`
5. Railway will auto-detect it's a Node.js app

#### Option B: Empty Service
1. Click **"Empty Service"**
2. Name it: `novaaid-backend`
3. After creation, go to Settings
4. Set **Start Command**: `node index.js`

---

### 3️⃣ Environment Variables (Already Added ✅)

You've already added all the environment variables! Railway will use them automatically.

To verify:
1. Click on your service
2. Click **"Variables"** tab
3. Confirm all variables are there

---

### 4️⃣ Deploy the Service

#### If using GitHub:
- Railway will automatically deploy on first connection
- Click **"Deployments"** tab to watch progress

#### If using Empty Service:
You need to push code. Options:
1. **Via GitHub**: Push your code to GitHub, then connect the repo in Railway settings
2. **Via CLI**: We'll try CLI again after service is created

---

### 5️⃣ Enable Public URL

1. Click on your service
2. Go to **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"**
5. Copy the generated URL (e.g., `https://novaaid-backend-production.up.railway.app`)

---

### 6️⃣ Monitor Deployment

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Watch the build logs
4. Wait for status to show **"Success"** ✅

---

### 7️⃣ Test Your Backend

Once deployed, test the health endpoint:

```bash
curl https://your-railway-url.up.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-10-26...","environment":"production"}
```

---

## 🔧 Alternative: Push to GitHub First

If you haven't already:

```bash
# From NovaAid root directory
git add .
git commit -m "Prepare for deployment"
git push origin main
```

Then use Option A (GitHub Repo) in Railway.

---

## 📊 After Successful Deployment

**Save your Railway URL!** You'll need it for:
- Vercel frontend deployments
- Setting `NEXT_PUBLIC_BACKEND_API_URL`

---

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Railway dashboard
- Verify all environment variables are set
- Check that `package.json` has correct scripts

**Service won't start?**
- Verify Start Command is `node index.js`
- Check logs for errors
- Ensure PORT environment variable is set

**No public URL?**
- Go to Settings → Networking
- Click "Generate Domain"

---

**Once deployed, come back and we'll deploy the frontends to Vercel!** 🚀
