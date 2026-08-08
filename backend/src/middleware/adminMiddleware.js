import { errorResponse } from '../utils/apiResponse.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return errorResponse(res, 403, 'Forbidden: Admin access required');
  }

  // Security Policy Enforcement: Mandatory 2FA for Administrator Accounts
  if (!req.user.isTwoFactorEnabled) {
    return res.status(403).json({
      success: false,
      requiresAdmin2faSetup: true,
      message: 'Security Policy Violation: Administrator accounts are strictly required to have Two-Factor Authentication (2FA) enabled.'
    });
  }

  next();
};
