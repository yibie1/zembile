import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/UserService';
import { AuthenticatedRequest, ApiResponse, AppError, HttpStatus } from '@/types/common';
import { IUserCreate, IUserUpdate, IUserLogin } from '@/entities/User';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Register a new user
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: IUserCreate = req.body;
      
      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        throw new AppError(
          'Name, email, and password are required',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.userService.createUser(userData);
      
      const response: ApiResponse = {
        success: true,
        message: 'User registered successfully',
        data: result.data
      };

      res.status(result.statusCode || HttpStatus.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: IUserLogin = req.body;
      
      // Validate required fields
      if (!loginData.email || !loginData.password) {
        throw new AppError(
          'Email and password are required',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.userService.loginUser(loginData);
      
      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: result.data
      };

      res.status(result.statusCode || HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile
   */
  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(
          'User not authenticated',
          HttpStatus.UNAUTHORIZED
        );
      }

      const result = await this.userService.getUserById(req.user._id.toString());
      
      const response: ApiResponse = {
        success: true,
        message: 'Profile retrieved successfully',
        data: result.data
      };

      res.status(result.statusCode || HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user profile
   */
  updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(
          'User not authenticated',
          HttpStatus.UNAUTHORIZED
        );
      }

      const updateData: IUserUpdate = req.body;
      const result = await this.userService.updateUser(req.user._id.toString(), updateData);
      
      const response: ApiResponse = {
        success: true,
        message: 'Profile updated successfully',
        data: result.data
      };

      res.status(result.statusCode || HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user by ID (admin only)
   */
  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new AppError(
          'User ID is required',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.userService.getUserById(id);
      
      const response: ApiResponse = {
        success: true,
        message: 'User retrieved successfully',
        data: result.data
      };

      res.status(result.statusCode || HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all users (admin only)
   */
  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.userService.getAllUsers(page, limit);
      
      const response: ApiResponse = {
        success: true,
        message: 'Users retrieved successfully',
        data: result.data?.users,
        pagination: result.data?.pagination
      };

      res.status(result.statusCode || HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user (admin only)
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new AppError(
          'User ID is required',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.userService.deleteUser(id);
      
      const response: ApiResponse = {
        success: true,
        message: 'User deleted successfully'
      };

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}