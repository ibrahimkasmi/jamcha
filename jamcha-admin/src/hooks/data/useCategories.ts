
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export const useCategories = () => {
  const { data, isLoading, refetch } = useQuery<Category[]>({ queryKey: ["/api/categories"], queryFn: () => api.get("/categories") });
  return { data: data || [], isLoading, refetch };
};
