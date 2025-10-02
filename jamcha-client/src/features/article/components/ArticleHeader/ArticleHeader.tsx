// src/features/article/components/ArticleHeader/ArticleHeader.tsx
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatTimeToArabic } from "@/lib/time-utils";
import { Calendar, Clock, User } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Article } from "@/types/article";

interface ArticleHeaderProps {
  article: Article;
  getImageUrl: (imageUrl: string | null | undefined) => string | null;
}

// ✅ memo() - This component might re-render when parent updates
export const ArticleHeader = memo<ArticleHeaderProps>(
  ({ article, getImageUrl }) => {
    return (
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant="secondary" className="capitalize">
            {article.category.translations[article.language]?.name ||
              article.category.name}
          </Badge>
          {article.isBreaking && (
            <Badge variant="destructive">{t("article.breaking")}</Badge>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {article.title}
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10">
              {article.author?.avatar ? (
                <img
                  src={
                    getImageUrl(article.author.avatar) || article.author.avatar
                  }
                  alt={article.author.name}
                  loading="lazy"
                />
              ) : (
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {article.author?.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {article.authorRole}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 gap-3">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.publishedAt}>
              {formatTimeToArabic(new Date(article.publishedAt))}
            </time>
          </div>

          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 gap-3">
            <Clock className="h-4 w-4" />
            <span>
              {article.readingTime} {t("article.readingTimePlural")}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ArticleHeader.displayName = "ArticleHeader";
