// src/features/comments/hooks/useCommentsData.ts
import { useMemo } from "react";
import { useCommentsContext } from "../contexts/CommentsDataProvider";

export const useCommentsData = () => {
  const context = useCommentsContext();

  // ✅ useMemo HERE - expensive filtering and sorting operations on large arrays
  const filteredComments = useMemo(() => {
    return context.comments.filter(
      (comment) =>
        comment.content
          .toLowerCase()
          .includes(context.searchTerm.toLowerCase()) ||
        comment.author.name
          .toLowerCase()
          .includes(context.searchTerm.toLowerCase()) ||
        (comment.author.email || "")
          .toLowerCase()
          .includes(context.searchTerm.toLowerCase())
    );
  }, [context.comments, context.searchTerm]);

  const sortedComments = useMemo(() => {
    return [...filteredComments].sort((a, b) => {
      switch (context.sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "popular":
          return (b.likesCount || 0) - (a.likesCount || 0);
        default:
          return 0;
      }
    });
  }, [filteredComments, context.sortBy]);

  // ✅ useMemo HERE - expensive filtering operation on sorted array
  const mainComments = useMemo(() => {
    return sortedComments.filter((comment) => !comment.parentId);
  }, [sortedComments]);

  // Function to get replies - simple operation, no memoization needed
  const getReplies = (commentId: number) =>
    sortedComments.filter((comment) => comment.parentId === commentId);

  // Simple boolean operations - no useMemo needed
  const hasComments = mainComments.length > 0;
  const isEmpty = !context.isLoading && mainComments.length === 0;
  const isError = !context.isLoading && !!context.error;

  return {
    ...context,
    filteredComments,
    sortedComments,
    mainComments,
    getReplies,
    hasComments,
    isEmpty,
    isError,
  };
};
