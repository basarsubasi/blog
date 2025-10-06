import React, { useEffect, useState } from 'react';
import BlogPostList from '../components/BlogPostList';
import api from '../utils/api';
import type { BlogPost } from '../types';

const Homepage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get<{ posts: BlogPost[] }>('/api/blogposts?limit=20');
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-justify-center flex-items-center py-6">
        <p className="color-fg-muted">Loading...</p>
      </div>
    );
  }

  return <BlogPostList posts={posts} />;
};

export default Homepage;
