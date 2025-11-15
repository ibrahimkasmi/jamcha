// src/features/comments/screens/CommentsScreen.tsx
import { memo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, MessageCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ErrorFallback } from "@/shared/components/ui/ErrorFallback";
import { t } from "@/lib/i18n";

import { useCommentsData } from "../hooks/useCommentsData";
import { LoadingSkeleton } from "../components/LoadingSkeleton/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { SearchAndFilter } from "../components/SearchAndFilter/SearchAndFilter";
import { CommentsList } from "../components/CommentsList/CommentsList";
import { CommentsSidebar } from "../components/CommentsSidebar/CommentsSidebar";

// ✅ memo on main screen component
export const CommentsScreen = memo(() => {
  const {
    comments,
    isLoading,
    articlesLoading,
    searchTerm,
    sortBy,
    setSearchTerm,
    setSortBy,
    filteredComments,
    mainComments,
    getReplies,
    getArticleData,
    formatDate,
    hasComments,
    isEmpty,
    isError,
  } = useCommentsData();

  if (isLoading || articlesLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black" dir="rtl">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("commentsPage.error.loading")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t("commentsPage.error.description")}
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50 dark:bg-black" dir="rtl">
        <Header />

        {/* Page Header */}
        <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("commentsPage.title")}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                {t("commentsPage.subtitle")} ({comments.length}{" "}
                {t("commentsPage.totalComments")})
              </p>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Comments Content */}
            <div className="lg:col-span-2">
              <SearchAndFilter
                searchTerm={searchTerm}
                sortBy={sortBy}
                onSearchChange={setSearchTerm}
                onSortChange={setSortBy}
              />

              {isEmpty ? (
                <EmptyState searchTerm={searchTerm} />
              ) : hasComments ? (
                <>
                  <CommentsList
                    mainComments={mainComments}
                    getReplies={getReplies}
                    getArticleData={getArticleData}
                    formatDate={formatDate}
                  />

                  {/* Results Summary */}
                  {filteredComments.length > 0 && (
                    <div className="mt-8 text-center">
                      <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <MessageCircle className="h-4 w-4 ml-2 text-blue-600" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                          {t("commentsPage.showingResults")
                            .replace(
                              "{count}",
                              filteredComments.length.toString()
                            )
                            .replace("{total}", comments.length.toString())}
                          {searchTerm &&
                            ` ${t("commentsPage.showingResultsFor").replace(
                              "{searchTerm}",
                              searchTerm
                            )}`}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Sidebar */}
            <CommentsSidebar
              comments={comments}
              getArticleData={getArticleData}
            />
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
});

CommentsScreen.displayName = "CommentsScreen";
