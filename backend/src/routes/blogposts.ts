import express from 'express';
import { verifyJWT } from '../middleware/authMiddleware';
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostsByCategory,
  searchBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost
} from '../api/blogposts';

const router = express.Router();

/**
 * POST /api/blogposts
 * Create a new blog post (protected route)
 * Body: { title, author, category, content_markdown }
 */
router.post('/', verifyJWT, createBlogPost);

/**
 * GET /api/blogposts
 * Get all blog posts (returns pre-rendered HTML)
 * Query params: ?limit=10&offset=0&category=tech
 */
router.get('/', getAllBlogPosts);

/**
 * GET /api/blogposts/category/:category
 * Get blog posts by category
 * Query params: ?limit=10&offset=0
 */
router.get('/category/:category', getBlogPostsByCategory);

/**
 * GET /api/blogposts/search
 * Search blog posts with pagination using full-text search
 * Query params: ?q=searchTerm&limit=10&offset=0
 */
router.get('/search', searchBlogPosts);

/**
 * GET /api/blogposts/:slug
 * Get a single blog post by slug (returns pre-rendered HTML)
 */
router.get('/:slug', getBlogPostBySlug);

/**
 * PUT /api/blogposts/:uuid
 * Update a blog post (protected route)
 * Body: { title?, author?, category?, content_markdown? }
 */
router.put('/:uuid', verifyJWT, updateBlogPost);

/**
 * DELETE /api/blogposts/:uuid
 * Delete a blog post (protected route)
 */
router.delete('/:uuid', verifyJWT, deleteBlogPost);

export default router;
