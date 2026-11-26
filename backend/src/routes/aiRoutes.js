import express from 'express';
import { handleAIChat, getAIStatus } from '../controllers/aiController.js';

const router = express.Router();

router.get('/status', getAIStatus);
router.post('/chat', handleAIChat);

export default router;
