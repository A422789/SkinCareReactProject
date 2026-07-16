const { AppError, ValidationError } = require('../utils/customErrors');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;
  let errors = undefined;

  // Log the error using winston
  logger.error(err.message, { stack: err.stack });

  if (err instanceof AppError) {
    // Operational expected error
    if (err instanceof ValidationError) {
      errors = err.errors;
    }
  } else {
    // Programming or generic unexpected error
    if (process.env.NODE_ENV === 'production') {
      statusCode = 500;
      message = 'Internal Server Error';
    }
  }

  res.status(statusCode).json({
    message,
    ...(errors && { errors }),
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
