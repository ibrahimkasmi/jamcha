// src/features/home/contexts/HomeDataProvider.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useParams } from "wouter";
import { useStore } from "@/store/useStore";
import { useArticles } from "@/hooks/useArticles"; // Your working hook
import type { Article } from "@/types/article";

interface HomeContextType {
  articles: Article[] | undefined;
  isLoading: boolean;
  error: Error | null;
  selectedCategory: string;
  language: string;
  limit: number;
  viewMode: "grid" | "list";
  setSelectedCategory: (category: string) => void;
  setViewMode: (mode: "grid" | "list") => void;
  loadMore: () => void;
  getImageUrl: (imageUrl: string | null | undefined) => string;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { selectedCategory, setSelectedCategory, language } = useStore();
  const { category } = useParams<{ category?: string }>();
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [limit, setLimit] = React.useState(10);

  // ✅ Use your working hook directly - no custom query
  const { data: allArticles, isLoading, error } = useArticles();

  console.log("Context provider - useArticles result:", allArticles);

  const getImageUrl = useCallback(
    (imageUrl: string | null | undefined): string => {
      if (!imageUrl)
        return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&auto=format&fit=crop&q=75";
      if (imageUrl.startsWith("http")) return imageUrl;
      return `/api/files/download/${imageUrl}`;
    },
    []
  );

  const loadMore = useCallback(() => {
    setLimit((prev) => prev + 10);
  }, []);

  // Update selected category when URL changes
  React.useEffect(() => {
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
    } else if (!category && selectedCategory !== "all") {
      setSelectedCategory("all");
    }
  }, [category, selectedCategory, setSelectedCategory]);

  // ✅ Simple filtering - same logic as your original HomePage
  const articles = React.useMemo(() => {
    if (!allArticles) return undefined;

    let filtered = allArticles;

    // Filter by category if not "all"
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) =>
          article.category?.name?.toLowerCase() ===
            selectedCategory.toLowerCase() ||
          article.category?.slug === selectedCategory
      );
    }

    // Apply limit
    return filtered.slice(0, limit);
  }, [allArticles, selectedCategory, limit]);

  const contextValue: HomeContextType = {
    articles,
    isLoading,
    error,
    selectedCategory,
    language,
    limit,
    viewMode,
    setSelectedCategory,
    setViewMode,
    loadMore,
    getImageUrl,
  };

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  );
};

export const useHomeContext = (): HomeContextType => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHomeContext must be used within HomeDataProvider");
  }
  return context;
};
