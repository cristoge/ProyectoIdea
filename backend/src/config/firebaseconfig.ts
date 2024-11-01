import admin from 'firebase-admin';
import * as serviceAccount from '/Users/cristog/Prat/Proyecto/Identificacion/keyFS.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };