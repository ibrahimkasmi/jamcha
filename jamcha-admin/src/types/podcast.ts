export interface Author {
  id?: number;
  name: string;
  email?: string;
  avatar?: string | null;
  provider?: string;
  providerId?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface PodcastVideo {
  id: number;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: Category;
  tags: Tag[];
  author: Author;
  duration: number;
  viewCount: number;
  publishedAt: string;
  isFeatured: boolean;
  language: string;
  translations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  translations?: Record<string, any> | object;
}
