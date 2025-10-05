// src/features/podcast/hooks/usePodcastData.ts
import { usePodcastContext } from "../contexts/PodcastDataProvider";

export const usePodcastData = () => {
  const context = usePodcastContext();

  // ❌ NO useMemo - simple boolean operations
  const hasPodcasts = (context.podcasts?.length ?? 0) > 0;
  const isEmpty =
    !context.isLoading && (!context.podcasts || context.podcasts.length === 0);
  const isError = !context.isLoading && !!context.error;

  return {
    ...context,
    hasPodcasts,
    isEmpty,
    isError,
  };
};
