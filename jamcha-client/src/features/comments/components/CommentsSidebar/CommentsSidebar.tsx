// src/features/comments/components/CommentsSidebar/CommentsSidebar.tsx
import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Flame, User, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { t } from "@/lib/i18n";

import type { Comment } from '@/types/comment';

interface CommentsSidebarProps {
  comments: Comment[];
  getArticleData: (articleId: number) => { title: string; slug: string | null };
}

// ✅ memo HERE - expensive statistics calculations, prevent unnecessary recalculation
export const CommentsSidebar = memo<CommentsSidebarProps>(
  ({ comments, getArticleData }) => {
    // ✅ useMemo HERE - expensive statistical operations on large arrays
    const statistics = useMemo(() => {
      const totalComments = comments.length;
      const totalUsers = new Set(comments.map((c) => c.author.email)).size;
      const totalLikes = comments.reduce(
        (sum, c) => sum + (c.likesCount || 0),
        0
      );

      // Active users this week
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const activeUsers = comments
        .filter((c) => new Date(c.createdAt) > oneWeekAgo)
        .map((c) => c.author.name)
        .filter((name, index, arr) => arr.indexOf(name) === index)
        .slice(0, 5);

      // Top commented articles
      const topCommentedArticles = Object.entries(
        comments.reduce((acc: { [key: number]: number }, comment) => {
          acc[comment.articleId] = (acc[comment.articleId] || 0) + 1;
          return acc;
        }, {})
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      return {
        totalComments,
        totalUsers,
        totalLikes,
        activeUsers,
        topCommentedArticles,
      };
    }, [comments]);

    return (
      <div className="space-y-6">
        {/* General Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="ml-2 h-5 w-5" />
              {t("commentsPage.sidebar.statsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {t("commentsPage.sidebar.totalComments")}
              </span>
              <Badge variant="secondary">{statistics.totalComments}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {t("commentsPage.sidebar.participants")}
              </span>
              <Badge variant="secondary">{statistics.totalUsers}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {t("commentsPage.sidebar.likes")}
              </span>
              <Badge variant="secondary">{statistics.totalLikes}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="ml-2 h-5 w-5" />
              {t("commentsPage.sidebar.activeUsersTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.activeUsers.length > 0 ? (
                statistics.activeUsers.map((username, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 space-x-reverse"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{username}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  {t("commentsPage.sidebar.noActivity")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Discussions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Flame className="ml-2 h-5 w-5" />
              {t("commentsPage.sidebar.topDiscussionsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.topCommentedArticles.length > 0 ? (
                statistics.topCommentedArticles.map(([articleId, count]) => {
                    const articleData = getArticleData(Number(articleId));
                    return (
                      <div key={articleId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {articleData.title}
                          </span>
                          <Badge variant="outline">
                            {count} {t("commentsPage.totalComments")}
                          </Badge>
                        </div>
                        {articleData.slug ? (
                          <Link href={`/article/${articleData.slug}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                            >
                              <BookOpen className="ml-2 h-4 w-4" />
                              {t("commentsPage.readArticle")}
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            disabled
                          >
                            <BookOpen className="ml-2 h-4 w-4" />
                            {t("commentsPage.articleUnavailable")}
                          </Button>
                        )}
                      </div>
                    );
                  }
                )
              ) : (
                <p className="text-gray-500 text-sm">
                  {t("commentsPage.sidebar.noData")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

CommentsSidebar.displayName = "CommentsSidebar";
