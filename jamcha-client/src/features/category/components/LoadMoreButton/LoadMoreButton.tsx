// src/features/category/components/LoadMoreButton/LoadMoreButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  show: boolean;
}

// No memo - simple button component
export const LoadMoreButton = ({ onLoadMore, show }: LoadMoreButtonProps) => {
  if (!show) return null;

  return (
    <div className="text-center mt-8">
      <Button onClick={onLoadMore} size="lg" className="arabic-nav">
        {t("category.loadMore")}
      </Button>
    </div>
  );
};
