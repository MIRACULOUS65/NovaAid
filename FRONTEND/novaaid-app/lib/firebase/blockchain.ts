// Firebase configuration for blockchain ZK data
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const blockchainFirebaseConfig = {
  apiKey: "AIzaSyC_yh7xZckbSwtvuBpVFc_kZSyNjpchkEI",
  authDomain: "nova-aid-blockchain-zk-data.firebaseapp.com",
  projectId: "nova-aid-blockchain-zk-data",
  storageBucket: "nova-aid-blockchain-zk-data.firebasestorage.app",
  messagingSenderId: "926280914453",
  appId: "1:926280914453:web:c3e9b1111c5c350e80601c",
  measurementId: "G-32SYH3F0V6"
};

// Initialize Firebase for blockchain data (separate from main app)
const blockchainApp = getApps().find(app => app.name === 'blockchain') || 
  initializeApp(blockchainFirebaseConfig, 'blockchain');

export const blockchainDb = getFirestore(blockchainApp);

// Initialize analytics only in browser and if supported
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(blockchainApp);
    }
  });
}

export default blockchainApp;
