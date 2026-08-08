import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwt.js';
import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { auth } from '../config/firebaseAdmin.js';

export const register = async (req, res, next) => {
  try {
    const { uid, email, password, fullName, phone } = req.body;

    if (!password || password.length < 6) {
      return errorResponse(res, 400, 'Password is required and must be at least 6 characters long');
    }

    // Check if user already exists
    const allUsers = await firestoreAdminService.getAllUsers();
    const existingUser = allUsers.find(u => u.email === email);
    if (existingUser) {
      return errorResponse(res, 400, 'A user with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = uid || 'user_' + Date.now();

    // Security Hardening: Force role to 'user'. Ignore any client-supplied role.
    const user = await firestoreAdminService.createUser({
      uid: userId,
      email,
      passwordHash,
      fullName: fullName || email.split('@')[0],
      phone: phone || '',
      role: 'user'
    });

    const { passwordHash: _, ...sanitizedUser } = user;

    const token = generateToken({
      uid: sanitizedUser.uid,
      email: sanitizedUser.email,
      role: sanitizedUser.role,
      fullName: sanitizedUser.fullName
    });

    return successResponse(res, 201, 'User registered successfully', { user: sanitizedUser, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, idToken } = req.body;

    let user = null;

    // Firebase Auth ID Token authentication path
    if (idToken && auth) {
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const allUsers = await firestoreAdminService.getAllUsers();
        user = allUsers.find(u => u.uid === decodedToken.uid || u.email === decodedToken.email);

        if (!user) {
          user = await firestoreAdminService.createUser({
            uid: decodedToken.uid,
            email: decodedToken.email,
            fullName: decodedToken.name || decodedToken.email.split('@')[0],
            role: 'user'
          });
        }
      } catch (err) {
        return errorResponse(res, 401, 'Invalid Firebase Auth token');
      }
    } else {
      // Custom Email + Password authentication path
      if (!email || !password) {
        return errorResponse(res, 400, 'Email and password are required');
      }

      const allUsers = await firestoreAdminService.getAllUsers();
      user = allUsers.find(u => u.email === email);

      if (!user || !user.passwordHash) {
        return errorResponse(res, 401, 'Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return errorResponse(res, 401, 'Invalid credentials');
      }
    }

    if (user.status === 'suspended') {
      return errorResponse(res, 403, 'Account has been suspended. Please contact support.');
    }

    // Update lastLogin timestamp
    await firestoreAdminService.updateUser(user.uid, { lastLogin: new Date().toISOString() });

    const { passwordHash: _, ...sanitizedUser } = user;

    const token = generateToken({
      uid: sanitizedUser.uid,
      email: sanitizedUser.email,
      role: sanitizedUser.role,
      fullName: sanitizedUser.fullName
    });

    return successResponse(res, 200, 'Login successful', { user: sanitizedUser, token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await firestoreAdminService.getUserByUid(req.user.uid);
    if (!user) {
      return errorResponse(res, 404, 'User profile not found');
    }
    const { passwordHash: _, ...sanitizedUser } = user;
    return successResponse(res, 200, 'Profile retrieved', sanitizedUser);
  } catch (error) {
    next(error);
  }
};
