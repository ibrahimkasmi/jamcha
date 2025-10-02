import { useQuery } from "@tanstack/react-query";
import i18n from "@/lib/i18n";

export interface TopFlopEntry {
  id: number;
  personName: string;
  slug: string;
  description: string;
  reason: string;
  position: number;
  profileImage?: string;
  entryType: "TOP" | "FLOP";
  category: any;
  author: any;
  weekOf: string;
  voteCount: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export const useTopFlop = () => {
  const { data = [], isLoading, refetch } = useQuery<TopFlopEntry[]>({
    queryKey: ["/api/topflop/current-week"],
    queryFn: async () => {
      const response = await fetch(`/api/topflop/current-week`);
      if (!response.ok) throw new Error("Failed to fetch top-flop data");
      return response.json();
    },
  });
  return { data, isLoading, refetch };
};
