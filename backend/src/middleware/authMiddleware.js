import { auth, db } from '../config/firebaseAdmin.js';
import { verifyToken } from '../config/jwt.js';
import { errorResponse } from '../utils/apiResponse.js';

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Try custom JWT verification first
    const decodedJwt = verifyToken(token);
    if (decodedJwt) {
      req.user = decodedJwt;
      return next();
    }

    // Try Firebase Admin ID token verification if Firebase Admin is initialized
    if (auth) {
      try {
        const decodedToken = await auth.verifyIdToken(token);
        let userDoc = null;
        if (db) {
          const snap = await db.collection('users').doc(decodedToken.uid).get();
          if (snap.exists) {
            userDoc = snap.data();
          }
        }
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email || '',
          role: userDoc?.role || 'user',
          fullName: userDoc?.fullName || decodedToken.name || 'User',
          status: userDoc?.status || 'active'
        };
        return next();
      } catch (err) {
        return errorResponse(res, 401, 'Unauthorized: Invalid Firebase Token');
      }
    }

    return errorResponse(res, 401, 'Unauthorized: Invalid authentication token');
  } catch (error) {
    return errorResponse(res, 500, 'Authentication error: ' + error.message);
  }
};
