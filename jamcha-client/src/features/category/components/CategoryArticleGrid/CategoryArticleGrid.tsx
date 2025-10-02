// src/features/category/components/CategoryArticleGrid/CategoryArticleGrid.tsx
import { memo } from "react";
import { CategoryArticleCard } from "../CategoryArticleCard/CategoryArticleCard";
import type { Article } from "@/types/article";

interface CategoryArticleGridProps {
  articles: Article[];
  getImageUrl: (imageUrl: string | null | undefined) => string;
}

// ✅ memo HERE - prevents re-rendering entire grid when parent updates
export const CategoryArticleGrid = memo<CategoryArticleGridProps>(
  ({ articles, getImageUrl }) => {
    // Safety check
    if (!articles || !Array.isArray(articles)) {
      return <div>No articles available</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <CategoryArticleCard
            key={article.id}
            article={article}
            getImageUrl={getImageUrl}
          />
        ))}
      </div>
    );
  }
);

CategoryArticleGrid.displayName = "CategoryArticleGrid";
