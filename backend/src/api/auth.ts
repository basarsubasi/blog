import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

// Interface to extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can define a more specific type based on your user structure
    }
  }
}

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

// Generate JWT token using composite secret
export const generateToken = (userId: string | number): string => {
  const compositeSecret = createCompositeSecret();
  return jwt.sign({ id: userId }, compositeSecret, {
    expiresIn: '6h',
  });
};

// Controller to get JWT token using API key authentication
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

// Controller to check authentication status
export const checkAuthStatus = (req: Request, res: Response): void => {
  res.json({ authenticated: true, user: req.user });
};
