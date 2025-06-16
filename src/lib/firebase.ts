
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  db = getFirestore(app);

  if (firebaseConfig.measurementId) {
    try {
      // Check if analytics is already initialized to prevent re-initialization error
      // This is a common pattern, though getAnalytics itself might be idempotent.
      // However, to be safe, especially in HMR scenarios:
      const existingAnalytics = getApps().find(existingApp => (existingApp as any)._analytics);
      if (!existingAnalytics) {
        analytics = getAnalytics(app);
      }
    } catch (error) {
      console.error("Failed to initialize Firebase Analytics", error);
    }
  }
} else {
  // On the server, we might not initialize client-side services like auth or analytics
  // If server-side Firebase Admin SDK or other services were needed, they'd be handled differently.
  // For this client-focused app, we primarily care about the browser environment.
  if (!getApps().length && firebaseConfig.projectId) { 
    // app = initializeApp(firebaseConfig); // Not typically needed for client-side focused setup
  } else if (getApps().length > 0) {
    // app = getApps()[0];
  }
  // db = getFirestore(app); // Usually done with Admin SDK on server
}

export { app, auth, db, analytics };
