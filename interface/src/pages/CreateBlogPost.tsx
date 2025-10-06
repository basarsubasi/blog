import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../utils/api';
import type { Tag } from '../types';

const CreateBlogPost: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [datePosted, setDatePosted] = useState(new Date().toISOString().split('T')[0]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [creating, setCreating] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get<{ tags: Tag[] }>('/api/tags');
        setAvailableTags(response.data.tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !author.trim() || !category.trim() || !content.trim()) {
      alert(t('error'));
      return;
    }

    setCreating(true);
    try {
      await api.post('/api/blogposts', {
        title,
        author,
        category,
        tags: selectedTags,
        date_posted: datePosted,
        content_markdown: content,
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert(t('error'));
    } finally {
      setCreating(false);
    }
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('createPost')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('title')}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('author')}
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('category')}
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('datePosted')}
          </label>
          <input
            type="date"
            value={datePosted}
            onChange={(e) => setDatePosted(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('tags')}
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.uuid}
                type="button"
                onClick={() => toggleTag(tag.name)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTags.includes(tag.name)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('content')}
          </label>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <MarkdownEditor
              value={content}
              onChange={setContent}
              height="400px"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={creating}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {creating ? t('creating') : t('save')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
