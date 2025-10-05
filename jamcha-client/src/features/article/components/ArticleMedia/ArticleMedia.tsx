// src/features/article/components/ArticleMedia/ArticleMedia.tsx
import { memo } from "react";
import { LazyImage } from "@/shared/components/ui/LazyImage";

interface ArticleMediaProps {
  title: string;
  featuredImageUrl: string | null;
  videoUrl?: string;
  getEmbedUrl: (url: string) => string | null;
}

export const ArticleMedia = memo<ArticleMediaProps>(
  ({ title, featuredImageUrl, videoUrl, getEmbedUrl }) => {
    // Debug: log the featuredImageUrl to help diagnose menu version image issue
    console.log('[ArticleMedia] featuredImageUrl:', featuredImageUrl);
    const hasEmbeddableVideo =
      videoUrl && videoUrl.trim() !== "" && getEmbedUrl(videoUrl);

    if (!featuredImageUrl && !hasEmbeddableVideo) {
      return null;
    }

    return (
      <div className="mb-8">
        {hasEmbeddableVideo ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <iframe
              src={getEmbedUrl(videoUrl!)!}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="Article Video"
              loading="lazy"
            />
          </div>
        ) : featuredImageUrl ? (
          <LazyImage
            src={featuredImageUrl}
            alt={title}
            className="w-full h-64 lg:h-96 object-cover rounded-lg"
            width={800}
            height={400}
          />
        ) : null}
      </div>
    );
  }
);

ArticleMedia.displayName = "ArticleMedia";
