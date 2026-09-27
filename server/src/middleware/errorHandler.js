const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (err.name === 'ValidationError') statusCode = 400;
  if (err.name === 'CastError') statusCode = 400;
  if (err.code === 11000) statusCode = 409; // Duplicate key

  // Developer logging
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
    statusCode,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  // User-facing sanitized response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred while processing your request.',
    errorType: err.name || 'InternalServerError',
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
