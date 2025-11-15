// src/features/topflop/components/EntryCard/EntryCard.tsx
import { memo } from "react";
import { TrendingUp, TrendingDown, Calendar, User } from "lucide-react";
import { t } from "@/lib/i18n";
import type { TopFlopEntry } from "@/types/topflop";

interface EntryCardProps {
  entry: TopFlopEntry;
  viewMode: "grid" | "list";
  getImageUrl: (profileImage: string | null | undefined) => string | null;
  formatDate: (dateString: string) => string;
}

// memo HERE - prevents re-rendering when parent updates but entry stays same
export const EntryCard = memo<EntryCardProps>(
  ({ entry, viewMode, getImageUrl, formatDate }) => {
    const isTop = entry.entryType === "TOP";
    const imageUrl = getImageUrl(entry.profileImage);

    if (viewMode === "grid") {
      return (
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg gap-5">
          {imageUrl && (
            <div className="p-4 text-center">
              <img
                src={imageUrl}
                alt={entry.personName}
                className={`w-24 h-24 rounded-full object-cover mx-auto ${
                  isTop
                    ? "border-4 border-green-200 dark:border-green-700"
                    : "border-4 border-red-200 dark:border-red-700"
                }`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/96x96/gray/white?text=?";
                }}
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center justify-center mb-3">
              <span
                className={`px-3 py-1 text-sm rounded-full font-semibold ${
                  isTop
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                }`}
              >
                #{entry.position} - {entry.category.name}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center arabic-nav">
              {entry.personName}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3 arabic-nav">
              {entry.description}
            </p>

            <div
              className={`flex items-center justify-center text-sm mb-3 ${
                isTop
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isTop ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="arabic-nav">{entry.reason}</span>
            </div>

            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center mb-1">
                <User className="h-3 w-3 mr-1" />
                <span className="arabic-nav">{entry.author.name}</span>
              </div>
              <div className="flex items-center justify-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(entry.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // List view
    return (
      <div className="flex bg-white dark:bg-black rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow gap-5">
        {imageUrl && (
          <div className="flex-shrink-0 mr-6">
            <img
              src={imageUrl}
              alt={entry.personName}
              className={`w-16 h-16 rounded-full object-cover ${
                isTop
                  ? "border-2 border-green-200 dark:border-green-700"
                  : "border-2 border-red-200 dark:border-red-700"
              }`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/64x64/gray/white?text=?";
              }}
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`px-2 py-1 text-xs rounded ${
                isTop
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              }`}
            >
              #{entry.position}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded ${
                isTop
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              }`}
            >
              {entry.category.name}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded ${
                isTop
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              }`}
            >
              {isTop ? t("topFlop.filter.top") : t("topFlop.filter.flop")}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 arabic-nav">
            {entry.personName}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3 arabic-nav">
            {entry.description}
          </p>

          <div
            className={`flex items-center text-sm mb-3 ${
              isTop
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isTop ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="arabic-nav">{entry.reason}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <User className="h-3 w-3 mr-1" />
              <span className="arabic-nav mr-2">{entry.author.name}</span>
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(entry.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

EntryCard.displayName = "EntryCard";
