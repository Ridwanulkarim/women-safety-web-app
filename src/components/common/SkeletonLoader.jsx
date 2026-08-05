import React from 'react';

export const SkeletonCard = () => (
  <div className="glass-card p-6 rounded-2xl animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
    <div className="h-10 bg-pink-500/20 rounded-xl w-full"></div>
  </div>
);

export const SkeletonTable = () => (
  <div className="glass-panel p-4 rounded-2xl animate-pulse space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex justify-between items-center h-12 bg-slate-200 dark:bg-slate-800 rounded-xl px-4">
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/6"></div>
      </div>
    ))}
  </div>
);
