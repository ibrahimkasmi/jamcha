// src/features/podcast/screens/PodcastScreen.tsx
import React, { memo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CategoryTabs } from "@/components/category-tabs";
import { Sidebar } from "@/components/sidebar";
import { ErrorFallback } from "@/shared/components/ui/ErrorFallback";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { t } from "@/lib/i18n";

import { usePodcastData } from "../hooks/usePodcastData";
import { LoadingSkeleton } from "../components/LoadingSkeleton/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { ViewModeToggle } from "../components/ViewModeToggle/ViewModeToggle";

// ✅ Lazy load ONLY heavy components
const PodcastGrid = React.lazy(() =>
  import("../components/PodcastGrid/PodcastGrid").then((m) => ({
    default: m.PodcastGrid,
  }))
);

const PodcastList = React.lazy(() =>
  import("../components/PodcastList/PodcastList").then((m) => ({
    default: m.PodcastList,
  }))
);

// ✅ memo on main screen - prevents re-renders from parent
export const PodcastScreen = memo(() => {
  const {
    podcasts,
    isLoading,
    viewMode,
    setViewMode,
    handlePlay,
    getThumbnailUrl,
    formatDate,
    hasPodcasts,
    isEmpty,
    isError,
  } = usePodcastData();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Header />
        <CategoryTabs />

        <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 arabic-nav">
                {t("podcast.title")}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 arabic-nav">
                {t("podcast.subtitle")}
              </p>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {t("podcast.latest")}
                </h2>
                <ViewModeToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>

              {isLoading ? (
                <LoadingSkeleton />
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-red-500 dark:text-red-400">
                    {t("podcast.errorLoading")}
                  </p>
                </div>
              ) : isEmpty ? (
                <EmptyState />
              ) : hasPodcasts ? (
                <Suspense fallback={<LoadingSpinner />}>
                  {viewMode === "grid" ? (
                    <PodcastGrid
                      podcasts={podcasts || []}
                      onPlay={handlePlay}
                      getThumbnailUrl={getThumbnailUrl}
                      formatDate={formatDate}
                    />
                  ) : (
                    <PodcastList
                      podcasts={podcasts || []}
                      onPlay={handlePlay}
                      getThumbnailUrl={getThumbnailUrl}
                      formatDate={formatDate}
                    />
                  )}
                </Suspense>
              ) : null}
            </div>

            <Sidebar />
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
});

PodcastScreen.displayName = "PodcastScreen";
