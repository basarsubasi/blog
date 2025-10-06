import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { IonIcon } from '@ionic/react';
import { languageOutline, moon, bulb } from 'ionicons/icons';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, setShowAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || '';
  });

  const headerColor = theme === 'dark' ? '#f0f6fc' : '#24292f';

  const handleCreateClick = () => {
    if (isAuthenticated) {
      navigate('/create');
    } else {
      setShowAuthModal(true);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const current = params.get('q') || '';
    setSearchTerm(current);
  }, [location.search]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      navigate('/search');
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="d-flex flex-column color-bg-canvas" style={{ minHeight: '100vh' }}>
      <header className="color-bg-default border-bottom color-border-muted">
        <div className="container-lg d-flex flex-wrap flex-justify-between flex-items-center py-3">
          <div className="d-flex flex-items-center mb-3 mb-md-0">
            <Link
              to="/"
              className="d-flex flex-items-center text-bold no-underline f3"
              style={{ color: headerColor }}
            >
              <span>{t('blogtitle')}</span>
              <span style={{ marginLeft: '0.35rem' }}>{t('blog')}</span>
            </Link>
            <nav className="d-flex flex-items-center text-bold no-underline f3 ml-4 ">
              <Link
                to="/category/teknoloji"
                className="Header-link mr-3"
                style={{ color: headerColor }}
              >
                {t('technology')}
              </Link>
              <Link
                to="/category/felsefe"
                className="Header-link"
                style={{ color: headerColor }}
              >
                {t('philosophy')}
              </Link>
            </nav>
          </div>

          <div className="d-flex flex-wrap flex-items-center flex-justify-end" style={{ gap: '0.75rem' }}>
            <form
              onSubmit={handleSearchSubmit}
              className="d-flex flex-items-center"
              role="search"
            >
              <label className="sr-only" htmlFor="header-search">
                {t('search')}
              </label>
              <input
                id="header-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('searchPlaceholder')}
                className="form-control input-sm width-full"
                style={{ maxWidth: '260px' }}
                data-color-mode={theme}
              />
              <button type="submit" className="btn btn-sm btn-primary ml-2">
                {t('search')}
              </button>
            </form>

            <div className="d-flex flex-items-center">
              <button
                type="button"
                onClick={toggleTheme}
                className="d-inline-flex flex-items-center px-2 py-1 mr-1"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: headerColor,
                  cursor: 'pointer',
                }}
                title={t('theme')}
              >
                <IonIcon icon={theme === 'light' ? moon : bulb} style={{ fontSize: '1.3rem' }} />
              </button>
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                className="d-inline-flex flex-items-center px-2 py-1"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: headerColor,
                  cursor: 'pointer',
                }}
                title={t('language')}
              >
                <IonIcon icon={languageOutline} style={{ fontSize: '1.1rem', marginRight: '0.35rem' }} />
                <span className="text-mono text-bold">{language.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-auto">
        <div className="container-lg py-6">
          {children}
        </div>
      </main>

      <footer className="color-bg-default border-top color-border-muted py-3">
        <div className="container-lg d-flex flex-wrap flex-justify-between flex-items-center text-small color-fg-muted">
          <div className="mb-2 mb-md-0">
            2025 © Başar Subaşı ·{' '}
            <a
              href="https://github.com/basarsubasi/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {t('sourceCode')}
            </a>
          </div>
          <button
            type="button"
            onClick={handleCreateClick}
            className="btn btn-primary btn-sm"
          >
            {t('create')}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
