// src/features/article/screens/ArticleScreen.tsx
import React, { memo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ErrorFallback } from "@/shared/components/ui/ErrorFallback";
import { t } from "@/lib/i18n";
import { useArticleData } from "../hooks/useArticleData";
import { ArticleSEOHead } from "../components/ArticleSEOHead/ArticleSEOHead";
import { ArticleLoadingSkeleton } from "../components/ArticleLoadingSkeleton/ArticleLoadingSkeleton";
import { ArticleErrorState } from "../components/ArticleErrorState/ArticleErrorState";
import { ArticleHeader } from "../components/ArticleHeader/ArticleHeader";
import { ArticleActions } from "../components/ArticleActions/ArticleActions";
import { ArticleMedia } from "../components/ArticleMedia/ArticleMedia";
import { ArticleContent } from "../components/ArticleContent/ArticleContent";
import { ArticleTags } from "../components/ArticleTags/ArticleTags";

// ✅ Lazy load heavy components
const CommentsSection = React.lazy(() =>
  import("@/components/comments/comments-section").then((m) => ({
    default: m.default,
  }))
);

// memo() for main screen component
export const ArticleScreen = memo(() => {
  const {
    article,
    isLoading,
    hasError,
    hasArticle,
    hasTags,
    getImageUrl,
    getEmbedUrl,
    handleShare,
  } = useArticleData();

  if (isLoading) {
    return <ArticleLoadingSkeleton />;
  }

  if (hasError || !hasArticle) {
    return <ArticleErrorState />;
  }

  // Use getImageUrl exactly as in the grid version for consistency
  const featuredImageUrl = getImageUrl(article!.featuredImage);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <ArticleSEOHead />
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-200 dark:hover:bg-black text-gray-900 dark:text-gray-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("article.backButton")}
              </Button>
            </Link>
          </div>

          {/* Article */}
          <article className="bg-white dark:bg-black rounded-lg shadow-lg p-8 mb-16 border border-gray-200 dark:border-gray-800">
            <ArticleHeader article={article!} getImageUrl={getImageUrl} />

            <div className="mb-6">
              <ArticleActions onShare={handleShare} />
            </div>

            <ArticleMedia
              title={article!.title}
              featuredImageUrl={featuredImageUrl}
              videoUrl={article!.videoUrl}
              getEmbedUrl={getEmbedUrl}
            />

            <ArticleContent content={article!.content} />

            {hasTags && <ArticleTags tags={article!.tags ?? []} />}

            {/* Comments Section */}
            <Suspense
              fallback={
                <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse h-32 border border-gray-200 dark:border-gray-800" />
              }
            >
              <CommentsSection articleId={Number(article!.id)} />
            </Suspense>
          </article>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
});

ArticleScreen.displayName = "ArticleScreen";
