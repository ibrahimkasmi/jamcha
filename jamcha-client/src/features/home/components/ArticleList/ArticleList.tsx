// src/features/home/components/ArticleList/ArticleList.tsx
import { memo } from "react";
import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/types/article";

interface ArticleListProps {
  articles: Article[];
}

export const ArticleList = memo<ArticleListProps>(({ articles }) => (
  <div className="space-y-6">
    {articles.map((article) => (
      <ArticleCard key={article.id} article={article} />
    ))}
  </div>
));

ArticleList.displayName = "ArticleList";
