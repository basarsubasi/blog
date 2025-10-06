import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../utils/api';
import type { BlogPost } from '../types';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import python from 'highlight.js/lib/languages/python';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import c from 'highlight.js/lib/languages/c';
import yaml from 'highlight.js/lib/languages/yaml';


hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('python', python);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('c', c);
hljs.registerLanguage('yaml', yaml);


const SingleBlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        const response = await api.get<BlogPost>(`/api/blogposts/${slug}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    if (!post || !window.confirm(t('confirmDelete') || 'Are you sure you want to delete this post?')) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/api/blogposts/${post.uuid}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!post || !contentRef.current) {
      return;
    }

    const blocks = contentRef.current.querySelectorAll('pre code');
    blocks.forEach((block) => {
      if (!block.classList.contains('hljs')) {
        block.classList.add('hljs');
      }
      hljs.highlightElement(block as HTMLElement);
    });
  }, [post, theme]);

  if (loading) {
    return (
      <div className="d-flex flex-justify-center flex-items-center py-6">
        <p className="color-fg-muted">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="d-flex flex-justify-center py-6">
        <p className="color-fg-muted">Post not found</p>
      </div>
    );
  }

  return (
    <article>
      <header className="mb-5">
        <h1 className="f00-light text-bold mb-3 color-fg-default">{post.title}</h1>
        <div className="d-flex flex-wrap flex-items-center text-small color-fg-muted">
          <span className="mr-2">{post.author}</span>
          <span className="mr-2">·</span>
          <time className="mr-2">
            {new Date(post.date_posted).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </time>
          <span className="mr-2">·</span>
          <Link to={`/category/${post.category}`} className="Link--secondary">
            {post.category}
          </Link>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="d-flex flex-wrap mt-3">
            {post.tags.map((tag) => (
              <Link key={tag} to={`/tags/${tag}`} className="Label Label--accent mr-2 mb-2">
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div
        className="markdown-body"
        ref={contentRef}
        data-color-mode={theme}
        data-light-theme="light"
        data-dark-theme="dark"
        dangerouslySetInnerHTML={{ __html: post.content_html }}
      />

      {isAuthenticated && (
        <div className="mt-6 pt-6 border-top color-border-muted d-flex">
          <Link to={`/edit/${post.slug}`} className="btn btn-primary mr-2">
            {t('edit') || 'Edit'}
          </Link>
          <button onClick={handleDelete} disabled={deleting} className="btn btn-danger">
            {deleting ? 'Deleting...' : t('delete')}
          </button>
        </div>
      )}
    </article>
  );
};

export default SingleBlogPost;
