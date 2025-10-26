# Firebase Setup Guide

## Overview

This fraud detection system uses Firebase for:
- **Firestore Database**: Storing registered users and detection results
- **Firebase Storage**: Storing user images

## Initial Setup Steps

### 1. Enable Firebase Services

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `nova-aid-blockchain-zk-data`
3. Enable the following services:

#### Firestore Database
- Navigate to **Build** → **Firestore Database**
- Click **Create Database**
- Choose **Start in production mode** (we'll set up rules next)
- Select your preferred region

#### Storage
- Navigate to **Build** → **Storage**
- Click **Get Started**
- Choose **Start in production mode**
- Select your preferred region

### 2. Configure Security Rules

#### Firestore Security Rules

Navigate to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for registered_users collection
    match /registered_users/{userId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Allow read/write for fraud_detections collection
    match /fraud_detections/{detectionId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

**Note**: These rules allow public access. For production, implement proper authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registered_users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /fraud_detections/{detectionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage Security Rules

Navigate to **Storage** → **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /registered_users/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
    
    match /fraud_checks/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

**Note**: For production, implement proper authentication similar to Firestore.

### 3. Database Collections

The application uses two Firestore collections:

#### Collection: `registered_users`

Stores legitimate users for fraud detection comparison.

**Document Structure:**
```javascript
{
  name: string,              // User's full name
  imageUrl: string,          // URL to the user's image in Firebase Storage
  faceDescriptor: number[],  // 128-dimensional face descriptor array
  registeredAt: string       // ISO timestamp of registration
}
```

**Example:**
```javascript
{
  name: "John Doe",
  imageUrl: "https://firebasestorage.googleapis.com/.../registered_users/...",
  faceDescriptor: [0.123, -0.456, 0.789, ...], // 128 numbers
  registeredAt: "2024-01-15T10:30:00.000Z"
}
```

#### Collection: `fraud_detections`

Stores results of fraud detection checks.

**Document Structure:**
```javascript
{
  timestamp: string,        // ISO timestamp of detection
  imageUrl: string,         // URL to the analyzed image
  isFraud: boolean,         // true if fraud detected, false if legitimate
  confidenceScore: number,  // Confidence percentage (0-100)
  matchedUserId: string,    // ID of the closest matching registered user (or null)
  matchedUserName: string,  // Name of the closest matching user
  similarity: number        // Similarity percentage with the matched user
}
```

**Example:**
```javascript
{
  timestamp: "2024-01-15T14:25:00.000Z",
  imageUrl: "https://firebasestorage.googleapis.com/.../fraud_checks/...",
  isFraud: false,
  confidenceScore: 87.5,
  matchedUserId: "abc123def456",
  matchedUserName: "John Doe",
  similarity: 87.5
}
```

### 4. Register Initial Users

Before using the fraud detection system, you need to register some legitimate users:

1. Start the application
2. Navigate to the Admin page (click "Register New Users" link on the homepage)
3. Enter user details and upload their photo
4. Click "Register User"

**OR** use the Firebase Console:

1. Go to Firestore Database
2. Create a new document in the `registered_users` collection
3. Manually add the fields (note: this requires computing face descriptors separately)

### 5. Storage Structure

```
firebase-storage/
├── registered_users/
│   ├── 1234567890_john_doe.jpg
│   ├── 1234567891_jane_smith.jpg
│   └── ...
└── fraud_checks/
    ├── 1234567892_upload1.jpg
    ├── 1234567893_upload2.jpg
    └── ...
```

## Testing the Setup

### 1. Verify Firestore Connection

Open browser console and check for:
```
✓ Firebase initialized
✓ Firestore connected
```

### 2. Test User Registration

1. Go to `/admin`
2. Register a test user
3. Check Firestore console for new document in `registered_users`
4. Check Storage console for uploaded image

### 3. Test Fraud Detection

1. Go to `/` (home page)
2. Upload an image
3. Check results page
4. Verify new document in `fraud_detections` collection

## Troubleshooting

### Issue: "Permission denied" errors

**Solution**: Check your Firestore and Storage security rules. Ensure they allow read/write access.

### Issue: Face detection not working

**Solution**: 
- Ensure face-api.js models are loading (check console)
- Use clear, well-lit face images
- Face should be directly facing the camera

### Issue: No registered users found

**Solution**: Register at least one user via the admin page before attempting fraud detection.

### Issue: Firebase initialization errors

**Solution**: 
- Verify Firebase config in `src/firebase/config.js`
- Check that all Firebase services are enabled
- Ensure you're using the correct project credentials

## Production Considerations

1. **Authentication**: Implement Firebase Authentication
2. **Security Rules**: Restrict access based on authentication
3. **Environment Variables**: Move credentials to `.env` file
4. **Rate Limiting**: Implement rate limiting for API calls
5. **Error Logging**: Set up proper error tracking
6. **Backup**: Regular database backups
7. **CORS**: Configure CORS for Storage if needed

## API Keys Security

⚠️ **Warning**: The current configuration exposes Firebase credentials in the frontend code. This is acceptable for Firebase web apps as these keys are meant to be public, but you should:

1. Set up proper security rules (shown above)
2. Enable App Check for additional security
3. Use Firebase Authentication to control access
4. Monitor usage in Firebase Console

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

For face-api.js issues:
- [face-api.js GitHub](https://github.com/justadudewhohacks/face-api.js)
