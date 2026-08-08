import { errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`[${req.method} ${req.originalUrl}] Server Error:`, err.stack || err.message);

  const statusCode = (res.statusCode && res.statusCode !== 200) ? res.statusCode : 500;
  const clientMessage = (statusCode < 500 && err.message) ? err.message : 'Internal Server Error. Please try again.';

  return errorResponse(
    res,
    statusCode,
    clientMessage,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};
