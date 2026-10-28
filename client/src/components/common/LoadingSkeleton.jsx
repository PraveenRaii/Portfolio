import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'dashboard') {
    return (
      <div className="w-full max-w-6xl space-y-6 animate-pulse">
        <div className="h-10 bg-theme-surfaceSecondary rounded-2xl w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-theme-surfaceSecondary border border-theme-border rounded-3xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-72 bg-theme-surfaceSecondary border border-theme-border rounded-3xl"></div>
          <div className="lg:col-span-5 h-72 bg-theme-surfaceSecondary border border-theme-border rounded-3xl"></div>
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
            className="rounded-3xl border border-theme-border bg-theme-surface p-5 space-y-4 animate-pulse"
          >
            <div className="h-44 bg-theme-surfaceSecondary rounded-2xl"></div>
            <div className="h-6 bg-theme-surfaceSecondary rounded-xl w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-theme-surfaceSecondary rounded-lg w-full"></div>
              <div className="h-4 bg-theme-surfaceSecondary rounded-lg w-5/6"></div>
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-theme-surfaceSecondary rounded-full w-16"></div>
              <div className="h-6 bg-theme-surfaceSecondary rounded-full w-20"></div>
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
          className="h-20 bg-theme-surfaceSecondary border border-theme-border rounded-2xl w-full"
        ></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
