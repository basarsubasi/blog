import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../database/connection';
import { markdownToHtml } from '../utils/markdownToHtml';
import { verifyJWT } from '../middleware/authMiddleware';
import slugify from 'slugify';

const router = express.Router();

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,      // Convert to lowercase
    strict: true,     // Strip special characters except replacement
    remove: /[*+~.()'"!:@]/g,  // Remove specific characters
    locale:"tr",
    trim: true
  });
}

/**
 * POST /api/blogposts
 * Create a new blog post (protected route)
 * Body: { title, author, category, content_markdown }
 */
router.post('/', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, category, content_markdown } = req.body;

    // Validation
    if (!title || !author || !category || !content_markdown) {
      res.status(400).json({
        error: 'Missing required fields: title, author, category, content_markdown'
      });
      return;
    }

    // Generate HTML from markdown
    const content_html = markdownToHtml(content_markdown);
    
    // Generate unique identifiers
    const uuid = uuidv4();
    const slug = generateSlug(title);
    const date_posted = new Date();

    // Insert into database
    const query = `
      INSERT INTO blogposts 
      (uuid, title, author, category, date_posted, slug, content_markdown, content_html)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const conn = await pool.getConnection();
    try {
      const result = await conn.query(query, [
        uuid,
        title,
        author,
        category,
        date_posted,
        slug,
        content_markdown,
        content_html
      ]);

      res.status(201).json({
        message: 'Blog post created successfully',
        post: {
          uuid,
          title,
          author,
          category,
          date_posted,
          slug,
          content_markdown,
          content_html
        }
      });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    
    // Handle duplicate entries
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        error: 'A blog post with this title or content already exists'
      });
      return;
    }
    
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

/**
 * GET /api/blogposts
 * Get all blog posts (returns pre-rendered HTML)
 * Query params: ?limit=10&offset=0&category=tech
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const category = req.query.category as string;

    let query = `
      SELECT uuid, title, author, category, date_posted, slug, 
             content_html, created_at, updated_at
      FROM blogposts
    `;

    const params: any[] = [];

    if (category) {
      query += ` WHERE category = ?`;
      params.push(category);
    }

    query += ` ORDER BY date_posted DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(query, params);
      res.json({
        posts: rows,
        limit,
        offset
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

/**
 * GET /api/blogposts/search
 * Search blog posts with pagination using full-text search
 * Query params: ?q=searchTerm&limit=10&offset=0
 */
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const searchTerm = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!searchTerm) {
      res.status(400).json({ error: 'Search query parameter "q" is required' });
      return;
    }

    // Use full-text search with MATCH AGAINST for better performance
    // BOOLEAN MODE works better for Turkish and allows wildcard searches
    const query = `
      SELECT uuid, title, author, category, date_posted, slug, 
             content_html, created_at, updated_at,
             MATCH(title, content_markdown) AGAINST (? IN BOOLEAN MODE) as relevance
      FROM blogposts
      WHERE MATCH(title, content_markdown) AGAINST (? IN BOOLEAN MODE)
      ORDER BY relevance DESC
      LIMIT ? OFFSET ?
    `;

    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(query, [
        searchTerm,
        searchTerm,
        limit,
        offset
      ]);

      res.json({
        posts: rows,
        searchTerm,
        limit,
        offset,
        count: Array.isArray(rows) ? rows.length : 0
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error searching blog posts:', error);
    res.status(500).json({ error: 'Failed to search blog posts' });
  }
});

/**
 * GET /api/blogposts/:slug
 * Get a single blog post by slug (returns pre-rendered HTML)
 */
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const query = `
      SELECT uuid, title, author, category, date_posted, slug,
             content_html, created_at, updated_at
      FROM blogposts
      WHERE slug = ?
    `;

    const conn = await pool.getConnection();
    try {
      const rows: any[] = await conn.query(query, [slug]);

      if (rows.length === 0) {
        res.status(404).json({ error: 'Blog post not found' });
        return;
      }

      res.json(rows[0]);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

/**
 * PUT /api/blogposts/:uuid
 * Update a blog post (protected route)
 * Body: { title?, author?, category?, content_markdown? }
 */
router.put('/:uuid', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid } = req.params;
    const { title, author, category, content_markdown } = req.body;

    // Build dynamic update query
    const updates: string[] = [];
    const params: any[] = [];

    if (title) {
      updates.push('title = ?');
      params.push(title);
      updates.push('slug = ?');
      params.push(generateSlug(title));
    }
    if (author) {
      updates.push('author = ?');
      params.push(author);
    }
    if (category) {
      updates.push('category = ?');
      params.push(category);
    }
    if (content_markdown) {
      updates.push('content_markdown = ?');
      params.push(content_markdown);
      updates.push('content_html = ?');
      params.push(markdownToHtml(content_markdown));
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    params.push(uuid);

    const query = `
      UPDATE blogposts
      SET ${updates.join(', ')}
      WHERE uuid = ?
    `;

    const conn = await pool.getConnection();
    try {
      const result: any = await conn.query(query, params);

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Blog post not found' });
        return;
      }

      res.json({ message: 'Blog post updated successfully' });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        error: 'A blog post with this title or content already exists'
      });
      return;
    }
    
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

/**
 * DELETE /api/blogposts/:uuid
 * Delete a blog post (protected route)
 */
router.delete('/:uuid', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid } = req.params;

    const query = 'DELETE FROM blogposts WHERE uuid = ?';

    const conn = await pool.getConnection();
    try {
      const result: any = await conn.query(query, [uuid]);

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Blog post not found' });
        return;
      }

      res.json({ message: 'Blog post deleted successfully' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

export default router;
