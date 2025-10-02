// src/features/podcast/components/VideoMeta/VideoMeta.tsx
import { Calendar, User } from "lucide-react";
import type { Podcast } from "@/types/podcast";

interface VideoMetaProps {
  author?: Podcast["author"];
  publishedAt: string;
  formatDate: (dateString: string) => string;
}

// ❌ NO memo - simple JSX rendering
export const VideoMeta = ({
  author,
  publishedAt,
  formatDate,
}: VideoMetaProps) => (
  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
    {author && (
      <>
        <User className="h-4 w-4 mr-1" />
        <span className="mr-4">{author.name}</span>
      </>
    )}
    <Calendar className="h-4 w-4 mr-1" />
    <span>{formatDate(publishedAt)}</span>
  </div>
);
