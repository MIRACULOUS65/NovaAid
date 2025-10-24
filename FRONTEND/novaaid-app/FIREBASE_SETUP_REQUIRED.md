# ⚠️ IMPORTANT: Firebase Setup Required

## Current Issue
The Firebase Firestore database is not properly configured yet. You need to complete these steps:

## Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **nova-aid-43305**
3. In the left sidebar, click **Firestore Database**
4. Click **Create Database**
5. Choose **Start in test mode** (for development) or **Production mode** (for production)
6. Select a location (choose closest to your users)
7. Click **Enable**

## Step 2: Get Your Web API Key

1. In Firebase Console, click the **⚙️ Settings** icon (top left)
2. Go to **Project Settings**
3. Scroll down to **Your apps** section
4. If you don't have a web app, click **Add app** → Select **Web** (</>) icon
5. Register your app with a nickname (e.g., "NovaAid Web")
6. Copy the **apiKey** from the config object shown
7. Update your `.env` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (your actual key)
```

## Step 3: Configure Firestore Security Rules (Optional for Development)

For development/testing, you can use these permissive rules:

1. Go to **Firestore Database** → **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for development - CHANGE THIS FOR PRODUCTION!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

⚠️ **WARNING**: These rules allow anyone to read/write. For production, implement proper security rules!

## Step 4: Restart Development Server

After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Production Security Rules (Recommended)

For production, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can only read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Verification

Once setup is complete:
1. Visit `/homepage`
2. Click **Profile** button
3. Sign in with Clerk
4. You should be redirected to `/profile`
5. Your data should appear (fetched from Firestore)
6. Check Firebase Console → Firestore Database → users collection to see the stored data

## Troubleshooting

### Error: "5 NOT_FOUND"
- Firestore database is not enabled yet
- Follow Step 1 above

### Error: "Permission denied"
- Firestore security rules are too restrictive
- Follow Step 3 to set test mode rules

### Error: "Invalid API key"
- API key is missing or incorrect
- Follow Step 2 to get the correct key

## Current Configuration

Your `.env` file should have:

```env
# Clerk (Already configured ✅)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Firebase Client (⚠️ NEEDS API KEY)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (GET THIS FROM FIREBASE CONSOLE)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nova-aid-43305
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nova-aid-43305.firebaseapp.com

# Firebase Admin (Already configured ✅)
FIREBASE_PROJECT_ID=nova-aid-43305
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@nova-aid-43305.iam.gserviceaccount.com
```
