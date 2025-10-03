// src/features/article/contexts/ArticleDataProvider.tsx
import React, {
  createContext,
  useContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useStore } from "@/store/useStore";
import type { Article } from "@/types/article";
import { t } from "@/lib/i18n";

interface ArticleContextType {
  article: Article | undefined;
  isLoading: boolean;
  error: Error | null;
  slug: string;
  sessionId: string;
  getImageUrl: (imageUrl: string | null | undefined) => string | null;
  getEmbedUrl: (url: string) => string | null;
  handleShare: () => Promise<void>;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

interface ArticleDataProviderProps {
  children: ReactNode;
}

export const ArticleDataProvider: React.FC<ArticleDataProviderProps> = ({
  children,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const { sessionId } = useStore();

  // ✅ useCallback for functions that don't change - reuse shared logic
  const getImageUrl = useCallback(
    (imageUrl: string | null | undefined): string | null => {
      if (!imageUrl) return null;
      if (imageUrl.startsWith("http")) return imageUrl;
      return `/api/files/download/${imageUrl}`;
    },
    []
  );

  // ✅ useCallback for complex video URL processing - expensive regex operations
  const getEmbedUrl = useCallback((url: string): string | null => {
    if (!url || url.trim() === "") return null;

    // YouTube URL processing
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regex =
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
      const match = url.match(regex);
      return match
        ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`
        : null;
    }

    // Vimeo URL processing
    if (url.includes("vimeo.com")) {
      const regex = /vimeo\.com\/(\d+)/;
      const match = url.match(regex);
      return match
        ? `https://player.vimeo.com/video/${match[1]}?autoplay=0`
        : null;
    }

    return null;
  }, []);

  // ✅ useCallback for async function passed to children
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Could dispatch toast notification here
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }, []);

  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/articles", slug],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${slug}`);
      if (!response.ok) throw new Error(t("common.error"));
      return response.json() as Promise<Article>;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes - articles don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // ❌ NO useMemo - simple object creation is fast
  const contextValue: ArticleContextType = {
    article,
    isLoading,
    error,
    slug: slug || "",
    sessionId,
    getImageUrl,
    getEmbedUrl,
    handleShare,
  };

  return (
    <ArticleContext.Provider value={contextValue}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticleContext = (): ArticleContextType => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error(
      "useArticleContext must be used within ArticleDataProvider"
    );
  }
  return context;
};
