// src/features/category/components/ErrorState/ErrorState.tsx
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";


// No memo - simple component
export const ErrorState = () => (
  <div className="text-center py-12">
    <p className="text-gray-500 dark:text-gray-400">{t("common.error")}</p>
    <Button onClick={() => window.location.reload()} className="mt-4">
      {t("common.tryAgain")}
    </Button>
  </div>
);
