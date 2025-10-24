# 🚀 Vercel Deployment Guide

## ✅ Yes, You Can Deploy Everything to Vercel!

All the features we built (authentication, profile, role selection, pricing, testimonials) will work perfectly on Vercel. Here's how to deploy:

---

## 📋 Pre-Deployment Checklist

### 1. ⚠️ IMPORTANT: Get Firebase Web API Key

Before deploying, you **MUST** get your Firebase Web API Key:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **nova-aid-43305**
3. Click ⚙️ **Settings** → **Project Settings**
4. Scroll to **Your apps** section
5. If no web app exists:
   - Click **Add app** → Select **Web** (</>)
   - Register app with name "NovaAid Web"
6. Copy the **apiKey** value (looks like: `AIzaSy...`)
7. Update your `.env` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (your actual key)
   ```

### 2. Enable Firestore Database

1. In Firebase Console, click **Firestore Database**
2. Click **Create Database**
3. Choose **Test mode** (for now) or **Production mode**
4. Select a location (closest to your users)
5. Click **Enable**

### 3. Set Up Firestore Security Rules (Optional for Development)

For development/testing:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **For production**, use proper security rules (see FIREBASE_SETUP_REQUIRED.md)

---

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Import Your Project**:
   - Click "Add New" → "Project"
   - Import from your Git repository
   - Or upload the project folder

3. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (or your project path)
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables** (CRITICAL!):
   Click "Environment Variables" and add ALL of these:

   ```env
   # Clerk Configuration
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGFyaW5nLW9wb3NzdW0tOC5jbGVyay5hY2NvdW50cy5kZXYk
   CLERK_SECRET_KEY=sk_test_BXfKQB53bJkM3q5GRS0kIMiSY2tuUA3a4SRTtVzsJY
   
   # Firebase Client (Public)
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (YOUR ACTUAL KEY FROM STEP 1)
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=nova-aid-43305
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nova-aid-43305.firebaseapp.com
   
   # Firebase Admin (Server-side - KEEP SECRET!)
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=nova-aid-43305
   FIREBASE_PRIVATE_KEY_ID=14a6245fe5f079c7732e49d1ab5ddfec008518c5
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCOXdRiyDcWvor6\ntyYvVhmbfQgl9NvQNU/jnXfrOdnydIO65doQeXw8rFtFcPeFZm2NFUZhaZBNtFTk\nUCnalB3lcnxkY2xKyvxfnZsXJthRTPJVW6lbiiVqbAM1kjPbiCwg46+Dp7PwuAE4\n/s/7QSN5iza9JJhdvIHVkzqM/OTzOPT726Qa85q1gsRm6dLgwXZ98a097KTn5Cy6\n0o0tcsIHlGDDdsvMGw/6q7deRRi0BGFJjf8oiO0xHAVdQJ7sCSZc7l5D3w15GkSV\nHQikyQtRpyurg3Yoeq0RZC0KIx/z6aMXoDnucCCYl6oh8Pz1z1IUSW5GD5BmoMIr\ncWZAAGY1AgMBAAECggEACumfT4kYS+qEHa6vQx6e7N+7Iamwtbd4bbKS0BmJnr+W\n1tiCTQ+tSni/yInHvcYe6F/WRUt5f7mKPAKHUKQPhe1+D30vZDsommiyzYDi8vR\noYBarXUb5BnubwtLZU79TvIU8IsIzHFWSqehiplWHklxAzOMaFb8PsI/0THLXOdJ\n/4LPkm7gkcRuRQ+XN5VlxsT4KrRTihawMfwgXYT2F1g1CuBXai9InTThlUVUDJRV\nuezefSe6wJo+Em3XvADd+qS8MF9ZY6J5tNUbQWlUjc0+CCdgmu1s1PZhxomX89bj\nQr8DzkMI/x5epAT/pSwtKIKJKN7VU/cILrjYacPFuwKBgQDAE1GZGkeQCf9cLn7x\nN6JkII34N9hRsFr6jGP9lfl015dc37y27w/k3weuoae3kRgHaR1VQ6ezrIeAqZc8\nejnHlk/lnyiDK3uuKQNMaCju2oIeHn51iXQHx9B7gtdigOkz1hkGxayHOqVk6JCF\n7wZul8Ny+Fh7u4++i2McOMT7VwKBgQC9v1jwNeCbd4IUiy8303Autz7quiyR4I9s\nmUeVcdktk4zHzYoc423WkKVyPiKmeQ1oquAx7o0X+A6PUX2Z5b1u2nUMhndPeFtT\n7bpiPVwoOwWRXY3yDnMTi9CNu50MSdv3npFjqNX7j1wADQi6YzXtXP6SLUd3l8Jz\neHVF/yu/UwKBgAkGH1RJFsmenp+vE4mzqm531ROvU/tqhKu2ws/cJu8lXdggLtaN\nXrrK+6ppr96A85cNijJCTnOzjF4wGYne2C4XUsOf+aBH/7SL+rqxPhMSswBFQH23\nKntfGN1kpUfcdJhZ260kxllIGRMnlfqk4zF48dbJ8iZGBpfWJp7hz+dbAoGAIN93\nrxYGdai8toZuhcNx2gYRNmVOt28qKexcRH3W3FiFuU/Yr6yPKO8iWqp9Ik4yjoGc\nGcp0U0S8cQPzOKheq0fZo3PgU7pMSDwVYFO1FZs0Gb0VjGwIb8h3NzbbvHdHTp0A\nHz3u5IgvriqT6oapnxfPWs/RY9y86XhjCN9uWtUCgYEAsEJ43F1o6JnP5Pk6hu9c\nI1wLKiXDPjUKI7bfiF4xgHhf59MiRGKWKLS2FinaPuC030mvDpNaqmlC6v15/4q4\nI97rBkiZfJZdTes4ia0IS4cvyArZOUm6nCqNlZsCUgMzUBqz9EbwjsOgQhEGorSs\nxrcJulxvKwApcKscq7T201Q=\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@nova-aid-43305.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=100058652815672549266
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40nova-aid-43305.iam.gserviceaccount.com
   ```

   ⚠️ **IMPORTANT**: Make sure to replace `NEXT_PUBLIC_FIREBASE_API_KEY` with your actual key!

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Get your deployment URL (e.g., `your-app.vercel.app`)

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No (or Yes if updating)
# - Project name? novaaid-app
# - Directory? ./
# - Override settings? No

# Add environment variables via CLI or dashboard
```

---

## 🔧 Post-Deployment Configuration

### 1. Update Clerk Redirect URLs

After deployment, update Clerk with your production URL:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **Paths** or **URLs**
4. Add your Vercel URL to:
   - **Authorized redirect URLs**: `https://your-app.vercel.app/*`
   - **Sign-in URL**: `https://your-app.vercel.app/sign-in`
   - **Sign-up URL**: `https://your-app.vercel.app/sign-up`
   - **After sign-in URL**: `https://your-app.vercel.app/homepage`
   - **After sign-up URL**: `https://your-app.vercel.app/homepage`

### 2. Set Up Clerk Webhook (Optional but Recommended)

For automatic user sync to Firestore:

1. In Clerk Dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/clerk`
4. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the **Signing Secret**
6. Add to Vercel environment variables:
   ```
   CLERK_WEBHOOK_SECRET=whsec_...
   ```
7. Redeploy the app

### 3. Update Firebase Authorized Domains

1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel domain: `your-app.vercel.app`

---

## ✅ What Will Work After Deployment

### ✅ All Features Working:
- 🔐 **Authentication** (Clerk sign-in/sign-up)
- 👤 **User Profiles** (stored in Firestore)
- 🎭 **Role Selection** (USER/NGO)
- 🏠 **Homepage** with sidebar navigation
- 💰 **Pricing Page** with 3 tiers
- 💬 **Testimonials Page** with reviews
- 🚪 **Logout** functionality
- 🔄 **Profile data sync** to Firestore
- ✨ **All animations** and sparkles effects

### ✅ All Routes Accessible:
- `/landing` - Landing page
- `/role-select` - Role selection
- `/homepage` - Main dashboard
- `/profile` - User profile (requires auth)
- `/pricing` - Pricing plans
- `/testimonials` - User testimonials
- `/ngo-dashboard` - NGO dashboard (placeholder)

---

## 🧪 Testing After Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`

2. **Test Authentication Flow**:
   - Go to `/landing`
   - Click "Get Started"
   - Choose "USER" role
   - Click "Profile" in sidebar
   - Sign up/Sign in with Clerk
   - Check if redirected to `/profile`
   - Verify data shows up

3. **Test Firestore Sync**:
   - After signing in, go to Firebase Console
   - Check **Firestore Database** → `users` collection
   - Your user data should be there

4. **Test All Pages**:
   - Navigate to Pricing, Testimonials
   - Test role selection
   - Test logout

---

## 🔒 Security Checklist

### ✅ Before Going Live:

1. **Firestore Security Rules**:
   - Replace test mode rules with production rules
   - Only allow authenticated users to read/write their own data

2. **Environment Variables**:
   - ✅ All secrets in Vercel environment variables (not in code)
   - ✅ Never commit `.env` file to Git
   - ✅ Use different keys for production vs development

3. **Clerk Configuration**:
   - ✅ Update redirect URLs
   - ✅ Set up webhook for user sync
   - ✅ Configure email/SMS settings

4. **Firebase Configuration**:
   - ✅ Enable Firestore
   - ✅ Set up security rules
   - ✅ Add authorized domains

---

## 🚨 Common Issues & Solutions

### Issue 1: "Firebase API Key Invalid"
**Solution**: Make sure you got the actual API key from Firebase Console and added it to Vercel environment variables.

### Issue 2: "Clerk Redirect Error"
**Solution**: Update Clerk authorized redirect URLs to include your Vercel domain.

### Issue 3: "Firestore Permission Denied"
**Solution**: Enable Firestore and set security rules to test mode (temporarily).

### Issue 4: "Build Failed"
**Solution**: Check build logs in Vercel dashboard. Usually missing environment variables.

### Issue 5: "User Data Not Syncing"
**Solution**: 
- Set up Clerk webhook
- Or users will sync when they visit `/profile` page (manual sync)

---

## 📊 Deployment Checklist

Before deploying, make sure:

- [ ] Firebase Web API Key obtained
- [ ] Firestore database enabled
- [ ] All environment variables ready
- [ ] `.env` file NOT committed to Git
- [ ] `vercel.json` configured
- [ ] Build succeeds locally (`npm run build`)

After deploying:

- [ ] Update Clerk redirect URLs
- [ ] Set up Clerk webhook (optional)
- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Test authentication flow
- [ ] Test Firestore data sync
- [ ] Test all pages and features

---

## 🎉 You're Ready to Deploy!

Everything we built will work perfectly on Vercel:
- ✅ Clerk authentication
- ✅ Firebase Firestore
- ✅ All pages and features
- ✅ Animations and effects
- ✅ Responsive design

Just follow the steps above, and your app will be live for everyone! 🚀

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Make sure Firebase API key is correct
5. Check Clerk redirect URLs

**Most common fix**: Make sure you have the actual Firebase Web API Key (not the dummy one)!
