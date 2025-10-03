// src/features/home/components/LoadMoreButton/LoadMoreButton.tsx
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  show: boolean;
}

// ✅ memo() HERE - Prevents re-render when parent updates but show prop stays same
export const LoadMoreButton = memo<LoadMoreButtonProps>(
  ({ onLoadMore, show }) => {
    if (!show) return null;

    return (
      <div className="text-center mt-8">
        <Button onClick={onLoadMore} size="lg">
          {t("category.loadMore")}
        </Button>
      </div>
    );
  }
);

LoadMoreButton.displayName = "LoadMoreButton";
