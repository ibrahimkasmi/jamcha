// src/features/home/hooks/useHomeData.ts
import { useHomeContext } from "../contexts/HomeDataProvider";

export const useHomeData = () => {
  const context = useHomeContext();

  // ✅ Add optional chaining to all articles.length calls
  const hasArticles = context.articles?.length > 0;
  const hasMoreArticles = (context.articles?.length ?? 0) >= context.limit;
  const showLoadMore = hasArticles && hasMoreArticles;
  const isEmpty = !context.isLoading && (context.articles?.length ?? 0) === 0;
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
