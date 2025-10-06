import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment variables for authentication
const BLOG_BACKEND_API_KEY = process.env.BLOG_BACKEND_API_KEY || ""
const BLOG_BACKEND_JWT_SECRET = process.env.BLOG_BACKEND_JWT_SECRET || ""

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

// Interface to extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can define a more specific type based on your user structure
    }
  }
}

// Generate JWT token using composite secret
export const generateToken = (userId: string | number): string => {
  const compositeSecret = createCompositeSecret();
  return jwt.sign({ id: userId }, compositeSecret, {
    expiresIn: '6h',
  });
};

// Middleware to get JWT token using API key authentication
export const getJwtToken = (req: Request, res: Response): void => {
  try {
    // Get API key from request header
    const clientProvidedApiKey = req.headers['x-api-key'] as string;
    
    // Check if API key is provided
    if (!clientProvidedApiKey) {
      res.status(401).json({ error: 'API key is required' });
      return;
    }
    
    // Verify API key
    if (clientProvidedApiKey !== BLOG_BACKEND_API_KEY) {
      res.status(401).json({ error: 'Invalid API key' });
      return;
    }
    
    // If API key is valid, generate JWT token
    const token = generateToken('admin-user');
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};

// Middleware to verify API key
export const verifyApiKey = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get API key from request header
    const clientProvidedApiKey = req.headers['x-api-key'] as string;
    
    // Check if API key is provided
    if (!clientProvidedApiKey) {
      res.status(401).json({ error: 'API key is required' });
      return;
    }
    
    // Verify API key
    if (clientProvidedApiKey !== BLOG_BACKEND_API_KEY) {
      res.status(401).json({ error: 'Invalid API key' });
      return;
    }
    
    // If API key is valid, proceed to the next middleware
    next();
  } catch (error) {
    console.error('Error verifying API key:', error);
    res.status(500).json({ error: 'Failed to authenticate API key' });
  }
};

// Middleware to verify JWT token
export const verifyJwt = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    
    // Extract token from Bearer format
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ error: 'Invalid token format' });
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
      res.status(401).json({ error: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
    } else {
      console.error('Error verifying token:', error);
      res.status(500).json({ error: 'Failed to authenticate token' });
    }
  }
};