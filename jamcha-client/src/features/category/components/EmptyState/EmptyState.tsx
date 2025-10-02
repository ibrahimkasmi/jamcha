// src/features/category/components/EmptyState/EmptyState.tsx
import { t } from "@/lib/i18n";

// No memo - simple component
export const EmptyState = () => (
  <div className="text-center py-12">
    <p className="text-gray-500 dark:text-gray-400 arabic-nav">
      {t("category.noArticles")}
    </p>
  </div>
);
