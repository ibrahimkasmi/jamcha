export interface TopFlopEntry {
  id: number;
  personName: string;
  slug: string;
  description: string;
  reason: string;
  position: number;
  profileImage?: string;
  category: any; // Should be replaced with Category if available
  author: any;   // Should be replaced with Author if available
  weekOf: string;
  voteCount: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}
