import pool from './connection'; // Assuming your database connection is in connection.ts
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' });




async function flushDatabase() {
    try {
      // Drop all tables in the database
      console.log('Flushing database...');
      await pool.query(`DROP DATABASE IF EXISTS blog_db;`);
      console.log('Database flushed successfully.');
    } catch (error) {
      console.error('Error flushing database:', error);
      throw error;
    }
  }

async function initializeDatabase() {
  try {

    // await flushDatabase();
    
    // Create the database if it doesn't exist
    await pool.query(`
      CREATE DATABASE IF NOT EXISTS blog_db;
    `);

    // Use the database
    await pool.query(`
      USE blog_db;
    `);

    // Create the blogposts table if it doesn't exist
    await pool.query(`
    CREATE TABLE IF NOT EXISTS blogposts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      title TEXT NOT NULL UNIQUE,
      author TEXT NOT NULL,
      category TEXT NOT NULL,
      date_posted DATETIME NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content_markdown TEXT NOT NULL UNIQUE,
      content_html TEXT NOT NULL UNIQUE,
      FULLTEXT INDEX ft_search (title, content_markdown)
      );`
  );

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1); // Exit the process if initialization fails
  }
}

export default initializeDatabase;
