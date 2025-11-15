import { Helmet } from "react-helmet-async";
import { ArticleScreen } from "@/features/article/screens/ArticleScreen";
import { generateMetadata } from "@/shared/utils/seo";
import { seoHelpers } from "@/shared/utils/seo-helpers";
import { useArticleData } from "@/features/article/hooks/useArticleData";

export function ArticlePageContent() {
  const { article, isLoading, error } = useArticleData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !article) {
    return <div>Error: {error?.message || "Article not found"}</div>;
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
        <script type="application/ld+json">
          {JSON.stringify(seoHelpers.formatArticleStructuredData(article))}
        </script>
      </Helmet>
      <ArticleScreen />
    </>
  );
}
