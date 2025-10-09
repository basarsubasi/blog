import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BlogPostList from '../components/BlogPostList';
import Pagination from '../components/Pagination';
import api from '../utils/api';
import type { BlogPost } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const POSTS_PER_PAGE = 5;

const sanitizeQuery = (value: string): string => {
  return value.replace(/[<>]/g, '').slice(0, 120);
};

const SearchPage: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('q') || '').trim();
  }, [location.search]);
  const displayQuery = useMemo(() => sanitizeQuery(query), [query]);

  useEffect(() => {
    if (!query) {
      setPosts([]);
      setHasMore(false);
      return;
    }

    let isMounted = true;
    setError(null);

    const offset = (currentPage - 1) * POSTS_PER_PAGE;

    api
      .get('/api/blogposts/search', {
        params: { q: query, limit: POSTS_PER_PAGE + 1, offset },
      })
      .then((response) => {
        if (!isMounted) return;
        const allPosts = response.data.posts || [];
        const hasMorePosts = allPosts.length > POSTS_PER_PAGE;
        setPosts(allPosts.slice(0, POSTS_PER_PAGE));
        setHasMore(hasMorePosts);
      })
      .catch((err) => {
        console.error('Error searching posts:', err);
        if (!isMounted) return;
        setError(t('searchError') || t('error'));
        setPosts([]);
      });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [query, currentPage, t]);

  useEffect(() => {
    // Reset to page 1 when query changes
    setCurrentPage(1);
  }, [query]);

  if (!query) {
    return (
      <div className="container-lg mx-auto py-6">
        <h1 className="h2 text-bold mb-3 color-fg-default">{t('search')}</h1>
        <p className="color-fg-muted">{t('searchPrompt')}</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="container-lg mx-auto py-6">
        <h1 className="h2 text-bold mb-3 color-fg-default">{t('searchResultsFor')} "{displayQuery}"</h1>
        <p className="color-fg-danger">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container-lg mx-auto py-6">
        <h1 className="h2 text-bold mb-3 color-fg-default">{t('searchResultsFor')} "{displayQuery}"</h1>
        <p className="color-fg-muted">{t('searchNoResults')}</p>
      </div>
    );
  }

  return (
    <div className="container-lg mx-auto py-6">
      <h1 className="h2 text-bold mb-5 color-fg-default">{t('searchResultsFor')} "{displayQuery}"</h1>
      <BlogPostList posts={posts} />
      <Pagination
        currentPage={currentPage}
        hasMore={hasMore}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default SearchPage;
