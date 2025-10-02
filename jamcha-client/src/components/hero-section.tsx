import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTimeToArabic } from "@/lib/time-utils";
import { Clock, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Article } from "@/types/article";
import { t } from "@/lib/i18n";
import { SocialIcons } from "@/components/ui/social-icons.tsx";
export function HeroSection() {
  // Handle MinIO image URLs
  const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl)
      return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `/api/files/download/${imageUrl}`;
  };

  const { data: featuredArticles, isLoading } = useQuery({
    queryKey: ["/api/articles/featured"],
    queryFn: async () => {
      const response = await fetch("/api/articles/featured?language=ar");
      if (!response.ok) throw new Error(t("common.error"));
      return response.json() as Promise<Article[]>;
    },
  });

  const featuredArticle = featuredArticles?.[0];

  if (isLoading) {
    return (
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="h-8 bg-white/20 rounded loading-skeleton"></div>
              <div className="h-16 bg-white/20 rounded loading-skeleton"></div>
              <div className="h-4 bg-white/20 rounded loading-skeleton"></div>
            </div>
            <div className="h-64 lg:h-80 bg-white/20 rounded-lg loading-skeleton"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredArticle) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            {featuredArticle.isBreaking && (
              <Badge variant="destructive" className="mb-4">
                {t("article.breaking")}
              </Badge>
            )}
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {featuredArticle.title}
            </h1>
            <p className="text-lg lg:text-xl mb-6 text-blue-100">
              {featuredArticle.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {featuredArticle.category.translations[featuredArticle.language]
                  ?.name || featuredArticle.category.name}
              </Badge>
              {featuredArticle.socialMediaLinkResponseDtos && (
                <SocialIcons
                  links={featuredArticle.socialMediaLinkResponseDtos}
                  className="text-white hover:text-blue-200"
                />
              )}
              <div className="flex items-center space-x-1 text-blue-100 gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {featuredArticle.readingTime} {t("article.readingTimePlural")}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-blue-100 gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {featuredArticle.publishedAt
                    ? formatTimeToArabic(new Date(featuredArticle.publishedAt))
                    : ""}
                </span>
              </div>
            </div>
            <Link href={`/article/${featuredArticle.slug}`}>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                {t("common.readMore")}
              </Button>
            </Link>
          </div>
          <div className="order-first lg:order-last">
            <img
              src={getImageUrl(featuredArticle.featuredImage)}
              alt={featuredArticle.title}
              className="rounded-lg shadow-xl w-full h-64 lg:h-80 object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
