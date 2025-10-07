# Blog

This is the source code of my blog website on https://blog.basarsubasi.com.tr

You are very welcome to fork it and make it yours as well!

## 🏗️ Project Structure

```
blog/
├── backend/                     # Express.js API server (Node.js + TypeScript)
│   └── Dockerfile
│
├── frontend/                    # Public blog interface (React.js + TypeScript)
│   └── Dockerfile
│
├── interface/                   # Admin interface for blog management (React.js + TypeScript)
│   └── Dockerfile
│
│
├── traefik/                     # Traefik reverse proxy
│   └── docker-compose.yaml.example
│
│
├── docker-compose.yaml.example  # Main Docker Compose configuration
└── .env.example                 # Environment variables template
```

## 🚀 Features

### Frontend (Blog)
- **Homepage**: Main blog landing page with recent posts
- **Category Pages**: Browse posts by category
- **Tag Pages**: Browse posts by tag
- **Search**: Find posts by title or content
- **Single Post Page**: Detailed view of individual blog posts
- **RSS Feed**: RSS feed generation
- **Responsive Design**: Mobile-friendly layout
- **Pagination**: Navigate through multiple pages of posts


### Interface (Admin Panel)
- **Authentication**: JWT-based login system
- **Post Management**: Create, edit, and delete blog posts
- **Category Management**: Organize posts by categories
- **Tag Management**: Tag posts for better organization
- **GitHub Flavored Markdown Editor**: Full GFM support with live preview
- **Syntax Highlighting**: Real-time code syntax highlighting in editor
- **Markdown Toolbar**: Rich markdown editing tools and shortcuts
- **Live Preview**: Side-by-side markdown preview with rendered output

### Backend (API Server)
- **RESTful API**: Comprehensive REST API for all blog operations
- **GitHub Flavored Markdown (GFM)**: Full GFM support with advanced markdown features
- **Markdown to HTML Conversion**: Automatic rendering with syntax highlighting
- **Code Syntax Highlighting**: Multi-language code block highlighting
- **Markdown Extensions**: Support for tables, task lists, strikethrough, and more
- **Authentication System**: JWT-based secure authentication
- **Database Management**: MariaDB integration with connection pooling
- **RSS Generation**: Automatic RSS feed generation for blog posts
- **Search Engine**: Full-text search across blog posts
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Cross-origin resource sharing configuration
- **Pagination Support**: Backend pagination for large datasets

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: React.js, Vite, TypeScript
- **Database**: MariaDB
- **Authentication**: JWT (JSON Web Tokens)
- **Content Format**: GitHub Flavored Markdown (GFM) with HTML conversion
- **Markdown Processing**: markdown-it with GFM plugins and extensions
- **Markdown Editor**: @uiw/react-markdown-editor with live preview
- **Syntax Highlighting**: highlight.js for multi-language code highlighting
- **Markdown Styling**: github-markdown-css for authentic GitHub styling
- **Containerization**: Docker & Docker Compose
- **Base Styling**: GitHub Primer CSS with markdown-optimized styles

## 📋 Prerequisites

- Docker and Docker Compose installed
- Git for cloning the repository

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/basarsubasi/blog.git
cd blog
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your preferred values:
- Database credentials
- JWT secret key
- Port configurations

### 3. Deploy with Docker Compose

```bash
docker-compose up -d --build
```

**Access the services:**
- Public Blog: `http://localhost:3000`
- Admin Interface: `http://localhost:3001`
- Backend API: `http://localhost:5000`

## 🐳 Deployment Options

### Option 1: Deploy with Traefik (Recommended)

For production deployment with automatic HTTPS, load balancing, and domain routing:

1. **Configure your domains** in the docker-compose labels
2. **Deploy the blog application:**
   ```bash
   docker-compose up -d --build
   cd ..
   ```
3. **Set up Traefik**
    ```bash
    cd traefik
    docker-compose-up -d
    ```
4. **Access the services**
    ```    
    http://blog.localhost
    http://bloginterface.localhost
    http://blogbackend.localhost
    ```


## 🔧 Development Setup

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Interface Development

```bash
cd interface
npm install
npm run dev
```

## 📊 Database

The application uses MariaDB with automatic database initialization. The database schema is created automatically when the backend starts for the first time.


## 🌐 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/verify` - Verify JWT token

### Blog Posts
- `GET /blogposts` - Get all blog posts (with pagination)
- `GET /blogposts/:id` - Get a single blog post
- `POST /blogposts` - Create new blog post (requires auth)
- `PUT /blogposts/:id` - Update blog post (requires auth)
- `DELETE /blogposts/:id` - Delete blog post (requires auth)
- `GET /blogposts/category/:category` - Get posts by category
- `GET /blogposts/search` - Search posts by query

### Tags
- `GET /tags` - Get all tags
- `GET /tags/:tag` - Get posts by tag

### RSS Feed
- `GET /rss` - Generate RSS feed

## 📝 Configuration Notes

### API Configuration

(you need to configure these in the RSS related files as well if you want RSS)

Update API base URLs in `frontend/src/utils/api.ts` and `interface/src/utils/api.ts` for your deployment:

```typescript
const API_BASE_URL = 'https://your-blog-api-domain.com'; // or http://localhost:5000 for development
```

### CORS Configuration

The backend is configured to accept requests from all domains by default. To restrict it to specific domains, update the CORS configuration in `backend/src/app.ts`:

```typescript
app.use(cors({
  origin: ['https://your-blog-domain.com', 'https://your-admin-domain.com'],
  // ... other CORS options
}));
```

## 🎨 Customization

### Styling

The blog uses GitHub Primer CSS as the base with custom mobile-responsive styles and markdown-optimized rendering. The styling includes:

- **GitHub-style Markdown**: Consistent with GitHub's markdown rendering
- **Syntax Highlighting Themes**: Multiple code highlighting themes
- **Responsive Typography**: Mobile-optimized text rendering
- **Code Block Styling**: Enhanced code block appearance with language labels
- **Table Styling**: Clean, responsive table layouts
- **Custom CSS**: Modify `src/index.css` in both frontend and interface directories

### Content

- **GitHub Flavored Markdown (GFM)**: Full support for all GFM features
- **Code Syntax Highlighting**: Multi-language syntax highlighting for code blocks
- **Markdown Tables**: Support for tables with alignment options
- **Task Lists**: Interactive checkboxes and todo lists
- **Strikethrough Text**: Support for ~~strikethrough~~ formatting
- **Autolinks**: Automatic URL and email linking
- **Emoji Support**: GitHub-style emoji rendering
- **Line Breaks**: Proper handling of line breaks and paragraphs
- **Images and Media**: Embedded images with alt text support
- **Categories and Tags**: Organize content with metadata
