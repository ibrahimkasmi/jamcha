// src/features/podcast/components/VideoTags/VideoTags.tsx
import type { Podcast } from "@/types/podcast";

interface VideoTagsProps {
  tags?: Podcast["tags"];
  maxTags?: number;
}

// ❌ NO memo - simple mapping operation
export const VideoTags = ({ tags, maxTags = 3 }: VideoTagsProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {tags.slice(0, maxTags).map((tag) => (
        <span
          key={tag.id}
          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};
