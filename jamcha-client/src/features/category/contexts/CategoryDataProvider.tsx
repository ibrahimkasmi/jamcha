// src/features/category/contexts/CategoryDataProvider.tsx
import React, {
  createContext,
  useContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useStore } from "@/store/useStore";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/types/article";

interface CategoryContextType {
  articles: Article[] | undefined;
  isLoading: boolean;
  error: Error | null;
  category: string;
  language: string;
  limit: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  loadMore: () => void;
  getImageUrl: (imageUrl: string | null | undefined) => string;
  categoryInfo: { id: string; name: string } | undefined;
  categoryName: string;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setSelectedCategory, language } = useStore();
  const { category } = useParams<{ category: string }>();
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [limit, setLimit] = React.useState(10);

  // Regular utility function - no useCallback needed
  const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl)
      return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `/api/files/download/${imageUrl}`;
  };

  // ✅ useCallback ONLY for functions passed to children
  const loadMore = useCallback(() => {
    setLimit((prev) => prev + 10);
  }, []);

  // Update selected category when URL changes
  React.useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category, setSelectedCategory]);

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles", { category, language, limit }],
    queryFn: async () => {
      if (!category) throw new Error("Category is required");
      if (!CATEGORIES.some((cat) => cat.id === category)) {
        throw new Error("Invalid category");
      }

      const params = new URLSearchParams({
        language,
        limit: limit.toString(),
        category: category,
      });

      try {
        const response = await fetch(`/api/articles?${params}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", errorText);
          throw new Error(
            `Failed to fetch articles: ${response.status} ${errorText}`
          );
        }

        const articles = await response.json();

        if (!Array.isArray(articles)) {
          console.error("Invalid response format:", articles);
          return [];
        }

        return articles as Article[];
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    },
    enabled: !!category,
  });

  // Simple operations - no useMemo needed
  const categoryInfo = CATEGORIES.find((cat) => cat.id === category);
  const categoryName = categoryInfo ? categoryInfo.name : category || "";

  // Simple object creation - no useMemo needed
  const contextValue: CategoryContextType = {
    articles,
    isLoading,
    error,
    category: category || "",
    language,
    limit,
    viewMode,
    setViewMode,
    loadMore,
    getImageUrl,
    categoryInfo,
    categoryName,
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategoryContext must be used within CategoryDataProvider"
    );
  }
  return context;
};
