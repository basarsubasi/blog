import express from 'express';
import dotenv from 'dotenv';
import initializeDatabase from './database/init-db';
import cors from 'cors'; 
import {verifyJWT} from './middleware/authMiddleware';
import { getJwtToken } from './routes/auth';
import blogpostsRouter from './routes/blogposts';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*', // Allow all origins
  methods: '*',
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'Origin', 'X-Requested-With', 'X-Api-Key']
}));

app.post('/api/auth', getJwtToken);

// Add endpoint to check authentication status
app.get('/api/auth/check', verifyJWT, (req: express.Request, res: express.Response) => {
  res.json({ authenticated: true, user: req.user });
});

// Blog posts routes
app.use('/api/blogposts', blogpostsRouter);



// Initialize the database

initializeDatabase().then(() => {
  // Start the server only after the database is initialized
  const PORT = parseInt(process.env.BLOG_BACKEND_PORT || '3000', 10);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
});