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
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return <BlogPostList posts={posts} />;
};

export default Homepage;
