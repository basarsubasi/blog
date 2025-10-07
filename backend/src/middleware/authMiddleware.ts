// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

// Get environment variables
const BLOG_BACKEND_JWT_SECRET = process.env.BLOG_BACKEND_JWT_SECRET || ""
const BLOG_BACKEND_API_KEY = process.env.BLOG_BACKEND_API_KEY || ""

// Validate environment variables
if (!process.env.BLOG_BACKEND_JWT_SECRET || BLOG_BACKEND_JWT_SECRET=="") {
  throw new Error('JWT_SECRET environment variable is not set.');
}

if (!process.env.BLOG_BACKEND_API_KEY || BLOG_BACKEND_JWT_SECRET=="") {
  throw new Error('API_KEY environment variable is not set.');
}

// Create composite secret from API key and JWT secret
const createCompositeSecret = (): string => {
  return crypto.createHash('sha256').update(BLOG_BACKEND_API_KEY + BLOG_BACKEND_JWT_SECRET).digest('hex');
};

// Extend the Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can define a more specific type based on your user structure
    }
  }
}

// Middleware to verify JWT token
export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    
    // Extract token from Bearer format
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Invalid token format' });
      return;
    }
    
    // Verify the token using composite secret from API key and JWT secret
    const compositeSecret = createCompositeSecret();
    const decoded = jwt.verify(token, compositeSecret);
    
    // Add user info to request object
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else {
      console.error('Error verifying token:', error);
      res.status(500).json({ message: 'Failed to authenticate token' });
    }
  }
};