import { auth, db } from '../config/firebaseAdmin.js';
import { verifyToken } from '../config/jwt.js';
import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];

    // 1. Try custom JWT verification first
    const decodedJwt = verifyToken(token);
    if (decodedJwt) {
      const user = await firestoreAdminService.getUserByUid(decodedJwt.uid);
      if (!user) {
        return errorResponse(res, 401, 'Unauthorized: User account does not exist');
      }
      if (user.status === 'suspended') {
        return errorResponse(res, 403, 'Account has been suspended. Please contact support.');
      }

      // Session Revocation Check via tokenVersion
      const currentTokenVersion = user.tokenVersion || 1;
      const tokenVersionInJwt = decodedJwt.tokenVersion || 1;
      if (tokenVersionInJwt < currentTokenVersion) {
        return errorResponse(res, 401, 'Session expired or revoked. Please log in again.');
      }

      req.user = {
        ...user,
        role: user.role || decodedJwt.role || 'user',
        uid: user.uid || decodedJwt.uid
      };
      return next();
    }

    // 2. Try Firebase Admin ID token verification if Firebase Admin is initialized
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
        logger.error('Firebase ID token verification failure:', err.message);
        return errorResponse(res, 401, 'Unauthorized: Invalid authentication token');
      }
    }

    return errorResponse(res, 401, 'Unauthorized: Invalid authentication token');
  } catch (error) {
    logger.error('Authentication verification internal error:', error);
    return errorResponse(res, 500, 'An authentication error occurred. Please try again.');
  }
};
