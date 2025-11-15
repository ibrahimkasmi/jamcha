// src/features/topflop/contexts/TopFlopDataProvider.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { useCurrentWeekTopFlop } from "@/hooks/useTopFlop";
import type { TopFlopEntry } from "@/types/topflop";

interface TopFlopContextType {
  entries: TopFlopEntry[] | undefined;
  isLoading: boolean;
  error: Error | null;
  viewMode: "grid" | "list";
  filter: "all" | "top" | "flop";
  setViewMode: (mode: "grid" | "list") => void;
  setFilter: (filter: "all" | "top" | "flop") => void;
  formatDate: (dateString: string) => string;
  getImageUrl: (profileImage: string | null | undefined) => string | null;
}

const TopFlopContext = createContext<TopFlopContextType | undefined>(undefined);

export const TopFlopDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");
  const [filter, setFilter] = React.useState<"all" | "top" | "flop">("all");

  // Use existing working hook
  const { data: entries, isLoading, error } = useCurrentWeekTopFlop();

  // Regular utility functions - no useCallback needed
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  const getImageUrl = (
    profileImage: string | null | undefined
  ): string | null => {
    if (!profileImage) return null;
    if (profileImage.startsWith("http")) return profileImage;
    return `/api/files/download/${profileImage}`;
  };

  // Simple object creation - no useMemo needed
  const contextValue: TopFlopContextType = {
    entries,
    isLoading,
    error,
    viewMode,
    filter,
    setViewMode,
    setFilter,
    formatDate,
    getImageUrl,
  };

  return (
    <TopFlopContext.Provider value={contextValue}>
      {children}
    </TopFlopContext.Provider>
  );
};

export const useTopFlopContext = (): TopFlopContextType => {
  const context = useContext(TopFlopContext);
  if (!context) {
    throw new Error(
      "useTopFlopContext must be used within TopFlopDataProvider"
    );
  }
  return context;
};
