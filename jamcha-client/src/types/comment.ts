// src/types/comment.ts
export interface Comment {
  id: number;
  articleId: number;
  content: string;
  author: {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
  };
  parentId?: number;
  isApproved: boolean;
  likesCount: number;
  isReported: boolean;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
}

export interface CommentRequest {
  articleId: number;
  content: string;
  parentId?: number;
  userEmail: string;
  userUsername: string;
}