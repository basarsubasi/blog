import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const headerColor = theme === 'dark' ? '#f0f6fc' : '#24292f';

  const handleCreateClick = () => {
    if (isAuthenticated) {
      navigate('/create');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="d-flex flex-column color-bg-canvas" style={{ minHeight: '100vh' }}>
      <header className="color-bg-default border-bottom color-border-muted">
        <div className="container-lg d-flex flex-justify-between flex-items-center py-3">
          <Link
            to="/"
            className="d-flex flex-items-center text-bold no-underline f3"
            style={{ color: headerColor }}
          >
            <span>basarsubasi's</span>
            <span style={{ marginLeft: '0.35rem' }}>blog</span>
          </Link>
          <div className="d-flex flex-items-center">
            <button
              type="button"
              onClick={handleCreateClick}
              className="btn btn-primary mr-2"
            >
              {t('create')}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="d-inline-flex flex-items-center px-2 py-1"
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
      </header>

      <main className="flex-auto">
        <div className="container-lg py-6">
          {children}
        </div>
      </main>

      <footer className="color-bg-default border-top color-border-muted py-3">
        <div className="container-lg text-small color-fg-muted">
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
      </footer>
    </div>
  );
};

export default Layout;
