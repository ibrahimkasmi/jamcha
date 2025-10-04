import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";
import { formatTimeToArabic } from "@/lib/time-utils";
import i18n from "@/lib/i18n";

interface ArticlePreviewProps {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorRole: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon: string;
    translations: {
      [key: string]: {
        name: string;
      };
    };
  };
  tags: string[];
  featuredImage?: string;
  videoUrl?: string;
  isBreaking: boolean;
  language: string;
}

export function ArticlePreview({
  title,
  content,
  excerpt,
  author,
  // authorRole,
  category,
  tags,
  featuredImage,
  videoUrl,
  isBreaking,
  language,
}: ArticlePreviewProps) {
  const { t } = useTranslation();
  const dir = i18n.dir?.() || 'ltr';
  const getYouTubeEmbedUrl = (url: string) => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match
      ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`
      : null;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match
      ? `https://player.vimeo.com/video/${match[1]}?autoplay=0`
      : null;
  };

  const getEmbedUrl = (url: string) => {
    if (!url || url.trim() === "") return null;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return getYouTubeEmbedUrl(url);
    } else if (url.includes("vimeo.com")) {
      return getVimeoEmbedUrl(url);
    }
    return null;
  };

  const readingTime = Math.ceil(content.split(" ").length / 200);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-8">
          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2'} gap-2`}>
              <Badge variant={isBreaking ? "destructive" : "default"}>
                {isBreaking
                  ? t("breaking")
                  : t(category.name)}
              </Badge>
              <Badge variant="outline">{t(language) || language.toUpperCase()}</Badge>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {excerpt}
            </p>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b">
            <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-1' : 'space-x-1'} gap-1`}>
              <User className="h-4 w-4" />
              <span>{author}</span>
              <span className="text-gray-400">•</span>
              {/* <span>{authorRole}</span> */}
            </div>
            <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-1' : 'space-x-1'} gap-1`}>
              <Calendar className="h-4 w-4" />
              <span>{formatTimeToArabic(new Date())}</span>
            </div>
            <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-1' : 'space-x-1'} gap-1`}>
              <Clock className="h-4 w-4" />
              <span>{readingTime} {t("minutesToRead")}</span>
            </div>
          </div>

          {/* Featured Media */}
          {(featuredImage || videoUrl) && (
            <div className="mb-8">
              {videoUrl && videoUrl.trim() !== "" && getEmbedUrl(videoUrl) ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <iframe
                    src={getEmbedUrl(videoUrl)!}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={t("articleVideo")}
                    loading="lazy"
                  />
                </div>
              ) : featuredImage && featuredImage.trim() !== "" ? (
                <img
                  src={featuredImage}
                  alt={title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                  loading="lazy"
                />
              ) : null}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
                    {paragraph.slice(2, -2)}
                  </h3>
                );
              }
              return (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
