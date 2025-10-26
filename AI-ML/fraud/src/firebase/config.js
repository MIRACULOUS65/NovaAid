import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_yh7xZckbSwtvuBpVFc_kZSyNjpchkEI",
  authDomain: "nova-aid-blockchain-zk-data.firebaseapp.com",
  projectId: "nova-aid-blockchain-zk-data",
  storageBucket: "nova-aid-blockchain-zk-data.firebasestorage.app",
  messagingSenderId: "926280914453",
  appId: "1:926280914453:web:c3e9b1111c5c350e80601c",
  measurementId: "G-32SYH3F0V6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };
