// src/features/about/components/AboutContent/AboutContent.tsx
import { t } from "@/lib/i18n";

// No memo - simple static component
export const AboutContent = () => (
  <div className="prose prose-lg max-w-none dark:prose-invert">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 arabic-nav">
        {t("about.missionTitle")}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        {t("about.missionDescription")}
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 arabic-nav">
        {t("about.valuesTitle")}
      </h2>
      <ul className="text-gray-700 dark:text-gray-300 space-y-3 mb-6">
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t("about.value1")}</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t("about.value2")}</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t("about.value3")}</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t("about.value4")}</span>
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 arabic-nav">
        {t("about.historyTitle")}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        {t("about.historyDescription1")}
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {t("about.historyDescription2")}
      </p>
    </div>
  </div>
);
