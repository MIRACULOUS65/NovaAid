# Fraud Detection System

A modern web application for detecting fraud using facial recognition and Firebase integration.

## Features

- 🎯 **Face Detection**: Advanced AI-powered facial recognition
- 🔒 **Firebase Integration**: Secure data storage and retrieval
- 📊 **Real-time Analysis**: Instant fraud detection results
- 🎨 **Modern UI**: Dark gradient theme with smooth animations
- 📱 **Responsive Design**: Works on all devices

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS
- **Backend**: Firebase (Firestore, Storage)
- **AI/ML**: face-api.js for facial recognition
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account with a project set up

### Installation

1. Clone the repository:
```bash
cd c:\CS\fraud
```

2. Install dependencies:
```bash
npm install
```

3. Firebase Configuration:
   - The Firebase configuration is already set up in `src/firebase/config.js`
   - Ensure your Firebase project has Firestore and Storage enabled

4. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## How It Works

### 1. Upload Page (`/`)
- Users can upload an image by dragging and dropping or clicking to browse
- The image is validated and previewed before submission
- Click "Analyze Image" to process

### 2. Fraud Detection Process
- The uploaded image is analyzed using face-api.js
- Face detection extracts facial features (descriptors)
- The system compares these features with registered users in Firebase
- A similarity score is calculated based on Euclidean distance
- Results are stored in Firebase for tracking

### 3. Results Page (`/results`)
- Displays fraud status (Fraud/Legitimate)
- Shows confidence score as a percentage
- Indicates similarity match with the closest registered user
- Provides recommendations based on the analysis
- Includes timestamp and detailed information

## Firebase Collections

### `registered_users`
Stores legitimate users for comparison:
```javascript
{
  name: string,
  imageUrl: string,
  faceDescriptor: number[],
  registeredAt: string (ISO date)
}
```

### `fraud_detections`
Stores detection results:
```javascript
{
  timestamp: string (ISO date),
  imageUrl: string,
  isFraud: boolean,
  confidenceScore: number,
  matchedUserId: string | null,
  matchedUserName: string,
  similarity: number
}
```

## Registering Users

To register legitimate users in the system, you can use the `registerUser` method from `fraudDetectionService`:

```javascript
import fraudDetectionService from './services/fraudDetectionService';

// Register a new user
const result = await fraudDetectionService.registerUser('John Doe', imageFile);
```

## Fraud Detection Algorithm

1. **Face Detection**: Detects faces in the uploaded image
2. **Feature Extraction**: Extracts 128-dimensional face descriptors
3. **Comparison**: Compares with all registered users using Euclidean distance
4. **Threshold**: Uses 70% similarity threshold
   - Below 70%: Flagged as fraud
   - Above 70%: Verified as legitimate
5. **Confidence Score**: Higher score = more confident in the decision

## Configuration

### Adjusting Fraud Threshold

Edit `src/services/fraudDetectionService.js`:

```javascript
const FRAUD_THRESHOLD = 70; // Adjust this value (0-100)
```

- Lower threshold: More strict (more likely to flag as fraud)
- Higher threshold: More lenient (fewer fraud detections)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Security Notes

⚠️ **Important**: The Firebase configuration and service account keys are currently exposed in the code. For production:

1. Move sensitive credentials to environment variables
2. Use Firebase Security Rules to protect your data
3. Implement authentication
4. Use server-side functions for sensitive operations

## Troubleshooting

### Face Detection Not Working
- Ensure the image contains a clear, frontal face
- Check browser console for model loading errors
- Verify internet connection (models are loaded from CDN)

### Firebase Connection Issues
- Check Firebase configuration
- Verify Firestore and Storage are enabled
- Check browser console for specific errors

## License

MIT

## Support

For issues and questions, please check the Firebase and face-api.js documentation.
