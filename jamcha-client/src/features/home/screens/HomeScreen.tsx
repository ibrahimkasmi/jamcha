// src/features/home/screens/HomeScreen.tsx
import React, { memo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { CategoryTabs } from "@/components/category-tabs";
import { Footer } from "@/components/footer";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { ErrorFallback } from "@/shared/components/ui/ErrorFallback";
import { t } from "@/lib/i18n";

import { useHomeData } from "../hooks/useHomeData";
import { SEOHead } from "../components/SEOHead/SEOHead";
import { LoadingSkeleton } from "../components/LoadingSkeleton/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { LoadMoreButton } from "../components/LoadMoreButton/LoadMoreButton";
import { ViewModeToggle } from "../components/ViewModeToggle/ViewModeToggle";

// ✅ Lazy load ONLY heavy components that might not be used immediately
const ArticleGrid = React.lazy(
  () => import("@/features/home/components/ArticleGrid/ArticleGrid")
);

const ArticleList = React.lazy(() =>
  import("../components/ArticleList/ArticleList").then((m) => ({
    default: m.ArticleList,
  }))
);

// ❌ DON'T lazy load Sidebar - it's always shown and small
import { Sidebar } from "@/components/sidebar";

// ✅ memo() for the main screen component - prevents unnecessary re-renders from parent
export const HomeScreen = memo(() => {
  const {
    articles,
    isLoading,
    viewMode,
    setViewMode,
    loadMore,
    getImageUrl,
    hasArticles,
    showLoadMore,
    isEmpty,
    isError,
  } = useHomeData();
  console.log(articles);
  // ❌ NO useMemo - these are simple boolean operations
  const shouldShowArticles = hasArticles && articles;
  const shouldShowSkeleton = isLoading;
  const shouldShowError = isError;
  const shouldShowEmpty = isEmpty;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SEOHead />

        <Header />
        <HeroSection />
        <CategoryTabs />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Articles Section */}
            <section className="lg:col-span-2" role="main">
              <header className="flex items-center justify-between mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {t("home.latestArticles")}
                </h1>
                <ViewModeToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </header>

              {shouldShowSkeleton ? (
                <LoadingSkeleton />
              ) : shouldShowError ? (
                <EmptyState type="error" />
              ) : shouldShowEmpty ? (
                <EmptyState type="no-articles" />
              ) : shouldShowArticles ? (
                <>
                  <Suspense fallback={<LoadingSpinner />}>
                    {viewMode === "grid" ? (
                      <ArticleGrid
                        articles={articles!}
                        getImageUrl={getImageUrl}
                      />
                    ) : (
                      <ArticleList articles={articles!} />
                    )}
                  </Suspense>
                  <LoadMoreButton onLoadMore={loadMore} show={showLoadMore} />
                </>
              ) : null}
            </section>

            {/* Sidebar */}
            <aside className="lg:col-span-1" role="complementary">
              <Sidebar />
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
});

HomeScreen.displayName = "HomeScreen";
