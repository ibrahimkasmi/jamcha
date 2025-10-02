// src/features/category/components/ViewModeToggle/ViewModeToggle.tsx
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { t } from "@/lib/i18n";

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

// No memo - simple UI component
export const ViewModeToggle = ({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) => (
  <div className="flex items-center space-x-2">
    <Button
      variant={viewMode === "grid" ? "default" : "outline"}
      size="sm"
      onClick={() => onViewModeChange("grid")}
      className="flex items-center space-x-1"
    >
      <Grid className="h-4 w-4" />
      <span className="hidden sm:inline arabic-nav">
        {t("category.viewMode.grid")}
      </span>
    </Button>
    <Button
      variant={viewMode === "list" ? "default" : "outline"}
      size="sm"
      onClick={() => onViewModeChange("list")}
      className="flex items-center space-x-1"
    >
      <List className="h-4 w-4" />
      <span className="hidden sm:inline arabic-nav">
        {t("category.viewMode.list")}
      </span>
    </Button>
  </div>
);
