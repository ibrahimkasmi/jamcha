// src/features/home/components/ViewModeToggle/ViewModeToggle.tsx
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { t } from "@/lib/i18n";

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

// ✅ memo() HERE - This is a pure UI component that doesn't need to re-render unless props change
export const ViewModeToggle = memo<ViewModeToggleProps>(
  ({ viewMode, onViewModeChange }) => {
    // ✅ useCallback() HERE - These functions are passed to Button onClick
    const handleGridClick = React.useCallback(
      () => onViewModeChange("grid"),
      [onViewModeChange]
    );
    const handleListClick = React.useCallback(
      () => onViewModeChange("list"),
      [onViewModeChange]
    );

    return (
      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          onClick={handleGridClick}
          className="flex items-center space-x-1"
          aria-label={t("category.viewMode.grid")}
        >
          <Grid className="h-4 w-4" />
          <span className="hidden sm:inline">
            {t("category.viewMode.grid")}
          </span>
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={handleListClick}
          className="flex items-center space-x-1"
          aria-label={t("category.viewMode.list")}
        >
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">
            {t("category.viewMode.list")}
          </span>
        </Button>
      </div>
    );
  }
);

ViewModeToggle.displayName = "ViewModeToggle";
