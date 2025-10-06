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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="page-header">
        <Link to="/" className="main-title">
          basarsubasi's <span className="title-suffix">blog</span>
        </Link>
        <div className="header-links">
          <button
            onClick={handleCreateClick}
            className="header-button"
          >
            {t('create')}
          </button>
          <button
            onClick={toggleTheme}
            className="icon-button"
            title={t('theme')}
          >
         <IonIcon icon={theme === 'light' ? moon : bulb} />   
           </button>
          <button
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            className="icon-button"
            title={t('language')}
          >
            <IonIcon icon={languageOutline} />
            <span style={{ marginLeft: '0.25rem', fontSize: '0.875rem' }}>{language.toUpperCase()}</span>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div className="content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="page-footer">
        2025 © Başar Subaşı |{' '}
        <a
          href="https://github.com/basarsubasi/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {t('sourceCode')}
        </a>
      </footer>
    </div>
  );
};

export default Layout;
