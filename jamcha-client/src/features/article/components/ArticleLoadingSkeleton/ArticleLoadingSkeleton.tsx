// src/features/article/components/ArticleLoadingSkeleton/ArticleLoadingSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// ❌ NO memo() - Loading skeleton renders once
export const ArticleLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header />
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </main>
    <Footer />
  </div>
);
