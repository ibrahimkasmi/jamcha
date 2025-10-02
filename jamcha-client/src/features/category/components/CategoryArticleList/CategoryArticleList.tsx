// src/features/category/components/CategoryArticleList/CategoryArticleList.tsx
import { memo } from "react";
import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/types/article";

interface CategoryArticleListProps {
  articles: Article[];
}

// ✅ memo HERE - prevents re-rendering entire list when parent updates
export const CategoryArticleList = memo<CategoryArticleListProps>(
  ({ articles }) => {
    // Safety check
    if (!articles || !Array.isArray(articles)) {
      return <div>No articles available</div>;
    }

    return (
      <div className="space-y-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    );
  }
);

CategoryArticleList.displayName = "CategoryArticleList";
