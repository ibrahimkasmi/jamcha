// src/types/topflop.ts
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

export interface TopFlopEntry {
  id: number;
  personName: string;
  slug: string;
  description: string;
  reason: string;
  position: number;
  profileImage?: string;
  entryType: 'TOP' | 'FLOP';
  category: Category;
  author: Author;
  weekOf: string;
  voteCount: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}