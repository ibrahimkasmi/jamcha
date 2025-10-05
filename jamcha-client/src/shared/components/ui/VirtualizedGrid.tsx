// src/shared/components/ui/VirtualizedGrid.tsx
import React, { memo, useMemo } from "react";
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

export const VirtualizedGrid = memo(
  <T,>({ items, itemHeight, columns, renderItem, className = "", gap = 24 }: VirtualizedGridProps<T>) => {
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

    const Cell = memo(({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
      const index = rowIndex * columnCount + columnIndex;
      const item = items[index];

      if (!item) return null;

      return (
        <div
          style={{
            ...style,
            left: (typeof style.left === 'number' ? style.left : 0) + gap / 2,
            top: (typeof style.top === 'number' ? style.top : 0) + gap / 2,
            width: typeof style.width === 'number' ? style.width - gap : style.width,
            height: typeof style.height === 'number' ? style.height - gap : style.height,
          }}
        >
          {renderItem({ item, index })}
        </div>
      );
    });

    Cell.displayName = "VirtualizedCell";

    return (
      <div className={className}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            gap: `${gap}px`,
            height: Math.min(rowCount * (itemHeight + gap), 800),
            width: "100%",
          }}
        >
          {items.map((item, index) => (
            <div key={index}>
              {renderItem({ item, index })}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

VirtualizedGrid.displayName = "VirtualizedGrid";
