// src/features/podcast/components/PodcastList/PodcastList.tsx
import { memo } from "react";
import { PodcastCard } from "../PodcastCard/PodcastCard";
import type { Podcast } from "@/types/podcast";

interface PodcastListProps {
  podcasts: Podcast[];
  onPlay: (podcast: Podcast) => void;
  getThumbnailUrl: (
    thumbnailUrl: string | null | undefined,
    videoUrl: string
  ) => string;
  formatDate: (dateString: string) => string;
}

// ✅ memo HERE - prevents re-rendering entire list when parent updates
export const PodcastList = memo<PodcastListProps>(
  ({ podcasts, onPlay, getThumbnailUrl, formatDate }) => {
    if (!podcasts || !Array.isArray(podcasts)) {
      return <div>No podcasts available</div>;
    }

    return (
      <div className="space-y-6">
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            podcast={podcast}
            viewMode="list"
            onPlay={() => onPlay(podcast)}
            getThumbnailUrl={getThumbnailUrl}
            formatDate={formatDate}
          />
        ))}
      </div>
    );
  }
);

PodcastList.displayName = "PodcastList";
