import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDVm8F5oYQtorV6JtPu45PZ9EIzKozmnRM",
  authDomain: "hallo-yema.firebaseapp.com",
  projectId: "hallo-yema",
  storageBucket: "hallo-yema.firebasestorage.app",
  messagingSenderId: "306179405289",
  appId: "1:306179405289:web:8e639ee6389d15ca964778"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
