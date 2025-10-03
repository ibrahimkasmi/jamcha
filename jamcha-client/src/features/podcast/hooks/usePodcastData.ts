// src/features/podcast/hooks/usePodcastData.ts
import { usePodcastContext } from "../contexts/PodcastDataProvider";

export const usePodcastData = () => {
  const context = usePodcastContext();

  const podcasts = context.podcasts || [];

  // ❌ NO useMemo - simple boolean operations
  const hasPodcasts = podcasts.length > 0;
  const isEmpty =
    !context.isLoading && podcasts.length === 0;
  const isError = !context.isLoading && !!context.error;

  return {
    ...context,
    hasPodcasts,
    isEmpty,
    isError,
  };
};
