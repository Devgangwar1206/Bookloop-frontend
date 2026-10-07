import React from 'react';

export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs animate-pulse">
      <div className="w-full aspect-[4/3] bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-4 bg-stone-200 rounded w-1/4" />
        </div>
        <div className="h-5 bg-stone-200 rounded w-4/5" />
        <div className="h-4 bg-stone-200 rounded w-1/2" />
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-7 bg-stone-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-stone-200 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-stone-200 rounded w-1/3" />
          <div className="h-4 bg-stone-200 rounded w-1/4" />
        </div>
      </div>
      <div className="h-16 bg-stone-200 rounded w-full" />
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4 animate-pulse">
      <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
        <div className="w-10 h-10 rounded-full bg-stone-200" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-stone-200 rounded w-1/4" />
          <div className="h-3 bg-stone-200 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-3 flex-1">
        <div className="h-10 bg-stone-200 rounded-lg w-2/3" />
        <div className="h-12 bg-stone-200 rounded-lg w-1/2 ml-auto" />
        <div className="h-10 bg-stone-200 rounded-lg w-3/5" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-stone-200 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-stone-200 rounded-xl" />
    </div>
  );
}
