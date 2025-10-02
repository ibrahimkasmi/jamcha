// src/features/podcast/components/PodcastCard/PodcastCard.tsx
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Play, Eye } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Podcast } from "@/types/podcast";
import { VideoThumbnail } from "../VideoThumbnail/VideoThumbnail";
import { VideoMeta } from "../VideoMeta/VideoMeta";
import { VideoTags } from "../VideoTags/VideoTags";

interface PodcastCardProps {
  podcast: Podcast;
  viewMode: "grid" | "list";
  onPlay: () => void;
  getThumbnailUrl: (
    thumbnailUrl: string | null | undefined,
    videoUrl: string
  ) => string;
  formatDate: (dateString: string) => string;
}

// ✅ memo HERE - this component re-renders when parent updates but podcast might stay same
export const PodcastCard = memo<PodcastCardProps>(
  ({ podcast, viewMode, onPlay, getThumbnailUrl, formatDate }) => {
    if (viewMode === "grid") {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <VideoThumbnail
            podcast={podcast}
            onPlay={onPlay}
            getThumbnailUrl={getThumbnailUrl}
          />

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 arabic-nav">
              {podcast.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3 arabic-nav">
              {podcast.excerpt || podcast.description}
            </p>

            <VideoMeta
              author={podcast.author}
              publishedAt={podcast.publishedAt}
              formatDate={formatDate}
            />
            <VideoTags tags={podcast.tags} />

            <Button onClick={onPlay} className="w-full" size="sm">
              <Play className="h-4 w-4 mr-2" />
              {t("podcast.watchVideo")}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
        <div className="w-1/3">
          <VideoThumbnail
            podcast={podcast}
            onPlay={onPlay}
            getThumbnailUrl={getThumbnailUrl}
          />
        </div>

        <div className="w-2/3 ml-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded">
              {t("podcast.title")}
            </span>
            {podcast.duration && (
              <span className="text-sm text-gray-500">
                {podcast.duration} {t("article.readingTimePlural")}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 arabic-nav">
            {podcast.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 arabic-nav">
            {podcast.excerpt || podcast.description}
          </p>

          <VideoMeta
            author={podcast.author}
            publishedAt={podcast.publishedAt}
            formatDate={formatDate}
          />
          <VideoTags tags={podcast.tags} />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm text-gray-500">
              {/* {podcast.viewCount > 0 && (
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>
                    {podcast.viewCount} {t("podcast.views")}
                  </span>
                </div>
              )} */}
            </div>
            <Button onClick={onPlay} size="sm">
              <Play className="h-4 w-4 mr-2" />
              {t("podcast.watch")}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

PodcastCard.displayName = "PodcastCard";
