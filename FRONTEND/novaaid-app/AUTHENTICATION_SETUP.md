# Authentication Setup Guide

This guide explains how to set up Clerk authentication with Firebase Firestore integration for NovaAid.

## Features Implemented

1. **Clerk Authentication**: Users can sign in/sign up using Clerk
2. **Firebase Firestore Integration**: User data is automatically synced to Firestore
3. **Profile Page**: Displays user information fetched from Firestore
4. **Protected Routes**: Homepage and profile pages require authentication
5. **Conditional Logout Button**: Only visible when user is signed in

## Setup Instructions

### 1. Environment Variables

The `.env` file has been created with your Clerk and Firebase credentials. Make sure it contains:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGFyaW5nLW9wb3NzdW0tOC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_BXfKQB53bJkM3q5GRS0kIMiSY2tuUA3a4SRTtVzsJY

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nova-aid-43305
FIREBASE_PROJECT_ID=nova-aid-43305
FIREBASE_PRIVATE_KEY="..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@nova-aid-43305.iam.gserviceaccount.com
```

### 2. Clerk Webhook Setup (Optional but Recommended)

To automatically sync users to Firestore when they sign up:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to your application
3. Go to **Webhooks** in the sidebar
4. Click **Add Endpoint**
5. Set the endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
6. Subscribe to these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
7. Copy the **Signing Secret** and add it to your `.env` file:
   ```
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

### 3. Firebase Firestore Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `nova-aid-43305`
3. Navigate to **Firestore Database**
4. If not already created, click **Create Database**
5. Choose **Start in production mode** or **Test mode** (for development)
6. The app will automatically create a `users` collection when users sign up

### 4. Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## How It Works

### Authentication Flow

1. **User clicks Profile button (not signed in)**:
   - Redirects to Clerk sign-in page
   - User signs in or signs up
   - Redirected back to homepage

2. **User clicks Profile button (signed in)**:
   - Redirects to `/profile` page
   - User data is synced to Firestore (if not already synced)
   - Profile information is fetched from Firestore and displayed

3. **User clicks Logout button**:
   - User is signed out via Clerk
   - Redirected to landing page

### Data Sync Methods

The app uses two methods to sync user data to Firestore:

1. **Webhooks (Recommended)**: Automatically syncs when Clerk events occur
2. **Manual Sync**: When user visits profile page, data is synced via `/api/sync-user`

### Firestore Data Structure

Users are stored in the `users` collection with the following structure:

```typescript
{
  clerkId: string;        // Clerk user ID
  email: string;          // User's email
  firstName: string;      // First name
  lastName: string;       // Last name
  username: string;       // Username
  imageUrl: string;       // Profile image URL
  createdAt: string;      // ISO timestamp
  updatedAt: string;      // ISO timestamp
}
```

## Pages

- `/landing` - Public landing page
- `/homepage` - Protected dashboard (requires authentication)
- `/profile` - Protected profile page showing user data from Firestore

## API Routes

- `/api/webhooks/clerk` - Webhook endpoint for Clerk events
- `/api/sync-user` - Manual user sync endpoint

## Troubleshooting

### Users not syncing to Firestore

1. Check that webhook is properly configured in Clerk dashboard
2. Verify Firebase credentials in `.env` file
3. Check browser console and server logs for errors
4. Try visiting the profile page to trigger manual sync

### Authentication not working

1. Verify Clerk keys in `.env` file
2. Make sure `middleware.ts` is in the root directory
3. Check that `ClerkProvider` wraps the app in `layout.tsx`

### Firebase connection issues

1. Verify Firebase project ID matches in `.env`
2. Check that private key is properly formatted (with `\n` for line breaks)
3. Ensure Firestore is enabled in Firebase console

## Security Notes

- Never commit `.env` file to version control
- Keep your Clerk secret key and Firebase credentials secure
- Use environment variables for all sensitive data
- Consider setting up Firestore security rules in production
