import pool from '../database/connection';
import dotenv from 'dotenv'


dotenv.config({ path: '../../.env' });

// Cache for RSS feeds - main feed and category-specific feeds
const rssFeedCache: Map<string, string> = new Map();

/**
 * Generate RSS 2.0 feed from blog posts
 * @param category - Optional category filter
 */
export async function generateRssFeed(category?: string): Promise<string> {
  const conn = await pool.getConnection();
  try {
    // Get the 10 most recent blog posts (optionally filtered by category)
    let query = `
      SELECT uuid, title, author, category, date_posted, slug, content_html, updated_at
      FROM blogposts
    `;
    const params: any[] = [];
    
    if (category) {
      query += ` WHERE category = ?`;
      params.push(category);
    }
    
    query += `
      ORDER BY date_posted DESC
      LIMIT 10
    `;

    const posts: any[] = await conn.query(query, params);

    // Get tags for each post
    for (const post of posts) {
      const tagRows: any[] = await conn.query(`
        SELECT t.name
        FROM tags t
        INNER JOIN blogpost_tags bt ON t.uuid = bt.tag_uuid
        WHERE bt.blogpost_uuid = ?
        ORDER BY t.name ASC
      `, [post.uuid]);
      post.tags = tagRows.map(row => row.name);
    }

    // Build RSS feed
    const baseUrl = 'http://localhost:5173';
    const currentDate = new Date().toUTCString();
    const blogTitle = "basarsubasi's blog";
    const blogDescription = "Son Yazılar";
    
    const feedTitle = category ? `${blogTitle} - ${category}` : blogTitle;
    const feedDescription = category ? `${blogDescription} - ${category}` : blogDescription;
    const feedUrl = category ? `${baseUrl}/rss/${category}.xml` : `${baseUrl}/rss.xml`;
    
    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>tr</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
`;

    // Add each post as an item
    for (const post of posts) {
      const postUrl = `${baseUrl}/posts/${post.slug}`;
      const pubDate = new Date(post.date_posted).toUTCString();
      const categories = post.tags.map((tag: string) => 
        `    <category>${escapeXml(tag)}</category>`
      ).join('\n');

      rss += `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author)}</author>
${categories}
      <content:encoded><![CDATA[${post.content_html}]]></content:encoded>
      <description><![CDATA[${post.content_html}]]></description>
    </item>`;
    }

    rss += `
  </channel>
</rss>`;

    // Cache the feed
    const cacheKey = category || 'main';
    rssFeedCache.set(cacheKey, rss);
    
    return rss;
  } finally {
    conn.release();
  }
}

/**
 * Get the cached RSS feed or generate a new one if cache is empty
 * @param category - Optional category filter
 */
export async function getCachedRssFeed(category?: string): Promise<string> {
  const cacheKey = category || 'main';
  
  if (!rssFeedCache.has(cacheKey)) {
    await generateRssFeed(category);
  }
  
  return rssFeedCache.get(cacheKey) || '';
}

/**
 * Regenerate all RSS feeds (main and all categories)
 */
export async function regenerateAllRssFeeds(): Promise<void> {
  const conn = await pool.getConnection();
  try {
    // Regenerate main feed
    await generateRssFeed();
    
    // Get all unique categories
    const categories: any[] = await conn.query(`
      SELECT DISTINCT category
      FROM blogposts
      ORDER BY category
    `);
    
    // Regenerate feed for each category
    for (const row of categories) {
      await generateRssFeed(row.category);
    }
    
    console.log('RSS feeds regenerated (main + categories)');
  } finally {
    conn.release();
  }
}

/**
 * Escape special XML characters
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
