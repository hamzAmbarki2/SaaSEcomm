export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
// Not found error
export class NotFoundError extends AppError {
  constructor() {
    super("Resources not found", 404, true);
  }
}

// validation Error (use for Joi/zod/react-hook-form validation errors)
export class ValidationError extends AppError {
  constructor(details?: any) {
    super("Invalid request data", 400, true, details);
  }
}

// Authentication Error (e.g., invalid credentials, expired token)
export class AuthenticationError extends AppError {
  constructor(message?: string, details?: any) {
    super(message = "Authentication failed", 401, true, details);
  }
}

// Forbidden Error (insufficient permissions)
export class ForbiddenError extends AppError {
  constructor(message?: string, details?: any) {
    super(message = "Insufficient permissions", 403, true, details);
  }
}

// Database Error (for MongoDB/PostgreSQL errors)
export class DatabaseError extends AppError {
  constructor(message?: string, details?: any) {
    super(message = "Database operation failed", 500, false, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message?: string, details?: any) {
    super(message = "Too many requests, please try again later", 429, false, details);
  }
}
