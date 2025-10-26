# ✅ Dual Authentication Setup Complete

## Overview

NovaAid now has **two separate applications** with **completely independent authentication systems**:

1. **User Portal** (Port 3000) - For refugees/users
   - Uses Clerk auth instance #1
   - Stores data in Firebase
   - Main Next.js app at `/FRONTEND/novaaid-app`

2. **NGO Portal** (Port 3002) - For NGOs
   - Uses Clerk auth instance #2 (different keys)
   - Stores data in MongoDB
   - Separate Next.js app at `/FRONTEND/NGO SECTION/ngo-portal`

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      NovaAid Platform                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────┐      ┌────────────────────┐   │
│  │   User Portal       │      │    NGO Portal      │   │
│  │   Port 3000         │      │    Port 3002       │   │
│  │                     │      │                    │   │
│  │  Clerk Auth #1      │      │  Clerk Auth #2     │   │
│  │  (User Keys)        │      │  (NGO Keys)        │   │
│  │  ↓                  │      │  ↓                 │   │
│  │  Firebase           │      │  MongoDB           │   │
│  └─────────────────────┘      └────────────────────┘   │
│           ↑                            ↑                 │
│           └────────┬───────────────────┘                 │
│                    │                                     │
│            Backend (Port 3001)                           │
│            Blockchain/ZK services                        │
└─────────────────────────────────────────────────────────┘
```

---

## How Authentication Separation Works

### User Logs In to User Portal:
1. User goes to `http://localhost:3000`
2. Clerk instance #1 handles authentication
3. Session stored for User Portal only
4. **NGO Portal remains logged out**

### NGO Logs In to NGO Portal:
1. NGO goes to `http://localhost:3002`
2. Clerk instance #2 handles authentication
3. Session stored for NGO Portal only
4. **User Portal remains logged out**

### Why This Works:
- **Different Clerk Instances**: Each app has different Clerk API keys
- **Different Ports**: Browser treats localhost:3000 and localhost:3002 as different origins
- **Separate Sessions**: Cookies/storage don't cross between ports
- **Different Databases**: User data in Firebase, NGO data in MongoDB

---

## Files Modified

### Main App (User Portal)

#### 1. `FRONTEND/novaaid-app/app/role-select/page.tsx`
```typescript
// Lines 12-21
const handleRoleSelect = (role: 'user' | 'ngo') => {
  if (role === 'user') {
    router.push('/homepage');
  } else {
    // Redirect to NGO portal (separate Next.js app on port 3002)
    const ngoPortalUrl = process.env.NEXT_PUBLIC_NGO_PORTAL_URL || 'http://localhost:3002';
    window.location.href = ngoPortalUrl;
  }
};
```

#### 2. `FRONTEND/novaaid-app/.env.local`
```bash
# Added at the end
NEXT_PUBLIC_NGO_PORTAL_URL=http://localhost:3002
```

### NGO Portal

#### 3. `FRONTEND/NGO SECTION/ngo-portal/app/sign-in/[[...sign-in]]/page.tsx`
```typescript
// Made client component with forceRedirectUrl
"use client"
// ... added forceRedirectUrl prop to SignIn component
```

#### 4. `FRONTEND/NGO SECTION/ngo-portal/app/page.tsx`
```typescript
// Added "Back to Role Selection" link in sidebar
<a href={process.env.NEXT_PUBLIC_MAIN_APP_URL || "http://localhost:3000/role-select"}>
  Back to Role Selection
</a>
```

#### 5. `FRONTEND/NGO SECTION/ngo-portal/.env.local`
```bash
# Added at the end
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000/role-select
```

---

## Startup Instructions

### Option 1: Start All Services at Once

Double-click the batch file:
```
d:\Refugee Lifeline\NovaAid\start-all-services.bat
```

This will open 3 command windows:
1. Backend (port 3001)
2. User Portal (port 3000)
3. NGO Portal (port 3002)

### Option 2: Start Individually

**Terminal 1 - Backend:**
```bash
cd "d:\Refugee Lifeline\NovaAid\BACKEND\novaaid-app-backend"
npm run dev
```

**Terminal 2 - User Portal:**
```bash
cd "d:\Refugee Lifeline\NovaAid\FRONTEND\novaaid-app"
npm run dev
```

**Terminal 3 - NGO Portal:**
```bash
cd "d:\Refugee Lifeline\NovaAid\FRONTEND\NGO SECTION\ngo-portal"
npm run dev
```

---

## Testing the Dual Auth System

### Test 1: User Login Doesn't Affect NGO Portal

1. Start all services
2. Go to `http://localhost:3000`
3. Sign in as a user
4. Go to `http://localhost:3002` (NGO portal)
5. ✅ You should be **logged out** in NGO portal
6. ✅ You need to sign in separately with NGO credentials

### Test 2: NGO Login Doesn't Affect User Portal

1. Go to `http://localhost:3002`
2. Sign in as an NGO
3. Go to `http://localhost:3000` (User portal)
4. ✅ You should be **logged out** in User portal
5. ✅ You need to sign in separately with user credentials

### Test 3: Role Selection

1. Go to `http://localhost:3000/role-select`
2. Click "USER" button
   - ✅ Stays on port 3000, routes to `/homepage`
3. Click "NGO" button
   - ✅ Redirects to `http://localhost:3002` (NGO portal)

---

## Environment Variables

### User Portal (.env.local)
```bash
# Clerk for Users (Instance #1)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...  # User Clerk keys
CLERK_SECRET_KEY=sk_...

# Firebase (User data storage)
NEXT_PUBLIC_FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=nova-aid-43305

# NGO Portal URL
NEXT_PUBLIC_NGO_PORTAL_URL=http://localhost:3002
```

### NGO Portal (.env.local)
```bash
# Clerk for NGOs (Instance #2 - Different keys!)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZmlybS1tb25rZmlzaC0xNC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_rxuzEysUPSAtvUdTqWMkrL3yxLng4sV8rND5UoZ8U2

# MongoDB (NGO data storage)
MONGODB_URI=mongodb+srv://berashreya05:shreya123@cluster0.ducq73a.mongodb.net/novaaid-ngo?retryWrites=true&w=majority

# Main App URL
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000/role-select
```

---

## How Data is Stored

### User Portal Data (Firebase)
```
Firebase Project: nova-aid-43305
Collections:
├── users (auth data)
└── (other user-related data)

Firebase Project: nova-aid-blockchain-zk-data
Collections:
├── commitments (Semaphore)
├── merkleRoots (ZK proofs)
├── verifications (payments)
└── users (verification status)
```

### NGO Portal Data (MongoDB)
```
MongoDB Database: novaaid-ngo
Collections:
├── ngos (NGO profiles)
├── beneficiaries (people they help)
├── aidPrograms (distribution tracking)
└── (other NGO-related data)
```

---

## Fixed: "User Already Signed In" Error

### The Problem
When you were logged into the User Portal and went to the NGO Portal, you saw:
```
"The <SignIn/> component cannot render when a user is already signed in, 
unless the application allows multiple sessions."
```

### The Solution
1. ✅ **Different Clerk Instances**: User portal and NGO portal use completely different Clerk API keys
2. ✅ **Different Ports**: Running on 3000 vs 3002 creates session isolation
3. ✅ **forceRedirectUrl**: Added to NGO sign-in component to handle edge cases
4. ✅ **Client Component**: Made sign-in page client component for proper handling

---

## Port Assignment

| Service | Port | Purpose |
|---------|------|---------|
| Backend | 3001 | API, blockchain services |
| User Portal | 3000 | Refugee/user interface |
| NGO Portal | 3002 | NGO management interface |

---

## Navigation Flow

```
User visits site
    ↓
Landing Page (port 3000)
    ↓
Role Select Page
    ↓
    ├─→ User Role → /homepage (port 3000)
    │                  ↓
    │              User Portal with Clerk Auth #1
    │                  ↓
    │              Firebase Storage
    │
    └─→ NGO Role → Redirect to port 3002
                       ↓
                   NGO Portal with Clerk Auth #2
                       ↓
                   MongoDB Storage
```

---

## Security Features

✅ **Complete Auth Isolation**: User and NGO sessions never mix
✅ **Different Databases**: User data and NGO data completely separated
✅ **Different Clerk Instances**: Each has its own users, roles, and permissions
✅ **Port-based Separation**: Browser treats as different origins
✅ **No Cross-contamination**: Logging in to one doesn't affect the other

---

## For Production Deployment

When deploying to production:

1. **User Portal**: Deploy to `https://app.novaaid.com`
2. **NGO Portal**: Deploy to `https://ngo.novaaid.com` (subdomain)
3. **Update Environment Variables**:
   ```bash
   # User Portal
   NEXT_PUBLIC_NGO_PORTAL_URL=https://ngo.novaaid.com
   
   # NGO Portal
   NEXT_PUBLIC_MAIN_APP_URL=https://app.novaaid.com/role-select
   ```

4. **DNS Configuration**:
   - `app.novaaid.com` → User Portal
   - `ngo.novaaid.com` → NGO Portal
   - Different subdomains ensure complete session isolation

---

## Troubleshooting

### Issue: "User already signed in" error still appears
**Solution**: Clear browser cookies and local storage for both `localhost:3000` and `localhost:3002`

### Issue: Can't access NGO portal after clicking NGO button
**Solution**: 
1. Check if NGO portal is running on port 3002
2. Check `NEXT_PUBLIC_NGO_PORTAL_URL` in User Portal `.env.local`

### Issue: Authentication not working in NGO portal
**Solution**: 
1. Verify NGO portal has its own Clerk keys in `.env.local`
2. Check that the keys are different from User Portal keys
3. Restart NGO portal server

### Issue: Data showing up in wrong database
**Solution**: 
1. User Portal should only connect to Firebase
2. NGO Portal should only connect to MongoDB
3. Check connection strings in respective `.env.local` files

---

## Current Status

```
✅ Role selection redirects to NGO portal
✅ User Portal auth (Clerk #1 + Firebase) working
✅ NGO Portal auth (Clerk #2 + MongoDB) working
✅ Complete authentication separation
✅ "User already signed in" error fixed
✅ Navigation between portals working
✅ Startup script created
✅ Documentation complete
```

---

## Summary

You now have two completely independent applications:

1. **User Portal** (Port 3000)
   - Refugees and users
   - Clerk instance #1
   - Firebase storage
   - Blockchain verification

2. **NGO Portal** (Port 3002)
   - NGO administrators
   - Clerk instance #2
   - MongoDB storage
   - Aid distribution management

**Both share the same backend** (port 3001) for blockchain/ZK services, but have **completely separate authentication and data storage**.

🎉 **Dual authentication system is complete and working!**
