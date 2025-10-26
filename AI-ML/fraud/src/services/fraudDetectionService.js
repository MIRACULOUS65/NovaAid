import * as faceapi from 'face-api.js';
import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

class FraudDetectionService {
  constructor() {
    this.modelsLoaded = false;
    this.registeredUsers = [];
  }

  async loadModels() {
    if (this.modelsLoaded) return;
    
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
    
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);
      this.modelsLoaded = true;
      console.log('Face detection models loaded successfully');
    } catch (error) {
      console.error('Error loading models:', error);
      throw new Error('Failed to load face detection models');
    }
  }

  async loadRegisteredUsers() {
    this.registeredUsers = [];
    
    // Try to load from Firebase first
    try {
      const usersCollection = collection(db, 'registered_users');
      const snapshot = await getDocs(usersCollection);
      
      for (const doc of snapshot.docs) {
        const userData = doc.data();
        this.registeredUsers.push({
          id: doc.id,
          ...userData,
          descriptor: new Float32Array(userData.faceDescriptor),
          isLocal: false
        });
      }
      console.log(`Loaded ${this.registeredUsers.length} users from Firebase`);
    } catch (error) {
      console.log('⚠️ Could not load from Firebase, using local storage');
    }
    
    // Also load from localStorage (demo mode users)
    try {
      const localUsers = JSON.parse(localStorage.getItem('fraud_detection_users') || '[]');
      for (const user of localUsers) {
        this.registeredUsers.push({
          id: user.id,
          name: user.name,
          imageUrl: user.imageUrl,
          descriptor: new Float32Array(user.faceDescriptor),
          registeredAt: user.registeredAt,
          isLocal: true
        });
      }
      console.log(`Loaded ${localUsers.length} users from localStorage (demo mode)`);
      console.log(`Total registered users: ${this.registeredUsers.length}`);
    } catch (error) {
      console.warn('Error loading local users:', error);
    }
  }

  async detectFace(imageElement) {
    await this.loadModels();
    
    const detection = await faceapi
      .detectSingleFace(imageElement)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    return detection;
  }

  calculateSimilarity(descriptor1, descriptor2) {
    // Calculate Euclidean distance
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    // Convert distance to similarity percentage (lower distance = higher similarity)
    const similarity = Math.max(0, (1 - distance) * 100);
    return similarity;
  }

  async detectFraud(imageFile) {
    console.log('🔍 Starting fraud detection...');
    try {
      console.log('📥 Loading AI models...');
      await this.loadModels();
      console.log('✅ Models loaded successfully');
      
      console.log('👥 Loading registered users...');
      await this.loadRegisteredUsers();
      console.log(`✅ Loaded ${this.registeredUsers.length} registered users`);

      // Create image element from file
      console.log('🖼️ Processing uploaded image...');
      const img = await this.createImageElement(imageFile);
      
      // Detect face in uploaded image
      console.log('👤 Detecting face...');
      const detection = await this.detectFace(img);
      
      if (!detection) {
        console.error('❌ No face detected');
        return {
          success: false,
          error: 'No face detected in the uploaded image. Please ensure the image contains a clear, frontal face.'
        };
      }
      console.log('✅ Face detected successfully');

      // Compare with registered users
      let maxSimilarity = 0;
      let matchedUser = null;

      if (this.registeredUsers.length === 0) {
        console.warn('⚠️ No registered users found - running in demo mode');
        // Demo mode: simulate a fraud detection result
        maxSimilarity = Math.random() * 100;
        console.log(`🎲 Demo similarity score: ${maxSimilarity.toFixed(2)}%`);
      } else {
        console.log('🔄 Comparing with registered users...');
        for (const user of this.registeredUsers) {
          const similarity = this.calculateSimilarity(
            detection.descriptor,
            user.descriptor
          );
          console.log(`  - ${user.name}: ${similarity.toFixed(2)}% similar`);
          
          if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            matchedUser = user;
          }
        }
        console.log(`✅ Best match: ${matchedUser?.name || 'None'} (${maxSimilarity.toFixed(2)}%)`);
      }

      // Determine fraud based on similarity threshold
      const FRAUD_THRESHOLD = 70; // 70% similarity threshold
      const isFraud = maxSimilarity < FRAUD_THRESHOLD;
      console.log(`📊 Fraud decision: ${isFraud ? 'FRAUD' : 'LEGITIMATE'} (threshold: ${FRAUD_THRESHOLD}%)`);

      let imageUrl = null;
      let detectionId = null;

      // Create local image URL first (always needed as fallback)
      console.log('📸 Creating local image preview...');
      imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });
      console.log('✅ Local preview created');

      // Try to upload to Firebase Storage with timeout (optional if Firebase not set up)
      try {
        console.log('☁️ Attempting Firebase upload (will skip if not configured)...');
        
        // Add timeout to prevent hanging on CORS errors
        const uploadPromise = (async () => {
          const timestamp = Date.now();
          const storageRef = ref(storage, `fraud_checks/${timestamp}_${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          const firebaseUrl = await getDownloadURL(storageRef);
          console.log('✅ Image uploaded to Firebase Storage');
          return firebaseUrl;
        })();

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firebase upload timeout')), 5000)
        );

        // Use Firebase URL if upload succeeds within timeout
        const firebaseUrl = await Promise.race([uploadPromise, timeoutPromise]);
        imageUrl = firebaseUrl; // Replace local URL with Firebase URL

        // Save detection result to Firestore
        console.log('💾 Saving result to Firestore...');
        const resultData = {
          timestamp: new Date().toISOString(),
          imageUrl,
          isFraud,
          confidenceScore: isFraud ? (100 - maxSimilarity) : maxSimilarity,
          matchedUserId: matchedUser?.id || null,
          matchedUserName: matchedUser?.name || 'Unknown',
          similarity: maxSimilarity
        };

        const docRef = await addDoc(collection(db, 'fraud_detections'), resultData);
        detectionId = docRef.id;
        console.log('✅ Result saved to Firestore');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase not configured or unavailable - using local storage');
        console.log('💡 To enable Firebase: See FIREBASE_SETUP.md');
        console.log('   Using local image preview instead');
        // imageUrl already set to local data URL above
      }

      const resultData = {
        timestamp: new Date().toISOString(),
        imageUrl,
        isFraud,
        confidenceScore: isFraud ? (100 - maxSimilarity) : maxSimilarity,
        matchedUserId: matchedUser?.id || null,
        matchedUserName: matchedUser?.name || (this.registeredUsers.length === 0 ? 'Demo Mode' : 'Unknown'),
        similarity: maxSimilarity
      };

      console.log('🎉 Fraud detection completed successfully');
      console.log('Result:', resultData);

      return {
        success: true,
        detectionId: detectionId || 'demo-' + Date.now(),
        ...resultData
      };

    } catch (error) {
      console.error('💥 Error in fraud detection:', error);
      console.error('Error details:', error.stack);
      return {
        success: false,
        error: `Detection failed: ${error.message}. Please check browser console for details.`
      };
    }
  }

  createImageElement(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async registerUser(name, imageFile) {
    console.log(`\ud83d\udc65 Registering user: ${name}`);
    try {
      console.log('\ud83d\udce5 Loading AI models for registration...');
      await this.loadModels();
      console.log('\u2705 Models loaded');

      console.log('\ud83d\uddbc\ufe0f Processing user image...');
      const img = await this.createImageElement(imageFile);
      
      console.log('\ud83d\udc64 Detecting face in registration image...');
      const detection = await this.detectFace(img);

      if (!detection) {
        console.error('\u274c No face detected in registration image');
        throw new Error('No face detected in the image. Please use a clear photo with a visible face.');
      }
      console.log('\u2705 Face detected in registration image');

      let imageUrl = null;
      let userId = null;

      // Try to upload to Firebase Storage with timeout
      try {
        console.log('\u2601\ufe0f Attempting to upload to Firebase Storage...');
        
        const uploadPromise = (async () => {
          const timestamp = Date.now();
          const storageRef = ref(storage, `registered_users/${timestamp}_${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          const url = await getDownloadURL(storageRef);
          console.log('\u2705 Image uploaded to Firebase Storage');
          return url;
        })();

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firebase upload timeout')), 5000)
        );

        imageUrl = await Promise.race([uploadPromise, timeoutPromise]);

        // Save user to Firestore
        console.log('\ud83d\udcbe Saving user to Firestore...');
        const userData = {
          name,
          imageUrl,
          faceDescriptor: Array.from(detection.descriptor),
          registeredAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'registered_users'), userData);
        userId = docRef.id;
        console.log(`\u2705 User saved to Firestore with ID: ${userId}`);
        
        // Reload registered users
        await this.loadRegisteredUsers();

      } catch (firebaseError) {
        console.warn('⚠️ Firebase not configured - using local storage (demo mode)');
        console.log('💡 User will be stored in browser memory for this session');
        console.log('   To save permanently: Enable Firebase Storage and Firestore');
        
        // Store user locally in memory as fallback
        const localUser = {
          id: `local-${Date.now()}`,
          name,
          imageUrl: await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imageFile);
          }),
          faceDescriptor: Array.from(detection.descriptor),
          registeredAt: new Date().toISOString(),
          isLocal: true
        };
        
        // Add to registered users array
        this.registeredUsers.push({
          id: localUser.id,
          name: localUser.name,
          imageUrl: localUser.imageUrl,
          descriptor: new Float32Array(localUser.faceDescriptor),
          registeredAt: localUser.registeredAt,
          isLocal: true
        });
        
        // Also save to localStorage for persistence across page refreshes
        try {
          const existingUsers = JSON.parse(localStorage.getItem('fraud_detection_users') || '[]');
          existingUsers.push(localUser);
          localStorage.setItem('fraud_detection_users', JSON.stringify(existingUsers));
          console.log('✅ User saved to browser localStorage (demo mode)');
        } catch (storageError) {
          console.warn('⚠️ Could not save to localStorage:', storageError.message);
        }
        
        userId = localUser.id;
      }

      console.log(`\ud83c\udf89 User "${name}" registered successfully`);
      return {
        success: true,
        userId: userId,
        message: `User "${name}" registered successfully!`
      };

    } catch (error) {
      console.error('\ud83d\udca5 Error registering user:', error);
      console.error('Error details:', error.stack);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new FraudDetectionService();
