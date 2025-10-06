import { markdownToHtml } from './src/utils/markdownToHtml';

// Comprehensive test markdown covering ALL features
const testMarkdown = `# The Ultimate Guide to Modern Web Development

A comprehensive tutorial covering everything you need to know about building modern web applications.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Core Technologies](#core-technologies)
- [Best Practices](#best-practices)
- [Conclusion](#conclusion)

---

## Introduction

Modern web development has evolved significantly over the past decade. This guide will walk you through the **essential concepts** and *best practices* that every developer should know.

Visit https://developer.mozilla.org for more resources!

## Getting Started

### Prerequisites

Before we begin, make sure you have the following installed:

- [x] Node.js (v16 or higher)
- [x] npm or yarn package manager
- [ ] Docker (optional)
- [ ] Git for version control

### Installation Steps

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Run the development server

#### Quick Start Commands

\`\`\`bash
# Clone the repository
git clone https://github.com/username/project.git

# Navigate to project directory
cd project

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

---

## Core Technologies

### Frontend Stack

| Technology | Purpose | Documentation |
|:-----------|:--------|:--------------|
| React | UI Library | [Docs](https://react.dev) |
| TypeScript | Type Safety | [Docs](https://typescriptlang.org) |
| Tailwind CSS | Styling | [Docs](https://tailwindcss.com) |
| Vite | Build Tool | [Docs](https://vitejs.dev) |

### Backend Stack

| Technology | Purpose | Documentation |
|:-----------|:--------|:--------------|
| Node.js | Runtime | [Docs](https://nodejs.org) |
| Express | Web Framework | [Docs](https://expressjs.com) |
| MariaDB | Database | [Docs](https://mariadb.org) |
| JWT | Authentication | [Docs](https://jwt.io) |

---

## Best Practices

### 1. Code Quality

Always write **clean**, **maintainable** code. Here's a good example:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

class UserService {
  private users: Map<string, User> = new Map();

  async createUser(data: Omit<User, 'id'>): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      ...data
    };
    
    this.users.set(user.id, user);
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }
}

export default UserService;
\`\`\`

### 2. Security Best Practices

> **Important:** Always sanitize user input and use parameterized queries to prevent SQL injection attacks.

**Security Checklist:**
- Use HTTPS in production
- Implement rate limiting
- Validate all input data
- Store passwords using bcrypt
- Keep dependencies updated

### 3. Performance Optimization

Here's a Python example for caching:

\`\`\`python
from functools import lru_cache
import time

@lru_cache(maxsize=128)
def expensive_operation(n: int) -> int:
    """Cached Fibonacci calculation"""
    if n <= 1:
        return n
    return expensive_operation(n-1) + expensive_operation(n-2)

# Usage
start = time.time()
result = expensive_operation(35)
print(f"Result: {result}, Time: {time.time() - start:.4f}s")
\`\`\`

### 4. Database Queries

Example SQL query with proper indexing:

\`\`\`sql
-- Create index for faster queries
CREATE INDEX idx_user_email ON users(email);

-- Efficient query with JOIN
SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
WHERE u.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id
ORDER BY post_count DESC
LIMIT 10;
\`\`\`

### 5. API Design

RESTful API example in JavaScript:

\`\`\`javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// GET endpoint
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST endpoint
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const user = await createUser({ name, email });
  res.status(201).json(user);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

---

## Advanced Topics

### Markdown Features Demo

#### Emphasis and Formatting

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- ***Bold and italic*** for maximum emphasis
- ~~Strikethrough~~ for corrections

#### Inline Code

Use \`const variable = "value"\` for inline code snippets.

#### Images with Sizing

Regular image:
![Placeholder](https://via.placeholder.com/600x400)

Image with specific dimensions:
![Resized Image](https://via.placeholder.com/800x600 =400x300)

Image with percentage width:
![Half Width](https://via.placeholder.com/1200x800 =50%)

#### Blockquotes

> "The best way to predict the future is to invent it."
> 
> — Alan Kay

Nested quotes:

> Level 1 quote
> > Level 2 quote
> > > Level 3 quote

#### Horizontal Rule

---

#### Lists Within Lists

* Frontend Development
  * HTML5
    * Semantic elements
    * Accessibility
  * CSS3
    * Flexbox
    * Grid
    * Animations
  * JavaScript
    * ES6+ features
    * Async/await
    * Promises

* Backend Development
  * Node.js
  * Python
  * Go

#### Code Blocks - Multiple Languages

**React Component:**

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <div className="counter">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;
\`\`\`

**Rust Example:**

\`\`\`rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    let sum: i32 = numbers.iter().sum();
    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();
    
    println!("Sum: {}", sum);
    println!("Doubled: {:?}", doubled);
}
\`\`\`

**Go Example:**

\`\`\`go
package main

import (
    "fmt"
    "time"
)

func main() {
    messages := make(chan string)
    
    go func() {
        time.Sleep(1 * time.Second)
        messages <- "Hello from goroutine!"
    }()
    
    msg := <-messages
    fmt.Println(msg)
}
\`\`\`

---

## Conclusion

This guide covered the essential aspects of modern web development:

1. ✅ Core technologies and frameworks
2. ✅ Best practices for security and performance
3. ✅ Code examples in multiple languages
4. ✅ Database optimization techniques
5. ✅ API design patterns

### Next Steps

- [ ] Build your first full-stack application
- [ ] Contribute to open source projects
- [ ] Keep learning and experimenting
- [ ] Join developer communities

### Useful Resources

- GitHub: https://github.com
- Stack Overflow: https://stackoverflow.com
- MDN Web Docs: https://developer.mozilla.org
- Contact: developer@example.com



> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

---

**Happy Coding!** 🚀

*Last updated: October 6, 2025*

`;

const testHtml = markdownToHtml(testMarkdown);

console.log(testHtml)