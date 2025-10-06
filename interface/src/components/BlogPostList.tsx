import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BlogPostListProps {
  posts: BlogPost[];
}

const BlogPostList: React.FC<BlogPostListProps> = ({ posts }) => {
  const { t } = useLanguage();

  if (posts.length === 0) {
    return (
      <div className="d-flex flex-justify-center py-6">
        {t('noPosts')}
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getTextPreview = (html: string, maxLength: number = 200): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="container-lg mx-auto py-6">
      {posts.map((post, index) => (
        <article
          key={post.uuid}
          className={`pb-6 ${index < posts.length - 1 ? 'border-bottom color-border-muted mb-6' : ''}`}
        >
          <Link to={`/posts/${post.slug}`} className="blogpost-title-link">
            <h2 className="blogpost-title text-bold ">
              {post.title}
            </h2>
          </Link>

          <div className="text-medium color-fg-muted mb-2 ">
            {formatDate(post.date_posted)}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="d-flex flex-wrap mb-3">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${tag}`}
                  className="Label Label--accent color-fg-default mr-2 mb-2"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <p className="color-fg-default mb-3">
            {getTextPreview(post.content_html)}
          </p>

          <Link
            to={`/posts/${post.slug}`}
            className="btn btn-sm"
          >
            {t('readMore')}
          </Link>
        </article>
      ))}
    </div>
  );
};

export default BlogPostList;
