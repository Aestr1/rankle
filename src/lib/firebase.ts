
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firestore";

// **IMPORTANT**: This configuration now points *exclusively* to your 'rankle-7db08' project.
// This is the single source of truth for your client-side Firebase connection.
const firebaseConfig = {
  apiKey: "AIzaSyB-X_de5SUn73RM3FQPSMLhnUc311hK5Ic",
  authDomain: "rankle-7db08.firebaseapp.com",
  projectId: "rankle-7db08",
  storageBucket: "rankle-7db08.firebasestorage.app",
  messagingSenderId: "169560119600",
  appId: "1:169560119600:web:b000b93427c209ec3a50f5",
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
