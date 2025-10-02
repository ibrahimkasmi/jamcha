// src/shared/components/ui/LoadingSpinner.tsx
import React, { memo } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(
  ({ size = "md", className = "" }) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    };

    return (
      <div className={`flex justify-center items-center p-4 ${className}`}>
        <div
          className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`}
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";
