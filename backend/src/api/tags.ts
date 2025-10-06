import { Request, Response } from 'express';
import pool from '../database/connection';

/**
 * Get all tags
 * Query params: ?limit=100&offset=0
 */
export const getAllTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const query = `
      SELECT uuid, name
      FROM tags
      ORDER BY name ASC
      LIMIT ? OFFSET ?
    `;

    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(query, [limit, offset]);
      res.json({
        tags: rows,
        limit,
        offset
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

/**
 * Get blog posts by tag
 * Query params: ?limit=10&offset=0
 */
export const getBlogPostsByTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tagName } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const query = `
      SELECT b.uuid, b.title, b.author, b.category, b.date_posted, b.slug,
             b.content_html, b.created_at, b.updated_at
      FROM blogposts b
      INNER JOIN blogpost_tags bt ON b.uuid = bt.blogpost_uuid
      INNER JOIN tags t ON bt.tag_uuid = t.uuid
      WHERE t.name = ?
      ORDER BY b.date_posted DESC
      LIMIT ? OFFSET ?
    `;

    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(query, [tagName, limit, offset]);
      res.json({
        posts: rows,
        tag: tagName,
        limit,
        offset
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error fetching blog posts by tag:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts by tag' });
  }
};

/**
 * Create or get existing tag by name
 * Helper function used internally
 */
export async function getOrCreateTag(conn: any, tagName: string): Promise<string> {
  // Import uuid at the top of function scope
  const { v4: uuidv4 } = require('uuid');
  
  // Normalize tag name (trim and lowercase)
  const normalizedTag = tagName.trim().toLowerCase();

  // Try to get existing tag
  const existingTags: any[] = await conn.query(
    'SELECT uuid FROM tags WHERE name = ?',
    [normalizedTag]
  );

  if (existingTags.length > 0) {
    return existingTags[0].uuid;
  }

  // Create new tag with UUID
  const tagUuid = uuidv4();
  await conn.query(
    'INSERT INTO tags (uuid, name) VALUES (?, ?)',
    [tagUuid, normalizedTag]
  );

  return tagUuid;
}

/**
 * Add tags to a blog post
 * Helper function used internally
 */
export async function addTagsToBlogPost(conn: any, blogpostUuid: string, tags: string[]): Promise<void> {
  if (!tags || tags.length === 0) return;

  // Get or create tag UUIDs
  const tagUuids: string[] = [];
  for (const tagName of tags) {
    const tagUuid = await getOrCreateTag(conn, tagName);
    tagUuids.push(tagUuid);
  }

  // Insert into blogpost_tags (ignore duplicates)
  for (const tagUuid of tagUuids) {
    await conn.query(
      'INSERT IGNORE INTO blogpost_tags (blogpost_uuid, tag_uuid) VALUES (?, ?)',
      [blogpostUuid, tagUuid]
    );
  }
}

/**
 * Remove all tags from a blog post and optionally add new ones
 * Helper function used internally
 */
export async function updateBlogPostTags(conn: any, blogpostUuid: string, tags: string[]): Promise<void> {
  // Remove existing tags
  await conn.query(
    'DELETE FROM blogpost_tags WHERE blogpost_uuid = ?',
    [blogpostUuid]
  );

  // Add new tags
  await addTagsToBlogPost(conn, blogpostUuid, tags);
}
