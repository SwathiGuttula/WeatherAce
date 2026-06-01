import React from 'react';

function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`bg-white/10 rounded-xl animate-pulse ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Main card skeleton */}
      <div className="glass p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
        </div>
        <div className="flex items-center gap-6 mb-8">
          <SkeletonBlock className="h-24 w-24 rounded-2xl" />
          <div className="space-y-3">
            <SkeletonBlock className="h-16 w-48" />
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <SkeletonBlock key={i} className="h-20" />
          ))}
        </div>
      </div>

      {/* Recommendation skeleton */}
      <div className="glass p-6">
        <SkeletonBlock className="h-5 w-48 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <SkeletonBlock key={i} className="h-16" />
          ))}
        </div>
      </div>

      {/* Forecast skeleton */}
      <div className="glass p-6">
        <SkeletonBlock className="h-5 w-40 mb-4" />
        <div className="flex gap-3 mb-4">
          {[...Array(8)].map((_, i) => (
            <SkeletonBlock key={i} className="h-20 w-16 flex-shrink-0" />
          ))}
        </div>
        <SkeletonBlock className="h-44" />
      </div>
    </div>
  );
}
