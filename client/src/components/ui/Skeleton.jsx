import React from 'react';

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const base = 'animate-pulse bg-slate-200 rounded';
  return <div className={`${base} ${className}`} />;
};

export const SchemeCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-subtle space-y-4">
    <div className="flex justify-between items-start gap-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-12 w-full" />
    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-24 rounded" />
    </div>
  </div>
);

export default Skeleton;
