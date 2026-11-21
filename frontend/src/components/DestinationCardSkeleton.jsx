import React from 'react';

export default function DestinationCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden halo-card flex flex-col h-full bg-[#151319]/60 border border-white/5 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[16/10] bg-[#1a1721] relative">
        <div className="absolute top-3 left-3 w-20 h-6 rounded-full bg-white/10" />
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10" />
        <div className="absolute bottom-3 left-3 w-16 h-5 rounded-full bg-white/10" />
      </div>

      {/* Body Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-5 bg-white/10 rounded-md w-3/4" />
          <div className="h-3 bg-white/5 rounded-md w-full" />
          <div className="h-3 bg-white/5 rounded-md w-2/3" />
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="h-4 bg-white/5 rounded w-1/4" />
          <div className="h-4 bg-white/5 rounded w-1/3" />
        </div>

        <div className="h-9 bg-white/5 rounded-xl w-full" />
      </div>
    </div>
  );
}
