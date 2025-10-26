# Video Room Buttons - Quick Access Guide

## ✅ Changes Applied

### 1. Fixed Authentication Issues
- ✅ Added Clerk credentials to backend `.env`
- ✅ Added Clerk keys to User Portal `.env.local`
- ✅ Backend restarted with proper Clerk configuration
- ✅ **Invalid token error should now be fixed!**

### 2. Added Video Room Buttons to All Sidebars

#### User Portal - Homepage (`/homepage`)
- **Location**: Sidebar, between "Testimonials" and "Settings"
- **Icon**: 📹 Video camera icon
- **Link**: `/video/room/test-room-123`

#### User Portal - Profile Page (`/profile`)
- **Location**: Sidebar, between "Verification" and "Settings"
- **Icon**: 📹 Video camera icon
- **Link**: `/video/room/test-room-123`

#### NGO Portal - Dashboard (`/ngo-portal`)
- **Location**: Sidebar, between "Reports" and "Settings"
- **Icon**: 📹 Video camera icon
- **Link**: `/video/room/test-room-123`

#### NGO Portal - Homepage (`/`)
- **Location**: Sidebar, between "Reports" and "Settings"
- **Icon**: 📹 Video camera icon
- **Link**: `/video/room/test-room-123`

---

## 🧪 How to Test Video Calling

### Step 1: Open User Portal
1. Go to: http://localhost:3000
2. Sign in with your **User** account
3. Navigate to Homepage or Profile
4. Look for **"Video Room"** button in the sidebar (with camera icon 📹)
5. Click it!

### Step 2: Open NGO Portal
1. Go to: http://localhost:3002 (in a different browser or incognito)
2. Sign in with your **NGO** account
3. Navigate to NGO Portal dashboard
4. Look for **"Video Room"** button in the sidebar (with camera icon 📹)
5. Click it!

### Step 3: Both Should Connect
- ✅ Both see video interface
- ✅ Participant count shows "2 participants"
- ✅ Can see and hear each other
- ✅ Controls work (mute, video toggle, leave)

---

## 🔑 Set User Roles in Clerk (IMPORTANT!)

Before testing, make sure your test accounts have the correct roles:

### In Clerk Dashboard:
1. Go to: https://dashboard.clerk.com/
2. Select application: **firm-monkfish-14**
3. Go to **Users**
4. For each test user:
   - Click on the user
   - Go to **Metadata** tab
   - Click **Public Metadata**
   - Add/Edit:

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

5. Click **Save**

---

## 🎯 Test Different Room Scenarios

### Same Test Room (Both Join)
- User: Click "Video Room" in sidebar → goes to `/video/room/test-room-123`
- NGO: Click "Video Room" in sidebar → goes to `/video/room/test-room-123`
- **Result**: Both in same room! 🎉

### Custom Room Names
You can also manually navigate to custom room names:

**For Alerts:**
```
User:  http://localhost:3000/video/room/novaaid-alert-1234
NGO:   http://localhost:3002/video/room/novaaid-alert-1234
```

**For Help Sessions:**
```
User:  http://localhost:3000/video/room/novaaid-help-5678
NGO:   http://localhost:3002/video/room/novaaid-help-5678
```

**Custom Test Rooms:**
```
User:  http://localhost:3000/video/room/my-custom-room
NGO:   http://localhost:3002/video/room/my-custom-room
```

---

## 🐛 Troubleshooting

### "Invalid token" Error - FIXED! ✅
- **Fixed by**: Adding Clerk credentials to backend `.env`
- **Credentials**: Using same Clerk app as NGO portal
- **Backend restarted**: New config loaded

### Can't Find Video Room Button
- **Check**: You're on the right page (Homepage, Profile, or NGO Dashboard)
- **Check**: Sidebar is expanded (hover over it on desktop)
- **Look for**: Camera icon 📹 labeled "Video Room"

### Still Getting Auth Errors
1. **Clear browser cache** and refresh
2. **Sign out and sign in** again
3. **Check Clerk metadata**: Ensure `activeRole` is set to "user" or "ngo"
4. **Check browser console** for specific error messages

### Video Not Showing
- **Allow camera/mic** permissions when browser asks
- **Check network**: Ensure not behind strict firewall
- **Try different browser**: Chrome/Edge work best

### Can't See Other Person
- **Ensure same room name**: Both must join exact same room
- **Wait a few seconds**: Connection may take 3-5 seconds
- **Check participant count**: Should say "2 participants"

---

## 📱 Where to Find Video Room Buttons

### User Portal Locations:

**1. Homepage (`/homepage`)**
```
Sidebar Items:
├── Home
├── Dashboard
├── Pricing
├── Testimonials
├── 📹 Video Room       ← HERE!
├── Settings
├── Profile (button)
└── Logout (button)
```

**2. Profile Page (`/profile`)**
```
Sidebar Items:
├── Home
├── Dashboard
├── Profile
├── Verification
├── 📹 Video Room       ← HERE!
├── Settings
└── Logout (button)
```

### NGO Portal Locations:

**1. NGO Dashboard (`/ngo-portal`)**
```
Sidebar Items:
├── Dashboard
├── Beneficiaries
├── Aid Programs
├── Reports
├── 📹 Video Room       ← HERE!
├── Settings
├── Profile
└── Logout (button)
```

**2. NGO Homepage (`/`)**
```
Sidebar Items:
├── Back to Role Selection
├── Dashboard
├── Beneficiaries
├── Aid Programs
├── Reports
├── 📹 Video Room       ← HERE!
├── Settings
└── Profile
```

---

## 🎨 Visual Guide

### What the Button Looks Like:
```
┌──────────────────────────┐
│  📹 Video Room           │  ← Camera icon + "Video Room" text
└──────────────────────────┘
```

### When Sidebar is Collapsed:
```
┌────┐
│ 📹 │  ← Just the camera icon
└────┘
```

### On Hover:
- Background changes to gray
- Slight animation
- Cursor becomes pointer

---

## 🚀 Quick Test Commands

**Open Both Portals:**
```bash
# User Portal
start http://localhost:3000/homepage

# NGO Portal (in incognito)
start msedge --inprivate http://localhost:3002/ngo-portal
```

**Direct to Video Room:**
```bash
# User
start http://localhost:3000/video/room/test-room-123

# NGO (in incognito)
start msedge --inprivate http://localhost:3002/video/room/test-room-123
```

---

## ✨ Next Steps

### 1. Test Basic Call
- [ ] User clicks "Video Room" in sidebar
- [ ] NGO clicks "Video Room" in sidebar
- [ ] Both see each other
- [ ] Audio/video works

### 2. Test Controls
- [ ] Mute audio button works
- [ ] Toggle video button works
- [ ] Leave call returns to dashboard

### 3. Test Different Rooms
- [ ] Create custom room name
- [ ] Both join same custom room
- [ ] Works as expected

### 4. Integrate with Alerts
- [ ] Add "Start Video Call" button to alert pages
- [ ] Generate room name from alert ID
- [ ] Test with real alert workflow

---

## 📞 Support

If you still encounter issues:
1. Check browser console for errors (F12)
2. Check backend logs in terminal
3. Verify Clerk metadata is set correctly
4. Try clearing cache and cookies

---

## 🎉 What's Working Now

✅ Backend authentication fixed (Clerk credentials added)
✅ Video Room buttons in all sidebars
✅ User Portal - Homepage sidebar
✅ User Portal - Profile sidebar
✅ NGO Portal - Dashboard sidebar
✅ NGO Portal - Homepage sidebar
✅ One-click access to video rooms
✅ Same test room for easy testing
✅ Camera icon for easy identification
✅ Responsive sidebar (hover to expand)

---

**Ready to test! Click the 📹 Video Room buttons and start your call!**
