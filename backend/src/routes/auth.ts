import express from 'express';
import { getJwtToken, checkAuthStatus } from '../api/auth';
import { verifyJWT } from '../middleware/authMiddleware';

const router = express.Router();

// POST /api/auth - Get JWT token using API key
router.post('/', getJwtToken);

// GET /api/auth/check - Check authentication status
router.get('/check', verifyJWT, checkAuthStatus);

export default router;