// src/features/article/components/ArticleTags/ArticleTags.tsx
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { t } from "@/lib/i18n";

interface ArticleTagsProps {
  tags: Array<string | { id: string | number; name: string }>;
}

// ✅ memo() - Tags don't change often, prevent unnecessary re-renders
export const ArticleTags = memo<ArticleTagsProps>(({ tags }) => (
  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
    <div className="flex items-center space-x-2 mb-4">
      <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("article.tagsLabel")}
      </span>
    </div>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const tagId = typeof tag === "object" ? tag.id : tag;
        const tagName = typeof tag === "object" ? tag.name : tag;
        return (
          <Badge key={tagId} variant="outline">
            {tagName}
          </Badge>
        );
      })}
    </div>
  </div>
));

ArticleTags.displayName = "ArticleTags";
