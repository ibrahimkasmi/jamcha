
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Newsletter } from "@/types/newsletter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export const useNewsletters = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery<Newsletter[]>({
    queryKey: ["/api/newsletter"],
    queryFn: () => api.get("/newsletter"),
    enabled: isAdmin,
  });

  const { mutate: updateSubscriber, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, ...data }: { id: number; email: string; isActive: boolean }) =>
      api.put(`/newsletter/${id}`, data),
    onSuccess: () => {
      toast({
        title: t("subscriberStateSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter"] });
    },
    onError: (error: any) => {
      toast({
        title: t("subscriberStateFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    updateSubscriber,
    isUpdating,
  };
};
