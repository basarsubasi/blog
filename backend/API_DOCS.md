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
  "content_markdown": "# Hello World\n\nThis is **markdown** content!"
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
    "content_html": "<h1>Hello World</h1>\n<p>This is <strong>markdown</strong> content!</p>\n"
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
      "updated_at": "2025-10-06T12:00:00.000Z"
    }
  ],
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
  "updated_at": "2025-10-06T12:00:00.000Z"
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
  "content_markdown": "# Updated Content\n\nNew **markdown** here!"
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

### Delete Blog Post

**DELETE** `/api/blogposts/:uuid`

Deletes a blog post by UUID.

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
  content_html TEXT NOT NULL UNIQUE
);
```

## Performance Note

Pre-rendering HTML at creation/update time provides:
- ⚡ **Fast reads** - No conversion overhead when serving posts
- 🔒 **Security** - HTML sanitization happens once at write time
- 📦 **Storage efficiency** - Both formats available for different use cases
