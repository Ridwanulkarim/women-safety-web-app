import express from 'express';
import {
  getNotifications, markAsRead,
  getAnnouncements, createAnnouncement, deleteAnnouncement,
  getBlogs, getBlogById, createBlog, deleteBlog,
  getSafetyTips, createSafetyTip, deleteSafetyTip,
  getAnalytics, getAuditLogs
} from '../controllers/extraControllers.js';
import { blogValidation, tipValidation } from '../validators/schemaValidators.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { verifyAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

// NOTIFICATIONS
export const notificationRoutes = express.Router();
notificationRoutes.get('/', verifyAuth, getNotifications);
notificationRoutes.patch('/:id/read', verifyAuth, markAsRead);

// ANNOUNCEMENTS
export const announcementRoutes = express.Router();
announcementRoutes.get('/', getAnnouncements);
announcementRoutes.post('/', verifyAuth, requireAdmin, createAnnouncement);
announcementRoutes.delete('/:id', verifyAuth, requireAdmin, deleteAnnouncement);

// BLOGS
export const blogRoutes = express.Router();
blogRoutes.get('/', getBlogs);
blogRoutes.get('/:id', getBlogById);
blogRoutes.post('/', verifyAuth, requireAdmin, blogValidation, validateRequest, createBlog);
blogRoutes.delete('/:id', verifyAuth, requireAdmin, deleteBlog);

// SAFETY TIPS
export const tipRoutes = express.Router();
tipRoutes.get('/', getSafetyTips);
tipRoutes.post('/', verifyAuth, requireAdmin, tipValidation, validateRequest, createSafetyTip);
tipRoutes.delete('/:id', verifyAuth, requireAdmin, deleteSafetyTip);

// ANALYTICS & AUDIT LOGS
export const analyticsRoutes = express.Router();
analyticsRoutes.get('/dashboard', verifyAuth, requireAdmin, getAnalytics);
analyticsRoutes.get('/audit-logs', verifyAuth, requireAdmin, getAuditLogs);
