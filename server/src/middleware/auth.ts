import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User.js';

// Extract error classes from jwt
const { JsonWebTokenError, TokenExpiredError } = jwt;

export interface AuthRequest extends Request {
  userId?: string;
  user?: IUser;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from multiple sources
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : req.cookies?.token;

    // No token provided
    if (!token) {
      res.status(401).json({ 
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN' 
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    // Validate decoded token structure
    if (!decoded.userId) {
      res.status(401).json({ 
        message: 'Invalid token structure',
        code: 'INVALID_TOKEN_STRUCTURE' 
      });
      return;
    }

    // Fetch user from database
    const user = await User.findById(decoded.userId).select('-password');

    // User not found or deleted
    if (!user) {
      res.status(401).json({ 
        message: 'User not found. Token invalid.',
        code: 'USER_NOT_FOUND' 
      });
      return;
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.user = user;

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ 
        message: 'Token has expired. Please login again.',
        code: 'TOKEN_EXPIRED' 
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ 
        message: 'Invalid token. Authentication failed.',
        code: 'INVALID_TOKEN' 
      });
      return;
    }

    // Generic error
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Internal server error during authentication',
      code: 'SERVER_ERROR' 
    });
  }
};

// Optional: Middleware to check if user is admin
export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optional: Middleware for optional authentication
export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : req.cookies?.token;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user) {
          req.userId = decoded.userId;
          req.user = user;
        }
      } catch (error) {
        console.log('Optional auth failed, continuing without user');
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};
