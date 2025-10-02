// src/features/category/components/CategoryArticleCard/CategoryArticleCard.tsx
import { memo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/shared/components/ui/LazyImage";
import { t } from "@/lib/i18n";
import type { Article } from "@/types/article";

interface CategoryArticleCardProps {
  article: Article;
  getImageUrl: (imageUrl: string | null | undefined) => string;
}

// ✅ memo HERE - prevents re-rendering when parent updates but article stays same
export const CategoryArticleCard = memo<CategoryArticleCardProps>(
  ({ article, getImageUrl }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <LazyImage
        src={getImageUrl(article.featuredImage)}
        alt={article.title}
        className="w-full h-48 object-cover"
        width={400}
        height={192}
      />
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-2 py-1 bg-primary text-white text-xs rounded capitalize">
            {typeof article.category === "string"
              ? article.category
              : article.category?.name}
          </span>
          <span className="text-sm text-gray-500">
            {article.readingTime} {t("article.readingTimePlural")}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{article.author?.name}</span>
          <Link href={`/article/${article.slug}`}>
            <Button size="sm">{t("common.readMore")}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
);

CategoryArticleCard.displayName = "CategoryArticleCard";
