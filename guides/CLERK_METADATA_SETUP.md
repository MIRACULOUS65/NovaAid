# Clerk Public Metadata Setup - Fix "Only user or ngo may create/join rooms" Error

## 🚨 The Problem

You're seeing this error because your Clerk user account doesn't have the `activeRole` set in public metadata.

**Error Message:**
```
Only user or ngo may create/join rooms
```

## ✅ Quick Fix (5 Steps)

### Step 1: Go to Clerk Dashboard
Open: **https://dashboard.clerk.com/**

### Step 2: Select Your Application
Click on: **firm-monkfish-14** (or your application name)

### Step 3: Go to Users Section
1. Click **"Users"** in the left sidebar
2. Find your test accounts (both User and NGO)

### Step 4: Add Public Metadata

**For EACH user account:**

1. **Click on the user** (email)
2. Go to **"Metadata"** tab
3. Click **"Public metadata"** section
4. **Add this JSON**:

**For User Account:**
```json
{
  "activeRole": "user"
}
```

**For NGO Account:**
```json
{
  "activeRole": "ngo"
}
```

5. Click **"Save"**

### Step 5: Sign Out and Sign In Again
- Go to your portal (User or NGO)
- Sign out completely
- Sign in again
- Try joining the video room

## 📸 Visual Guide

### Where to Find Public Metadata:

```
Clerk Dashboard
└── Users
    └── [Click on User Email]
        └── Metadata Tab
            └── Public metadata
                └── [Add JSON here]
                    └── Click "Save"
```

### What the JSON Should Look Like:

**User Portal Account:**
```json
{
  "activeRole": "user"
}
```

**NGO Portal Account:**
```json
{
  "activeRole": "ngo"
}
```

**DO NOT USE:**
- ❌ `"role": "user"` (wrong key)
- ❌ `activeRole: "user"` (no quotes on key)
- ❌ `"activeRole": user` (no quotes on value)

**CORRECT:**
- ✅ `"activeRole": "user"` (with quotes on both)

## 🔍 How to Verify It's Set Correctly

### Method 1: Check Backend Logs

After adding metadata and trying to join video room, check your **backend terminal**. You should see:

```
User from token: {
  "sub": "user_xxxxx",
  "public_metadata": {
    "activeRole": "user"    ← THIS SHOULD BE HERE!
  },
  ...
}
Current role found: user
```

### Method 2: Check Browser Console

After clicking "Video Room", open browser console (F12) and look for:

```
Video room error: { 
  status: 403, 
  data: { 
    error: '...', 
    debug: {
      foundRole: undefined,           ← If undefined, metadata not set
      availableKeys: [...],
      hint: 'Please set activeRole...'
    }
  } 
}
```

## 🎯 Test Cases

### ✅ Success Case:
```
1. Metadata set: { "activeRole": "user" }
2. Backend logs: "Current role found: user"
3. Video room: Loads successfully!
```

### ❌ Failure Case:
```
1. Metadata NOT set or wrong key
2. Backend logs: "Current role found: undefined"
3. Video room: Error "Only user or ngo may create/join rooms"
```

## 🛠️ Alternative: Temporarily Disable Role Check (Dev Only)

**ONLY for testing - NOT for production!**

If you want to test video calling without role check, you can temporarily comment out the role validation:

**File**: `BACKEND/novaaid-app-backend/routes/video.js`

```javascript
// TEMPORARILY COMMENT OUT THIS CHECK FOR TESTING:
/*
if (!['user', 'ngo'].includes(currentRole)) {
  console.log('Role check failed. User object keys:', Object.keys(user || {}));
  return res.status(403).json({ 
    error: 'Only user or ngo may create/join rooms',
    ...
  });
}
*/

// Add this for testing:
console.log('⚠️ WARNING: Role check disabled for testing!');
```

**Remember to re-enable it after testing!**

## 📋 Complete Setup Checklist

For **User Portal** account:
- [ ] Go to Clerk Dashboard
- [ ] Navigate to Users
- [ ] Click on your user account
- [ ] Go to Metadata tab
- [ ] Add to Public metadata: `{"activeRole": "user"}`
- [ ] Click Save
- [ ] Sign out of user portal
- [ ] Sign in again
- [ ] Test video room

For **NGO Portal** account:
- [ ] Go to Clerk Dashboard
- [ ] Navigate to Users
- [ ] Click on your NGO account
- [ ] Go to Metadata tab
- [ ] Add to Public metadata: `{"activeRole": "ngo"}`
- [ ] Click Save
- [ ] Sign out of NGO portal
- [ ] Sign in again
- [ ] Test video room

## 🔄 Restart Services After Change

After setting metadata, restart:

```bash
# Backend (important!)
cd BACKEND/novaaid-app-backend
# Stop: Ctrl+C
npm run dev

# User Portal (if needed)
cd FRONTEND/novaaid-app
# Stop: Ctrl+C
npm run dev

# NGO Portal (if needed)
cd "FRONTEND/NGO SECTION/ngo-portal"
# Stop: Ctrl+C
npm run dev
```

## 🐛 Still Not Working?

### Check These:

1. **JSON Format**: Make sure it's valid JSON
   - Use double quotes `"` not single quotes `'`
   - No trailing commas
   - Valid format: `{"activeRole": "user"}`

2. **Signed Out Completely**: 
   - Click logout button
   - Clear cookies (Ctrl+Shift+Delete)
   - Close all tabs
   - Sign in fresh

3. **Correct Clerk Instance**:
   - Both portals using `firm-monkfish-14`
   - Check `.env` files have same Clerk keys

4. **Backend Logs**:
   - Check terminal for "Current role found: user" or "ngo"
   - If says "undefined", metadata not in token

5. **Token Template** (Advanced):
   - In Clerk Dashboard → JWT Templates
   - Make sure public metadata is included in token
   - Default templates should work

## 📞 Quick Help Commands

**Check backend logs:**
```bash
# Look in backend terminal for:
User from token: {...}
Current role found: user
```

**Check browser console:**
```javascript
// Press F12, go to Console tab
// Look for error details with debug info
```

**Test API directly:**
```bash
# Get your token from browser console:
# localStorage.getItem('__clerk_db_jwt')

curl -X POST http://localhost:3001/api/video/create \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"roomName":"test-room"}'
```

## ✅ Expected Success Output

**Backend Terminal:**
```
Verifying token...
Token verified successfully for user: user_xxxxx
User from token: {
  "sub": "user_xxxxx",
  "public_metadata": {
    "activeRole": "user"
  },
  ...
}
User public_metadata: { activeRole: 'user' }
Current role found: user
✅ Role check passed!
```

**Browser Console:**
```
Successfully got room token
Successfully joined meeting
```

**Video Room:**
```
✅ Loads without error
✅ Shows video interface
✅ Can join call
```

---

## 🎉 Summary

**Problem**: Clerk token doesn't include `activeRole`
**Solution**: Add `{"activeRole": "user"}` or `{"activeRole": "ngo"}` to Public metadata in Clerk Dashboard
**Location**: Clerk Dashboard → Users → [User] → Metadata → Public metadata
**Must do**: Sign out and sign in again after setting

**After fixing, video rooms should work perfectly!** 🚀
