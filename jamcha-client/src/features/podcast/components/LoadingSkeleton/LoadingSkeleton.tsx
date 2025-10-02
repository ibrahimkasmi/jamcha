// src/features/podcast/components/LoadingSkeleton/LoadingSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

// ❌ NO memo - renders once during loading
export const LoadingSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 6 }, (_, i) => (
      <div
        key={i}
        className="flex bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <Skeleton className="w-1/3 h-48 rounded-lg" />
        <div className="w-2/3 ml-6 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
