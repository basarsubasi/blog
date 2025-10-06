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
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
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
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      {posts.map((post) => (
        <article
          key={post.uuid}
          className="mb-12 pb-8 border-b border-gray-200 dark:border-gray-700 last:border-none"
        >
          <Link to={`/posts/${post.slug}`}>
            <h2 className="text-3xl font-bold mb-2 hover:underline text-gray-900 dark:text-gray-100">
              {post.title}
            </h2>
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {formatDate(post.date_posted)}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${tag}`}
                  className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className="text-gray-700 dark:text-gray-300 mb-3">
            {getTextPreview(post.content_html)}
          </div>

          <Link
            to={`/posts/${post.slug}`}
            className="text-sm font-medium text-black dark:text-white hover:underline"
          >
            {t('readMore')}
          </Link>
        </article>
      ))}
    </div>
  );
};

export default BlogPostList;
