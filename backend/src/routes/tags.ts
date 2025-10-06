import express from 'express';
import {
  getAllTags,
  getBlogPostsByTag
} from '../api/tags';

const router = express.Router();

/**
 * GET /api/tags
 * Get all tags
 * Query params: ?limit=100&offset=0
 */
router.get('/', getAllTags);

/**
 * GET /api/tags/:tagName/posts
 * Get blog posts by tag name
 * Query params: ?limit=10&offset=0
 */
router.get('/:tagName/posts', getBlogPostsByTag);



export default router;
