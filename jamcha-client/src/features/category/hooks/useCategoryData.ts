// src/features/category/hooks/useCategoryData.ts
import { useCategoryContext } from "../contexts/CategoryDataProvider";

export const useCategoryData = () => {
  const context = useCategoryContext();

  // Simple boolean operations - no useMemo needed
  const hasArticles = (context.articles?.length ?? 0) > 0;
  const hasMoreArticles =
    context.articles && context.articles.length >= context.limit;
  const showLoadMore = hasArticles && hasMoreArticles;
  const isEmpty =
    !context.isLoading && (!context.articles || context.articles.length === 0);
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
