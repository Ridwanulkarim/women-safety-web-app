import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: apiKey && !apiKey.includes('MockKey') ? apiKey : "AIzaSyDTSYuREKkzPcUHaECOGNzmSf1NpwNe8po",
  authDomain: authDomain || "women-safety-app-7c29e.firebaseapp.com",
  projectId: projectId || "women-safety-app-7c29e",
  storageBucket: storageBucket || "women-safety-app-7c29e.firebasestorage.app",
  messagingSenderId: messagingSenderId || "997838014585",
  appId: appId || "1:997838014585:web:6216196e2d737c65786ca8"
};

// Initialize Firebase App instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
