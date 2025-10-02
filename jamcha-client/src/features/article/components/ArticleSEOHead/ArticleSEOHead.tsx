// src/features/article/components/ArticleSEOHead/ArticleSEOHead.tsx
import { memo } from "react";
import { useArticleSEO } from "../../hooks/useArticleSEO";

export const ArticleSEOHead = memo(() => {
  const seoData = useArticleSEO();

  if (!seoData) return null;

  return (
    <div>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <link rel="canonical" href={seoData.canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.image} />
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta property="og:type" content="article" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.image} />

      {/* Article Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(seoData.structuredData)}
      </script>

      {/* Breadcrumb Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(seoData.breadcrumbData)}
      </script>
    </div>
  );
});

ArticleSEOHead.displayName = "ArticleSEOHead";
