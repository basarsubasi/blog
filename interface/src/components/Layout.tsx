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
          <Link to="/" className="d-flex flex-items-center text-bold color-fg-default no-underline f3">
            basarsubasi's&nbsp;<span className="color-fg-muted">blog</span>
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
              className="btn-octicon mr-2"
              title={t('theme')}
            >
              <IonIcon icon={theme === 'light' ? moon : bulb} />
            </button>
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
              className="btn btn-invisible"
              title={t('language')}
            >
              <span className="mr-1"><IonIcon icon={languageOutline} /></span>
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
            className="color-fg-accent text-underline"
          >
            {t('sourceCode')}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
