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
    <div className="container-lg mx-auto py-6">
      <h1 className="h1 text-bold mb-4 color-fg-default">{t('createPost')}</h1>

      <form onSubmit={handleSubmit} className="Box Box--spacious">
        <div className="mb-3">
          <label className="form-label">{t('title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control width-full"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('author')}</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="form-control width-full"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('category')}</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control width-full"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('datePosted')}</label>
          <input
            type="date"
            value={datePosted}
            onChange={(e) => setDatePosted(e.target.value)}
            className="form-control width-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">{t('tags')}</label>
          {selectedTags.length > 0 && (
            <div className="d-flex flex-wrap mb-2">
              {selectedTags.map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="btn btn-sm btn-danger mr-2 mb-2"
                >
                  {tag} ×
                </button>
              ))}
            </div>
          )}
          {availableTags.length > 0 && (
            <div className="d-flex flex-wrap mb-2">
              {availableTags
                .filter((tag) => !selectedTags.includes(tag.name))
                .map((tag) => (
                  <button
                    key={tag.uuid}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className="btn btn-sm btn-outline mr-2 mb-2"
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
          )}
          <div className="d-flex flex-items-center">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Type tag name and press Enter or Add..."
              className="form-control flex-auto mr-2"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!newTagName.trim()}
              className="btn btn-sm btn-primary"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">{t('content')}</label>
          <div className="Box" data-color-mode={theme}>
            <MarkdownEditor value={content} onChange={setContent} height="500px" />
          </div>
        </div>

        <div className="d-flex flex-justify-end">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-outline mr-2"
          >
            {t('cancel')}
          </button>
          <button type="submit" disabled={creating} className="btn btn-primary">
            {creating ? t('creating') : t('save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
