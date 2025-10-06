import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Homepage from './pages/Homepage';
import SingleBlogPost from './pages/SingleBlogPost';
import CategoryPage from './pages/CategoryPage';
import TagPage from './pages/TagPage';
import SearchPage from './pages/SearchPage';

const AppContent: React.FC = () => {

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/posts/:slug" element={<SingleBlogPost />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/tags/:tag" element={<TagPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Layout>
      
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
