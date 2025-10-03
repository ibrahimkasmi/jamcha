import { memo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/shared/components/ui/LazyImage";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { t } from "@/lib/i18n";
import type { Article } from "@/types/article";
import { SocialIcons } from "@/components/ui/social-icons.tsx";

interface ArticleCardProps {
  article: Article;
  getImageUrl: (imageUrl: string | null | undefined) => string;
}

const ArticleCard = memo<ArticleCardProps>(({ article, getImageUrl }) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: getImageUrl(article.featuredImage),
    author: {
      "@type": "Person",
      name: article.author?.name || "Anonymous",
    },
    datePublished: article.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "Your Site Name",
    },
  };

  return (
    <article
      ref={ref}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105"
      itemScope
      itemType="https://schema.org/Article"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {isIntersecting && (
        <>
          <LazyImage
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            className="w-full h-48 object-cover"
            width={400}
            height={192}
            loading="lazy"
          />
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-primary text-white text-xs rounded capitalize">
                {article.category?.translations?.[article.language]?.name ||
                  article.category?.name ||
                  "Uncategorized"}
              </span>
              {article.socialMediaLinkResponseDtos && (
                <SocialIcons links={article.socialMediaLinkResponseDtos} />
              )}
              <time
                className="text-sm text-gray-500"
                dateTime={article.publishedAt}
              >
                {article.readingTime || 0} {t("article.readingTimePlural")}
              </time>
            </div>

            <h2
              className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2"
              itemProp="headline"
            >
              {article.title}
            </h2>

            <p
              className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3"
              itemProp="description"
            >
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between">
              {/* <span className="text-sm text-gray-500" itemProp="author">
                {article.author?.name || "Anonymous"}
              </span> */}
              <Link href={`/article/${article.slug}`}>
                <Button
                  size="sm"
                  aria-label={`Read more about ${article.title}`}
                >
                  {t("common.readMore")}
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </article>
  );
});

ArticleCard.displayName = "ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  getImageUrl: (imageUrl: string | null | undefined) => string;
}

export const ArticleGrid = memo<ArticleGridProps>(
  ({ articles, getImageUrl }) => {
    // Add safety check - this is line 115 where the error occurs
    if (!articles || !Array.isArray(articles)) {
      return <div>No articles available</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            getImageUrl={getImageUrl}
          />
        ))}
      </div>
    );
  }
);

export default ArticleGrid;
