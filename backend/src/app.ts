import express from 'express';
import dotenv from 'dotenv';
import initializeDatabase from './database/init-db';
import cors from 'cors';
import authRouter from './routes/auth';
import blogpostsRouter from './routes/blogposts';
import tagsRouter from './routes/tags';
import { getCachedRssFeed, regenerateAllRssFeeds } from './utils/rssGenerator';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*', // Allow all origins
  methods: '*',
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'Origin', 'X-Requested-With', 'X-Api-Key']
}));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/blogposts', blogpostsRouter);
app.use('/api/tags', tagsRouter);

// RSS Feed Routes
// Main RSS feed (all posts)
app.get('/rss.xml', async (req, res) => {
  try {
    const rssFeed = await getCachedRssFeed();
    res.type('application/rss+xml');
    res.send(rssFeed);
  } catch (error) {
    console.error('Error serving RSS feed:', error);
    res.status(500).send('Failed to generate RSS feed');
  }
});

// Category-specific RSS feed
app.get('/rss/:category.xml', async (req, res) => {
  try {
    const { category } = req.params;
    const rssFeed = await getCachedRssFeed(category);
    res.type('application/rss+xml');
    res.send(rssFeed);
  } catch (error) {
    console.error('Error serving category RSS feed:', error);
    res.status(500).send('Failed to generate RSS feed');
  }
});



// Initialize the database

initializeDatabase().then(() => {
  // Generate initial RSS feeds (main + all categories)
  regenerateAllRssFeeds().catch(err => console.error('Failed to generate initial RSS feeds:', err));
  
  // Start the server only after the database is initialized
  const PORT = parseInt(process.env.BLOG_BACKEND_PORT || '3000', 10);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
});