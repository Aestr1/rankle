
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-X_de5SUn73RM3FQPSMLhnUc311hK5Ic",
  authDomain: "rankle-7db08.firebaseapp.com",
  projectId: "rankle-7db08",
  storageBucket: "rankle-7db08.appspot.com",
  messagingSenderId: "169560119600",
  appId: "1:169560119600:web:b000b93427c209ec3a50f5",
  measurementId: "G-GJ97QMNCXC"
};


// Initialize Firebase for Singleton Pattern
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

// Initialize Analytics only on the client side
if (typeof window !== 'undefined') {
    isSupported().then(supported => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}


export { app, auth, db, analytics };
