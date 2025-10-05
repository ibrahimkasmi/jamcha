import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock } from 'lucide-react';
import { useCallback } from 'react';
import { formatTimeToArabic } from '@/lib/time-utils';
import { t } from '@/lib/i18n';

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
  authorRole,
  category,
  tags,
  featuredImage,
  videoUrl,
  isBreaking,
  language
}: ArticlePreviewProps) {

  const handleShare = useCallback(() => {
    const shareData = {
      title,
      text: excerpt,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  }, [title, excerpt]);

  const getYouTubeEmbedUrl = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=0` : null;
  };

  const getEmbedUrl = (url: string) => {
    if (!url || url.trim() === '') return null;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return getYouTubeEmbedUrl(url);
    } else if (url.includes('vimeo.com')) {
      return getVimeoEmbedUrl(url);
    }
    return null;
  };

  const readingTime = Math.ceil(content.split(' ').length / 200);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-8">
          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-2">
              <Badge variant={isBreaking ? "destructive" : "default"}>
                {isBreaking ? t('article.breaking') : category.translations[language]?.name || category.name}
              </Badge>
              <Badge variant="outline">{language.toUpperCase()}</Badge>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {excerpt}
            </p>
          </div>

          {/* Meta info & Share button */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b gap-4 justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4" />
                <span className="ml-4">{author}</span>
                <span className="ml-2 text-gray-400">•</span>
                <span className="ml-2">{authorRole}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4" />
                <span className="ml-4">{formatTimeToArabic(new Date())}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4" />
                <span className="ml-4">{readingTime} {t('article.readingTime')}</span>
              </div>
            </div>
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition"
              aria-label="مشاركة"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2 mr-2 h-4 w-4"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
              مشاركة
            </button>
          </div>

          {/* Featured Media */}
          {(featuredImage || videoUrl) && (
            <div className="mb-8 mb-7">
              {videoUrl && videoUrl.trim() !== '' && getEmbedUrl(videoUrl) ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <iframe
                    src={getEmbedUrl(videoUrl)!}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="Article Video"
                    loading="lazy"
                  />
                </div>
              ) : featuredImage && featuredImage.trim() !== '' ? (
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
            {content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
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