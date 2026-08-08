import axios from 'axios';
import { errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Cloudflare Turnstile / Google reCAPTCHA Verification Middleware
 */
export const verifyCaptcha = async (req, res, next) => {
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const captchaToken = req.body.captchaToken || req.headers['cf-turnstile-response'] || req.headers['g-recaptcha-response'];

  if (turnstileSecret) {
    if (!captchaToken) {
      return errorResponse(res, 400, 'CAPTCHA verification token is required');
    }
    try {
      const formData = new URLSearchParams();
      formData.append('secret', turnstileSecret);
      formData.append('response', captchaToken);
      formData.append('remoteip', req.ip);

      const verificationRes = await axios.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        formData.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (!verificationRes.data?.success) {
        logger.warn(`Cloudflare Turnstile verification failed for IP ${req.ip}`);
        return errorResponse(res, 400, 'CAPTCHA verification failed. Please try again.');
      }
      return next();
    } catch (err) {
      logger.error('Cloudflare Turnstile verification error:', err.message);
      return errorResponse(res, 500, 'CAPTCHA verification service error');
    }
  } else if (recaptchaSecret) {
    if (!captchaToken) {
      return errorResponse(res, 400, 'CAPTCHA verification token is required');
    }
    try {
      const verificationRes = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}&remoteip=${req.ip}`
      );
      if (!verificationRes.data?.success) {
        logger.warn(`Google reCAPTCHA verification failed for IP ${req.ip}`);
        return errorResponse(res, 400, 'CAPTCHA verification failed. Please try again.');
      }
      return next();
    } catch (err) {
      logger.error('Google reCAPTCHA verification error:', err.message);
      return errorResponse(res, 500, 'CAPTCHA verification service error');
    }
  }

  // Development / Non-keys mode: Log verification check
  if (process.env.NODE_ENV === 'production') {
    logger.warn('Production warning: TURNSTILE_SECRET_KEY / RECAPTCHA_SECRET_KEY not defined for bot protection.');
  }
  next();
};
