import { errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.message, err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return errorResponse(res, statusCode, err.message || 'Internal Server Error', process.env.NODE_ENV === 'development' ? err.stack : null);
};
