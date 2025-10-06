import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../utils/api';
import type { BlogPost, Tag } from '../types';

const EditBlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [datePosted, setDatePosted] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        const [postResponse, tagsResponse] = await Promise.all([
          api.get<BlogPost>(`/api/blogposts/${slug}`),
          api.get<{ tags: Tag[] }>('/api/tags'),
        ]);

        const postData = postResponse.data;
        setPost(postData);
        setTitle(postData.title);
        setAuthor(postData.author);
        setCategory(postData.category);
        setSelectedTags(postData.tags || []);
        setDatePosted(postData.date_posted.split('T')[0]);
        setContent(postData.content_markdown || '');

        setAvailableTags(tagsResponse.data.tags);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post) return;

    if (!title.trim() || !author.trim() || !category.trim() || !content.trim()) {
      alert(t('error'));
      return;
    }

    setSaving(true);
    try {
      await api.put(`/api/blogposts/${post.uuid}`, {
        title,
        author,
        category,
        tags: selectedTags,
        date_posted: datePosted,
        content_markdown: content,
      });

      navigate(`/posts/${post.slug}`);
    } catch (error) {
      console.error('Error updating post:', error);
      alert(t('error'));
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="d-flex flex-justify-center flex-items-center py-6">
        <p className="color-fg-muted">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="d-flex flex-justify-center py-6">
        <p className="color-fg-muted">Post not found</p>
      </div>
    );
  }

  return (
    <div className="container-lg mx-auto py-6">
      <h1 className="h1 text-bold mb-4 color-fg-default">{t('editPost')}</h1>

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
          <div
            className="Box"
            data-color-mode={theme}
            data-light-theme="light"
            data-dark-theme="dark"
          >
            <MarkdownEditor value={content} onChange={setContent} height="500px" />
          </div>
        </div>

        <div className="d-flex flex-justify-end">
          <button
            type="button"
            onClick={() => navigate(`/posts/${post.slug}`)}
            className="btn btn-outline mr-2"
          >
            {t('cancel')}
          </button>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? t('saving') : t('save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPost;
