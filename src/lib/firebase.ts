// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDfZLexNq-U3Wk5oV7HD2JQEcLnSq1V4h8',
  authDomain: 'nudgee-508d3.firebaseapp.com',
  projectId: 'nudgee-508d3',
  storageBucket: 'nudgee-508d3.firebasestorage.app',
  messagingSenderId: '616352534001',
  appId: '1:616352534001:web:a708754c4f348887e2c850',
  measurementId: 'G-JMTJB4YYH3',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const store = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
