// src/features/topflop/components/FilterControls/FilterControls.tsx
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { t } from "@/lib/i18n";

interface FilterControlsProps {
  filter: "all" | "top" | "flop";
  viewMode: "grid" | "list";
  onFilterChange: (filter: "all" | "top" | "flop") => void;
  onViewModeChange: (mode: "grid" | "list") => void;
}

// No memo - simple UI component
export const FilterControls = ({
  filter,
  viewMode,
  onFilterChange,
  onViewModeChange,
}: FilterControlsProps) => (
  <div className="flex flex-wrap items-center gap-2">
    {/* Filter Buttons */}
    <div className="flex items-center space-x-1">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
      >
        {t("topFlop.filter.all")}
      </Button>
      <Button
        variant={filter === "top" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("top")}
        className="text-green-600"
      >
        {t("topFlop.filter.top")}
      </Button>
      <Button
        variant={filter === "flop" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("flop")}
        className="text-red-600"
      >
        {t("topFlop.filter.flop")}
      </Button>
    </div>

    {/* View Mode Buttons */}
    <div className="flex items-center space-x-1">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange("grid")}
        className="flex items-center space-x-1"
      >
        <Grid className="h-4 w-4" />
        <span className="hidden sm:inline">{t("category.viewMode.grid")}</span>
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange("list")}
        className="flex items-center space-x-1"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">{t("category.viewMode.list")}</span>
      </Button>
    </div>
  </div>
);
