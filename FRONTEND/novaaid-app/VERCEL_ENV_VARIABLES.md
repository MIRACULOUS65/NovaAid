# 📋 Exact Environment Variables for Vercel

## 📍 Location in Vercel Dashboard

1. Go to: **https://vercel.com/dashboard**
2. Select your project (or create new one)
3. Go to: **Settings** → **Environment Variables**
4. Add each variable below

---

## ✅ Copy-Paste These Exact Variables

### 1. Clerk Configuration (3 variables)

**Variable Name:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```
**Value:**
```
pk_test_ZGFyaW5nLW9wb3NzdW0tOC5jbGVyay5hY2NvdW50cy5kZXYk
```

---

**Variable Name:**
```
CLERK_SECRET_KEY
```
**Value:**
```
sk_test_BXfKQB53bJkM3q5GRS0kIMiSY2tuUA3a4SRTtVzsJY
```

---

**Variable Name:** (Optional - add later after setting up webhook)
```
CLERK_WEBHOOK_SECRET
```
**Value:**
```
your_webhook_secret_here
```
*(Skip this for now, add it later when you set up the webhook)*

---

### 2. Firebase Client Configuration (3 variables - PUBLIC)

⚠️ **IMPORTANT**: For the API key, you need to get it from Firebase Console first!

**Variable Name:**
```
NEXT_PUBLIC_FIREBASE_API_KEY
```
**Value:**
```
GET_THIS_FROM_FIREBASE_CONSOLE
```
**How to get it:**
1. Go to https://console.firebase.google.com
2. Select project: **nova-aid-43305**
3. Click ⚙️ Settings → Project Settings
4. Scroll to "Your apps" section
5. If no web app: Click "Add app" → Web (</>)
6. Copy the **apiKey** value (looks like: AIzaSy...)
7. Paste it here

---

**Variable Name:**
```
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```
**Value:**
```
nova-aid-43305
```

---

**Variable Name:**
```
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
```
**Value:**
```
nova-aid-43305.firebaseapp.com
```

---

### 3. Firebase Admin SDK (9 variables - KEEP SECRET!)

**Variable Name:**
```
FIREBASE_TYPE
```
**Value:**
```
service_account
```

---

**Variable Name:**
```
FIREBASE_PROJECT_ID
```
**Value:**
```
nova-aid-43305
```

---

**Variable Name:**
```
FIREBASE_PRIVATE_KEY_ID
```
**Value:**
```
14a6245fe5f079c7732e49d1ab5ddfec008518c5
```

---

**Variable Name:**
```
FIREBASE_PRIVATE_KEY
```
**Value:**
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCOXdRiyDcWvor6\ntyYvVhmbfQgl9NvQNU/jnXfrOdnydIO65doQeXw8rFtFcPeFZm2NFUZhaZBNtFTk\nUCnalB3lcnxkY2xKyvxfnZsXJthRTPJVW6lbiiVqbAM1kjPbiCwg46+Dp7PwuAE4\n/s/7QSN5iza9JJhdvIHVkzqM/OTzOPT726Qa85q1gsRm6dLgwXZ98a097KTn5Cy6\n0o0tcsIHlGDDdsvMGw/6q7deRRi0BGFJjf8oiO0xHAVdQJ7sCSZc7l5D3w15GkSV\nHQikyQtRpyurg3Yoeq0RZC0KIx/z6aMXoDnucCCYl6oh8Pz1z1IUSW5GD5BmoMIr\ncWZAAGY1AgMBAAECggEACumfT4kYS+qEHa6vQx6e7N+7Iamwtbd4bbKS0BmJnr+W\nn1tiCTQ+tSni/yInHvcYe6F/WRUt5f7mKPAKHUKQPhe1+D30vZDsommiyzYDi8vR\noYBarXUb5BnubwtLZU79TvIU8IsIzHFWSqehiplWHklxAzOMaFb8PsI/0THLXOdJ\n/4LPkm7gkcRuRQ+XN5VlxsT4KrRTihawMfwgXYT2F1g1CuBXai9InTThlUVUDJRV\nuezefSe6wJo+Em3XvADd+qS8MF9ZY6J5tNUbQWlUjc0+CCdgmu1s1PZhxomX89bj\nQr8DzkMI/x5epAT/pSwtKIKJKN7VU/cILrjYacPFuwKBgQDAE1GZGkeQCf9cLn7x\nN6JkII34N9hRsFr6jGP9lfl015dc37y27w/k3weuoae3kRgHaR1VQ6ezrIeAqZc8\nejnHlk/lnyiDK3uuKQNMaCju2oIeHn51iXQHx9B7gtdigOkz1hkGxayHOqVk6JCF\n7wZul8Ny+Fh7u4++i2McOMT7VwKBgQC9v1jwNeCbd4IUiy8303Autz7quiyR4I9s\nmUeVcdktk4zHzYoc423WkKVyPiKmeQ1oquAx7o0X+A6PUX2Z5b1u2nUMhndPeFtT\n7bpiPVwoOwWRXY3yDnMTi9CNu50MSdv3npFjqNX7j1wADQi6YzXtXP6SLUd3l8Jz\neHVF/yu/UwKBgAkGH1RJFsmenp+vE4mzqm531ROvU/tqhKu2ws/cJu8lXdggLtaN\nXrrK+6ppr96A85cNijJCTnOzjF4wGYne2C4XUsOf+aBH/7SL+rqxPhMSswBFQH23\nKntfGN1kpUfcdJhZ260kxllIGRMnlfqk4zF48dbJ8iZGBpfWJp7hz+dbAoGAIN93\nrxYGdai8toZuhcNx2gYRNmVOt28qKexcRH3W3FiFuU/Yr6yPKO8iWqp9Ik4yjoGc\nGcp0U0S8cQPzOKheq0fZo3PgU7pMSDwVYFO1FZs0Gb0VjGwIb8h3NzbbvHdHTp0A\nHz3u5IgvriqT6oapnxfPWs/RY9y86XhjCN9uWtUCgYEAsEJ43F1o6JnP5Pk6hu9c\nI1wLKiXDPjUKI7bfiF4xgHhf59MiRGKWKLS2FinaPuC030mvDpNaqmlC6v15/4q4\nI97rBkiZfJZdTes4ia0IS4cvyArZOUm6nCqNlZsCUgMzUBqz9EbwjsOgQhEGorSs\nxrcJulxvKwApcKscq7T201Q=\n-----END PRIVATE KEY-----\n"
```
⚠️ **IMPORTANT**: Include the quotes at the beginning and end!

---

**Variable Name:**
```
FIREBASE_CLIENT_EMAIL
```
**Value:**
```
firebase-adminsdk-fbsvc@nova-aid-43305.iam.gserviceaccount.com
```

---

**Variable Name:**
```
FIREBASE_CLIENT_ID
```
**Value:**
```
100058652815672549266
```

---

**Variable Name:**
```
FIREBASE_AUTH_URI
```
**Value:**
```
https://accounts.google.com/o/oauth2/auth
```

---

**Variable Name:**
```
FIREBASE_TOKEN_URI
```
**Value:**
```
https://oauth2.googleapis.com/token
```

---

**Variable Name:**
```
FIREBASE_AUTH_PROVIDER_CERT_URL
```
**Value:**
```
https://www.googleapis.com/oauth2/v1/certs
```

---

**Variable Name:**
```
FIREBASE_CLIENT_CERT_URL
```
**Value:**
```
https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40nova-aid-43305.iam.gserviceaccount.com
```

---

**Variable Name:**
```
FIREBASE_UNIVERSE_DOMAIN
```
**Value:**
```
googleapis.com
```

---

## 📊 Summary

**Total Environment Variables: 15**

### Required Now (14):
- ✅ 2 Clerk variables (publishable key, secret key)
- ⚠️ 3 Firebase Client variables (need to get API key first!)
- ✅ 9 Firebase Admin SDK variables

### Optional (1):
- ⏭️ 1 Clerk webhook secret (add later)

---

## 🎯 Step-by-Step in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Select/Create Project**:
   - If existing: Click your project
   - If new: Click "Add New" → "Project" → Import your repo

3. **Go to Settings**:
   - Click "Settings" tab at the top

4. **Click "Environment Variables"**:
   - In the left sidebar, click "Environment Variables"

5. **Add Each Variable**:
   - Click "Add New" button
   - Enter **Variable Name** (exactly as shown above)
   - Enter **Value** (copy-paste from above)
   - Select environment: **Production**, **Preview**, **Development** (check all 3)
   - Click "Save"
   - Repeat for all 15 variables

6. **Get Firebase API Key** (CRITICAL!):
   - Before deploying, get the actual Firebase Web API Key
   - Go to Firebase Console → Project Settings → Your apps
   - Copy the apiKey value
   - Update `NEXT_PUBLIC_FIREBASE_API_KEY` in Vercel

7. **Deploy**:
   - After adding all variables, click "Deployments" tab
   - Click "Redeploy" (if already deployed)
   - Or just deploy normally if first time

---

## ⚠️ CRITICAL NOTES

1. **Firebase API Key**: You MUST get the real API key from Firebase Console. The app won't work without it!

2. **Private Key**: Make sure to include the quotes around the FIREBASE_PRIVATE_KEY value!

3. **All Environments**: When adding variables, check all 3 boxes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Case Sensitive**: Variable names are case-sensitive. Copy them exactly!

5. **No Spaces**: Don't add spaces before or after the values.

---

## 🧪 After Adding Variables

1. **Redeploy** your app (if already deployed)
2. **Test** the authentication flow
3. **Check** if user data syncs to Firestore
4. If issues, check Vercel build logs

---

## ✅ Checklist

Before deploying:
- [ ] Got Firebase Web API Key from Firebase Console
- [ ] Added all 14 required environment variables in Vercel
- [ ] Checked all 3 environments (Production, Preview, Development)
- [ ] Verified FIREBASE_PRIVATE_KEY has quotes around it
- [ ] Enabled Firestore database in Firebase Console

After deploying:
- [ ] Update Clerk redirect URLs with Vercel domain
- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Test authentication
- [ ] Test Firestore sync

---

## 🎉 You're Ready!

Once you add all these variables in Vercel, your app will work perfectly for everyone! 🚀
