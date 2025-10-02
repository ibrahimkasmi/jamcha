
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Article } from "@/types/article";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export const useArticles = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data, isLoading, refetch } = useQuery<Article[]>({
    queryKey: ["/api/articles/my-articles"],
    queryFn: async () => {
      const response = await api.get("/articles/my-articles");
      // If backend returns { articles: Article[], count: number }
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.articles)) return response.articles;
      return [];
    },
    enabled: isAuthenticated,
  });

  const toggleArticleActiveMutation = useMutation({
    mutationFn: (articleId: number) => {
      return api.patch(`/articles/${articleId}/toggle-active`, {});
    },
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles/my-articles"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/articles", articleId.toString()],
      });
      toast({
        title: t("success"),
        description: t("articleUpdatedSuccessfully"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("error"),
        description: error.message || t("failedToUpdateArticle"),
        variant: "destructive",
      });
    },
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    toggleArticleActive: toggleArticleActiveMutation.mutate,
    isToggling: toggleArticleActiveMutation.isPending,
  };
};
