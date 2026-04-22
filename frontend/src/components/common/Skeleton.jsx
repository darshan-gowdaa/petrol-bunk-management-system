import React from "react";

export const SkeletonBox = ({ className = "" }) => (
  <div className={`skeleton ${className}`} />
);

export const SkeletonStatsCard = () => (
  <div className="p-4 rounded-xl border border-gray-700/50 bg-gray-800/30 flex items-center gap-4">
    <div className="skeleton w-14 h-14 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <SkeletonBox className="h-3 w-2/3" />
      <SkeletonBox className="h-7 w-1/2" />
      <SkeletonBox className="h-3 w-3/4" />
    </div>
  </div>
);

export const SkeletonTableRows = ({ rows = 6, cols = 5 }) => (
  <div className="divide-y divide-gray-700/50">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 px-4 py-3">
        {Array.from({ length: cols }).map((_, j) => (
          <SkeletonBox key={j} className={`h-4 flex-1 ${j === 0 ? "max-w-[30%]" : ""}`} />
        ))}
        <div className="flex gap-2 w-16 flex-shrink-0">
          <SkeletonBox className="h-6 w-6 rounded-md" />
          <SkeletonBox className="h-6 w-6 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonChartBlock = ({ height = "h-64" }) => (
  <div className={`skeleton w-full rounded-xl ${height}`} />
);

// Suspense fallback for lazy-loaded pages
export const SkeletonPageFallback = () => (
  <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6 animate-fadeIn">
    <div className="flex items-center justify-between mb-8">
      <SkeletonBox className="h-8 w-56" />
      <div className="flex gap-3">
        <SkeletonBox className="h-9 w-24 rounded-lg" />
        <SkeletonBox className="h-9 w-28 rounded-lg" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {[0,1,2].map(i => <SkeletonStatsCard key={i} />)}
    </div>
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/20 overflow-hidden">
      <div className="flex gap-4 px-4 py-3 bg-gray-800/60 border-b border-gray-700">
        {[40,20,20,15].map((w, i) => (
          <SkeletonBox key={i} className="h-3 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
      <SkeletonTableRows rows={7} cols={4} />
    </div>
  </div>
);
