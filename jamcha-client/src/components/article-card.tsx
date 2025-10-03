import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { formatTimeToArabic } from '@/lib/time-utils';
import {
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Share2,
  User
} from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/useToast';
import { apiRequest } from '@/lib/queryClient';
import type { Article } from '@/types/article';
import { t } from '@/lib/i18n';
import { SocialIcons } from '@/components/ui/social-icons.tsx';

interface ArticleCardProps {
  article: Article;
  isBookmarked?: boolean;
}

export function ArticleCard({ article, isBookmarked = false }: ArticleCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const url = bookmarked ? `/api/bookmarks/${article.id}` : '/api/bookmarks';
      const method = bookmarked ? 'DELETE' : 'POST';
      return apiRequest(method, url, { articleId: article.id });
    },
    onSuccess: () => {
      setBookmarked(!bookmarked);
      toast({
        title: bookmarked ? t('message.unbookmarked') : t('message.bookmarked'),
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('message.bookmarkError'),
        variant: 'destructive',
      });
    },
  });

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/article/${article.slug}`);
      toast({
        title: t('message.linkCopySuccess'),
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('message.linkCopyError'),
        variant: 'destructive',
      });
    }
  };

  const getCategoryClass = (category: Article['category']) => {
    return `category-${category.slug}`;
  };

  const getImageUrl = useCallback((imageUrl: string | null | undefined): string => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `/api/files/download/${imageUrl}`;
  }, []);

  return (
    <Card className={`article-card overflow-hidden ${getCategoryClass(article.category)}`}>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3">
          <img
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <CardContent className="w-full md:w-2/3 p-4 md:p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary" className="capitalize">
              {article.category.translations[article.language]?.name || article.category.name}
            </Badge>
            {article.socialMediaLinkResponseDtos && (
              <SocialIcons links={article.socialMediaLinkResponseDtos} />
            )}
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
              <Calendar className="h-3 w-3" />
              <span>{formatTimeToArabic(new Date(article.publishedAt))}</span>
            </div>
          </div>

          <Link href={`/article/${article.slug}`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer line-clamp-2">
              {article.title}
            </h3>
          </Link>

          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {article.author?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {article.authorRole}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{article.readingTime} {t('article.readingTime')}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => bookmarkMutation.mutate()}
                disabled={bookmarkMutation.isPending}
                className="p-2"
              >
                {bookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
