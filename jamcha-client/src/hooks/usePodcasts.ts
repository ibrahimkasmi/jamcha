// src/hooks/usePodcasts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';
import type { Podcast } from '@/types/podcast';

// Hook to fetch all podcasts
export function usePodcasts(limit?: number, category?: string) {
  const { language } = useStore();
  
  return useQuery({
    queryKey: ['podcasts', language, limit, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        language,
        ...(limit && { limit: limit.toString() }),
        ...(category && { category })
      });
      
      const response = await fetch(`/api/podcasts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch podcasts');
      return response.json() as Promise<Podcast[]>;
    },
  });
}

// Hook to fetch a single podcast by ID
export function usePodcast(id: number) {
  return useQuery({
    queryKey: ['podcast', id],
    queryFn: async () => {
      const response = await fetch(`/api/podcasts/id/${id}`);
      if (!response.ok) throw new Error('Failed to fetch podcast');
      return response.json() as Promise<Podcast>;
    },
    enabled: !!id,
  });
}

// Hook to fetch a podcast by slug
export function usePodcastBySlug(slug: string) {
  return useQuery({
    queryKey: ['podcast-slug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/podcasts/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch podcast');
      return response.json() as Promise<Podcast>;
    },
    enabled: !!slug,
  });
}

// Hook to fetch featured podcasts
export function useFeaturedPodcasts(limit: number = 5) {
  const { language } = useStore();
  
  return useQuery({
    queryKey: ['featured-podcasts', language, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        language,
        limit: limit.toString()
      });
      
      const response = await fetch(`/api/podcasts/featured?${params}`);
      if (!response.ok) throw new Error('Failed to fetch featured podcasts');
      return response.json() as Promise<Podcast[]>;
    },
  });
}

// Hook to fetch most viewed podcasts
export function useMostViewedPodcasts(limit: number = 10) {
  const { language } = useStore();
  
  return useQuery({
    queryKey: ['most-viewed-podcasts', language, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        language,
        limit: limit.toString()
      });
      
      const response = await fetch(`/api/podcasts/most-viewed?${params}`);
      if (!response.ok) throw new Error('Failed to fetch most viewed podcasts');
      return response.json() as Promise<Podcast[]>;
    },
  });
}

// Hook to search podcasts
export function useSearchPodcasts(query: string) {
  const { language } = useStore();
  
  return useQuery({
    queryKey: ['search-podcasts', query, language],
    queryFn: async () => {
      const params = new URLSearchParams({
        query,
        language
      });
      
      const response = await fetch(`/api/podcasts/search?${params}`);
      if (!response.ok) throw new Error('Failed to search podcasts');
      return response.json() as Promise<Podcast[]>;
    },
    enabled: query.length > 0,
  });
}

// Hook to increment view count
export function useIncrementPodcastView() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (podcastId: number) => {
      const response = await fetch(`/api/podcasts/${podcastId}/view`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to increment view count');
    },
    onSuccess: (_, podcastId) => {
      // Invalidate and refetch podcast data
      queryClient.invalidateQueries({ queryKey: ['podcast', podcastId] });
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      queryClient.invalidateQueries({ queryKey: ['most-viewed-podcasts'] });
    },
  });
}