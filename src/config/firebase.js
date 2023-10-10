import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
 
const firebaseConfig = {
  apiKey: "#apiKey",
  authDomain: "#authDomain",
  projectId: "#projectId",
  storageBucket: "#storageBucket",
  messagingSenderId: "#messagingSenderId",
  appId: "#appId",
  measurementId: "#measurementId"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
