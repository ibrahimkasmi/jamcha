import { SocialMediaLink } from "./social.ts";

export interface Author {
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
  providerId?: string;
  role?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  translations: {
    [key: string]: {
      name: string;
    };
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  videoUrl?: string;
  featuredImage?: string;
  category: Category;
  tags?: Tag[];
  comments?: Comment[];
  author?: Author;
  readingTime?: number;
  publishedAt: string;
  updatedAt?: string;
  isBreaking?: boolean;
  isActive?: boolean;
  language: "ar" | "en" | "fr";
  translations?: string;
  socialMediaLinkResponseDtos?: SocialMediaLink[];
  authorRole?: string;
}
