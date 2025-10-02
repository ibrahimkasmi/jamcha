// src/features/comments/components/SearchAndFilter/SearchAndFilter.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { t } from "@/lib/i18n";

interface SearchAndFilterProps {
  searchTerm: string;
  sortBy: "newest" | "oldest" | "popular";
  onSearchChange: (term: string) => void;
  onSortChange: (sort: "newest" | "oldest" | "popular") => void;
}

// No memo - simple UI component
export const SearchAndFilter = ({
  searchTerm,
  sortBy,
  onSearchChange,
  onSortChange,
}: SearchAndFilterProps) => (
  <div className="mb-6 space-y-4">
    <div className="relative">
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={t("commentsPage.searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pr-10"
      />
    </div>

    <div className="flex items-center space-x-4 space-x-reverse">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("commentsPage.sortBy")}
      </span>
      <div className="flex space-x-2 space-x-reverse">
        <Button
          variant={sortBy === "newest" ? "default" : "outline"}
          size="sm"
          onClick={() => onSortChange("newest")}
        >
          {t("commentsPage.sort.newest")}
        </Button>
        <Button
          variant={sortBy === "popular" ? "default" : "outline"}
          size="sm"
          onClick={() => onSortChange("popular")}
        >
          {t("commentsPage.sort.popular")}
        </Button>
        <Button
          variant={sortBy === "oldest" ? "default" : "outline"}
          size="sm"
          onClick={() => onSortChange("oldest")}
        >
          {t("commentsPage.sort.oldest")}
        </Button>
      </div>
    </div>
  </div>
);
