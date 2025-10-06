import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AuthModal from './components/AuthModal';
import Homepage from './pages/Homepage';
import SingleBlogPost from './pages/SingleBlogPost';
import CreateBlogPost from './pages/CreateBlogPost';
import EditBlogPost from './pages/EditBlogPost';
import CategoryPage from './pages/CategoryPage';
import TagPage from './pages/TagPage';
import SearchPage from './pages/SearchPage';

const AppContent: React.FC = () => {
  const { loading, showAuthModal, setShowAuthModal } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex flex-justify-center flex-items-center color-bg-canvas-inset"
        style={{ minHeight: '100vh' }}
      >
        <p className="color-fg-muted">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/posts/:slug" element={<SingleBlogPost />} />
          <Route path="/create" element={<CreateBlogPost />} />
          <Route path="/edit/:slug" element={<EditBlogPost />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/tags/:tag" element={<TagPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Layout>
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
