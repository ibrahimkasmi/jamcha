// src/features/article/hooks/useArticleData.ts
import { useArticleContext } from "../contexts/ArticleDataProvider";

export const useArticleData = () => {
  const context = useArticleContext();

  // ❌ NO useMemo - simple boolean operations are fast
  const hasArticle = !!context.article;
  const hasError = !!context.error;
  const hasFeaturedImage = !!context.article?.featuredImage;
  const hasVideoUrl = !!(
    context.article?.videoUrl && context.article.videoUrl.trim() !== ""
  );
  const hasEmbeddableVideo =
    hasVideoUrl && !!context.getEmbedUrl(context.article?.videoUrl || "");
  const hasTags = !!(context.article?.tags && context.article.tags.length > 0);

  return {
    ...context,
    hasArticle,
    hasError,
    hasFeaturedImage,
    hasVideoUrl,
    hasEmbeddableVideo,
    hasTags,
  };
};
