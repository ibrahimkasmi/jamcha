// src/features/comments/components/CommentCard/CommentCard.tsx
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  User,
  ExternalLink,
  ThumbsUp,
  Reply,
  MessageCircle,
} from "lucide-react";
import { Link } from "wouter";
import { t } from "@/lib/i18n";

import type { Comment } from '@/types/comment';

interface CommentCardProps {
  comment: Comment;
  replies: Comment[];
  getArticleData: (articleId: number) => { title: string; slug: string | null };
  formatDate: (dateString: string) => string;
}

// ✅ memo HERE - prevents re-rendering when parent updates but comment stays same
export const CommentCard = memo<CommentCardProps>(
  ({ comment, replies, getArticleData, formatDate }) => {
    const articleData = getArticleData(comment.articleId);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {comment.author.name}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Calendar className="h-4 w-4 ml-1" />
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            </div>

            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">
                {t("commentsPage.commentedOn")}
              </div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                {articleData.title}
              </div>
              {articleData.slug ? (
                <Link href={`/article/${articleData.slug}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 ml-2" />
                    {t("commentsPage.readArticle")}
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ExternalLink className="h-4 w-4 ml-2" />
                  {t("commentsPage.articleUnavailable")}
                </Button>
              )}
            </div>
          </div>

          {/* Comment Content */}
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* Comment Stats */}
          <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 ml-1" />
              {comment.likesCount || 0} {t("commentsPage.likes")}
            </div>

            {replies.length > 0 && (
              <div className="flex items-center">
                <Reply className="h-4 w-4 ml-1" />
                {replies.length} {t("commentsPage.replies")}
              </div>
            )}

            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 ml-1" />
              {t("commentsPage.commentId")}
              {comment.id}
            </div>
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-6 space-y-4 pr-6 border-r-2 border-blue-100 dark:border-blue-800">
              <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Reply className="h-4 w-4 ml-2" />
                {t("commentsPage.repliesTitle")} ({replies.length})
              </div>
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {reply.author.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(reply.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    {reply.content}
                  </p>

                  <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <ThumbsUp className="h-3 w-3 ml-1" />
                      {reply.likesCount || 0}
                    </div>
                    <span>
                      {t("commentsPage.replyId")}
                      {reply.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

CommentCard.displayName = "CommentCard";
