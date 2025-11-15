// src/hooks/useTopFlop.ts
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';
import type { TopFlopEntry } from '@/types/topflop';

// Hook to fetch current week entries
export function useCurrentWeekTopFlop() {
  const { language } = useStore();
  
  return useQuery({
    queryKey: ['topflop-current-week', language],
    queryFn: async () => {
      const params = new URLSearchParams({
        language
      });
      
      const response = await fetch(`/api/topflop/current-week?${params}`);
      if (!response.ok) throw new Error('Failed to fetch current week top-flop entries');
      return response.json() as Promise<TopFlopEntry[]>;
    },
  });
}

// Hook to fetch entries by specific week
export function useTopFlopByWeek(date: string) {
  const { language } = useStore();
  
  return useQuery({
    queryKey: ['topflop-week', date, language],
    queryFn: async () => {
      const params = new URLSearchParams({
        language
      });
      
      const response = await fetch(`/api/topflop/week/${date}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch top-flop entries for week');
      return response.json() as Promise<TopFlopEntry[]>;
    },
    enabled: !!date,
  });
}

// Hook to fetch a single entry by ID
export function useTopFlopById(id: number) {
  return useQuery({
    queryKey: ['topflop', id],
    queryFn: async () => {
      const response = await fetch(`/api/topflop/id/${id}`);
      if (!response.ok) throw new Error('Failed to fetch top-flop entry');
      return response.json() as Promise<TopFlopEntry>;
    },
    enabled: !!id,
  });
}

// Hook to fetch a single entry by slug
export function useTopFlopBySlug(slug: string) {
  return useQuery({
    queryKey: ['topflop-slug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/topflop/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch top-flop entry');
      return response.json() as Promise<TopFlopEntry>;
    },
    enabled: !!slug,
  });
}

// Hook to get profile image info
export function useTopFlopImageInfo(id: number) {
  return useQuery({
    queryKey: ['topflop-image-info', id],
    queryFn: async () => {
      const response = await fetch(`/api/topflop/${id}/image/info`);
      if (!response.ok) throw new Error('Failed to fetch image info');
      return response.json() as Promise<Record<string, any>>;
    },
    enabled: !!id,
  });
}