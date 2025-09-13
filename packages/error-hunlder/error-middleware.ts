// error-middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from './index';

/**
 * Global error handling middleware for Express apps.
 * Handles AppError and subclasses with consistent JSON responses.
 * Logs system errors and responds with generic message for security.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If it's an AppError (or subclass), respond with specific status and details if operational
  if (err instanceof AppError) {
    const response: { success: boolean; message: string; details?: any; } = {
      success: false,
      message: err.message,
    };

    // Include details only for operational errors (user-facing)
    if (err.isOperational && err.details) {
      response['details'] = err.details;
    }

    res.status(err.statusCode).json(response);
  } else {
    // For unhandled errors (e.g., generic Error, async errors), log and respond generically
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};