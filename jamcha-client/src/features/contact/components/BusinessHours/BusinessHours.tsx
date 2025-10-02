// src/features/contact/components/BusinessHours/BusinessHours.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n";

// No memo - simple static component
export const BusinessHours = () => (
  <Card>
    <CardHeader>
      <CardTitle className="arabic-nav">{t("contact.hoursTitle")}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">
            {t("contact.hours.sunThu")}
          </span>
          <span className="text-gray-900 dark:text-white">9:00 - 18:00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">
            {t("contact.hours.fri")}
          </span>
          <span className="text-gray-900 dark:text-white">9:00 - 13:00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">
            {t("contact.hours.sat")}
          </span>
          <span className="text-gray-900 dark:text-white">
            {t("contact.hours.closed")}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);
