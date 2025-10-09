import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogPostList from '../components/BlogPostList';
import Pagination from '../components/Pagination';
import api from '../utils/api';
import type { BlogPost } from '../types';

const POSTS_PER_PAGE = 5;

const TagPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!tag) return;

      try {
        const offset = (currentPage - 1) * POSTS_PER_PAGE;
        const response = await api.get<{ posts: BlogPost[] }>(
          `/api/tags/${tag}/posts`,
          { params: { limit: POSTS_PER_PAGE + 1, offset } }
        );
        const allPosts = response.data.posts;
        const hasMorePosts = allPosts.length > POSTS_PER_PAGE;
        setPosts(allPosts.slice(0, POSTS_PER_PAGE));
        setHasMore(hasMorePosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } 
    };

    fetchPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tag, currentPage]);

  useEffect(() => {
    // Reset to page 1 when tag changes
    setCurrentPage(1);
  }, [tag]);


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

export default TagPage;
