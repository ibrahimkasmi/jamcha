// src/features/category/screens/CategoryScreen.tsx
import React, { memo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CategoryTabs } from "@/components/category-tabs";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ErrorFallback } from "@/shared/components/ui/ErrorFallback";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { t } from "@/lib/i18n";

import { useCategoryData } from "../hooks/useCategoryData";
import { LoadingSkeleton } from "../components/LoadingSkeleton/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { ErrorState } from "../components/ErrorState/ErrorState";
import { LoadMoreButton } from "../components/LoadMoreButton/LoadMoreButton";
import { ViewModeToggle } from "../components/ViewModeToggle/ViewModeToggle";

// ✅ Lazy load heavy components
const CategoryArticleGrid = React.lazy(() =>
  import("../components/CategoryArticleGrid/CategoryArticleGrid").then((m) => ({
    default: m.CategoryArticleGrid,
  }))
);

const CategoryArticleList = React.lazy(() =>
  import("../components/CategoryArticleList/CategoryArticleList").then((m) => ({
    default: m.CategoryArticleList,
  }))
);

// ✅ memo on main screen component
export const CategoryScreen = memo(() => {
  const {
    articles,
    isLoading,
    language,
    viewMode,
    setViewMode,
    loadMore,
    getImageUrl,
    categoryName,
    hasArticles,
    showLoadMore,
    isEmpty,
    isError,
  } = useCategoryData();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50 dark:bg-black rtl-content">
        <Header />
        <CategoryTabs />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Back to Home */}
          <div className="mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="arabic-nav">{t("category.backToHome")}</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Articles Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white arabic-nav">
                  {categoryName}
                </h1>
                <ViewModeToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>

              {isLoading ? (
                <LoadingSkeleton />
              ) : isError ? (
                <ErrorState language={language} />
              ) : isEmpty ? (
                <EmptyState />
              ) : hasArticles ? (
                <>
                  <Suspense fallback={<LoadingSpinner />}>
                    {viewMode === "grid" ? (
                      <CategoryArticleGrid
                        articles={articles || []}
                        getImageUrl={getImageUrl}
                      />
                    ) : (
                      <CategoryArticleList articles={articles || []} />
                    )}
                  </Suspense>
                  <LoadMoreButton onLoadMore={loadMore} show={showLoadMore} />
                </>
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

CategoryScreen.displayName = "CategoryScreen";
