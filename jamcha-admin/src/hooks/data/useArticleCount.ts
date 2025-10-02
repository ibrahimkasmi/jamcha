import { useQuery } from "@tanstack/react-query";

export function useArticleCount() {
  return useQuery({
    queryKey: ["popularAuthors"],
    queryFn: async () => {
      const response = await fetch("/api/authors/popular?limit=100");
      if (!response.ok) throw new Error("Failed to fetch author stats");
      const data = await response.json();
      // Map: { [authorName]: articleCount }
      const map: Record<string, number> = {};
      data.forEach((author: { name: string; articleCount: number }) => {
        map[author.name] = author.articleCount;
      });
      return map;
    }
  });
}
