import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../utils/api';
import type { Tag } from '../types';

const CreateBlogPost: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [datePosted, setDatePosted] = useState(new Date().toISOString().split('T')[0]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [creating, setCreating] = useState(false);
  const [content, setContent] = useState('');
  const [newTagName, setNewTagName] = useState('');

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

  const handleAddTag = () => {
    const trimmedTag = newTagName.trim();
    if (!trimmedTag) return;
    
    if (!selectedTags.includes(trimmedTag)) {
      setSelectedTags((prev) => [...prev, trimmedTag]);
    }
    setNewTagName('');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
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
            className="form-input"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('author')}
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="form-input"
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
              className="form-input"
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
            className="form-input [color-scheme:light] dark:[color-scheme:dark]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('tags')}
          </label>
          <div className="space-y-3">
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1 text-sm rounded-full transition-colors bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {tag} ×
                  </button>
                ))}
              </div>
            )}
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableTags.filter(tag => !selectedTags.includes(tag.name)).map((tag) => (
                  <button
                    key={tag.uuid}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className="px-3 py-1 text-sm rounded-full transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Type tag name and press Enter or Add..."
                className="flex-1 form-input"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!newTagName.trim()}
                className="form-button-primary"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('content')}
          </label>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden" data-color-mode={theme}>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              height="500px"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            type="submit"
            disabled={creating}
            className="form-button-primary px-8"
          >
            {creating ? t('creating') : t('save')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="form-button-secondary px-8"
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
