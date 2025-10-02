// src/features/podcast/components/PodcastGrid/PodcastGrid.tsx
import { memo } from "react";
import { PodcastCard } from "../PodcastCard/PodcastCard";
import type { Podcast } from "@/types/podcast";

interface PodcastGridProps {
  podcasts: Podcast[];
  onPlay: (podcast: Podcast) => void;
  getThumbnailUrl: (
    thumbnailUrl: string | null | undefined,
    videoUrl: string
  ) => string;
  formatDate: (dateString: string) => string;
}

// ✅ memo HERE - prevents re-rendering entire grid when parent updates
export const PodcastGrid = memo<PodcastGridProps>(
  ({ podcasts, onPlay, getThumbnailUrl, formatDate }) => {
    if (!podcasts || !Array.isArray(podcasts)) {
      return <div>No podcasts available</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            podcast={podcast}
            viewMode="grid"
            onPlay={() => onPlay(podcast)}
            getThumbnailUrl={getThumbnailUrl}
            formatDate={formatDate}
          />
        ))}
      </div>
    );
  }
);

PodcastGrid.displayName = "PodcastGrid";
