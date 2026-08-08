import express from 'express';
import {
  register, login, getMe, forgotPassword, resetPassword, verifyEmail,
  generateTwoFactorSecret, enableTwoFactor, disableTwoFactor, cleanupUnverified
} from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../validators/authValidator.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { verifyAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { verifyCaptcha } from '../middleware/captchaMiddleware.js';

const router = express.Router();

router.post('/register', authRateLimiter, verifyCaptcha, registerValidation, validateRequest, register);
router.post('/login', authRateLimiter, verifyCaptcha, loginValidation, validateRequest, login);
router.post('/forgot-password', authRateLimiter, verifyCaptcha, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);
router.post('/verify-email', authRateLimiter, verifyEmail);

// 2FA Endpoints
router.post('/2fa/generate', verifyAuth, generateTwoFactorSecret);
router.post('/2fa/enable', verifyAuth, enableTwoFactor);
router.post('/2fa/disable', verifyAuth, disableTwoFactor);

// Maintenance Endpoint (Admin only)
router.post('/cleanup-unverified', verifyAuth, requireAdmin, cleanupUnverified);

router.get('/me', verifyAuth, getMe);

export default router;
