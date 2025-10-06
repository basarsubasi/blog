import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const pool = mariadb.createPool({
  host: "blog_db",
  user: process.env.BLOG_DB_USER,
  password: process.env.BLOG_DB_PASSWORD,
  database: process.env.BLOG_DB_NAME,
});

export default pool;
