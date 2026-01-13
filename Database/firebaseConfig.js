// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDtHHuIoMoJU-RTmmtHnmM13QlY8LP8bik",
  authDomain: "diabetes-app-a886e.firebaseapp.com",
  projectId: "diabetes-app-a886e",
  storageBucket: "diabetes-app-a886e.firebasestorage.app",
  messagingSenderId: "336723881603",
  appId: "1:336723881603:web:085154de665fa209db35b6",
  measurementId: "G-SNYS3TEJM6"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Get Firestore
const firestore = getFirestore(app);

export { auth, firestore, app };
