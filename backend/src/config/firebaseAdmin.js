import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db;
let auth;

try {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey) {
      let cleaned = privateKey.trim();
      if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
        cleaned = cleaned.slice(1, -1);
      }
      cleaned = cleaned.replace(/\\n/g, '\n').replace(/\r/g, '');

      const header = '-----BEGIN PRIVATE KEY-----';
      const footer = '-----END PRIVATE KEY-----';
      if (cleaned.includes(header) && !cleaned.includes('\n')) {
        let body = cleaned.replace(header, '').replace(footer, '').replace(/\s+/g, '');
        const chunks = body.match(/.{1,64}/g) || [body];
        cleaned = `${header}\n${chunks.join('\n')}\n${footer}\n`;
      }
      privateKey = cleaned;
    }

    if (projectId && clientEmail && privateKey) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        console.log('✅ Firebase Admin initialized with Service Account credentials');
      } catch (certErr) {
        console.warn('⚠️ Service account cert parse notice:', certErr.message);
        admin.initializeApp({ projectId });
        console.log('✅ Firebase Admin initialized with Project ID fallback');
      }
    } else if (projectId) {
      admin.initializeApp({
        projectId,
      });
      console.log('✅ Firebase Admin initialized with Project ID');
    } else {
      console.warn('⚠️ Firebase credentials not set in backend/.env. Using mock mode for local dev fallback.');
    }
  }

  if (admin.apps.length > 0) {
    db = admin.firestore();
    auth = admin.auth();
  }
} catch (error) {
  console.error('❌ Firebase Admin Initialization Error:', error.message);
}

export { admin, db, auth };
