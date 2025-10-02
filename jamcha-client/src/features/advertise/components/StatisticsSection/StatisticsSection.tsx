// src/features/advertise/components/StatisticsSection/StatisticsSection.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, TrendingUp } from "lucide-react";
import { t } from "@/lib/i18n";

// No memo - simple static component
export const StatisticsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <Card>
      <CardContent className="p-6 text-center">
        <Users className="h-8 w-8 text-primary mx-auto mb-3" />
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          500K+
        </div>
        <div className="text-gray-600 dark:text-gray-300">
          {t("advertise.stats.readers")}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-6 text-center">
        <Target className="h-8 w-8 text-primary mx-auto mb-3" />
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          85%
        </div>
        <div className="text-gray-600 dark:text-gray-300">
          {t("advertise.stats.engagement")}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-6 text-center">
        <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          25%
        </div>
        <div className="text-gray-600 dark:text-gray-300">
          {t("advertise.stats.growth")}
        </div>
      </CardContent>
    </Card>
  </div>
);
