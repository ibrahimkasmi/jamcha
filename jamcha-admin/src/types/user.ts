export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  articlesCount: number;
  provider?: string;
  providerId?: string;
  authorName?: string;
  avatar?: string;
}

export interface UserProfile {
  id: number;
  authorName: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  articlesCount?: number;
}