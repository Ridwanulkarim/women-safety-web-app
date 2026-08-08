import express from 'express';
import { register, login, getMe, forgotPassword, resetPassword, verifyEmail } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../validators/authValidator.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { verifyAuth } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authRateLimiter, registerValidation, validateRequest, register);
router.post('/login', authRateLimiter, loginValidation, validateRequest, login);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);
router.post('/verify-email', verifyEmail);
router.get('/me', verifyAuth, getMe);

export default router;
