// src/features/podcast/contexts/PodcastDataProvider.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { usePodcasts, useIncrementPodcastView } from "@/hooks/usePodcasts";
import type { Podcast } from "@/types/podcast";

interface PodcastContextType {
  podcasts: Podcast[] | undefined;
  isLoading: boolean;
  error: Error | null;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  incrementView: any;
  getThumbnailUrl: (
    thumbnailUrl: string | null | undefined,
    videoUrl: string
  ) => string;
  formatDate: (dateString: string) => string;
  extractYouTubeId: (url: string) => string | null;
  handlePlay: (podcast: Podcast) => void;
}

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

export const PodcastDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Use your existing working hooks
  const { data: podcasts, isLoading, error } = usePodcasts();
  const incrementView = useIncrementPodcastView();

  // ❌ NO useCallback - just regular functions for utilities
  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (
    thumbnailUrl: string | null | undefined,
    videoUrl: string
  ): string => {
    if (!thumbnailUrl) {
      const youtubeId = extractYouTubeId(videoUrl);
      return youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        : "/placeholder-video.jpg";
    }

    if (thumbnailUrl.startsWith("http")) {
      return thumbnailUrl;
    }

    return `/api/files/download/${thumbnailUrl}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  // ✅ useCallback ONLY here - function with side effects passed to many children
  const handlePlay = useCallback(
    (podcast: Podcast) => {
      incrementView.mutate(podcast.id);
      window.open(podcast.videoUrl, "_blank");
    },
    [incrementView]
  );

  // ❌ NO useMemo - simple object creation
  const contextValue: PodcastContextType = {
    podcasts,
    isLoading,
    error,
    viewMode,
    setViewMode,
    incrementView,
    getThumbnailUrl,
    formatDate,
    extractYouTubeId,
    handlePlay,
  };

  return (
    <PodcastContext.Provider value={contextValue}>
      {children}
    </PodcastContext.Provider>
  );
};

export const usePodcastContext = (): PodcastContextType => {
  const context = useContext(PodcastContext);
  if (!context) {
    throw new Error(
      "usePodcastContext must be used within PodcastDataProvider"
    );
  }
  return context;
};
