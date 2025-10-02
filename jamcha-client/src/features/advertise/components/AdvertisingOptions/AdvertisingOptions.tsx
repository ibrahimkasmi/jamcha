// src/features/advertise/components/AdvertisingOptions/AdvertisingOptions.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n";

// No memo - simple static component
export const AdvertisingOptions = () => (
  <Card>
    <CardHeader>
      <CardTitle className="arabic-nav">
        {t("advertise.optionsTitle")}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="border-l-4 border-primary pl-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
          {t("advertise.option1.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t("advertise.option1.description")}
        </p>
      </div>

      <div className="border-l-4 border-primary pl-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
          {t("advertise.option2.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t("advertise.option2.description")}
        </p>
      </div>

      <div className="border-l-4 border-primary pl-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
          {t("advertise.option3.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t("advertise.option3.description")}
        </p>
      </div>

      <div className="border-l-4 border-primary pl-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
          {t("advertise.option4.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t("advertise.option4.description")}
        </p>
      </div>
    </CardContent>
  </Card>
);
