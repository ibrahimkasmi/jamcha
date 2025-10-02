// src/features/podcast/components/VideoThumbnail/VideoThumbnail.tsx
import { Play, Eye } from "lucide-react";
import type { Podcast } from "@/types/podcast";

interface VideoThumbnailProps {
  podcast: Podcast;
  onPlay: () => void;
  getThumbnailUrl: (
    thumbnailUrl: string | null | undefined,
    videoUrl: string
  ) => string;
}

// ❌ NO memo - simple component that just renders JSX
export const VideoThumbnail = ({
  podcast,
  onPlay,
  getThumbnailUrl,
}: VideoThumbnailProps) => {
  const thumbnailUrl = getThumbnailUrl(podcast.thumbnailUrl, podcast.videoUrl);

  return (
    <div
      className="relative aspect-video bg-gray-200 dark:bg-gray-700 cursor-pointer rounded-lg overflow-hidden"
      onClick={onPlay}
    >
      <img
        src={thumbnailUrl}
        alt={podcast.title}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=400";
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-200">
        <div className="bg-red-600 rounded-full p-4 transform hover:scale-110 transition-transform">
          <Play className="h-8 w-8 text-white fill-white" />
        </div>
      </div>
      {podcast.duration && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          {podcast.duration}:00
        </div>
      )}
      {podcast.viewCount > 0 && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
          <Eye className="h-3 w-3 mr-1" />
          {podcast.viewCount}
        </div>
      )}
    </div>
  );
};
