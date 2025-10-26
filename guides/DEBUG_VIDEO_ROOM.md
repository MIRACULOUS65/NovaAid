# Debug Video Room "Only user or ngo may create/join rooms" Error

## 🔍 Step-by-Step Debugging

### Step 1: Verify You Saved the Metadata
Go back to Clerk Dashboard and check:
1. Go to Users
2. Click on your user
3. Click Metadata tab
4. Public metadata should show:
```json
{
  "activeRole": "user"
}
```
or
```json
{
  "activeRole": "ngo"
}
```

### Step 2: SIGN OUT COMPLETELY (MOST IMPORTANT!)
**This is the #1 reason it doesn't work after adding metadata!**

#### For User Portal:
1. Go to: http://localhost:3000
2. Click **Logout** button in sidebar
3. **Close ALL browser tabs** for localhost:3000
4. **Clear cookies** (Ctrl+Shift+Delete) → Check "Cookies" → Clear
5. Open fresh tab: http://localhost:3000
6. Sign in again

#### For NGO Portal:
1. Go to: http://localhost:3002
2. Click **Logout** button in sidebar
3. **Close ALL browser tabs** for localhost:3002
4. **Clear cookies** (Ctrl+Shift+Delete) → Check "Cookies" → Clear
5. Open fresh tab: http://localhost:3002
6. Sign in again

### Step 3: Check Backend Logs IMMEDIATELY
After signing in again, click Video Room and **immediately check your backend terminal**. You should see:

**✅ SUCCESS - You should see:**
```
Verifying token...
Token verified successfully for user: user_xxxxx
User from token: {
  "sub": "user_xxxxx",
  "email": "...",
  "public_metadata": {
    "activeRole": "user"        ← THIS SHOULD BE HERE!
  },
  ...
}
User public_metadata: { activeRole: 'user' }
Current role found: user
```

**❌ FAILURE - If you see:**
```
User from token: {
  "sub": "user_xxxxx",
  "email": "...",
  "public_metadata": {},        ← EMPTY! This means old token
  ...
}
Current role found: undefined
Role check failed.
```

This means you're still using the old token. **You MUST sign out and clear cookies!**

### Step 4: Check Browser Console
Open browser console (Press F12), go to Console tab, and look for:

**✅ If working:**
```
Successfully got room token
Successfully joined meeting
```

**❌ If not working:**
```
Video room error: { 
  status: 403, 
  data: { 
    error: 'Only user or ngo may create/join rooms',
    debug: {
      foundRole: undefined,
      availableKeys: [...]
    }
  } 
}
```

---

## 🛠️ Common Issues & Fixes

### Issue 1: "Still shows error after adding metadata"
**Cause**: Old token cached in browser
**Fix**: 
1. Sign out
2. Clear cookies (Ctrl+Shift+Delete)
3. Close all tabs
4. Sign in fresh

### Issue 2: "Metadata looks correct but not in token"
**Cause**: Metadata saved but token not refreshed
**Fix**:
1. In Clerk Dashboard, check metadata is saved
2. Sign out from portal
3. Wait 10 seconds
4. Sign in again

### Issue 3: "Wrong JSON format"
**Cause**: Typo in metadata
**Fix**: Must be EXACTLY this:
```json
{
  "activeRole": "user"
}
```
NOT:
- ❌ `{'activeRole': 'user'}` (single quotes)
- ❌ `{activeRole: "user"}` (no quotes on key)
- ❌ `{"role": "user"}` (wrong key name)
- ❌ `{"activeRole": "User"}` (capital U)

### Issue 4: "Set metadata for wrong user"
**Cause**: Multiple test accounts, updated wrong one
**Fix**:
1. In Clerk Dashboard → Users
2. Find the EXACT email you're signing in with
3. Update that user's metadata
4. Sign out and in with that email

---

## 🔬 Advanced Debugging

### Check Token Contents Directly

1. After signing in, open browser console (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Look for **Local Storage** → `http://localhost:3000` (or 3002)
4. Find key like `__clerk_db_jwt` or similar
5. Copy the token value

Then decode it at: https://jwt.io/

Look for:
```json
{
  "sub": "user_xxx",
  "public_metadata": {
    "activeRole": "user"    ← Should be here!
  }
}
```

### Test API Directly

Open terminal and run:

```bash
# Replace YOUR_TOKEN with actual token from browser
curl -X POST http://localhost:3001/api/video/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roomName":"test-room-debug"}'
```

Check response. Should see room details, not error.

---

## 🎯 Quick Checklist

Run through this checklist:

**Clerk Dashboard:**
- [ ] Logged into Clerk Dashboard
- [ ] Selected correct application (firm-monkfish-14)
- [ ] Found Users section
- [ ] Clicked on correct user email
- [ ] Went to Metadata tab
- [ ] Added to **Public metadata** (not Private!)
- [ ] JSON is exactly: `{"activeRole": "user"}` or `{"activeRole": "ngo"}`
- [ ] Clicked Save button
- [ ] Saw success message

**User Portal (localhost:3000):**
- [ ] Clicked Logout
- [ ] Closed all tabs
- [ ] Cleared cookies
- [ ] Opened fresh tab
- [ ] Signed in again
- [ ] Tried Video Room

**Backend Check:**
- [ ] Backend terminal is visible
- [ ] Logs show: "Token verified successfully"
- [ ] Logs show: "Current role found: user" (or ngo)
- [ ] No "Role check failed" message

**If All Checked and Still Not Working:**
- [ ] Restart backend server
- [ ] Restart user portal
- [ ] Try different browser
- [ ] Double-check email you're signing in with matches Clerk user

---

## 🚀 Step-by-Step Fresh Start

If nothing works, try this complete reset:

### 1. Clean Slate
```bash
# Stop all services
# Close all browser tabs

# Clear everything
1. Clerk Dashboard → verify metadata is set
2. Browser → Clear all cookies and cache
3. Close IDE and terminal
```

### 2. Fresh Start
```bash
# Terminal 1 - Backend
cd "d:\Refugee Lifeline\NovaAid\BACKEND\novaaid-app-backend"
npm run dev

# Terminal 2 - User Portal
cd "d:\Refugee Lifeline\NovaAid\FRONTEND\novaaid-app"
npm run dev

# Terminal 3 - NGO Portal  
cd "d:\Refugee Lifeline\NovaAid\FRONTEND\NGO SECTION\ngo-portal"
npm run dev
```

### 3. Fresh Browser
1. Open **new incognito window**
2. Go to http://localhost:3000
3. Sign in
4. Click Video Room
5. Watch backend terminal

### 4. Read Backend Logs
Look for the JSON output showing user data. Share that with me!

---

## 📞 What to Share If Still Not Working

Please share these 3 things:

1. **Clerk Metadata Screenshot**
   - Show the Public metadata section

2. **Backend Terminal Output**
   - After clicking Video Room, copy the logs starting from:
   ```
   Verifying token...
   User from token: {...}
   ```

3. **Browser Console Error**
   - Press F12, go to Console tab
   - Copy any errors about video room

---

## 💡 Most Likely Issue

**95% of the time it's this:**
You added the metadata correctly, but you're still using the OLD TOKEN from before you added it.

**The fix:**
1. Sign out
2. Wait 10 seconds  
3. Sign in again
4. Try video room

The NEW token will have the metadata!

---

## ✅ What Success Looks Like

**Backend Terminal:**
```
Verifying token...
Token verified successfully for user: user_2abc123xyz
User from token: {
  "sub": "user_2abc123xyz",
  "public_metadata": {
    "activeRole": "user"
  },
  "email": "test@example.com"
}
User public_metadata: { activeRole: 'user' }
Current role found: user
✅ No role check error!
```

**Browser:**
- Video room loads
- No error message
- Shows "Joining room..."
- Then shows video interface

**When Both Join:**
- Participant count: 2
- Can see/hear each other
- Controls work
