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
      <div className="d-flex flex-items-center" style={{ gap: '0.5rem' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-sm btn-outline"
          aria-label="Previous page"
        >
<IonIcon icon={chevronBack} style={{ fontSize: '1rem', color: 'var(--color-fg-default)' }} />        </button>

        <span className="px-3 color-fg-default">
        {currentPage}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore}
          className="btn btn-sm btn-outline"
          aria-label="Next page"
        >
<IonIcon icon={chevronForward} style={{ fontSize: '1rem', color: 'var(--color-fg-default)' }} />        </button>
      </div>
    </nav>
  );
};

export default Pagination;
