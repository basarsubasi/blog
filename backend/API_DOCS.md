# Blog Backend API Documentation

## Overview

This blog backend supports **GitHub Flavored Markdown (GFM)** with automatic conversion to HTML. When you create or update a blog post, you send markdown content, and the backend stores both the original markdown and pre-rendered HTML in the database.

## Markdown Features Supported

- ✅ **Tables** - Full GFM table support
- ✅ **Strikethrough** - Use `~~text~~`
- ✅ **Task Lists** - `- [ ]` and `- [x]`
- ✅ **Syntax Highlighting** - Code blocks with language specification
- ✅ **Autolinks** - URLs and email addresses automatically converted to links
- ✅ **Line Breaks** - GFM-style line breaks (single newline = `<br>`)
- ✅ **Typographer** - Smart quotes and other typographic replacements
- ✅ **GitHub-style Headings** - Headings with anchor IDs
- ✅ **Image Sizing** - Resize images with `![alt](url =WIDTHxHEIGHT)` or `![alt](url =WIDTH%)`

### Image Sizing Examples

```markdown
# Specific dimensions (pixels)
![Image](image.jpg =200x100)

# Percentage width
![Image](image.jpg =50%)

# Only width
![Image](image.jpg =300x)
```

## API Endpoints

### Authentication

All `POST`, `PUT`, and `DELETE` endpoints require JWT authentication.

Include the token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

---

### Create Blog Post

**POST** `/api/blogposts`

Creates a new blog post. The markdown content is automatically converted to HTML.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "My Amazing Blog Post",
  "author": "John Doe",
  "category": "Technology",
  "content_markdown": "# Hello World\n\nThis is **markdown** content!",
  "tags": ["javascript", "tutorial", "backend"]
}
```

**Response (201 Created):**
```json
{
  "message": "Blog post created successfully",
  "post": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Amazing Blog Post",
    "author": "John Doe",
    "category": "Technology",
    "date_posted": "2025-10-06T12:00:00.000Z",
    "slug": "my-amazing-blog-post",
    "content_markdown": "# Hello World\n\nThis is **markdown** content!",
    "content_html": "<h1>Hello World</h1>\n<p>This is <strong>markdown</strong> content!</p>\n",
    "tags": ["javascript", "tutorial", "backend"]
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Blog post with this title already exists
- `500 Internal Server Error` - Server error

---

### Get All Blog Posts

**GET** `/api/blogposts`

Retrieves all blog posts with pre-rendered HTML (no authentication required).

**Query Parameters:**
- `limit` (optional) - Number of posts to return (default: 10)
- `offset` (optional) - Number of posts to skip (default: 0)
- `category` (optional) - Filter by category

**Example:**
```
GET /api/blogposts?limit=5&offset=0&category=Technology
```

**Response (200 OK):**
```json
{
  "posts": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "title": "My Amazing Blog Post",
      "author": "John Doe",
      "category": "Technology",
      "date_posted": "2025-10-06T12:00:00.000Z",
      "slug": "my-amazing-blog-post",
      "content_html": "<h1>Hello World</h1>...",
      "created_at": "2025-10-06T12:00:00.000Z",
      "updated_at": "2025-10-06T12:00:00.000Z",
      "tags": ["javascript", "tutorial", "backend"]
    }
  ],
  "limit": 5,
  "offset": 0
}
```

---

### Get Blog Posts by Category

**GET** `/api/blogposts/category/:category`

Retrieves all blog posts in a specific category (no authentication required).

**Query Parameters:**
- `limit` (optional) - Number of posts to return (default: 10)
- `offset` (optional) - Number of posts to skip (default: 0)

**Example:**
```
GET /api/blogposts/category/Technology?limit=5
```

**Response (200 OK):**
```json
{
  "posts": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "title": "My Amazing Blog Post",
      "author": "John Doe",
      "category": "Technology",
      "date_posted": "2025-10-06T12:00:00.000Z",
      "slug": "my-amazing-blog-post",
      "content_html": "<h1>Hello World</h1>...",
      "created_at": "2025-10-06T12:00:00.000Z",
      "updated_at": "2025-10-06T12:00:00.000Z",
      "tags": ["javascript", "tutorial", "backend"]
    }
  ],
  "category": "Technology",
  "limit": 5,
  "offset": 0
}
```

---

### Get Single Blog Post by Slug

**GET** `/api/blogposts/:slug`

Retrieves a single blog post by its slug (no authentication required).

**Example:**
```
GET /api/blogposts/my-amazing-blog-post
```

**Response (200 OK):**
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "title": "My Amazing Blog Post",
  "author": "John Doe",
  "category": "Technology",
  "date_posted": "2025-10-06T12:00:00.000Z",
  "slug": "my-amazing-blog-post",
  "content_html": "<h1>Hello World</h1><p>This is <strong>markdown</strong> content!</p>\n",
  "created_at": "2025-10-06T12:00:00.000Z",
  "updated_at": "2025-10-06T12:00:00.000Z",
  "tags": ["javascript", "tutorial", "backend"]
}
```

**Error Responses:**
- `404 Not Found` - Blog post not found

---

### Update Blog Post

**PUT** `/api/blogposts/:uuid`

Updates an existing blog post. If `content_markdown` is updated, HTML is automatically regenerated.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "author": "Jane Doe",
  "category": "Programming",
  "content_markdown": "# Updated Content\n\nNew **markdown** here!",
  "tags": ["nodejs", "api", "rest"]
}
```

**Response (200 OK):**
```json
{
  "message": "Blog post updated successfully"
}
```

**Error Responses:**
- `400 Bad Request` - No fields to update
- `404 Not Found` - Blog post not found
- `409 Conflict` - Duplicate title or content
- `500 Internal Server Error` - Server error

---

### Search Blog Posts

**GET** `/api/blogposts/search`

Search blog posts using full-text search.

**Query Parameters:**
- `q` (required) - Search query string
- `limit` (optional) - Number of posts to return (default: 10)
- `offset` (optional) - Number of posts to skip (default: 0)

**Example:**
```
GET /api/blogposts/search?q=javascript&limit=10
```

**Response (200 OK):**
```json
{
  "posts": [...],
  "searchTerm": "javascript",
  "limit": 10,
  "offset": 0,
  "count": 5
}
```

---

## Tags Endpoints

### Get All Tags

**GET** `/api/tags`

Retrieves all tags (no authentication required).

**Query Parameters:**
- `limit` (optional) - Number of tags to return (default: 100)
- `offset` (optional) - Number of tags to skip (default: 0)

**Example:**
```
GET /api/tags?limit=50
```

**Response (200 OK):**
```json
{
  "tags": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "javascript"
    },
    {
      "uuid": "660e8400-e29b-41d4-a716-446655440001",
      "name": "tutorial"
    }
  ],
  "limit": 50,
  "offset": 0
}
```

---

### Get Blog Posts by Tag

**GET** `/api/tags/:tagName/posts`

Retrieves all blog posts with a specific tag (no authentication required).

**Query Parameters:**
- `limit` (optional) - Number of posts to return (default: 10)
- `offset` (optional) - Number of posts to skip (default: 0)

**Example:**
```
GET /api/tags/javascript/posts?limit=5
```

**Response (200 OK):**
```json
{
  "posts": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "title": "My Amazing Blog Post",
      "author": "John Doe",
      "category": "Technology",
      "date_posted": "2025-10-06T12:00:00.000Z",
      "slug": "my-amazing-blog-post",
      "content_html": "<h1>Hello World</h1>...",
      "created_at": "2025-10-06T12:00:00.000Z",
      "updated_at": "2025-10-06T12:00:00.000Z"
    }
  ],
  "tag": "javascript",
  "limit": 5,
  "offset": 0
}
```

---

### Get Tags for a Blog Post

**GET** `/api/tags/blogpost/:uuid`

Retrieves all tags for a specific blog post (no authentication required).

**Example:**
```
GET /api/tags/blogpost/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "tags": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "javascript"
    },
    {
      "uuid": "660e8400-e29b-41d4-a716-446655440001",
      "name": "tutorial"
    }
  ]
}
```

---

### Delete Blog Post

**DELETE** `/api/blogposts/:uuid`

Deletes a blog post by UUID. Tags associated with the post are automatically removed.

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response (200 OK):**
```json
{
  "message": "Blog post deleted successfully"
}
```

**Error Responses:**
- `404 Not Found` - Blog post not found
- `500 Internal Server Error` - Server error

---

## Markdown Library

This backend uses **markdown-it** with the following plugins:

- `markdown-it` - Core markdown parser
- `markdown-it-highlightjs` - Syntax highlighting for code blocks
- `markdown-it-task-lists` - GitHub-style task lists
- `markdown-it-github-headings` - GitHub-style heading anchors
- `markdown-it-imsize` - Image size support (=WIDTHxHEIGHT or =WIDTH%)
-`markdown-it-github-alerts` - Alerts;

## URL Slug Generation

Slugs are automatically generated from post titles using the `slugify` library with strict settings:
- Converts to lowercase
- Removes special characters
- Replaces spaces with hyphens
- Ensures URL-safe strings
- Turkish locale

Example: `"My Amazing Blog Post!"` → `"my-amazing-blog-post"`


## Database Schema

```sql
CREATE TABLE blogposts (
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

CREATE TABLE tags (
  uuid VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  INDEX idx_tag_name (name)
);

CREATE TABLE blogpost_tags (
  blogpost_uuid VARCHAR(36) NOT NULL,
  tag_uuid VARCHAR(36) NOT NULL,
  PRIMARY KEY (blogpost_uuid, tag_uuid),
  FOREIGN KEY (blogpost_uuid) REFERENCES blogposts(uuid) ON DELETE CASCADE,
  FOREIGN KEY (tag_uuid) REFERENCES tags(uuid) ON DELETE CASCADE
);
```

## Tagging System

The tagging system uses a **many-to-many relationship** between blog posts and tags:

- **Tags are normalized**: Tag names are automatically converted to lowercase and trimmed
- **Auto-creation**: Tags are created automatically when you use them in a blog post
- **Reusable**: The same tag can be associated with multiple blog posts
- **Cascade deletion**: When a blog post is deleted, its tag associations are automatically removed
- **Efficient querying**: Indexed for fast lookups by tag name

### Tag Usage Examples

**Creating a post with tags:**
```json
POST /api/blogposts
{
  "title": "Learn JavaScript",
  "tags": ["JavaScript", "Tutorial", "Web Dev"]
}
// Tags will be stored as: ["javascript", "tutorial", "web dev"]
```

**Updating tags:**
```json
PUT /api/blogposts/:uuid
{
  "tags": ["nodejs", "backend"]
}
// This replaces ALL existing tags with the new ones
```

**Finding posts by tag:**
```
GET /api/tags/javascript/posts
```

## Performance Note

Pre-rendering HTML at creation/update time provides:
- ⚡ **Fast reads** - No conversion overhead when serving posts
- 🔒 **Security** - HTML sanitization happens once at write time
- 📦 **Storage efficiency** - Both formats available for different use cases
