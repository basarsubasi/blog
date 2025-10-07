import React, { useEffect, useState } from 'react';
import BlogPostList from '../components/BlogPostList';
import Pagination from '../components/Pagination';
import api from '../utils/api';
import type { BlogPost } from '../types';

const POSTS_PER_PAGE = 5;

const Homepage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * POSTS_PER_PAGE;
        const response = await api.get<{ posts: BlogPost[] }>('/api/blogposts', {
          params: { limit: POSTS_PER_PAGE + 1, offset }
        });
        const allPosts = response.data.posts;
        // Check if there are more posts by seeing if we got an extra one
        const hasMorePosts = allPosts.length > POSTS_PER_PAGE;
        // Only show POSTS_PER_PAGE posts
        setPosts(allPosts.slice(0, POSTS_PER_PAGE));
        setHasMore(hasMorePosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (loading) {
    return (
      <div className="d-flex flex-justify-center flex-items-center py-6">
        <p className="color-fg-muted">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <BlogPostList posts={posts} />
      <Pagination
        currentPage={currentPage}
        hasMore={hasMore}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Homepage;
