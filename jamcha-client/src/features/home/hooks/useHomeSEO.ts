// src/features/home/hooks/useHomeSEO.ts
import { useMemo } from "react";
import { useHomeData } from "./useHomeData";
import { generateMetadata } from "@/shared/utils/seo";
import { t } from "@/lib/i18n";

export const useHomeSEO = () => {
  const { selectedCategory, articles, language } = useHomeData();

  // ✅ useMemo HERE - expensive string operations and metadata generation
  const seoData = useMemo(() => {
    const categoryName =
      selectedCategory === "all" ? t("home.allCategories") : selectedCategory;

    const title =
      selectedCategory === "all"
        ? t("seo.home.title")
        : t("seo.home.categoryTitle", { category: categoryName });

    const description =
      selectedCategory === "all"
        ? t("seo.home.description")
        : t("seo.home.categoryDescription", { category: categoryName });

    // This is expensive - string manipulation and array operations
    const keywords = [
      t("seo.home.keywords.base"),
      categoryName,
      ...(articles?.slice(0, 5).map((article) => article.title) || []),
    ].join(", ");

    const canonicalUrl =
      selectedCategory === "all"
        ? `${window.location.origin}/`
        : `${window.location.origin}/category/${selectedCategory}`;

    return generateMetadata({
      title,
      description,
      keywords,
      canonicalUrl,
      type: "website",
      image: articles?.[0]?.featuredImage
        ? `/api/files/download/${articles[0].featuredImage}`
        : "/images/og-default.jpg",
      articleCount: articles?.length || 0,
    });
  }, [selectedCategory, articles, language]); // Only recalculate when these change

  return seoData;
};
