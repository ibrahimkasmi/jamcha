// src/features/notfound/components/NotFoundCard/NotFoundCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { t } from "@/lib/i18n";

// No memo - simple static component that renders once
export const NotFoundCard = () => (
  <Card className="w-full max-w-md mx-4">
    <CardContent className="pt-6">
      <div className="flex mb-4 gap-2">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">
          {t("notFound.title")}
        </h1>
      </div>

      <p className="mt-4 text-sm text-gray-600">{t("notFound.suggestion")}</p>
    </CardContent>
  </Card>
);
