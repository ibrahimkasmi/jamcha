// src/shared/components/ui/VirtualizedGrid.tsx
import React, { memo, useMemo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

interface VirtualizedGridProps<T> {
  items: T[];
  itemHeight: number;
  columns: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactNode;
  className?: string;
  gap?: number;
}

export const VirtualizedGrid = memo<VirtualizedGridProps<any>>(
  ({ items, itemHeight, columns, renderItem, className = "", gap = 24 }) => {
    const isSm = useMediaQuery("(min-width: 640px)");
    const isMd = useMediaQuery("(min-width: 768px)");
    const isLg = useMediaQuery("(min-width: 1024px)");
    const isXl = useMediaQuery("(min-width: 1280px)");

    const columnCount = useMemo(() => {
      if (isXl && columns.xl) return columns.xl;
      if (isLg && columns.lg) return columns.lg;
      if (isMd && columns.md) return columns.md;
      if (isSm && columns.sm) return columns.sm;
      return columns.default;
    }, [isXl, isLg, isMd, isSm, columns]);

    const rowCount = Math.ceil(items.length / columnCount);

    const Cell = memo(({ columnIndex, rowIndex, style }: any) => {
      const index = rowIndex * columnCount + columnIndex;
      const item = items[index];

      if (!item) return null;

      return (
        <div
          style={{
            ...style,
            left: style.left + gap / 2,
            top: style.top + gap / 2,
            width: style.width - gap,
            height: style.height - gap,
          }}
        >
          {renderItem({ item, index })}
        </div>
      );
    });

    Cell.displayName = "VirtualizedCell";

    return (
      <div className={className}>
        <Grid
          columnCount={columnCount}
          columnWidth={(window.innerWidth - 64) / columnCount} // Responsive width
          height={Math.min(rowCount * (itemHeight + gap), 800)} // Max height
          rowCount={rowCount}
          rowHeight={itemHeight + gap}
          width="100%"
        >
          {Cell}
        </Grid>
      </div>
    );
  }
);

VirtualizedGrid.displayName = "VirtualizedGrid";
