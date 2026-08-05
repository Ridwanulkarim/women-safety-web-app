import { generateToken } from '../config/jwt.js';
import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { uid, email, fullName, phone, role } = req.body;
    const userId = uid || 'user_' + Date.now();

    const user = await firestoreAdminService.createUser({
      uid: userId,
      email,
      fullName,
      phone: phone || '',
      role: role || 'user'
    });

    const token = generateToken({ uid: user.uid, email: user.email, role: user.role, fullName: user.fullName });

    return successResponse(res, 201, 'User registered successfully', { user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, uid } = req.body;
    let user = null;

    if (uid) {
      user = await firestoreAdminService.getUserByUid(uid);
    }

    if (!user) {
      // Find by email or create standard mock account
      const allUsers = await firestoreAdminService.getAllUsers();
      user = allUsers.find(u => u.email === email);
    }

    if (!user) {
      user = await firestoreAdminService.createUser({
        uid: uid || 'user_' + Date.now(),
        email,
        fullName: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user'
      });
    }

    // Update lastLogin
    await firestoreAdminService.updateUser(user.uid, { lastLogin: new Date().toISOString() });

    const token = generateToken({ uid: user.uid, email: user.email, role: user.role, fullName: user.fullName });

    return successResponse(res, 200, 'Login successful', { user, token });
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
    return successResponse(res, 200, 'Profile retrieved', user);
  } catch (error) {
    next(error);
  }
};
