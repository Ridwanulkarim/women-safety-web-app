import express from 'express';
import { getAllUsers, getUserByUid, updateUser, updateUserStatus, deleteUser } from '../controllers/userController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', verifyAuth, requireAdmin, getAllUsers);
router.get('/:uid', verifyAuth, getUserByUid);
router.put('/:uid', verifyAuth, updateUser);
router.patch('/:uid/status', verifyAuth, requireAdmin, updateUserStatus);
router.delete('/:uid', verifyAuth, requireAdmin, deleteUser);

export default router;
