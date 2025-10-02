import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import type { Article } from "@/types/article";

export function useArticles() {
  const { language } = useStore();
  return useQuery({
    queryKey: ["all-articles", language],
    queryFn: async () => {
      const response = await fetch(`/api/articles?language=${language}`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json() as Promise<Article[]>;
    },
  });
}

export function useLatestArticles(limit = 5) {
  const { language } = useStore();

  return useQuery({
    queryKey: ["latest-articles", language, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/articles/latest?language=${language}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch latest articles");
      return response.json();
    },
  });
}
