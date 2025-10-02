// src/features/comments/contexts/CommentsDataProvider.tsx
import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useComments } from "@/hooks/useComments";
import { useArticles } from "@/hooks/useArticles";

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

interface CommentsContextType {
  comments: Comment[];
  articles: any[];
  isLoading: boolean;
  articlesLoading: boolean;
  error: Error | null;
  searchTerm: string;
  sortBy: "newest" | "oldest" | "popular";
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: "newest" | "oldest" | "popular") => void;
  articlesLookup: Map<number, any>;
  formatDate: (dateString: string) => string;
  getArticleData: (articleId: number) => { title: string; slug: string | null };
}

const CommentsContext = createContext<CommentsContextType | undefined>(
  undefined
);

export const CommentsDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"newest" | "oldest" | "popular">(
    "newest"
  );

  // Use existing working hooks
  const { data: comments = [], isLoading, error } = useComments();
  const { data: articles = [], isLoading: articlesLoading } = useArticles();

  // Regular utility function - no useCallback needed
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  // ✅ useMemo HERE - expensive operation creating lookup map from large array
  const articlesLookup = useMemo(() => {
    const lookup = new Map();
    articles.forEach((article) => {
      lookup.set(article.id, {
        title: article.title,
        slug: article.slug,
      });
    });
    return lookup;
  }, [articles]);

  // Regular function - no useCallback needed for simple operations
  const getArticleData = (articleId: number) => {
    const article = articlesLookup.get(articleId);
    return {
      title: article?.title || `Article #${articleId}`,
      slug: article?.slug || null,
    };
  };

  // Simple object creation - no useMemo needed
  const contextValue: CommentsContextType = {
    comments,
    articles,
    isLoading,
    articlesLoading,
    error,
    searchTerm,
    sortBy,
    setSearchTerm,
    setSortBy,
    articlesLookup,
    formatDate,
    getArticleData,
  };

  return (
    <CommentsContext.Provider value={contextValue}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useCommentsContext = (): CommentsContextType => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error(
      "useCommentsContext must be used within CommentsDataProvider"
    );
  }
  return context;
};
