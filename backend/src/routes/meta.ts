import express, { Request, Response } from 'express';
import pool from '../database/connection';

const router = express.Router();

interface BlogPost {
  uuid: string;
  title: string;
  author: string;
  category: string;
  date_posted: Date;
  slug: string;
  content_markdown: string;
  content_html: string;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Helper function to detect if the request is from a crawler/bot
 */
function isCrawler(userAgent: string): boolean {
  const crawlerPatterns = [
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'LinkedInBot',
    'Slackbot',
    'TelegramBot',
    'WhatsApp',
    'SkypeUriPreview',
    'Discordbot',
    'curl',
    'wget',
    'python-requests',
  ];
  
  const ua = userAgent.toLowerCase();
  return crawlerPatterns.some(pattern => ua.includes(pattern.toLowerCase()));
}

/**
 * Serve pre-rendered HTML for blog posts to crawlers
 * GET /meta/posts/:slug
 */
router.get('/posts/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const userAgent = req.headers['user-agent'] || '';

    // Check if this is a crawler
    if (!isCrawler(userAgent)) {
      res.status(400).json({ error: 'This endpoint is for crawlers only' });
      return;
    }

    // Fetch the blog post
    const query = 'SELECT * FROM blogposts WHERE slug = ?';
    const rows = await pool.query(query, [slug]) as BlogPost[];

    if (!rows || rows.length === 0) {
      res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Post Not Found</title>
        </head>
        <body>
          <h1>Post Not Found</h1>
        </body>
        </html>
      `);
      return;
    }

    const post = rows[0];

    // Generate HTML with proper meta tags
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${escapeHtml(post.title)}</title>
  <meta name="title" content="${escapeHtml(post.title)}">
  <meta name="description" content="${escapeHtml(post.content_html.substring(0, 150))}...">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://blog.basarsubasi.com.tr/posts/${escapeHtml(post.slug)}">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(post.content_html.substring(0, 150))}...">
  <meta property="og:site_name" content="basarsubasi's blog">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary">
  <meta property="twitter:url" content="https://blog.basarsubasi.com.tr/posts/${escapeHtml(post.slug)}">
  <meta property="twitter:title" content="${escapeHtml(post.title)}">
  <meta property="twitter:description" content="${escapeHtml(post.content_html.substring(0, 150))}..."> 
</head>
</html>
    `;

    res.type('text/html');
    res.send(html);
  } catch (error) {
    console.error('Error serving meta page:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
      </head>
      <body>
        <h1>Error loading post</h1>
      </body>
      </html>
    `);
  }
});

/**
 * Helper function to escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

export default router;
