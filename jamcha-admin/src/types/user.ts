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
