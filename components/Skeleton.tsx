
import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="glass-card p-6 rounded-2xl animate-pulse space-y-4">
    <div className="h-6 w-24 bg-white/10 rounded"></div>
    <div className="h-10 w-full bg-white/10 rounded"></div>
    <div className="flex gap-2">
      <div className="h-8 w-1/2 bg-white/10 rounded"></div>
      <div className="h-8 w-1/2 bg-white/10 rounded"></div>
    </div>
  </div>
);

export const ListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-white/10"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-white/10 rounded"></div>
          <div className="h-3 w-1/2 bg-white/10 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);
