class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 1. Validation Errors
class ValidationError extends AppError {
  constructor(errors) {
    super('Validation failed', 400);
    this.errors = errors; // Holds specific express-validator errors
  }
}

// 2. Database Errors
class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500);
  }
}

// 3. Authentication Errors
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

// 4. API Errors
class ApiError extends AppError {
  constructor(message = 'API error occurred', statusCode = 400) {
    super(message, statusCode);
  }
}

// 5. Logging Errors
class LoggingError extends AppError {
  constructor(message = 'Logging system error') {
    super(message, 500);
  }
}

// 6. Performance Errors
class PerformanceError extends AppError {
  constructor(message = 'Performance threshold exceeded') {
    super(message, 500);
  }
}

// 7. Third-Party Integration Errors
class ThirdPartyIntegrationError extends AppError {
  constructor(message = 'Third-party service error') {
    super(message, 502);
  }
}

// 8. Custom Business Logic Errors
class CustomBusinessError extends AppError {
  constructor(message = 'Business rule violation') {
    super(message, 422);
  }
}

// Keep standard HTTP helpers for compatibility
class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

module.exports = {
  AppError,
  ValidationError,
  DatabaseError,
  AuthenticationError,
  ApiError,
  LoggingError,
  PerformanceError,
  ThirdPartyIntegrationError,
  CustomBusinessError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
};
