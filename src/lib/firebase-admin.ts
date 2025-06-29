import { initializeApp, getApps, App, cert, getApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import 'server-only';

function getServiceAccount(): ServiceAccount | null {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson || serviceAccountJson.trim() === '') {
    return null;
  }
  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    return serviceAccount;
  } catch (e) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT. Ensure it's a valid JSON string copied from the Firebase console.", e);
    return null;
  }
}

let adminDbInstance: Firestore | null = null;

export function getAdminDb(): Firestore | null {
  if (adminDbInstance) {
    return adminDbInstance;
  }

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    console.error("CRITICAL: FIREBASE_SERVICE_ACCOUNT environment variable not set or invalid. Server-side functionality will fail.");
    return null;
  }
  
  const adminApp: App = getApps().find(app => app.name === 'admin')
    ? getApp('admin')
    : initializeApp({
        credential: cert(serviceAccount)
      }, 'admin');

  adminDbInstance = getFirestore(adminApp);
  return adminDbInstance;
}
