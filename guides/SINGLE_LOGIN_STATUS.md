# Single Login Enforcement - Current Status

## ✅ What's Currently Implemented

### Role Selection System
**Location:** `/FRONTEND/novaaid-app/app/role-select/page.tsx`

The system has a **partial** single login enforcement with role switching:

### How It Works Now:

1. **User visits role-select page**
   - Sees two options: USER and NGO
   - Each option is a clickable card

2. **When selecting a role:**
   ```typescript
   // Lines 22-44 in role-select/page.tsx
   const currentRole = user.publicMetadata?.activeRole;
   
   if (currentRole && currentRole !== role) {
     // User trying to switch roles
     const confirmSwitch = confirm(
       `You are currently signed in as ${currentRole.toUpperCase()}. 
        To access the ${role.toUpperCase()} portal, you need to sign out first. 
        Continue?`
     );
     
     if (confirmSwitch) {
       await signOut();
       // Redirect to new portal
     }
   }
   ```

3. **Role is stored in Clerk:**
   ```typescript
   // /api/auth/set-role/route.ts
   await client.users.updateUserMetadata(userId, {
     publicMetadata: {
       activeRole: role,
       lastRoleChange: new Date().toISOString(),
     },
   });
   ```

---

## ⚠️ Current Issues

### 1. **NOT Fully Enforced**
**Problem:** The single login enforcement only works if users go through the role-select page.

**What's Missing:**
- ❌ No middleware to check role on every page load
- ❌ NGO portal doesn't redirect users with `activeRole: 'user'`
- ❌ User portal doesn't redirect NGOs with `activeRole: 'ngo'`
- ❌ Users can manually navigate to either portal URL

**Example of Problem:**
```
1. User signs in as "USER" (activeRole = 'user')
2. User navigates to http://localhost:3002 (NGO portal)
3. NGO portal loads successfully ❌ (should redirect to user portal)
```

### 2. **No Portal-Level Guards**
Neither portal has middleware to enforce role-based access:

**User Portal (`localhost:3000`):**
- ✅ Has role-select page
- ❌ No check to block NGO role users
- ❌ Anyone authenticated can access

**NGO Portal (`localhost:3002`):**
- ❌ No role-select page
- ❌ No check to block USER role users
- ❌ Anyone authenticated can access

### 3. **Backend Role Check**
Backend video routes DO check roles:
```javascript
// /BACKEND/routes/video.js lines 22-32
const currentRole = user?.publicMetadata?.activeRole;

if (!['user', 'ngo'].includes(currentRole)) {
  return res.status(403).json({ 
    error: 'Only user or ngo may create/join rooms'
  });
}
```
**Status:** ✅ Working
**Issue:** Only protects API endpoints, not frontend access

---

## 🚨 What Needs to Be Fixed

### Option 1: Strict Enforcement (Recommended)

#### A. Add Middleware to User Portal
**File:** `/FRONTEND/novaaid-app/middleware.ts` (CREATE NEW)
```typescript
import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up", "/role-select"],
  
  afterAuth(auth, req) {
    // If not authenticated, allow (Clerk will handle)
    if (!auth.userId) return NextResponse.next();
    
    // Get user's active role
    const activeRole = auth.sessionClaims?.publicMetadata?.activeRole;
    
    // If user has NGO role, redirect to NGO portal
    if (activeRole === 'ngo') {
      const ngoPortalUrl = process.env.NEXT_PUBLIC_NGO_PORTAL_URL || 'http://localhost:3002';
      return NextResponse.redirect(new URL(ngoPortalUrl));
    }
    
    // Allow USER role to continue
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

#### B. Add Middleware to NGO Portal
**File:** `/FRONTEND/NGO SECTION/ngo-portal/middleware.ts` (CREATE NEW)
```typescript
import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  
  afterAuth(auth, req) {
    // If not authenticated, allow (Clerk will handle)
    if (!auth.userId) return NextResponse.next();
    
    // Get user's active role
    const activeRole = auth.sessionClaims?.publicMetadata?.activeRole;
    
    // If user has USER role, redirect to user portal
    if (activeRole === 'user') {
      const userPortalUrl = process.env.NEXT_PUBLIC_USER_PORTAL_URL || 'http://localhost:3000';
      return NextResponse.redirect(new URL(`${userPortalUrl}/homepage`));
    }
    
    // Allow NGO role to continue
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

---

### Option 2: Soft Enforcement (Current State)

Keep the current behavior where:
- ✅ Users select role on role-select page
- ✅ Switching roles requires sign out
- ❌ Users can bypass by typing URL directly
- ⚠️ Backend API routes are protected

**When to use:** During development/testing

---

## 🎯 Testing the Current Implementation

### Test Case 1: Role Selection ✅
```
1. Sign in as a new user
2. Go to /role-select
3. Click "USER"
4. Should redirect to /homepage
5. activeRole should be set to 'user' in Clerk
```

### Test Case 2: Role Switching ✅
```
1. Already signed in as USER
2. Go to /role-select
3. Click "NGO"
4. Should show confirmation dialog
5. Click "OK" to sign out
6. Should redirect to NGO portal
```

### Test Case 3: Direct URL Access ❌ (FAILS - NOT ENFORCED)
```
1. Sign in as USER (activeRole = 'user')
2. Manually navigate to http://localhost:3002
3. EXPECTED: Redirect to user portal
4. ACTUAL: NGO portal loads ❌
```

### Test Case 4: Backend API Protection ✅
```
1. Sign in as USER
2. Try to access video room
3. Backend checks activeRole
4. If role is valid, allows access ✅
```

---

## 📊 Current vs. Desired State

| Feature | Current State | Desired State |
|---------|---------------|---------------|
| Role Selection Page | ✅ Working | ✅ Keep |
| Role Stored in Clerk | ✅ Working | ✅ Keep |
| Switch Role Requires Signout | ✅ Working | ✅ Keep |
| User Portal Guards | ❌ Missing | ✅ Add Middleware |
| NGO Portal Guards | ❌ Missing | ✅ Add Middleware |
| Backend API Protection | ✅ Working | ✅ Keep |
| Direct URL Blocking | ❌ Not Enforced | ✅ Enforce |

---

## 🔧 Quick Fix Implementation

### Step 1: Create User Portal Middleware
```bash
# Create file: /FRONTEND/novaaid-app/middleware.ts
```

### Step 2: Create NGO Portal Middleware
```bash
# Create file: /FRONTEND/NGO SECTION/ngo-portal/middleware.ts
```

### Step 3: Add Environment Variables
```env
# User Portal .env.local
NEXT_PUBLIC_NGO_PORTAL_URL=http://localhost:3002

# NGO Portal .env.local
NEXT_PUBLIC_USER_PORTAL_URL=http://localhost:3000
```

### Step 4: Test
```
1. Sign in as USER
2. Try to access http://localhost:3002
3. Should auto-redirect to http://localhost:3000 ✅
```

---

## 💡 Alternative Approaches

### Approach 1: Single Portal with Role Switching
- One application
- Role switcher in navbar
- Different views based on activeRole
- **Pros:** Easier to maintain
- **Cons:** Complex routing

### Approach 2: Separate Portals with Strict Guards (Current + Fixes)
- Two separate applications
- Middleware enforces role-based access
- Sign out required to switch
- **Pros:** Clean separation
- **Cons:** Need to implement guards

### Approach 3: Shared Sessions with Auto-Switching
- Two portals share same Clerk instance
- Automatically switch activeRole on navigation
- No sign out required
- **Pros:** Smooth UX
- **Cons:** Security concerns

---

## 🚀 Recommendation

**Implement Option 1: Strict Enforcement**

### Why?
- ✅ Maintains current architecture (two separate portals)
- ✅ Provides proper security
- ✅ Prevents unauthorized access
- ✅ Clean user experience
- ✅ Easy to implement (just add middleware)

### Timeline:
- **Create middleware files:** 10 minutes
- **Add environment variables:** 5 minutes
- **Test enforcement:** 15 minutes
- **Total:** ~30 minutes

---

## 📋 Summary

### What's Working ✅
- Role selection page with beautiful UI
- Role stored in Clerk public metadata
- Switch role requires sign out
- Backend API routes protected
- Last role change timestamp tracked

### What's Broken ❌
- Users can bypass role enforcement
- Direct URL access not blocked
- No portal-level guards
- No automatic redirect based on role

### Fix Required 🔧
- Add middleware to both portals (30 minutes)
- Enforce role-based access at routing level
- Auto-redirect users to correct portal

---

**Status:** ⚠️ Partially Implemented - Requires Middleware Guards
**Priority:** High (Security Issue)
**Effort:** Low (30 minutes)
