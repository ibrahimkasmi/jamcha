export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
  providerId?: string;
  role?: string;
}
