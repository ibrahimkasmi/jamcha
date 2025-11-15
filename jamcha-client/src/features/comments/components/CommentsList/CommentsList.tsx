// src/features/comments/components/CommentsList/CommentsList.tsx
import  { memo } from "react";
import { CommentCard } from "../CommentCard/CommentCard";

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

interface CommentsListProps {
  mainComments: Comment[];
  getReplies: (commentId: number) => Comment[];
  getArticleData: (articleId: number) => { title: string; slug: string | null };
  formatDate: (dateString: string) => string;
}

// ✅ memo HERE - prevents re-rendering entire list when parent updates
export const CommentsList = memo<CommentsListProps>(
  ({ mainComments, getReplies, getArticleData, formatDate }) => {
    // Safety check
    if (!mainComments || !Array.isArray(mainComments)) {
      return <div>No comments available</div>;
    }

    return (
      <div className="space-y-6">
        {mainComments.map((comment) => {
          const replies = getReplies(comment.id);
          return (
            <CommentCard
              key={comment.id}
              comment={comment}
              replies={replies}
              getArticleData={getArticleData}
              formatDate={formatDate}
            />
          );
        })}
      </div>
    );
  }
);

CommentsList.displayName = "CommentsList";
