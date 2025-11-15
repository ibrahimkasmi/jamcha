// 3. Updated Sidebar Component
import { NewsletterForm } from "@/components/newsletter-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Link } from "wouter";
import { useAuthors } from "@/hooks/useAuthors";
import { useLatestArticles } from "@/hooks/useArticles";
import { useTranslation } from "react-i18next";
import { t } from "@/lib/i18n";

export function Sidebar() {
  // Fetch popular authors from backend
  const {
    data: popularAuthors = [],
    isLoading: isLoadingAuthors,
    error: authorsError,
  } = useAuthors();

  // Fetch latest articles for trending topics
  const {
    data: latestArticles = [],
    isLoading: isLoadingArticles,
    error: articlesError,
  } = useLatestArticles(5);

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Newsletter Signup */}
      <NewsletterForm />

      {/* Trending Topics - Latest Articles */}
      <Card>
        <CardHeader>
          <CardTitle>{t("sidebar.trendingTopics")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingArticles ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 animate-pulse"
                >
                  <div className="h-4 w-4 bg-gray-300 rounded"></div>
                  <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : articlesError ? (
            <p className="text-sm text-red-500 dark:text-red-400 text-center py-4">
              {t("sidebar.trendingTopicsError")}
            </p>
          ) : latestArticles.length > 0 ? (
            <div className="space-y-3">
              {latestArticles.map((article, index) => (
                <div key={article.id} className="flex items-center space-x-3">
                  <span className="text-primary font-bold text-lg">
                    {index + 1}
                  </span>
                  <Link
                    href={`/article/${article.slug}`}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex-1 line-clamp-2"
                  >
                    {article.title}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {t("sidebar.noTrendingTopics")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Popular Authors - From Backend */}
      <Card>
        <CardHeader>
          <CardTitle>{t("sidebar.popularAuthors")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAuthors ? (
            <div className="space-y-4 ">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 animate-pulse"
                >
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : authorsError ? (
            <p className="text-sm text-red-50 dark:text-red-400 text-center py-4">
              {t("sidebar.popularAuthorsError")}
            </p>
          ) : popularAuthors.length > 0 ? (
            <div className="space-y-4">
              {popularAuthors.map((author) => (
                <div key={author.id} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    {author.avatar ? (
                      <AvatarImage
                        src={
                          author.avatar.startsWith("http")
                            ? author.avatar
                            : `/api/files/download/${author.avatar}`
                        }
                        alt={author.name}
                      />
                    ) : (
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {author.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {author.articleCount} {t("sidebar.article")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {t("sidebar.noPopularAuthors")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
