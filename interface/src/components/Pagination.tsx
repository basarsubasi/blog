import React from 'react';
import { chevronBack, chevronForward } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';


interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, hasMore, onPageChange }) => {
  return (
    <nav className="d-flex flex-justify-center mt-6 mb-4" aria-label="Pagination">
      <div
        className="d-flex flex-items-center"
        style={{ gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            background: 'none',
            border: 'none',
            color: currentPage === 1 ? 'var(--color-fg-muted, #888)' : 'var(--color-fg-default)',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Previous page"
        >
          <IonIcon icon={chevronBack} style={{ fontSize: '1rem', color: currentPage === 1 ? 'var(--color-fg-muted, #888)' : 'var(--color-fg-default)' }} />
        </button>

        <span style={{ padding: '0.5rem 1rem', color: 'var(--color-fg-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {currentPage}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore}
          style={{
            background: 'none',
            border: 'none',
            color: !hasMore ? 'var(--color-fg-muted, #888)' : 'var(--color-fg-default)',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Next page"
        >
          <IonIcon icon={chevronForward} style={{ fontSize: '1rem', color: !hasMore ? 'var(--color-fg-muted, #888)' : 'var(--color-fg-default)' }} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
