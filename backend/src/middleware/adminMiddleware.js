import { errorResponse } from '../utils/apiResponse.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return errorResponse(res, 403, 'Forbidden: Admin access required');
  }
  next();
};
