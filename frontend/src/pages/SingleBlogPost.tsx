import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  
  const { theme } = useTheme();
  const [post, setPost] = useState<BlogPost | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        const response = await api.get<BlogPost>(`/api/blogposts/${slug}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [slug]);



  useEffect(() => {
    if (!post || !contentRef.current) {
      return;
    }

    const blocks = contentRef.current.querySelectorAll('pre code');
    blocks.forEach((block) => {
      const element = block as HTMLElement;

      if (element.dataset.highlighted === 'yes') {
        return;
      }

      if (element.querySelector('span[class^="hljs"]')) {
        element.dataset.highlighted = 'yes';
        return;
      }

      if (!element.classList.contains('hljs')) {
        element.classList.add('hljs');
      }

      hljs.highlightElement(element);
    });
  }, [post, theme]);

  useEffect(() => {
    if (!post || !contentRef.current) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollToHash = (rawHash: string, smooth = true): HTMLElement | null => {
      const trimmed = rawHash.replace(/^#/, '');
      if (!trimmed) {
        return null;
      }

      const decoded = decodeURIComponent(trimmed);
      const target = document.getElementById(decoded) || document.getElementById(`user-content-${decoded}`);
      if (!target) {
        return null;
      }

      target.scrollIntoView({
        behavior: prefersReducedMotion || !smooth ? 'auto' : 'smooth',
        block: 'start',
      });

      return target;
    };

    const handleHashChange = () => {
      scrollToHash(window.location.hash, false);
    };

  const anchors = Array.from(contentRef.current.querySelectorAll<HTMLAnchorElement>('a[href*="#"]'));
    const listeners: Array<{ anchor: HTMLAnchorElement; handler: (event: MouseEvent) => void }> = [];

    anchors.forEach((anchor) => {
      const handler = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        let url: URL;
        try {
          url = new URL(anchor.href, window.location.origin);
        } catch (error) {
          return;
        }

        if (url.pathname !== window.location.pathname || !url.hash || url.hash === '#') {
          return;
        }

        event.preventDefault();
        const target = scrollToHash(url.hash);
        if (target) {
          const newHash = `#${target.id}`;
          if (window.location.hash !== newHash) {
            window.history.replaceState(null, '', `${url.pathname}${newHash}`);
          }
        }
      };

      anchor.addEventListener('click', handler);
      listeners.push({ anchor, handler });
    });

    window.addEventListener('hashchange', handleHashChange);
    // Ensure initial load with hash brings the section into view.
    if (window.location.hash) {
      // Use a microtask to allow the DOM to settle with highlighted code blocks.
      queueMicrotask(() => scrollToHash(window.location.hash, false));
    }

    return () => {
      listeners.forEach(({ anchor, handler }) => anchor.removeEventListener('click', handler));
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [post]);


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
          <span className="mr-2 f4">{post.author}</span>
          <span className="mr-2 f4">·</span>
          <time className="mr-2 f4">
            {new Date(post.date_posted).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </time>

          {post.tags && post.tags.length > 0 && (
            <span className="d-flex flex-wrap">
              <span className="mr-2 f4">·</span>
              {post.tags.map((t) => (
                <Link
                  key={t}
                  to={`/tags/${t}`}
                  className="mr-2 f4 color-fg-muted"
                >
                  {`#${t}`}
                </Link>
              ))}
            </span>
          )}

        </div>
         </header>

      <div
        className="markdown-body"
        ref={contentRef}
        data-color-mode={theme}
        data-light-theme="light"
        data-dark-theme="dark"
        dangerouslySetInnerHTML={{ __html: post.content_html }}
      />

    </article>
  );
};

export default SingleBlogPost;
