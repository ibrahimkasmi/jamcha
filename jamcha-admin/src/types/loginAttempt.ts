export interface LoginAttempt {
  id: number;
  userId: number;
  timestamp: string;
  success: boolean;
  ipAddress: string;
}
