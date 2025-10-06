-- only for reference, db init happens in init-db.ts

CREATE DATABASE IF NOT EXISTS blog_db;

USE blog_db;


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
);
