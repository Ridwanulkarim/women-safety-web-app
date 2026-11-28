import React from 'react';

export const SkeletonCard = () => (
  <div className="surface-card p-6 animate-pulse space-y-4">
    <div className="h-5 bg-[#f4f4f5] dark:bg-[#232325] rounded w-3/4"></div>
    <div className="h-4 bg-[#f4f4f5] dark:bg-[#232325] rounded w-full"></div>
    <div className="h-4 bg-[#f4f4f5] dark:bg-[#232325] rounded w-5/6"></div>
    <div className="h-10 bg-[#f4f4f5] dark:bg-[#232325] rounded-lg w-full"></div>
  </div>
);

export const SkeletonTable = () => (
  <div className="surface-card p-4 animate-pulse space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex justify-between items-center h-10 bg-[#f4f4f5] dark:bg-[#232325] rounded-lg px-4">
        <div className="h-3.5 bg-zinc-300/60 dark:bg-white/10 rounded w-1/4"></div>
        <div className="h-3.5 bg-zinc-300/60 dark:bg-white/10 rounded w-1/3"></div>
        <div className="h-3.5 bg-zinc-300/60 dark:bg-white/10 rounded w-1/6"></div>
      </div>
    ))}
  </div>
);
