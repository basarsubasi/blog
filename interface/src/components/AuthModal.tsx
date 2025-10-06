import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthModalProps {
  onClose?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = () => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { authenticate } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await authenticate(apiKey);
    
    if (!success) {
      setError(t('authenticationFailed'));
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed d-flex flex-justify-center flex-items-center z-2"
      style={{ inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="Box Box--spacious width-full" style={{ maxWidth: '24rem' }}>
        <h2 className="h3 text-bold mb-3 color-fg-default">
          {t('enterApiKey')}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="apiKey" className="form-label">
              {t('apiKey')}
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="form-control width-full"
              required
            />
          </div>
          {error && (
            <p className="color-fg-danger text-small mb-3">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary width-full"
          >
            {loading ? '...' : t('authenticate')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
