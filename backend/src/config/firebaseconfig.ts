import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Convertir la cadena de JSON en un objeto
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS || '{}');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };