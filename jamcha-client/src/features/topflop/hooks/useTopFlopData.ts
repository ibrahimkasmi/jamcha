// src/features/topflop/hooks/useTopFlopData.ts
import { useTopFlopContext } from "../contexts/TopFlopDataProvider";

export const useTopFlopData = () => {
  const context = useTopFlopContext();

  // Simple boolean operations - no useMemo needed
  const hasEntries = context.entries?.length > 0;
  const isEmpty =
    !context.isLoading && (!context.entries || context.entries.length === 0);
  const isError = !context.isLoading && !!context.error;

  // Filter entries based on current filter
  const topEntries =
    context.entries
      ?.filter((entry) => entry.entryType === "TOP")
      .sort((a, b) => a.position - b.position) || [];

  const flopEntries =
    context.entries
      ?.filter((entry) => entry.entryType === "FLOP")
      .sort((a, b) => a.position - b.position) || [];

  const getFilteredEntries = () => {
    if (context.filter === "top")
      return { type: "single" as const, entries: topEntries };
    if (context.filter === "flop")
      return { type: "single" as const, entries: flopEntries };
    return { type: "grouped" as const, topEntries, flopEntries };
  };

  return {
    ...context,
    hasEntries,
    isEmpty,
    isError,
    topEntries,
    flopEntries,
    filteredData: getFilteredEntries(),
  };
};
