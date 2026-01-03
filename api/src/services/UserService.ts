import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser, IUserCreate, IUserUpdate, IUserLogin, IUserResponse } from '@/entities/User';
import { ServiceResponse, AppError, ErrorType, HttpStatus } from '@/types/common';
import { UserModel } from '@/models/User';

export class UserService {
  /**
   * Create a new user
   */
  async createUser(userData: IUserCreate): Promise<ServiceResponse<IUserResponse>> {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new AppError(
          'User with this email already exists',
          HttpStatus.CONFLICT,
          ErrorType.DUPLICATE_ERROR
        );
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = new UserModel({
        ...userData,
        password: hashedPassword,
        role: userData.role || 'customer',
        isEmailVerified: false,
        isActive: true
      });

      const savedUser = await user.save();
      const userResponse = this.formatUserResponse(savedUser);

      return {
        success: true,
        data: userResponse,
        statusCode: HttpStatus.CREATED
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorType.DATABASE_ERROR
      );
    }
  }

  /**
   * Authenticate user login
   */
  async loginUser(loginData: IUserLogin): Promise<ServiceResponse<{ user: IUserResponse; token: string }>> {
    try {
      // Find user by email
      const user = await UserModel.findOne({ email: loginData.email }).select('+password');
      if (!user) {
        throw new AppError(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
          ErrorType.AUTHENTICATION_ERROR
        );
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError(
          'Account is deactivated',
          HttpStatus.UNAUTHORIZED,
          ErrorType.AUTHENTICATION_ERROR
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        throw new AppError(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
          ErrorType.AUTHENTICATION_ERROR
        );
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = this.generateToken(user);
      const userResponse = this.formatUserResponse(user);

      return {
        success: true,
        data: { user: userResponse, token },
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Login failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorType.AUTHENTICATION_ERROR
      );
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<ServiceResponse<IUserResponse>> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new AppError(
          'User not found',
          HttpStatus.NOT_FOUND,
          ErrorType.NOT_FOUND_ERROR
        );
      }

      const userResponse = this.formatUserResponse(user);
      return {
        success: true,
        data: userResponse,
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to get user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorType.DATABASE_ERROR
      );
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, updateData: IUserUpdate): Promise<ServiceResponse<IUserResponse>> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new AppError(
          'User not found',
          HttpStatus.NOT_FOUND,
          ErrorType.NOT_FOUND_ERROR
        );
      }

      const userResponse = this.formatUserResponse(user);
      return {
        success: true,
        data: userResponse,
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorType.DATABASE_ERROR
      );
    }
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(userId: string): Promise<ServiceResponse<void>> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!user) {
        throw new AppError(
          'User not found',
          HttpStatus.NOT_FOUND,
          ErrorType.NOT_FOUND_ERROR
        );
      }

      return {
        success: true,
        statusCode: HttpStatus.NO_CONTENT
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorType.DATABASE_ERROR
      );
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(page: number = 1, limit: number = 10): Promise<ServiceResponse<{
    users: IUserResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> {
    try {
      const skip = (page - 1) * limit;
      const users = await UserModel.find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await UserModel.countDocuments({ isActive: true });
      const pages = Math.ceil(total / limit);

      const userResponses = users.map(user => this.formatUserResponse(user));

      return {
        success: true,
        data: {
          users: userResponses,
          pagination: { page, limit, total, pages }
        },
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      throw new AppError(
        'Failed to get users',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorType.DATABASE_ERROR
      );
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<ServiceResponse<IUserResponse>> {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new AppError(
          'JWT secret not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
          ErrorType.INTERNAL_SERVER_ERROR
        );
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      const user = await UserModel.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new AppError(
          'Invalid token',
          HttpStatus.UNAUTHORIZED,
          ErrorType.AUTHENTICATION_ERROR
        );
      }

      const userResponse = this.formatUserResponse(user);
      return {
        success: true,
        data: userResponse,
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Invalid token',
        HttpStatus.UNAUTHORIZED,
        ErrorType.AUTHENTICATION_ERROR
      );
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: IUser): string {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
      throw new AppError(
        'JWT secret not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorType.INTERNAL_SERVER_ERROR
      );
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    // Type assertion to work around @types/jsonwebtoken compatibility issues
    return (jwt.sign as any)(payload, jwtSecret, { expiresIn: jwtExpiresIn });
  }

  /**
   * Format user response (remove sensitive data)
   */
  private formatUserResponse(user: IUser): IUserResponse {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}