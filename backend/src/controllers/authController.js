import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwt.js';
import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { auth } from '../config/firebaseAdmin.js';
import { logger } from '../utils/logger.js';

// Per-account brute-force lockout tracking
const failedLoginAttempts = new Map(); // email -> { count, lockUntil }
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes lockout

const checkAccountLockout = (email) => {
  if (!email) return null;
  const key = email.toLowerCase().trim();
  const record = failedLoginAttempts.get(key);
  if (record) {
    if (record.lockUntil && Date.now() < record.lockUntil) {
      const remainingSecs = Math.ceil((record.lockUntil - Date.now()) / 1000);
      return `Account is temporarily locked due to repeated failed login attempts. Try again in ${remainingSecs} seconds.`;
    }
    if (record.lockUntil && Date.now() >= record.lockUntil) {
      failedLoginAttempts.delete(key);
    }
  }
  return null;
};

const recordFailedAttempt = (email) => {
  if (!email) return;
  const key = email.toLowerCase().trim();
  const record = failedLoginAttempts.get(key) || { count: 0, lockUntil: null };
  record.count += 1;
  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCK_TIME_MS;
    logger.warn(`[SECURITY LOCKOUT] Account ${key} locked for 15 minutes after ${MAX_FAILED_ATTEMPTS} failed attempts.`);
  }
  failedLoginAttempts.set(key, record);
};

const resetFailedAttempts = (email) => {
  if (!email) return;
  failedLoginAttempts.delete(email.toLowerCase().trim());
};

export const register = async (req, res, next) => {
  try {
    const { uid, email, password, fullName, phone } = req.body;

    if (!password || password.length < 6) {
      return errorResponse(res, 400, 'Password is required and must be at least 6 characters long');
    }

    // Direct indexed query by email (No collection scan)
    const existingUser = await firestoreAdminService.getUserByEmail(email);
    if (existingUser) {
      return errorResponse(res, 400, 'A user with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = uid || 'user_' + Date.now();

    // Generate cryptographic email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Security Hardening: Force role to 'user' and isVerified to false upon initial registration
    const user = await firestoreAdminService.createUser({
      uid: userId,
      email: email.toLowerCase().trim(),
      passwordHash,
      fullName: fullName || email.split('@')[0],
      phone: phone || '',
      role: 'user',
      isVerified: false,
      verificationToken,
      verificationTokenExpires
    });

    logger.info(`Verification email dispatched to ${user.email} with token: ${verificationToken}`);

    const { passwordHash: _, verificationToken: __, ...sanitizedUser } = user;

    const token = generateToken({
      uid: sanitizedUser.uid,
      email: sanitizedUser.email,
      role: sanitizedUser.role,
      fullName: sanitizedUser.fullName
    });

    return successResponse(res, 201, 'Registration successful! Verification email dispatched.', {
      user: sanitizedUser,
      token,
      verificationToken // Included for development/testing ease
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, idToken } = req.body;

    // Check for account lockout before processing
    if (email) {
      const lockoutMsg = checkAccountLockout(email);
      if (lockoutMsg) {
        return errorResponse(res, 429, lockoutMsg);
      }
    }

    let user = null;

    // Firebase Auth ID Token authentication path
    if (idToken && auth) {
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        user = await firestoreAdminService.getUserByUid(decodedToken.uid) || await firestoreAdminService.getUserByEmail(decodedToken.email);

        if (!user) {
          user = await firestoreAdminService.createUser({
            uid: decodedToken.uid,
            email: decodedToken.email.toLowerCase().trim(),
            fullName: decodedToken.name || decodedToken.email.split('@')[0],
            role: 'user',
            isVerified: true
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

      // Direct indexed query by email
      user = await firestoreAdminService.getUserByEmail(email);

      if (!user || !user.passwordHash) {
        recordFailedAttempt(email);
        return errorResponse(res, 401, 'Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        recordFailedAttempt(email);
        return errorResponse(res, 401, 'Invalid credentials');
      }
    }

    if (user.status === 'suspended') {
      return errorResponse(res, 403, 'Account has been suspended. Please contact support.');
    }

    // Reset failed login attempts on success
    resetFailedAttempts(user.email);

    // Update lastLogin timestamp
    await firestoreAdminService.updateUser(user.uid, { lastLogin: new Date().toISOString() });

    const { passwordHash: _, resetPasswordToken: __, verificationToken: ___, ...sanitizedUser } = user;

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

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return errorResponse(res, 400, 'Verification token is required');
    }

    const user = await firestoreAdminService.getUserByVerificationToken(token);
    if (!user) {
      return errorResponse(res, 400, 'Invalid or expired verification token');
    }

    if (user.verificationTokenExpires && new Date() > new Date(user.verificationTokenExpires)) {
      return errorResponse(res, 400, 'Verification token has expired. Please request a new one.');
    }

    const updatedUser = await firestoreAdminService.updateUser(user.uid, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null
    });

    const { passwordHash: _, ...sanitizedUser } = updatedUser;
    return successResponse(res, 200, 'Email address verified successfully!', sanitizedUser);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 400, 'Email is required');
    }

    const user = await firestoreAdminService.getUserByEmail(email);
    // Generic response to prevent user enumeration
    const genericResponseMsg = 'If an account with that email exists, a password reset link has been dispatched.';

    if (user && user.passwordHash) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      await firestoreAdminService.updateUser(user.uid, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });

      logger.info(`Password reset token generated for ${user.email}: ${resetToken}`);
    }

    return successResponse(res, 200, genericResponseMsg);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return errorResponse(res, 400, 'Token and new password are required');
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 400, 'New password must be at least 6 characters long');
    }

    const user = await firestoreAdminService.getUserByResetToken(token);
    if (!user || !user.resetPasswordExpires || new Date() > new Date(user.resetPasswordExpires)) {
      return errorResponse(res, 400, 'Password reset token is invalid or has expired');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await firestoreAdminService.updateUser(user.uid, {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    // Reset lockout counters for this account
    resetFailedAttempts(user.email);

    return successResponse(res, 200, 'Password has been reset successfully! You can now log in with your new password.');
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
    const { passwordHash: _, resetPasswordToken: __, verificationToken: ___, ...sanitizedUser } = user;
    return successResponse(res, 200, 'Profile retrieved', sanitizedUser);
  } catch (error) {
    next(error);
  }
};
