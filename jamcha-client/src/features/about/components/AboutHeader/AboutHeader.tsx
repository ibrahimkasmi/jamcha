// src/features/about/components/AboutHeader/AboutHeader.tsx
import { Globe } from "lucide-react";
import { t } from "@/lib/i18n";

// No memo - simple static component
export const AboutHeader = () => (
  <div className="text-center mb-12">
    <div className="flex items-center justify-center mb-4">
      <Globe className="h-12 w-12 text-primary" />
    </div>
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 arabic-nav">
      {t("about.title")}
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
      {t("about.subtitle")}
    </p>
  </div>
);
