import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import corsMiddleware from './src/config/corsConfig.js';
import { apiRateLimiter } from './src/middleware/rateLimiter.js';
import { errorHandler } from './src/middleware/errorHandler.js';

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

// Security & Parsing Middlewares
app.use(helmet());
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Rate limiting
app.use('/api', apiRateLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Women Safety Web Application API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/safety-tips', tipRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Women Safety Backend Server listening on http://0.0.0.0:${PORT}`);
  });
}

export default app;
