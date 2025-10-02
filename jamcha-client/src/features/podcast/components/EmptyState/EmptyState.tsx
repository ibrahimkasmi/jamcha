// src/features/podcast/components/EmptyState/EmptyState.tsx
import { Play } from "lucide-react";
import { t } from "@/lib/i18n";

export const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 dark:text-gray-500 mb-4">
      <Play className="h-16 w-16 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">{t("podcast.noPodcasts")}</h3>
      <p>{t("podcast.comingSoon")}</p>
    </div>
  </div>
);
