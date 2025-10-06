import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config()

const pool = mariadb.createPool({
  host: process.env.BLOG_DB_HOST,
  user: process.env.BLOG_DB_USER,
  password: process.env.BLOG_DB_PASSWORD,
  database: "blog_db",
});

export default pool;
