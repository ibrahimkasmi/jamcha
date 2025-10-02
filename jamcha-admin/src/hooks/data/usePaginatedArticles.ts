import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Article } from "@/types/article";
import { useAuth } from "@/contexts/AuthContext";

export const usePaginatedArticles = (page: number, limit: number = 10) => {
  const { isAuthenticated } = useAuth();
  const { data = [], isLoading, refetch } = useQuery<Article[]>({
    queryKey: ["/api/articles/my-articles", page, limit],
    queryFn: async () => {
      // Use the exact limit provided by the component
      return api.get(`/articles/my-articles?page=${page}&limit=${limit}`);
    },
    enabled: isAuthenticated,
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
