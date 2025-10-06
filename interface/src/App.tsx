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

const AppContent: React.FC = () => {
  const { loading, showAuthModal, setShowAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
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
