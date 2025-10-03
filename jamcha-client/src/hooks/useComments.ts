import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Comment, CommentRequest } from '@/types/comment';

// Hook to fetch all comments
export function useComments() {
  return useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const response = await fetch('/api/comments');
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json() as Promise<Comment[]>;
    },
  });
}

// Hook to fetch a single comment by ID
export function useComment(id: number) {
  return useQuery({
    queryKey: ['comment', id],
    queryFn: async () => {
      const response = await fetch(`/api/comments/${id}`);
      if (!response.ok) throw new Error('Failed to fetch comment');
      return response.json() as Promise<Comment>;
    },
    enabled: !!id,
  });
}

// Hook to fetch comments by article ID
export function useCommentsByArticle(articleId: number) {
  return useQuery({
    queryKey: ['comments-article', articleId],
    queryFn: async () => {
      const response = await fetch(`/api/comments/article/${articleId}`);
      if (!response.ok) throw new Error('Failed to fetch article comments');
      return response.json() as Promise<Comment[]>;
    },
    enabled: !!articleId,
  });
}

// Hook to create a new comment
export function useCreateComment() {
  const queryClient = useQueryClient();
   
  return useMutation({
    mutationFn: async (commentData: CommentRequest) => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create comment');
      }
      
      return response.json() as Promise<Comment>;
    },
    onSuccess: (newComment) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments-article', newComment.articleId] });
    },
  });
}

// Hook to update a comment
export function useUpdateComment() {
  const queryClient = useQueryClient();
   
  return useMutation({
    mutationFn: async ({ id, commentData }: { id: number; commentData: CommentRequest }) => {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update comment');
      }
      
      return response.json() as Promise<Comment>;
    },
    onSuccess: (updatedComment) => {
      queryClient.invalidateQueries({ queryKey: ['comment', updatedComment.id] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments-article', updatedComment.articleId] });
    },
  });
}

// Hook to delete a comment
export function useDeleteComment() {
  const queryClient = useQueryClient();
   
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete comment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

// Hook to like a comment
export function useLikeComment() {
  const queryClient = useQueryClient();
   
  return useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to like comment');
      return response.json() as Promise<Comment>;
    },
    onSuccess: (likedComment) => {
      queryClient.invalidateQueries({ queryKey: ['comment', likedComment.id] });
      queryClient.invalidateQueries({ queryKey: ['comments-article', likedComment.articleId] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

// Hook to report a comment
export function useReportComment() {
  const queryClient = useQueryClient();
   
  return useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetch(`/api/comments/${commentId}/report`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to report comment');
      return response.json() as Promise<Comment>;
    },
    onSuccess: (reportedComment) => {
      queryClient.invalidateQueries({ queryKey: ['comment', reportedComment.id] });
      queryClient.invalidateQueries({ queryKey: ['comments-article', reportedComment.articleId] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

// Hook to get comment count for an article
export function useCommentCount(articleId: number) {
  return useQuery({
    queryKey: ['comment-count', articleId],
    queryFn: async () => {
      const response = await fetch(`/api/comments/article/${articleId}/count`);
      if (!response.ok) throw new Error('Failed to fetch comment count');
      const data = await response.json();
      return data.count as number;
    },
    enabled: !!articleId,
  });
}