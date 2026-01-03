import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorType, HttpStatus, ApiResponse, LogLevel } from '@/types/common';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let type = ErrorType.INTERNAL_SERVER_ERROR;

  // Log error
  console.error(`[${new Date().toISOString()}] ERROR:`, {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle custom AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    type = error.type;
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Validation error';
    type = ErrorType.VALIDATION_ERROR;
  }
  // Handle Mongoose cast errors (invalid ObjectId)
  else if (error.name === 'CastError') {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Invalid ID format';
    type = ErrorType.VALIDATION_ERROR;
  }
  // Handle Mongoose duplicate key errors
  else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = HttpStatus.CONFLICT;
    message = 'Duplicate entry';
    type = ErrorType.DUPLICATE_ERROR;
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = 'Invalid token';
    type = ErrorType.AUTHENTICATION_ERROR;
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = 'Token expired';
    type = ErrorType.AUTHENTICATION_ERROR;
  }
  // Handle multer errors (file upload)
  else if (error.name === 'MulterError') {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'File upload error';
    type = ErrorType.VALIDATION_ERROR;
  }

  // Prepare error response
  const errorResponse: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.message : message
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    (errorResponse as any).stack = error.stack;
    (errorResponse as any).type = type;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Handle 404 errors for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'Not Found'
  };

  res.status(HttpStatus.NOT_FOUND).json(response);
};

/**
 * Async error wrapper to catch async errors in route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation error formatter
 */
export const formatValidationErrors = (errors: any): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  if (errors.errors) {
    // Mongoose validation errors
    Object.keys(errors.errors).forEach(key => {
      formattedErrors[key] = errors.errors[key].message;
    });
  } else if (Array.isArray(errors)) {
    // Array of validation errors
    errors.forEach((error, index) => {
      formattedErrors[`field_${index}`] = error.message || error;
    });
  } else if (typeof errors === 'object') {
    // Object with field errors
    Object.keys(errors).forEach(key => {
      formattedErrors[key] = errors[key];
    });
  }

  return formattedErrors;
};