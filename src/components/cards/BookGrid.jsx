import React from 'react';
import { BookCard } from './BookCard';
import { BookCardSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function BookGrid({ 
  books = [], 
  loading = false, 
  skeletonCount = 8, 
  emptyType = 'books',
  emptyTitle,
  emptyDescription,
  onQuickView,
  className = ''
}) {
  const gridClasses = className || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6';

  if (loading) {
    return (
      <div className={`grid ${gridClasses}`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <EmptyState
        type={emptyType}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className={`grid ${gridClasses}`}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} onQuickView={onQuickView} />
      ))}
    </div>
  );
}

export default BookGrid;
