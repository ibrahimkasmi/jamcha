// src/pages/ArticlePage.tsx
import { Helmet } from "react-helmet-async";
import { ArticleDataProvider } from "@/features/article/contexts/ArticleDataProvider";
import { ArticleScreen } from "@/features/article/screens/ArticleScreen";
import { generateMetadata } from "@/shared/utils/seo";
import { seoHelpers } from "@/shared/utils/seo-helpers";
import { useArticleData } from "@/features/article/hooks/useArticleData";

export default function ArticlePage() {
  const { article, isLoading, error } = useArticleData();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading skeleton
  }

  if (error || !article) {
    return <div>Error: {error?.message || "Article not found"}</div>; // Or a proper error component
  }

  const metadata = generateMetadata({
    title: `${article.title ?? ''} - Jamcha`,
    description: seoHelpers.generateMetaDescription(
      article.content || article.excerpt || ''
    ),
    keywords: seoHelpers.generateKeywords(
      article.title ?? '',
      article.content || article.excerpt || '',
      article.category.name
    ),
    canonicalUrl: `/article/${article.slug ?? ''}`,
    type: "article",
  });

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <link rel="canonical" href={metadata.canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:site_name" content="Jamcha" />
        <meta property="article:author" content={article.author?.name} />
        <meta property="article:published_time" content={article.publishedAt} />

        {/* Structured data for Google */}
        <script type="application/ld+json">
          {JSON.stringify(seoHelpers.formatArticleStructuredData(article))}
        </script>
      </Helmet>

      <ArticleDataProvider>
        <ArticleScreen />
      </ArticleDataProvider>
    </>
  );
}
