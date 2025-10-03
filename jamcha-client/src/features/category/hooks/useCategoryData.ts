// src/features/category/hooks/useCategoryData.ts
import { useCategoryContext } from "../contexts/CategoryDataProvider";

export const useCategoryData = () => {
  const context = useCategoryContext();

  const articles = context.articles || [];

  // Simple boolean operations - no useMemo needed
  const hasArticles = articles.length > 0;
  const hasMoreArticles = articles.length >= context.limit;
  const showLoadMore = hasArticles && hasMoreArticles;
  const isEmpty = !context.isLoading && articles.length === 0;
  const isError = !context.isLoading && !!context.error;

  return {
    ...context,
    hasArticles,
    hasMoreArticles,
    showLoadMore,
    isEmpty,
    isError,
  };
};
