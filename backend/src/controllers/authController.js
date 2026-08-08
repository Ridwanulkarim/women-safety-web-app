import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwt.js';
import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sendTransactionalEmail } from '../services/notificationService.js';
import { auth } from '../config/firebaseAdmin.js';
import { logger } from '../utils/logger.js';

/**
 * TOTP Helper (HMAC-SHA1 RFC 6238 implementation)
 */
const generateTotpCode = (secret, timeStep = Math.floor(Date.now() / 1000 / 30)) => {
  const key = Buffer.from(secret, 'hex');
  const buffer = Buffer.alloc(8);
  let tmp = timeStep;
  for (let i = 7; i >= 0; i--) {
    buffer[i] = tmp & 0xff;
    tmp = tmp >> 8;
  }
  const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = ((hmac[offset] & 0x7f) << 24) |
               ((hmac[offset + 1] & 0xff) << 16) |
               ((hmac[offset + 2] & 0xff) << 8) |
               (hmac[offset + 3] & 0xff);
  return (code % 1000000).toString().padStart(6, '0');
};

const verifyTotpCode = (secret, code) => {
  if (!secret || !code) return false;
  const currentStep = Math.floor(Date.now() / 1000 / 30);
  // Allow a 1-step window before and after for clock drift tolerance
  for (let step = currentStep - 1; step <= currentStep + 1; step++) {
    if (generateTotpCode(secret, step) === code.toString().trim()) {
      return true;
    }
  }
  return false;
};

export const register = async (req, res, next) => {
  try {
    const { uid, email, password, fullName, phone, honeypot, website } = req.body;

    // Bot Protection / Honeypot Enforcement
    if (honeypot || website) {
      logger.warn(`Bot registration attempt rejected for email: ${email}`);
      return errorResponse(res, 400, 'Invalid registration payload');
    }

    if (!email || !password || password.length < 6) {
      return errorResponse(res, 400, 'Email and password (min 6 chars) are required');
    }

    const cleanEmail = email.toLowerCase().trim();
    const userId = uid || 'user_' + Date.now();

    // Atomic Database-Level Email Claim (Prevents TOCTOU Race Condition)
    try {
      await firestoreAdminService.claimEmailAtomic(cleanEmail, userId);
    } catch (err) {
      return errorResponse(res, 400, 'A user with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const user = await firestoreAdminService.createUser({
      uid: userId,
      email: cleanEmail,
      passwordHash,
      fullName: fullName || cleanEmail.split('@')[0],
      phone: phone || '',
      role: 'user',
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
      isTwoFactorEnabled: false
    });

    // Outbound Verification Email Dispatch
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; background: #09090b; color: #fff;">
        <h2 style="color: #e11d48;">Welcome to SafeHaven</h2>
        <p>Please click the button below to verify your email address:</p>
        <p><a href="${verifyLink}" style="background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a></p>
      </div>
    `;

    await sendTransactionalEmail({
      to: cleanEmail,
      subject: 'Verify Your SafeHaven Account',
      htmlContent: emailHtml
    });

    // Sanitize user object for response — DO NOT leak verificationToken in HTTP body
    const { passwordHash: _, verificationToken: __, verificationTokenExpires: ___, ...sanitizedUser } = user;

    const token = generateToken({
      uid: sanitizedUser.uid,
      email: sanitizedUser.email,
      role: sanitizedUser.role,
      fullName: sanitizedUser.fullName
    });

    return successResponse(res, 201, 'Registration successful! Verification email has been sent.', {
      user: sanitizedUser,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, idToken, twoFactorCode } = req.body;

    // Persistent Firestore Lockout Check
    if (email) {
      const lockout = await firestoreAdminService.getAccountLockout(email);
      if (lockout && lockout.lockUntil && new Date() < new Date(lockout.lockUntil)) {
        const remainingSecs = Math.ceil((new Date(lockout.lockUntil) - new Date()) / 1000);
        return errorResponse(res, 429, `Account is temporarily locked due to repeated failed login attempts. Try again in ${remainingSecs} seconds.`);
      }
    }

    let user = null;

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
      if (!email || !password) {
        return errorResponse(res, 400, 'Email and password are required');
      }

      user = await firestoreAdminService.getUserByEmail(email);

      if (!user || !user.passwordHash) {
        await firestoreAdminService.recordFailedLogin(email);
        return errorResponse(res, 401, 'Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        await firestoreAdminService.recordFailedLogin(email);
        return errorResponse(res, 401, 'Invalid credentials');
      }
    }

    // Two-Factor Authentication (2FA) Check
    if (user.isTwoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(401).json({
          success: false,
          requiresTwoFactor: true,
          message: 'Two-Factor Authentication (2FA) code is required'
        });
      }

      const is2faValid = verifyTotpCode(user.twoFactorSecret, twoFactorCode);
      if (!is2faValid) {
        await firestoreAdminService.recordFailedLogin(user.email);
        return errorResponse(res, 401, 'Invalid Two-Factor Authentication code');
      }
    }

    if (user.status === 'suspended') {
      return errorResponse(res, 403, 'Account has been suspended. Please contact support.');
    }

    // Clear failed login attempts on clean login
    await firestoreAdminService.clearAccountLockout(user.email);
    await firestoreAdminService.updateUser(user.uid, { lastLogin: new Date().toISOString() });

    const { passwordHash: _, resetPasswordToken: __, verificationToken: ___, twoFactorSecret: ____, ...sanitizedUser } = user;

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

    const { passwordHash: _, twoFactorSecret: __, ...sanitizedUser } = updatedUser;
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
    const genericResponseMsg = 'If an account with that email exists, a password reset link has been sent.';

    if (user && user.passwordHash) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      await firestoreAdminService.updateUser(user.uid, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; background: #09090b; color: #fff;">
          <h2 style="color: #e11d48;">SafeHaven Password Reset</h2>
          <p>Click the link below to reset your account password (expires in 1 hour):</p>
          <p><a href="${resetLink}" style="background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a></p>
        </div>
      `;

      await sendTransactionalEmail({
        to: user.email,
        subject: 'Reset Your SafeHaven Password',
        htmlContent: emailHtml
      });
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

    await firestoreAdminService.clearAccountLockout(user.email);

    return successResponse(res, 200, 'Password has been reset successfully! You can now log in with your new password.');
  } catch (error) {
    next(error);
  }
};

/**
 * 2FA (Two-Factor Authentication) Handlers
 */
export const generateTwoFactorSecret = async (req, res, next) => {
  try {
    const secretHex = crypto.randomBytes(20).toString('hex');
    await firestoreAdminService.updateUser(req.user.uid, { twoFactorTempSecret: secretHex });

    const otpauthUrl = `otpauth://totp/SafeHaven:${encodeURIComponent(req.user.email)}?secret=${secretHex}&issuer=SafeHaven`;

    return successResponse(res, 200, '2FA secret generated. Scan QR or enter secret into your authenticator app.', {
      secret: secretHex,
      otpauthUrl
    });
  } catch (error) {
    next(error);
  }
};

export const enableTwoFactor = async (req, res, next) => {
  try {
    const { twoFactorCode } = req.body;
    const user = await firestoreAdminService.getUserByUid(req.user.uid);

    if (!user || !user.twoFactorTempSecret) {
      return errorResponse(res, 400, 'Please generate 2FA secret first');
    }

    const isValid = verifyTotpCode(user.twoFactorTempSecret, twoFactorCode);
    if (!isValid) {
      return errorResponse(res, 400, 'Invalid 2FA verification code');
    }

    await firestoreAdminService.updateUser(req.user.uid, {
      isTwoFactorEnabled: true,
      twoFactorSecret: user.twoFactorTempSecret,
      twoFactorTempSecret: null
    });

    return successResponse(res, 200, 'Two-Factor Authentication (2FA) successfully enabled!');
  } catch (error) {
    next(error);
  }
};

export const disableTwoFactor = async (req, res, next) => {
  try {
    const { twoFactorCode } = req.body;
    const user = await firestoreAdminService.getUserByUid(req.user.uid);

    if (!user || !user.isTwoFactorEnabled) {
      return errorResponse(res, 400, '2FA is not enabled on this account');
    }

    const isValid = verifyTotpCode(user.twoFactorSecret, twoFactorCode);
    if (!isValid) {
      return errorResponse(res, 400, 'Invalid 2FA verification code');
    }

    await firestoreAdminService.updateUser(req.user.uid, {
      isTwoFactorEnabled: false,
      twoFactorSecret: null
    });

    return successResponse(res, 200, 'Two-Factor Authentication (2FA) disabled.');
  } catch (error) {
    next(error);
  }
};

export const cleanupUnverified = async (req, res, next) => {
  try {
    const count = await firestoreAdminService.cleanupUnverifiedAccounts();
    return successResponse(res, 200, `Purged ${count} expired unverified accounts`, { purgedCount: count });
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
    const { passwordHash: _, resetPasswordToken: __, verificationToken: ___, twoFactorSecret: ____, ...sanitizedUser } = user;
    return successResponse(res, 200, 'Profile retrieved', sanitizedUser);
  } catch (error) {
    next(error);
  }
};
