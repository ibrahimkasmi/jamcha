// src/features/topflop/components/EntryGrid/EntryGrid.tsx
import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { t } from "@/lib/i18n";
import { EntryCard } from "../EntryCard/EntryCard";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import type { TopFlopEntry } from "@/types/topflop";

interface EntryGridProps {
  filteredData:
    | {
        type: "single";
        entries: TopFlopEntry[];
      }
    | {
        type: "grouped";
        topEntries: TopFlopEntry[];
        flopEntries: TopFlopEntry[];
      };
  getImageUrl: (profileImage: string | null | undefined) => string | null;
  formatDate: (dateString: string) => string;
}

// memo HERE - prevents re-rendering entire grid when parent updates
export const EntryGrid = memo<EntryGridProps>(
  ({ filteredData, getImageUrl, formatDate }) => {
    if (filteredData.type === "single") {
      // Safety check
      if (!filteredData.entries || !Array.isArray(filteredData.entries)) {
        return <div>No entries available</div>;
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              viewMode="grid"
              getImageUrl={getImageUrl}
              formatDate={formatDate}
            />
          ))}
        </div>
      );
    }

    // Grouped view
    return (
      <div className="space-y-12">
        {/* TOP Section */}
        {filteredData.topEntries.length > 0 && (
          <div>
            <SectionHeader
              title={t("topFlop.topTitle")}
              icon={<TrendingUp className="h-6 w-6 text-white" />}
              color="bg-green-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.topEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  viewMode="grid"
                  getImageUrl={getImageUrl}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {/* FLOP Section */}
        {filteredData.flopEntries.length > 0 && (
          <div>
            <SectionHeader
              title={t("topFlop.flopTitle")}
              icon={<TrendingDown className="h-6 w-6 text-white" />}
              color="bg-red-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.flopEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  viewMode="grid"
                  getImageUrl={getImageUrl}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

EntryGrid.displayName = "EntryGrid";
