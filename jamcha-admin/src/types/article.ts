
import { Category } from "./category";
import { Author } from "./author";
import { Tag } from "./tag";
import { Comment } from "./comment";
import { SocialMediaLink } from "./social-media-link";

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  videoUrl: string;
  featuredImage: string;
  category: Category;
  tags: Tag[];
  comments: Comment[];
  author: Author;
  socialMediaLinks: SocialMediaLink[];
  readingTime: number;
  publishedAt: string; // LocalDateTime as ISO string
  isBreaking: boolean;
  isActive: boolean;
  language: string;
  translations: string;
}
