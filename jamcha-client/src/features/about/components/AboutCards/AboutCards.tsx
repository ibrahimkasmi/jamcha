// src/features/about/components/AboutCards/AboutCards.tsx
import React from "react";
import { Users, Award, Target } from "lucide-react";
import { t } from "@/lib/i18n";

// No memo - simple static component
export const AboutCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Users className="h-8 w-8 text-primary mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {t("about.teamTitle")}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {t("about.teamDescription")}
      </p>
    </div>

    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Award className="h-8 w-8 text-primary mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {t("about.credibilityTitle")}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {t("about.credibilityDescription")}
      </p>
    </div>

    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Target className="h-8 w-8 text-primary mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {t("about.visionTitle")}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {t("about.visionDescription")}
      </p>
    </div>
  </div>
);
