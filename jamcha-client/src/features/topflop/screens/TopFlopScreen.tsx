// src/features/topflop/screens/TopFlopScreen.tsx
import React, { memo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CategoryTabs } from "@/components/category-tabs";
import { Sidebar } from "@/components/sidebar";
import { ErrorFallback } from "@/shared/components/ui/ErrorFallback";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { t } from "@/lib/i18n";

import { useTopFlopData } from "../hooks/useTopFlopData";
import { LoadingSkeleton } from "../components/LoadingSkeleton/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { FilterControls } from "../components/FilterControls/FilterControls";

// Lazy load heavy components
const EntryGrid = React.lazy(() =>
  import("../components/EntryGrid/EntryGrid").then((m) => ({
    default: m.EntryGrid,
  }))
);

const EntryList = React.lazy(() =>
  import("../components/EntryList/EntryList").then((m) => ({
    default: m.EntryList,
  }))
);

// memo on main screen component
export const TopFlopScreen = memo(() => {
  const {
    isLoading,
    viewMode,
    filter,
    setViewMode,
    setFilter,
    getImageUrl,
    formatDate,
    hasEntries,
    isEmpty,
    isError,
    filteredData,
  } = useTopFlopData();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <CategoryTabs />

        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 arabic-nav">
                {t("topFlop.title")}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 arabic-nav">
                {t("topFlop.subtitle")}
              </p>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Top/Flop Content */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {t("topFlop.entries")}
                </h2>

                <FilterControls
                  filter={filter}
                  viewMode={viewMode}
                  onFilterChange={setFilter}
                  onViewModeChange={setViewMode}
                />
              </div>

              {isLoading ? (
                <LoadingSkeleton />
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-red-500 dark:text-red-400 arabic-nav">
                    {t("topFlop.errorLoading")}
                  </p>
                </div>
              ) : isEmpty ? (
                <EmptyState />
              ) : hasEntries ? (
                <Suspense fallback={<LoadingSpinner />}>
                  {viewMode === "grid" ? (
                    <EntryGrid
                      filteredData={filteredData}
                      getImageUrl={getImageUrl}
                      formatDate={formatDate}
                    />
                  ) : (
                    <EntryList
                      filteredData={filteredData}
                      getImageUrl={getImageUrl}
                      formatDate={formatDate}
                    />
                  )}
                </Suspense>
              ) : null}
            </div>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
});

TopFlopScreen.displayName = "TopFlopScreen";
