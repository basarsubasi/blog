import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../utils/api';
import type { AuthResponse, AuthCheckResponse } from '../types';

interface AuthContextType {
  isAuthenticated: boolean | null;
  loading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authenticate: (apiKey: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      await api.get<AuthCheckResponse>('/api/auth/check');
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('jwt_token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const authenticate = async (apiKey: string): Promise<boolean> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth', {}, {
        headers: { 'x-api-key': apiKey },
      });
      
      localStorage.setItem('jwt_token', response.data.token);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      loading,
      showAuthModal,
      setShowAuthModal,
      authenticate, 
      logout, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
