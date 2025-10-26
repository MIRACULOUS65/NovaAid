# NovaAid Video Calling Feature - Implementation Documentation

## Overview
Secure video calling feature using Daily.co for NovaAid, enabling real-time video communication between refugees (users) and NGO workers.

## Architecture

### Technology Stack
- **Backend**: Express.js with Daily.co REST API integration
- **Frontend**: Next.js 14 (App Router) with @daily-co/daily-js SDK
- **Authentication**: Clerk JWT tokens with role-based access control
- **Video Infrastructure**: Daily.co (hosted WebRTC)

### Components Implemented

#### Backend (`BACKEND/novaaid-app-backend/`)
1. **`routes/video.js`**
   - `POST /api/video/create` - Creates Daily room and generates meeting token
   - `DELETE /api/video/room/:roomName` - Deletes a room (admin/authorized users)
   - Role validation (user/ngo only)
   - Optional resource permission checks (Firestore alerts collection)
   - Idempotent room creation

2. **`index.js`** - Updated to wire video routes

3. **`.env`** - Added Daily.co configuration:
   ```
   DAILY_API_KEY=617e9ee77706604df5f7ee661436021d854758cfed724859d74d6c5e0d208c4a
   DAILY_BASE_URL=https://api.daily.co
   ```

#### User Portal (`FRONTEND/novaaid-app/`)
1. **`app/video/room/[roomName]/page.tsx`** - Server component with auth check
2. **`app/video/room/[roomName]/VideoRoomClient.tsx`** - Client component with Daily.co integration
3. **Package**: `@daily-co/daily-js` installed
4. **`.env.local`** - Added `NEXT_PUBLIC_BACKEND_URL=http://localhost:3001`

#### NGO Portal (`FRONTEND/NGO SECTION/ngo-portal/`)
1. **`app/video/room/[roomName]/page.tsx`** - Server component with auth check
2. **`app/video/room/[roomName]/VideoRoomClient.tsx`** - Client component with Daily.co integration
3. **Package**: `@daily-co/daily-js` installed
4. **`.env.local`** - Added `NEXT_PUBLIC_BACKEND_URL=http://localhost:3001`

## Security Features

### Authentication & Authorization
- ✅ Clerk JWT token validation on every request
- ✅ Role-based access control (user/ngo only)
- ✅ Optional resource ownership verification
- ✅ Short-lived meeting tokens (1 hour expiry)
- ✅ No API keys exposed to frontend

### API Security
- API key stored securely in backend `.env`
- Meeting tokens generated server-side only
- Resource permission checks before token issuance
- HTTPS recommended for production

## How It Works

### Flow for User + NGO Video Call

1. **User creates/joins room:**
   - User clicks "Start Video" for an alert
   - Frontend navigates to `/video/room/novaaid-alert-{alertId}?resourceId={alertId}`
   - Client component fetches Clerk JWT
   - Sends POST to backend `/api/video/create` with roomName and resourceId
   - Backend validates role, checks alert ownership
   - Backend creates Daily room (or retrieves existing) and generates meeting token
   - Client receives token and joins via Daily.co

2. **NGO joins same room:**
   - NGO navigates to same URL: `/video/room/novaaid-alert-{alertId}?resourceId={alertId}`
   - Same flow as above, but backend validates NGO is assigned to alert
   - Both participants can see/hear each other

### Room Naming Convention
- Format: `novaaid-{type}-{id}`
- Examples:
  - `novaaid-alert-1234` - For alert-based assistance
  - `novaaid-help-5678` - For scheduled support sessions

## API Reference

### POST /api/video/create

**Request:**
```json
{
  "roomName": "novaaid-alert-TEST1",
  "resourceId": "TEST1"
}
```

**Headers:**
```
Authorization: Bearer <CLERK_JWT>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "room": {
    "name": "novaaid-alert-TEST1",
    "url": "https://domain.daily.co/novaaid-alert-TEST1",
    "id": "...",
    "config": {...}
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing roomName
- `401` - Invalid/missing authentication
- `403` - Role not authorized or not assigned to resource
- `404` - Resource not found
- `500` - Server error

## Testing Guide

### Prerequisites
1. **Backend running** on port 3001
   ```bash
   cd BACKEND/novaaid-app-backend
   npm run dev
   ```

2. **User portal running** on port 3000
   ```bash
   cd FRONTEND/novaaid-app
   npm run dev
   ```

3. **NGO portal running** on port 3002
   ```bash
   cd "FRONTEND/NGO SECTION/ngo-portal"
   npm run dev
   ```

4. **Two Clerk test accounts:**
   - User account with `publicMetadata.activeRole = "user"`
   - NGO account with `publicMetadata.activeRole = "ngo"`

### Test Cases

#### Test 1: Basic Video Call (User + NGO)
1. Sign in as **user** in browser 1 (e.g., Chrome)
2. Navigate to: `http://localhost:3000/video/room/novaaid-test-room1`
3. Should see loading → then video interface with participant count
4. Sign in as **NGO** in browser 2 (e.g., Chrome Incognito)
5. Navigate to: `http://localhost:3002/video/room/novaaid-test-room1`
6. Both should see each other and participant count = 2
7. Test audio/video toggle buttons
8. Test leave call button

#### Test 2: Permission Check with resourceId
1. Create a test alert in Firestore with:
   - `requesterId` = user's Clerk `sub` ID
   - `assignedNgoId` = NGO's Clerk `sub` ID
2. User navigates to: `/video/room/novaaid-alert-{alertId}?resourceId={alertId}`
3. Should successfully join
4. NGO navigates to same URL
5. Should successfully join
6. Different user (not owner) tries to join → should get 403 error

#### Test 3: Authentication Required
1. Open incognito/private browser
2. Navigate to: `http://localhost:3000/video/room/test-room`
3. Should redirect to sign-in page

#### Test 4: Role Validation
1. Sign in as user with `activeRole = "admin"` or other invalid role
2. Try to join room → should get 403 "Only user or ngo may create/join rooms"

#### Test 5: Token Expiry (optional long-running test)
1. Join a room
2. Wait 1+ hour (token expiry time)
3. Token should expire, new users cannot join with old token
4. Existing participants may continue until they leave

### Manual Backend API Test

Using curl or Postman:

```bash
# Get a Clerk JWT token from your frontend console
# Then test the endpoint:

curl -X POST http://localhost:3001/api/video/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_JWT" \
  -d '{
    "roomName": "novaaid-test-room",
    "resourceId": "optional-resource-id"
  }'
```

Expected response: JSON with `success: true`, `room`, and `token` fields.

## Features Implemented

### Video Room Client Features
- ✅ WebRTC video/audio via Daily.co
- ✅ Participant count display
- ✅ Loading states
- ✅ Error handling with retry option
- ✅ Audio toggle
- ✅ Video toggle
- ✅ Leave call button
- ✅ Responsive UI (full screen)
- ✅ Auto-cleanup on unmount
- ✅ Event logging (joined, left, errors)

### Backend Features
- ✅ Idempotent room creation
- ✅ Short-lived meeting tokens (1 hour)
- ✅ Role-based access control
- ✅ Optional resource permission checks
- ✅ Room deletion endpoint
- ✅ Error handling and logging
- ✅ CORS support

## Next Steps / Enhancements

### Recommended Additions
1. **Alert Integration:**
   - Add "Start Video Call" button on alert detail pages
   - Auto-generate room names from alertId
   - Show video call status indicator

2. **Notifications:**
   - Notify NGO when user starts a video call
   - SMS/email notification for scheduled calls

3. **Call History:**
   - Log video calls in Firestore
   - Track: roomName, participants, duration, startTime, endTime
   - Display in user/NGO dashboards

4. **UI Improvements:**
   - Screen share toggle
   - Recording toggle (if needed)
   - Chat sidebar (Daily supports chat)
   - Virtual backgrounds
   - Participant list with names

5. **Production Readiness:**
   - Rate limiting on `/api/video/create`
   - HTTPS enforcement
   - Daily webhook integration for call events
   - Auto-delete old rooms (Daily API)
   - Environment-specific Daily domains

## Environment Variables Summary

### Backend `.env`
```env
DAILY_API_KEY=617e9ee77706604df5f7ee661436021d854758cfed724859d74d6c5e0d208c4a
DAILY_BASE_URL=https://api.daily.co
PORT=3001
```

### User Portal `.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### NGO Portal `.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## Troubleshooting

### Issue: "Failed to get meeting token or room"
- **Check**: Backend is running on port 3001
- **Check**: `DAILY_API_KEY` is set in backend `.env`
- **Check**: Clerk JWT is valid (check browser console)

### Issue: "Only user or ngo may create/join rooms"
- **Check**: User's `publicMetadata.activeRole` in Clerk is set to "user" or "ngo"
- **Update**: Via Clerk Dashboard → Users → select user → Metadata → Public Metadata

### Issue: "Not authorized: not the alert owner"
- **Check**: `resourceId` matches an alert in Firestore
- **Check**: Alert's `requesterId` (for user) or `assignedNgoId` (for NGO) matches user's Clerk `sub`

### Issue: Video not showing
- **Check**: Browser permissions for camera/microphone
- **Check**: Daily room URL is valid
- **Check**: Network/firewall allows WebRTC connections

### Issue: npm install fails
- **Check**: Node.js version >= 18
- **Run**: `npm install --legacy-peer-deps` if peer dependency conflicts

## Support & Documentation

- **Daily.co Docs**: https://docs.daily.co/
- **Daily.co Dashboard**: https://dashboard.daily.co/
- **Clerk Docs**: https://clerk.com/docs
- **Next.js App Router**: https://nextjs.org/docs/app

## Security Checklist

- [x] API keys stored in backend only (not frontend)
- [x] Clerk JWT validation on every request
- [x] Role-based access control
- [x] Short-lived meeting tokens
- [x] Optional resource ownership checks
- [x] HTTPS recommended for production
- [x] No PII logged (only metadata)
- [x] CORS configured
- [ ] Rate limiting (TODO for production)
- [ ] Webhook signature validation (TODO if using webhooks)

## License & Credits

- NovaAid Platform
- Daily.co for video infrastructure
- Clerk for authentication
- Built with Next.js, Express, and React

---

**Implementation Date**: January 2025  
**Status**: ✅ Complete and ready for testing  
**Next**: Run test cases and integrate into alert workflow
