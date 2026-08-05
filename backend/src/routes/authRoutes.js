import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../validators/authValidator.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/me', verifyAuth, getMe);

export default router;
