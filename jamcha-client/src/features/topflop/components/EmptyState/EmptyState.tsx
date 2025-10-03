// src/features/topflop/components/EmptyState/EmptyState.tsx

import { TrendingUp } from "lucide-react";
import { t } from "@/lib/i18n";

// No memo - renders once when empty
export const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 dark:text-gray-500 mb-4">
      <TrendingUp className="h-16 w-16 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">{t("topFlop.noEntries")}</h3>
      <p>{t("topFlop.comingSoon")}</p>
    </div>
  </div>
);
