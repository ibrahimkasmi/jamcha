// src/features/home/components/EmptyState/EmptyState.tsx

import { t } from "@/lib/i18n";

interface EmptyStateProps {
  type: "error" | "no-articles";
}

// ❌ NO memo() - Simple component that renders once
export const EmptyState = ({ type }: EmptyStateProps) => (
  <div className="text-center py-12">
    <p className="text-gray-500 dark:text-gray-400">
      {type === "error" ? t("home.errorLoading") : t("home.noArticles")}
    </p>
  </div>
);
