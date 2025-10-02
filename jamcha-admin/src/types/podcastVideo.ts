import { Category } from "./category";
import { Author } from "./author";
import { Tag } from "./tag";

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
