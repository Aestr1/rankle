import { initializeApp, getApps, App, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import 'server-only';

// This function safely parses the service account key from the environment variable.
function getServiceAccount() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set. Please see the instructions in the terminal.');
  }
  try {
    return JSON.parse(serviceAccountJson);
  } catch (e) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", e);
    throw new Error('Failed to parse the FIREBASE_SERVICE_ACCOUNT. Please ensure it is a valid JSON string.');
  }
}

// Check if the admin app is already initialized.
// This prevents re-initialization errors in Next.js hot-reloading environments.
const adminApp: App = getApps().find(app => app.name === 'admin')
  ? getApp('admin')
  : initializeApp({
      credential: cert(getServiceAccount())
    }, 'admin');

const adminDb = getFirestore(adminApp);

export { adminDb };
