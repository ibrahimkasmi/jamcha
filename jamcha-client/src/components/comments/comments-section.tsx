import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { t } from "@/lib/i18n";

import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Reply,
  ThumbsUp,
  Flag,
  Calendar,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import {
  useCommentsByArticle,
  useCreateComment,
  useLikeComment,
  useReportComment,
} from "@/hooks/useComments";

interface Comment {
  id: number;
  articleId: number;
  content: string;
  userEmail: string;
  userUsername: string;
  parentId?: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  isReported?: boolean;
}

interface CommentsSectionProps {
  articleId: number;
}

export default function CommentsSection({ articleId }: CommentsSectionProps) {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [replyUsername, setReplyUsername] = useState("");

  // Hooks
  const { data: comments = [], isLoading } = useCommentsByArticle(articleId);
  const createCommentMutation = useCreateComment();
  const likeCommentMutation = useLikeComment();
  const reportCommentMutation = useReportComment();

  const handlePostComment = () => {
    if (!newComment.trim() || !userEmail.trim() || !userUsername.trim()) {
      toast({
        title: t("comments.toast.fillAllFields"),
        variant: "destructive",
      });
      return;
    }

    createCommentMutation.mutate(
      {
        articleId,
        content: newComment,
        userEmail: userEmail.toLowerCase().trim(),
        userUsername: userUsername.trim(),
      },
      {
        onSuccess: () => {
          toast({ title: t("comments.toast.postSuccess") });
          setNewComment("");
          setUserEmail("");
          setUserUsername("");
        },
        onError: (error: any) => {
          toast({
            title: t("comments.toast.postError"),
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handlePostReply = () => {
    if (!replyContent.trim() || !replyEmail.trim() || !replyUsername.trim()) {
      toast({
        title: t("comments.toast.fillAllFields"),
        variant: "destructive",
      });
      return;
    }

    createCommentMutation.mutate(
      {
        articleId,
        content: replyContent,
        userEmail: replyEmail.toLowerCase().trim(),
        userUsername: replyUsername.trim(),
        parentId: replyTo,
      },
      {
        onSuccess: () => {
          toast({ title: t("comments.toast.replySuccess") });
          setReplyContent("");
          setReplyEmail("");
          setReplyUsername("");
          setReplyTo(null);
        },
        onError: (error: any) => {
          toast({
            title: t("comments.toast.replyError"),
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleLikeComment = (commentId: number) => {
    likeCommentMutation.mutate(commentId, {
      onSuccess: () => {
        toast({ title: t("comments.toast.likeSuccess") });
      },
      onError: (error: any) => {
        toast({
          title: t("comments.toast.likeError"),
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleReportComment = (commentId: number) => {
    reportCommentMutation.mutate(commentId, {
      onSuccess: () => {
        toast({ title: t("comments.toast.reportSuccess") });
      },
      onError: (error: any) => {
        toast({
          title: t("comments.toast.reportError"),
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group comments and replies
  const groupedComments = Array.isArray(comments)
    ? comments.filter((comment: Comment) => !comment.parentId)
    : [];

  const getReplies = (commentId: number) =>
    Array.isArray(comments)
      ? comments.filter((comment: Comment) => comment.parentId === commentId)
      : [];

  return (
    <Card className="mt-8" dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <MessageSquare className="h-5 w-5" />
          <span>
            {t("comments.title")} ({comments.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder={t("comments.form.usernamePlaceholder")}
              value={userUsername}
              onChange={(e) => setUserUsername(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder={t("comments.form.emailPlaceholder")}
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>
          <Textarea
            placeholder={t("comments.form.commentPlaceholder")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button
            onClick={handlePostComment}
            disabled={createCommentMutation.isPending}
            className="w-full"
          >
            {createCommentMutation.isPending
              ? t("comments.form.postingButton")
              : t("comments.form.postCommentButton")}
          </Button>
        </div>

        <Separator />

        {/* Comments List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">{t("comments.loading")}</div>
          ) : groupedComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {t("comments.noComments")}
              </p>
            </div>
          ) : (
            groupedComments.map((comment: Comment) => {
              const replies = getReplies(comment.id);

              return (
                <div key={comment.id} className="space-y-4">
                  {/* Main Comment */}
                  <div className="flex space-x-3 space-x-reverse">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-medium">
                          {comment.userUsername}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 ml-1" />
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeComment(comment.id)}
                          disabled={likeCommentMutation.isPending}
                        >
                          <ThumbsUp className="h-4 w-4 ml-1" />
                          {t("comments.likeButton")}{" "}
                          {comment.likesCount ? `(${comment.likesCount})` : ""}
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setReplyTo(
                              replyTo === comment.id ? null : comment.id
                            )
                          }
                        >
                          <Reply className="h-4 w-4 ml-1" />
                          {t("comments.replyButton")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReportComment(comment.id)}
                          disabled={
                            reportCommentMutation.isPending ||
                            comment.isReported
                          }
                        >
                          <Flag className="h-4 w-4 ml-1" />
                          {comment.isReported
                            ? t("comments.reportedButton")
                            : t("comments.reportButton")}
                        </Button>
                      </div>

                      {/* Reply Form */}
                      {replyTo === comment.id && (
                        <div className="mt-4 space-y-3 pr-4 border-r-2 border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              type="text"
                              placeholder={t(
                                "comments.form.usernamePlaceholder"
                              )}
                              value={replyUsername}
                              onChange={(e) => setReplyUsername(e.target.value)}
                              size="sm"
                            />
                            <Input
                              type="email"
                              placeholder={t("comments.form.emailPlaceholder")}
                              value={replyEmail}
                              onChange={(e) => setReplyEmail(e.target.value)}
                              size="sm"
                            />
                          </div>
                          <Textarea
                            placeholder={t("comments.form.replyPlaceholder")}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                          />
                          <div className="flex space-x-2 space-x-reverse">
                            <Button
                              size="sm"
                              onClick={handlePostReply}
                              disabled={createCommentMutation.isPending}
                            >
                              {createCommentMutation.isPending
                                ? t("comments.form.postingButton")
                                : t("comments.form.postReplyButton")}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReplyTo(null);
                                setReplyContent("");
                                setReplyEmail("");
                                setReplyUsername("");
                              }}
                            >
                              {t("comments.form.cancelButton")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {replies.length > 0 && (
                    <div className="mr-12 space-y-4">
                      {replies.map((reply: Comment) => (
                        <div
                          key={reply.id}
                          className="flex space-x-3 space-x-reverse"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className="font-medium text-sm">
                                {reply.userUsername}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 ml-1" />
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {reply.content}
                            </p>
                            <div className="flex items-center space-x-4 space-x-reverse">
                              {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikeComment(reply.id)}
                                disabled={likeCommentMutation.isPending}
                              >
                                <ThumbsUp className="h-3 w-3 ml-1" />
                                {t('comments.likeButton')} {reply.likesCount ? `(${reply.likesCount})` : ''}
                              </Button> */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReportComment(reply.id)}
                                disabled={
                                  reportCommentMutation.isPending ||
                                  reply.isReported
                                }
                              >
                                <Flag className="h-3 w-3 ml-1" />
                                {reply.isReported
                                  ? t("comments.reportedButton")
                                  : t("comments.reportButton")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
