import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'dashboard') {
    return (
      <div className="w-full max-w-6xl space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-dark-surface rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-dark-surface rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 dark:bg-dark-surface rounded-xl"></div>
          <div className="h-64 bg-gray-200 dark:bg-dark-surface rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (type === 'project') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-4 space-y-4 animate-pulse"
          >
            <div className="h-48 bg-gray-200 dark:bg-dark-surface rounded-xl"></div>
            <div className="h-6 bg-gray-200 dark:bg-dark-surface rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-dark-surface rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-surface rounded w-5/6"></div>
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-gray-200 dark:bg-dark-surface rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 dark:bg-dark-surface rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full animate-pulse">
      {items.map((_, i) => (
        <div
          key={i}
          className="h-20 bg-gray-200 dark:bg-dark-surface rounded-xl w-full"
        ></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
