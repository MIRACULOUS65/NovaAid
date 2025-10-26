# NovaAid Video Calling - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Backend
```bash
cd "d:\Refugee Lifeline\NovaAid\BACKEND\novaaid-app-backend"
npm run dev
```
✅ Backend running on http://localhost:3001

### Step 2: Start User Portal
```bash
cd "d:\Refugee Lifeline\NovaAid\FRONTEND\novaaid-app"
npm run dev
```
✅ User portal running on http://localhost:3000

### Step 3: Start NGO Portal
```bash
cd "d:\Refugee Lifeline\NovaAid\FRONTEND\NGO SECTION\ngo-portal"
npm run dev
```
✅ NGO portal running on http://localhost:3002

### Step 4: Test Video Call

#### As User:
1. Open Chrome: http://localhost:3000
2. Sign in with user account (activeRole = "user")
3. Navigate to: http://localhost:3000/video/room/test-room-123

#### As NGO:
1. Open Chrome Incognito: http://localhost:3002
2. Sign in with NGO account (activeRole = "ngo")
3. Navigate to: http://localhost:3002/video/room/test-room-123

#### Expected Result:
- Both see video interface
- Participant count shows 2
- Audio/video works both ways
- Controls (mute, video toggle, leave) work

---

## 🔑 Setting Up Clerk Roles

### For Testing, Set User Roles in Clerk Dashboard:

1. Go to: https://dashboard.clerk.com/
2. Navigate to: Users
3. Click on a test user
4. Go to: Metadata tab
5. Add to **Public Metadata**:

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

6. Click Save

---

## 📋 Room Naming Convention

Use this format for room names:
- `novaaid-alert-{alertId}` - For alerts
- `novaaid-help-{caseId}` - For help cases
- `test-room-{anything}` - For testing

Example URLs:
```
User Portal:
http://localhost:3000/video/room/novaaid-alert-1234
http://localhost:3000/video/room/test-room-abc

NGO Portal:
http://localhost:3002/video/room/novaaid-alert-1234
http://localhost:3002/video/room/test-room-abc
```

---

## ✅ Quick Test Checklist

- [ ] Backend running (port 3001)
- [ ] User portal running (port 3000)
- [ ] NGO portal running (port 3002)
- [ ] User account has `activeRole: "user"`
- [ ] NGO account has `activeRole: "ngo"`
- [ ] Both users can join same room
- [ ] Participant count shows correctly
- [ ] Audio/video works
- [ ] Can toggle audio/video
- [ ] Can leave call

---

## 🐛 Quick Fixes

### "Failed to get meeting token"
```bash
# Check backend .env has:
DAILY_API_KEY=617e9ee77706604df5f7ee661436021d854758cfed724859d74d6c5e0d208c4a
```

### "Only user or ngo may create/join rooms"
```
Fix: Update user's publicMetadata in Clerk Dashboard
Set: "activeRole": "user" or "ngo"
```

### "Authentication required"
```
Fix: Sign in to Clerk in the portal first
```

### Video not showing
```
Fix: Allow camera/microphone permissions in browser
```

---

## 🎯 Integration Example

### Add "Start Video Call" button to Alert Page:

```tsx
// In your alert detail component
import { useRouter } from 'next/navigation'

function AlertDetail({ alert }) {
  const router = useRouter()
  
  const startVideoCall = () => {
    const roomName = `novaaid-alert-${alert.id}`
    router.push(`/video/room/${roomName}?resourceId=${alert.id}`)
  }
  
  return (
    <div>
      <h1>Alert Details</h1>
      {/* ... alert info ... */}
      
      <button 
        onClick={startVideoCall}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Start Video Call with NGO
      </button>
    </div>
  )
}
```

---

## 📞 API Usage Example

### Create Room & Get Token (from your own component):

```typescript
import { useAuth } from '@clerk/nextjs'

async function createVideoRoom(roomName: string, resourceId?: string) {
  const { getToken } = useAuth()
  const clerkToken = await getToken()
  
  const response = await fetch('http://localhost:3001/api/video/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clerkToken}`
    },
    body: JSON.stringify({ roomName, resourceId })
  })
  
  const data = await response.json()
  return data // { success: true, room: {...}, token: "..." }
}
```

---

## 🎥 Features Available

- ✅ 1-on-1 video calls
- ✅ Multi-participant support (up to 10)
- ✅ Audio toggle
- ✅ Video toggle
- ✅ Screen share (enabled in backend)
- ✅ Participant count
- ✅ Automatic cleanup
- ✅ Role-based access
- ✅ Secure token generation

---

## 🔒 Security Built-in

- ✅ JWT authentication required
- ✅ Role validation (user/ngo only)
- ✅ Short-lived tokens (1 hour)
- ✅ Server-side token generation
- ✅ Optional resource permission checks
- ✅ No API keys in frontend

---

## 📱 Browser Compatibility

Recommended browsers:
- ✅ Chrome/Edge (best support)
- ✅ Firefox
- ✅ Safari (Mac/iOS)
- ⚠️ Mobile browsers (limited support)

---

## 🆘 Support

Check full documentation: `VIDEO_CALLING_IMPLEMENTATION.md`

Daily.co Dashboard: https://dashboard.daily.co/

---

**Status**: ✅ Ready to use!  
**Your Daily.co API Key**: Already configured in backend  
**Test Room**: http://localhost:3000/video/room/test-room-123
