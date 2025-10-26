# NovaAid Production Deployment Guide 🚀

Complete step-by-step guide to deploy NovaAid to production using Vercel (Frontend) and Railway (Backend).

---

## 📋 Overview

**Components to Deploy:**
1. **Main App** (novaaid-app) → Vercel
2. **NGO Portal** (ngo-portal) → Vercel  
3. **Fraud Detection** (fraud-detection-app) → Vercel
4. **Backend API** (novaaid-app-backend) → Railway

---

## 🎯 Prerequisites

- [ ] Vercel account created (https://vercel.com)
- [ ] Railway account created (https://railway.app)
- [ ] Vercel CLI installed: `npm i -g vercel`
- [ ] Railway CLI installed: `npm i -g @railway/cli`
- [ ] Git repository pushed to GitHub/GitLab
- [ ] All environment variables ready

---

## 🚂 Part 1: Deploy Backend to Railway

### Step 1.1: Prepare Backend

```bash
cd "d:/Refugee Lifeline/NovaAid/BACKEND/novaaid-app-backend"
```

### Step 1.2: Login to Railway

```bash
railway login
```

This will open your browser for authentication.

### Step 1.3: Create New Railway Project

```bash
railway init
```

Follow prompts to create a new project or link to existing one.

### Step 1.4: Add Environment Variables

#### Option A: Via Railway Dashboard (Recommended)

1. Go to https://railway.app/dashboard
2. Select your project
3. Click on "Variables" tab
4. Add the following variables:

```env
# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_FRONTEND_API=clerk.your-domain.com

# Celo Network
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
OPERATOR_PRIVATE_KEY=0xyourprivatekey
CUSD_ADDRESS_ALFAJORES=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1

# Contract Addresses (from blockchain deployment)
VERIFIER_CONTRACT_ADDRESS=0xYourVerifierAddress
VERIFIED_PAYMENTS_CONTRACT_ADDRESS=0xYourPaymentsAddress

# Daily.co Video
DAILY_API_KEY=your_daily_api_key
DAILY_BASE_URL=https://api.daily.co

# Server Config
PORT=3001
NODE_ENV=production
```

5. For Firebase service account, add the **entire JSON content** as a variable:
   - Name: `FIREBASE_SERVICE_ACCOUNT_JSON`
   - Value: Copy-paste entire content of `serviceAccountKey.json`

6. For ZK service account:
   - Name: `FIREBASE_ZK_SERVICE_ACCOUNT_JSON`
   - Value: Copy-paste entire content of `zkServiceAccountKey.json`

#### Option B: Via CLI

```bash
railway variables set CLERK_SECRET_KEY="sk_test_xxxxx"
railway variables set PORT="3001"
# Repeat for all variables...
```

### Step 1.5: Update Backend to Read JSON from Environment

Create a file `d:/Refugee Lifeline/NovaAid/BACKEND/novaaid-app-backend/config/firebase-env.js`:

```javascript
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

export function initializeFirebaseFromEnv() {
  try {
    // Try to read from environment variable first (for Railway)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase initialized from environment variable');
    } else {
      // Fallback to file (for local development)
      const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase initialized from file');
    }
    return admin;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
}
```

### Step 1.6: Deploy to Railway

```bash
railway up
```

Or connect your GitHub repo for automatic deployments:
1. Go to Railway Dashboard → Your Project
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-deploy on every push

### Step 1.7: Get Backend URL

After deployment completes, Railway will provide a URL:
```
https://your-app-name.up.railway.app
```

**Copy this URL** - you'll need it for frontend configuration.

### Step 1.8: Test Backend

```bash
curl https://your-app-name.up.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-..."}
```

---

## ▲ Part 2: Deploy Frontends to Vercel

### 2.1 Main App (novaaid-app)

#### Step 2.1.1: Navigate to Project

```bash
cd "d:/Refugee Lifeline/NovaAid/FRONTEND/novaaid-app"
```

#### Step 2.1.2: Check Vercel Configuration

The project already has `vercel.json`. Verify it exists:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

#### Step 2.1.3: Deploy to Vercel

```bash
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (first time)
- Project name? **novaaid-main-app**
- Directory? **./
**
- Override settings? **N**

#### Step 2.1.4: Add Environment Variables

Go to Vercel Dashboard → Project → Settings → Environment Variables

Add all variables from your `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nova-aid-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nova-aid-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nova-aid-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx

# Firebase Admin (Server-side only)
FIREBASE_PROJECT_ID=nova-aid-xxxxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nova-aid-xxxxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKeyHere\n-----END PRIVATE KEY-----\n"

# Blockchain
NEXT_PUBLIC_VERIFIED_PAYMENTS_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_SEMAPHORE_VERIFIER_ADDRESS=0xYourVerifierAddress
NEXT_PUBLIC_CELO_NETWORK=alfajores

# Backend API
NEXT_PUBLIC_BACKEND_API_URL=https://your-app-name.up.railway.app

# Daily.co
NEXT_PUBLIC_DAILY_API_KEY=your_daily_api_key
```

**Important:** For `FIREBASE_PRIVATE_KEY`, keep the quotes and newlines as shown.

#### Step 2.1.5: Redeploy with Variables

After adding variables:
```bash
vercel --prod
```

Or trigger redeploy from Vercel Dashboard → Deployments → Redeploy

#### Step 2.1.6: Get URL

Vercel will provide:
```
https://novaaid-main-app.vercel.app
```

### 2.2 NGO Portal

#### Step 2.2.1: Navigate and Deploy

```bash
cd "d:/Refugee Lifeline/NovaAid/FRONTEND/NGO SECTION/ngo-portal"
vercel --prod
```

Project name: **novaaid-ngo-portal**

#### Step 2.2.2: Add Environment Variables

Similar to main app, add:
- Clerk keys
- Firebase config
- MongoDB connection string (if using)
- Backend API URL
- Daily.co API key

#### Step 2.2.3: Get URL

```
https://novaaid-ngo-portal.vercel.app
```

### 2.3 Fraud Detection App

#### Step 2.3.1: Navigate to Project

```bash
cd "d:/Refugee Lifeline/NovaAid/AI-ML/fraud"
```

#### Step 2.3.2: Create Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": "dist"
}
```

#### Step 2.3.3: Deploy

```bash
vercel --prod
```

Project name: **novaaid-fraud-detection**

#### Step 2.3.4: Add Environment Variables

Add Firebase configuration for fraud detection:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

#### Step 2.3.5: Get URL

```
https://novaaid-fraud-detection.vercel.app
```

---

## 🔗 Part 3: Connect Services

### Step 3.1: Update CORS in Backend

Edit `d:/Refugee Lifeline/NovaAid/BACKEND/novaaid-app-backend/index.js`:

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

Redeploy backend:
```bash
railway up
```

### Step 3.2: Update Clerk Settings

1. Go to Clerk Dashboard
2. Navigate to **DNS** or **Domains**
3. Add production domains:
   - `https://novaaid-main-app.vercel.app`
   - `https://novaaid-ngo-portal.vercel.app`
4. Update **Redirect URLs** in Clerk

### Step 3.3: Update Firebase Security Rules

Go to Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /commitments/{commitmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    
    match /merkleRoots/{rootId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /verifications/{verificationId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

---

## ✅ Part 4: Verification & Testing

### Step 4.1: Test All Deployments

**Backend Health Check:**
```bash
curl https://your-backend.up.railway.app/health
```

**Frontend Checks:**
- Visit https://novaaid-main-app.vercel.app
- Visit https://novaaid-ngo-portal.vercel.app  
- Visit https://novaaid-fraud-detection.vercel.app

### Step 4.2: End-to-End Testing

1. **Sign Up Flow**
   - [ ] Create new account
   - [ ] Verify email
   - [ ] Profile created in Firestore

2. **Authentication**
   - [ ] Login works
   - [ ] Session persists
   - [ ] Logout works

3. **Main Features**
   - [ ] Profile page loads
   - [ ] Wallet connection works
   - [ ] Verification flow completes
   - [ ] Video calling works

4. **NGO Portal**
   - [ ] NGO dashboard accessible
   - [ ] Location tracking works
   - [ ] Alert creation functions

5. **Fraud Detection**
   - [ ] Face detection loads
   - [ ] Registration works
   - [ ] Verification works

### Step 4.3: Monitor Logs

**Railway Logs:**
```bash
railway logs
```

**Vercel Logs:**
- Go to Dashboard → Project → Deployments
- Click on latest deployment
- View Function Logs and Build Logs

---

## 📊 Part 5: Monitoring Setup

### Step 5.1: Railway Monitoring

1. Go to Railway Dashboard → Your Project
2. Click **Metrics** tab
3. Monitor:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### Step 5.2: Vercel Analytics

1. Go to Vercel Dashboard → Project
2. Enable **Analytics** tab
3. Monitor:
   - Page views
   - Performance scores
   - Error rates

### Step 5.3: Set Up Alerts

**Railway:**
- Set up health checks
- Configure notification webhooks

**Vercel:**
- Enable deployment notifications
- Set up Slack/Discord integration

---

## 🌐 Deployment URLs Summary

After deployment, you'll have:

| Service | URL | Platform |
|---------|-----|----------|
| Main App | https://novaaid-main-app.vercel.app | Vercel |
| NGO Portal | https://novaaid-ngo-portal.vercel.app | Vercel |
| Fraud Detection | https://novaaid-fraud-detection.vercel.app | Vercel |
| Backend API | https://your-app.up.railway.app | Railway |

---

## 🔄 Continuous Deployment

### Automatic Deployments

**Vercel:**
- Connects to your Git repository
- Auto-deploys on push to main branch
- Preview deployments for PRs

**Railway:**
- Connects to your Git repository  
- Auto-deploys on push to main branch
- Shows deployment status in dashboard

### Manual Deployments

**Vercel:**
```bash
vercel --prod
```

**Railway:**
```bash
railway up
```

---

## 🛠️ Troubleshooting

### Common Issues

**1. Build Failures**
- Check build logs in Vercel/Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

**2. Environment Variables Not Working**
- Ensure variables are set in production environment
- Redeploy after adding variables
- Check variable names (NEXT_PUBLIC_ prefix for client-side)

**3. CORS Errors**
- Update backend CORS to include frontend URLs
- Check if credentials: true is set
- Verify protocol (http vs https)

**4. Authentication Issues**
- Update Clerk dashboard with production URLs
- Check API keys are production keys
- Verify webhook URLs if using

**5. Database Connection Errors**
- Check Firebase service account JSON is correct
- Verify Firestore security rules
- Test connection with firebase CLI

---

## 📝 Post-Deployment Checklist

- [ ] All services deployed and accessible
- [ ] Environment variables configured
- [ ] CORS properly set up
- [ ] Clerk domains added
- [ ] Firebase security rules updated
- [ ] End-to-end flow tested
- [ ] Monitoring enabled
- [ ] Alerts configured
- [ ] Documentation updated
- [ ] Team notified of URLs

---

## 🚀 Next Steps

1. **Custom Domains** (Optional)
   - Add custom domain in Vercel
   - Configure DNS records
   - Enable HTTPS

2. **Performance Optimization**
   - Enable Vercel Edge Functions
   - Add caching strategies
   - Optimize images

3. **Security Hardening**
   - Add rate limiting
   - Implement API authentication
   - Set up DDoS protection

4. **Monitoring & Analytics**
   - Set up Sentry for error tracking
   - Add Google Analytics
   - Configure uptime monitoring

---

## 💡 Pro Tips

1. **Use Preview Deployments**: Test changes in Vercel preview URLs before merging
2. **Environment Separation**: Use different Firebase projects for staging/production
3. **Secret Rotation**: Regularly rotate API keys and secrets
4. **Backup Strategy**: Enable Firebase backups, export data regularly
5. **Cost Monitoring**: Check Railway and Vercel usage to stay within free tier

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Clerk Production Checklist](https://clerk.com/docs/deployments/production)
- [Firebase Best Practices](https://firebase.google.com/docs/rules/best-practices)

---

## 🎉 Conclusion

Your NovaAid application is now deployed to production! Users can access:
- Main refugee assistance app
- NGO management portal
- Fraud detection system

All services are connected and ready to serve users at scale! 🚀

For support, check logs in Railway/Vercel dashboards or refer to troubleshooting section above.
