import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BlogPostList from '../components/BlogPostList';
import api from '../utils/api';
import type { BlogPost } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const sanitizeQuery = (value: string): string => {
  return value.replace(/[<>]/g, '').slice(0, 120);
};

const SearchPage: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('q') || '').trim();
  }, [location.search]);
  const displayQuery = useMemo(() => sanitizeQuery(query), [query]);

  useEffect(() => {
    if (!query) {
      setPosts([]);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    api
      .get('/api/blogposts/search', {
        params: { q: query },
      })
      .then((response) => {
        if (!isMounted) return;
        setPosts(response.data.posts || []);
      })
      .catch((err) => {
        console.error('Error searching posts:', err);
        if (!isMounted) return;
        setError(t('searchError') || t('error'));
        setPosts([]);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query, t]);

  if (!query) {
    return (
      <div className="container-lg mx-auto py-6">
        <h1 className="h2 text-bold mb-3 color-fg-default">{t('search')}</h1>
        <p className="color-fg-muted">{t('searchPrompt')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex flex-justify-center flex-items-center py-6">
        <p className="color-fg-muted">{t('searching')}</p>
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
    </div>
  );
};

export default SearchPage;
