import { useQuery } from '@tanstack/react-query';

export function useAuthors() {
  return useQuery({
    queryKey: ['popular-authors'],
    queryFn: async () => {
      const response = await fetch('/api/authors/popular?limit=5');
      if (!response.ok) throw new Error('Failed to fetch popular authors');
      return response.json();
    },
  });
}