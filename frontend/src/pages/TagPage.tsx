import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogPostList from '../components/BlogPostList';
import api from '../utils/api';
import type { BlogPost } from '../types';

const TagPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!tag) return;
      
      try {
        const response = await api.get<{ posts: BlogPost[] }>(
          `/api/tags/${tag}/posts?limit=20`
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tag]);

  if (loading) {
    return (
      <div className="d-flex flex-justify-center flex-items-center py-6">
        <p className="color-fg-muted">Loading...</p>
      </div>
    );
  }

  return <BlogPostList posts={posts} />;
};

export default TagPage;
