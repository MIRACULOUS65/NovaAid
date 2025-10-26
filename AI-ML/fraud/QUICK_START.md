# Quick Start Guide

## Fraud Detection System - Getting Started

### 🚀 Application is Running!

Your fraud detection application is now live at: **http://localhost:3000**

---

## 📋 First Steps

### 1. **Set Up Firebase (REQUIRED)**

Before using the application, you MUST set up Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `nova-aid-blockchain-zk-data`
3. Enable these services:
   - ✅ **Firestore Database**
   - ✅ **Firebase Storage**

**Detailed instructions:** See `FIREBASE_SETUP.md`

---

### 2. **Register Legitimate Users**

The system needs registered users to compare against:

1. Open: http://localhost:3000
2. Click **"Register New Users (Admin)"** at the bottom
3. Or navigate directly to: http://localhost:3000/admin

**Register at least 2-3 users for testing:**
- Enter their name
- Upload a clear face photo
- Click "Register User"

---

### 3. **Test Fraud Detection**

Once you have registered users:

1. Go to homepage: http://localhost:3000
2. Upload an image to test:
   - **Test Case 1**: Upload an image of a registered user → Should show "VERIFIED USER"
   - **Test Case 2**: Upload an image of someone not registered → Should show "FRAUD DETECTED"

---

## 🎯 Application Routes

| Route | Description |
|-------|-------------|
| `/` | **Upload Page** - Upload images for fraud detection |
| `/results` | **Results Page** - View detection results |
| `/admin` | **Admin Page** - Register new legitimate users |

---

## 📊 How It Works

1. **Upload Image** → System detects faces using AI
2. **Extract Features** → Creates a 128-dimensional face descriptor
3. **Compare** → Matches against all registered users
4. **Calculate Score** → Uses Euclidean distance to determine similarity
5. **Decision** → Fraud if similarity < 70%, Legitimate if ≥ 70%

---

## ⚙️ Key Features

- ✨ **Real-time Face Detection** using face-api.js
- 🔐 **Firebase Integration** for secure data storage
- 📈 **Confidence Scoring** with percentage accuracy
- 🎨 **Modern Dark UI** with gradient theme
- 📱 **Responsive Design** works on all devices

---

## 🔧 Configuration

### Adjust Fraud Detection Threshold

Edit `src/services/fraudDetectionService.js`:

```javascript
const FRAUD_THRESHOLD = 70; // Default: 70%
```

- **Lower (e.g., 60)**: More strict, more fraud detections
- **Higher (e.g., 80)**: More lenient, fewer fraud detections

---

## 📝 Data Stored in Firebase

### Firestore Collections:

1. **`registered_users`**
   - Stores legitimate users
   - Includes face descriptors and images

2. **`fraud_detections`**
   - Stores all detection results
   - Includes timestamps, scores, and matched users

### Storage Buckets:

1. **`registered_users/`**
   - Photos of legitimate users

2. **`fraud_checks/`**
   - Uploaded images being analyzed

---

## 🐛 Troubleshooting

### "No face detected"
- Use a clear, well-lit photo
- Face should be directly facing the camera
- Ensure entire face is visible

### "Permission denied"
- Check Firebase security rules (see FIREBASE_SETUP.md)
- Ensure Firestore and Storage are enabled

### "No registered users found"
- Register at least one user via `/admin` page

### Models not loading
- Check internet connection (models load from CDN)
- Wait a few seconds for models to download

---

## 📸 Best Practices for Photos

### For Registration (Admin Page):
- ✅ Clear, high-quality image
- ✅ Good lighting
- ✅ Face directly facing camera
- ✅ Neutral expression
- ❌ No sunglasses or face coverings
- ❌ Avoid extreme angles

### For Fraud Detection (Upload Page):
- Same guidelines as registration
- Can be different from registration photo but same person

---

## 🔒 Security Notes

⚠️ **Current Setup**: Development mode with open access

**For Production:**
1. Implement Firebase Authentication
2. Restrict database rules to authenticated users
3. Move credentials to environment variables
4. Enable Firebase App Check
5. Set up rate limiting

See `FIREBASE_SETUP.md` for production security rules.

---

## 📚 Documentation

- **README.md** - Full project documentation
- **FIREBASE_SETUP.md** - Detailed Firebase configuration
- **package.json** - Dependencies and scripts

---

## 🎨 UI Preview

- **Dark Gradient Theme** - Purple/Indigo gradients on dark background
- **Smooth Animations** - Hover effects and transitions
- **Modern Icons** - Using Lucide React icons
- **Responsive Cards** - Glass-morphism design

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ✨ Next Steps

1. ✅ Set up Firebase (Firestore + Storage)
2. ✅ Register 2-3 test users via `/admin`
3. ✅ Test fraud detection with various images
4. ✅ Adjust threshold if needed
5. ✅ Review security rules before production deployment

---

## 💡 Tips

- **Registration**: Use multiple photos of the same person for better accuracy
- **Testing**: Try different angles and lighting conditions
- **Threshold**: Start with 70% and adjust based on your needs
- **Performance**: Face detection runs in browser, no server required

---

## 🆘 Need Help?

1. Check browser console for errors
2. Review Firebase console for data
3. See `README.md` for detailed documentation
4. Check `FIREBASE_SETUP.md` for Firebase issues

---

**🎉 Enjoy using your Fraud Detection System!**
