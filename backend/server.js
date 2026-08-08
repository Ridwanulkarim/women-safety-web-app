import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import corsMiddleware from './src/config/corsConfig.js';
import { apiRateLimiter } from './src/middleware/rateLimiter.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { checkNotificationConfig } from './src/services/notificationService.js';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import sosRoutes from './src/routes/sosRoutes.js';
import {
  notificationRoutes,
  announcementRoutes,
  blogRoutes,
  tipRoutes,
  analyticsRoutes
} from './src/routes/extraRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Run startup configuration audit for notification providers
checkNotificationConfig();

// Security & Parsing Middlewares
app.use(helmet());
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Rate limiting
app.use('/api', apiRateLimiter);

// Health check endpoints
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Women Safety Web Application API',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes with both /api prefix and root prefix to support Vercel rewrites seamlessly
const registerRoutes = (prefix = '') => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/contacts`, contactRoutes);
  app.use(`${prefix}/sos`, sosRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
  app.use(`${prefix}/announcements`, announcementRoutes);
  app.use(`${prefix}/blogs`, blogRoutes);
  app.use(`${prefix}/safety-tips`, tipRoutes);
  app.use(`${prefix}/analytics`, analyticsRoutes);
};

registerRoutes('/api');
registerRoutes('');

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Women Safety Backend Server listening on http://0.0.0.0:${PORT}`);
  });
}

export default app;
