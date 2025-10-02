// src/features/article/hooks/useArticleSEO.ts
import { useMemo } from "react";
import { useArticleData } from "./useArticleData";
import { seoHelpers } from "@/shared/utils/seo-helpers";

export const useArticleSEO = () => {
  const { article, getImageUrl } = useArticleData();

  // ✅ useMemo HERE - expensive SEO operations (string processing, metadata generation)
  const seoData = useMemo(() => {
    if (!article) return null;

    const title = `${article.title} | Your Blog`;
    const description = seoHelpers.generateMetaDescription(
      article.excerpt || article.content,
      160
    );
    const keywords = seoHelpers.generateKeywords(
      article.title,
      article.content,
      article.category.name
    );
    const canonicalUrl = `${window.location.origin}/article/${article.slug}`;
    const featuredImageUrl = getImageUrl(article.featuredImage);

    return {
      title,
      description,
      keywords,
      canonicalUrl,
      image: featuredImageUrl || "/images/og-default.jpg",
      structuredData: seoHelpers.formatArticleStructuredData({
        ...article,
        featuredImage: featuredImageUrl,
      }),
      breadcrumbData: seoHelpers.generateBreadcrumbData([
        { name: "Home", url: "/" },
        {
          name: article.category.name,
          url: `/category/${article.category.slug}`,
        },
        { name: article.title, url: `/article/${article.slug}` },
      ]),
    };
  }, [article, getImageUrl]);

  return seoData;
};
