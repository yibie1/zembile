import { Response, NextFunction } from 'express';
import { UserService } from '@/services/UserService';
import { AuthenticatedRequest, AppError, ErrorType, HttpStatus } from '@/types/common';

const userService = new UserService();

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Access token is required',
        HttpStatus.UNAUTHORIZED,
        ErrorType.AUTHENTICATION_ERROR
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      throw new AppError(
        'Access token is required',
        HttpStatus.UNAUTHORIZED,
        ErrorType.AUTHENTICATION_ERROR
      );
    }

    // Verify token and get user
    const result = await userService.verifyToken(token);
    
    if (!result.success || !result.data) {
      throw new AppError(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
        ErrorType.AUTHENTICATION_ERROR
      );
    }

    // Attach user to request
    req.user = result.data as any;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authorize specific roles
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError(
          'Authentication required',
          HttpStatus.UNAUTHORIZED,
          ErrorType.AUTHENTICATION_ERROR
        );
      }

      if (!roles.includes(req.user.role)) {
        throw new AppError(
          'Insufficient permissions',
          HttpStatus.FORBIDDEN,
          ErrorType.AUTHORIZATION_ERROR
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user owns the resource or is admin
 */
export const authorizeOwnerOrAdmin = (userIdParam: string = 'id') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError(
          'Authentication required',
          HttpStatus.UNAUTHORIZED,
          ErrorType.AUTHENTICATION_ERROR
        );
      }

      const resourceUserId = req.params[userIdParam];
      const currentUserId = req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isAdmin && resourceUserId !== currentUserId) {
        throw new AppError(
          'Access denied',
          HttpStatus.FORBIDDEN,
          ErrorType.AUTHORIZATION_ERROR
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Optional authentication middleware (doesn't throw error if no token)
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (token) {
        try {
          const result = await userService.verifyToken(token);
          if (result.success && result.data) {
            req.user = result.data as any;
          }
        } catch (error) {
          // Ignore token errors in optional auth
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};