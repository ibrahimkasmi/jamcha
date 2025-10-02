// src/features/advertise/components/WhyUsSection/WhyUsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n";

// No memo - simple static component
export const WhyUsSection = () => (
  <Card>
    <CardHeader>
      <CardTitle className="arabic-nav">{t("advertise.whyUsTitle")}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t("advertise.whyUs1")}</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t("advertise.whyUs2")}</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t("advertise.whyUs3")}</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t("advertise.whyUs4")}</span>
        </li>
      </ul>
    </CardContent>
  </Card>
);
