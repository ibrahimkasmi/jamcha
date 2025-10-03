// src/features/home/hooks/useHomeData.ts
import { useHomeContext } from "../contexts/HomeDataProvider";

export const useHomeData = () => {
  const context = useHomeContext();

  const articles = context.articles || [];

  // ✅ Add optional chaining to all articles.length calls
  const hasArticles = articles.length > 0;
  const hasMoreArticles = articles.length >= context.limit;
  const showLoadMore = hasArticles && hasMoreArticles;
  const isEmpty = !context.isLoading && articles.length === 0;
  const isError = !context.isLoading && !!context.error;

  return {
    ...context,
    // Computed values
    hasMoreArticles,
    hasArticles,
    showLoadMore,
    isEmpty,
    isError,
  };
};
