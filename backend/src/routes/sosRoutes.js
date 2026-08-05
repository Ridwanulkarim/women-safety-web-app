import express from 'express';
import { triggerSOS, getSOSHistory, getAllSOSAlerts, updateSOSStatus } from '../controllers/sosController.js';
import { sosValidation } from '../validators/schemaValidators.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { verifyAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { sosRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', verifyAuth, sosRateLimiter, sosValidation, validateRequest, triggerSOS);
router.get('/history', verifyAuth, getSOSHistory);
router.get('/all', verifyAuth, requireAdmin, getAllSOSAlerts);
router.patch('/:id/status', verifyAuth, requireAdmin, updateSOSStatus);

export default router;
