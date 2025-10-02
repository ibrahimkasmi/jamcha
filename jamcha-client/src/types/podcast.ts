// src/types/podcast.ts
export interface Author {
  id: number;
  name: string;
  email?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Podcast {
  id: number;
  title: string;
  slug: string;
  description: string;
  excerpt?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: Category;
  tags?: Tag[];
  author?: Author;
  duration?: number; // in minutes
  publishedAt: string;
  featured: boolean;
  viewCount: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}