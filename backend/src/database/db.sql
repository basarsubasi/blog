-- only for reference, db init happens in init-db.ts

CREATE DATABASE IF NOT EXISTS blog_db;

USE blog_db;


CREATE TABLE IF NOT EXISTS blogposts (
  uuid VARCHAR(36) PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS tags (
  uuid VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
);

CREATE TABLE IF NOT EXISTS blogpost_tags (
  blogpost_uuid VARCHAR(36) NOT NULL,
  tag_uuid VARCHAR(36) NOT NULL,
  PRIMARY KEY (blogpost_uuid, tag_uuid),
  FOREIGN KEY (blogpost_uuid) REFERENCES blogposts(uuid) ON DELETE CASCADE,
  FOREIGN KEY (tag_uuid) REFERENCES tags(uuid) ON DELETE CASCADE
);
