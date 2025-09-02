interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
  const renderPageButton = (page: number, label?: string) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      disabled={isLoading || page === currentPage}
      style={{
        padding: '8px 12px',
        margin: '0 2px',
        border: '1px solid #e5e7eb',
        borderRadius: '4px',
        backgroundColor: page === currentPage ? '#3b82f6' : 'white',
        color: page === currentPage ? 'white' : '#374151',
        cursor: isLoading || page === currentPage ? 'default' : 'pointer',
        opacity: isLoading ? 0.5 : 1,
        fontSize: '14px'
      }}
    >
      {label || page}
    </button>
  );

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderPageButton(i));
      }
    } else {
      pages.push(renderPageButton(1));

      if (currentPage > 3) {
        pages.push(<span key="ellipsis1" style={{ margin: '0 8px' }}>...</span>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(renderPageButton(i));
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="ellipsis2" style={{ margin: '0 8px' }}>...</span>);
      }

      pages.push(renderPageButton(totalPages));
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '16px 0'
    }}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={isLoading || currentPage === 1}
        style={{
          padding: '8px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          backgroundColor: 'white',
          cursor: isLoading || currentPage === 1 ? 'default' : 'pointer',
          opacity: isLoading || currentPage === 1 ? 0.5 : 1,
          fontSize: '14px'
        }}
      >
        Previous
      </button>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={isLoading || currentPage === totalPages}
        style={{
          padding: '8px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          backgroundColor: 'white',
          cursor: isLoading || currentPage === totalPages ? 'default' : 'pointer',
          opacity: isLoading || currentPage === totalPages ? 0.5 : 1,
          fontSize: '14px'
        }}
      >
        Next
      </button>

      <div style={{
        marginLeft: '16px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
