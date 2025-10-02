
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Report {
  id: number;
  commentId: number;
  reason: string;
  details?: string;
  reportedAt: string;
  status: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: {
    id: number;
    content: string;
    authorName: string;
    provider: string;
    articleId: number;
    createdAt: string;
  };
}

export const useReports = () => {
  const { isAdmin } = useAuth();
  const { data, isLoading, refetch } = useQuery<Report[]>({
    queryKey: ["/api/comment-reports"],
    queryFn: () => api.get("/comment-reports"),
    enabled: isAdmin,
  });
  return { data: data || [], isLoading, refetch };
};
