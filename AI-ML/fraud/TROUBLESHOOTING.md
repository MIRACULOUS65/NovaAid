# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Processing but output is not showing"

This usually means one of the following:

#### 1. **Browser Console Errors**

**Solution:** Open your browser's Developer Console (F12) and check for errors.

Common errors and fixes:
- **Firebase errors**: Firebase services not enabled → See [Firebase Setup](#firebase-not-set-up)
- **Face detection errors**: Models not loading → Check internet connection
- **Navigation errors**: React Router issues → Check console logs

#### 2. **Face Not Detected**

**Symptoms:** Processing completes but shows error "No face detected"

**Solutions:**
- ✅ Use a clear, well-lit photo
- ✅ Ensure face is directly facing camera
- ✅ Face should be the primary subject
- ✅ Remove sunglasses, hats, or coverings
- ✅ Avoid extreme angles or blurry images

**Test with a good image:**
- Take a selfie in good lighting
- Face should fill at least 30% of the image
- Eyes, nose, and mouth clearly visible

#### 3. **Firebase Not Set Up**

**Symptoms:** 
- App works but shows "Demo Mode" warning
- Firebase errors in console
- No data persistence

**Solution:**

1. **Enable Firestore:**
   - Go to: https://console.firebase.google.com/
   - Select project: `nova-aid-blockchain-zk-data`
   - Click "Build" → "Firestore Database"
   - Click "Create Database"
   - Choose "Start in production mode"
   - Select a region

2. **Enable Storage:**
   - Click "Build" → "Storage"
   - Click "Get Started"
   - Use default rules for now
   - Click "Done"

3. **Set Security Rules:**

   **Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

   **Storage Rules:**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ```

4. **Test Connection:**
   - Refresh the app
   - Check browser console for Firebase errors
   - Should see: "✅ Firebase initialized"

#### 4. **No Registered Users**

**Symptoms:**
- Shows "Demo Mode" on results
- Random similarity scores
- Can't verify actual users

**Solution:**

1. Navigate to: http://localhost:3000/admin
2. Register at least 2-3 test users:
   - Enter their full name
   - Upload a clear face photo
   - Click "Register User"
3. Wait for success message
4. Return to homepage and test again

#### 5. **Results Page Not Loading**

**Symptoms:**
- Processing completes but stays on upload page
- Or shows "No detection data available"

**Debug Steps:**

1. **Check Browser Console:**
   ```javascript
   // You should see these logs:
   🚀 Starting fraud detection process
   📋 Detection result: {success: true, ...}
   ✅ Navigating to results page with data: {...}
   📊 Results page loaded
   ```

2. **If navigation fails:**
   - Check for console errors
   - Verify React Router is working
   - Try refreshing the page

3. **If data is missing:**
   - Check the detection result in console
   - Verify it has `success: true`
   - Check that result contains required fields

#### 6. **AI Models Not Loading**

**Symptoms:**
- Stuck on "Loading AI models..."
- Console shows model loading errors
- Network errors in console

**Solutions:**

1. **Check Internet Connection:**
   - Models load from CDN
   - Requires active internet
   - Check firewall/proxy settings

2. **Try Different CDN:**
   
   Edit `src/services/fraudDetectionService.js`:
   ```javascript
   // Current:
   const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
   
   // Alternative:
   const MODEL_URL = 'https://unpkg.com/@vladmandic/face-api@1.7.11/model/';
   ```

3. **Clear Browser Cache:**
   - Ctrl + Shift + Delete
   - Clear cached images and files
   - Reload the page

#### 7. **Slow Processing**

**Symptoms:**
- Takes too long to analyze
- Browser becomes unresponsive

**Solutions:**

1. **Use smaller images:**
   - Resize images to max 1000px width
   - Compress before uploading
   - Lower resolution = faster processing

2. **Close other tabs:**
   - Face detection is CPU intensive
   - Free up browser resources

3. **Use modern browser:**
   - Chrome/Edge recommended
   - Update to latest version

---

## Debugging Checklist

When something doesn't work, check these in order:

### 1. Open Browser Console (F12)
- Look for red error messages
- Check for warnings
- Read the emoji log messages (🔍 📥 ✅ ❌)

### 2. Verify Steps
```
✅ Is the dev server running? (npm run dev)
✅ Is the browser pointing to http://localhost:3000?
✅ Can you see the upload page?
✅ Is the file selected? (shows preview)
✅ Does clicking "Analyze Image" start processing?
✅ Are there any error messages?
```

### 3. Check Firebase (if needed)
```
✅ Is Firestore enabled?
✅ Is Storage enabled?
✅ Are security rules set?
✅ Are there registered users? (check /admin)
```

### 4. Test with Known Good Image
- Use a clear selfie
- Good lighting
- Face directly visible
- No obstructions

---

## Console Log Reference

### Normal Operation:
```
🚀 Starting fraud detection process
🔍 Starting fraud detection...
📥 Loading AI models...
✅ Models loaded successfully
👥 Loading registered users...
✅ Loaded X registered users
🖼️ Processing uploaded image...
👤 Detecting face...
✅ Face detected successfully
🔄 Comparing with registered users...
  - John Doe: 85.32% similar
  - Jane Smith: 42.18% similar
✅ Best match: John Doe (85.32%)
📊 Fraud decision: LEGITIMATE (threshold: 70%)
☁️ Uploading to Firebase Storage...
✅ Image uploaded to Firebase
💾 Saving result to Firestore...
✅ Result saved to Firestore
🎉 Fraud detection completed successfully
📋 Detection result: {success: true, ...}
✅ Navigating to results page with data: {...}
📊 Results page loaded
✅ Rendering results for detection: demo-1234567890
```

### Demo Mode (No Firebase):
```
⚠️ No registered users found - running in demo mode
🎲 Demo similarity score: 65.43%
⚠️ Firebase save failed (continuing without storage): ...
```

### Error:
```
❌ No face detected
💥 Error in fraud detection: ...
```

---

## Still Having Issues?

### 1. Complete Reset

```bash
# Stop the server (Ctrl+C)

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Restart
npm run dev
```

### 2. Check System Requirements

- Node.js 16+ required
- Modern browser (Chrome, Edge, Firefox)
- Stable internet connection
- Sufficient RAM (2GB+ free)

### 3. Test Firebase Connection

Open browser console and run:
```javascript
// Should log Firebase config
import { db } from './src/firebase/config';
console.log('Firebase:', db);
```

### 4. Verify File Structure

```
src/
├── firebase/config.js          ← Must exist
├── services/fraudDetectionService.js  ← Must exist
├── pages/
│   ├── UploadPage.jsx         ← Must exist
│   └── ResultsPage.jsx        ← Must exist
└── App.jsx                    ← Must have routes
```

---

## Getting More Help

### Console Logs
All important steps are logged with emojis:
- 🔍 🚀 = Starting
- 📥 📊 = Processing  
- ✅ = Success
- ❌ 💥 = Error
- ⚠️ = Warning

### Key Things to Check
1. **Console logs** - Most informative
2. **Network tab** - Check API calls
3. **Firebase console** - Check data
4. **React DevTools** - Check component state

### Report Issues
If you still have problems:
1. Note the exact error message
2. Copy relevant console logs
3. Note what you were trying to do
4. Check if Firebase is set up correctly

---

## Prevention Tips

### For Best Results:
1. ✅ Set up Firebase first
2. ✅ Register users before testing
3. ✅ Use good quality images
4. ✅ Check console regularly
5. ✅ Read error messages carefully

### Common Mistakes to Avoid:
- ❌ Skipping Firebase setup
- ❌ Not registering any users
- ❌ Using poor quality images
- ❌ Ignoring console errors
- ❌ Not checking logs

---

## Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| No face detected | Use clearer image with visible face |
| Demo mode | Register users at `/admin` |
| Models not loading | Check internet, try different browser |
| Firebase errors | Enable Firestore & Storage |
| Results not showing | Check console for navigation errors |
| Slow processing | Use smaller images |
| Page not loading | Clear cache, restart server |

---

**Remember:** Most issues are solved by:
1. Checking the browser console (F12)
2. Reading the error messages
3. Following the setup guides
