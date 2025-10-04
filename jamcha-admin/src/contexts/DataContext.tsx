import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useArticles } from "@/hooks/data/useArticles";
import { useCategories } from "@/hooks/data/useCategories";
import { useUsers } from "@/hooks/data/useUsers";
import { useNewsletters } from "@/hooks/data/useNewsletters";
import { useReports } from "@/hooks/data/useReports";
import { Article } from "@/types/article";
import { User } from "@/types/user";
import { Category } from "@/types/category";
import { Newsletter } from "@/types/newsletter";

interface Report {
  id: number;
  commentId: number;
  reason: string;
  details?: string;
  reportedAt: string;
  status: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: {
    id: number;
    content: string;
    authorName: string;
    provider: string;
    articleId: number;
    createdAt: string;
  };
}

interface DataContextType {
  articles: {
    data: Article[];
    isLoading: boolean;
    refetch: () => void;
  };
  categories: {
    data: Category[];
    isLoading: boolean;
    refetch: () => void;
  };
  users: {
    data: User[];
    isLoading: boolean;
    refetch: () => void;
  };
  newsletters: {
    data: Newsletter[];
    isLoading: boolean;
    refetch: () => void;
    updateSubscriber: (params: { id: number; email: string; isActive: boolean }) => void;
    isUpdating: boolean;
  };
  reports: {
    data: Report[];
    isLoading: boolean;
    refetch: () => void;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const articles = useArticles();
  const categories = useCategories();
  const users = useUsers();
  const newsletters = useNewsletters();
  const reports = useReports();

  const contextValue: DataContextType = {
    articles,
    categories,
    users,
    newsletters,
    reports,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}