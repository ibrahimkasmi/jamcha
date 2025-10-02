import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

const ForbiddenPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dir = typeof i18n.dir === "function" ? i18n.dir() : "ltr";

  const handleGoBack = () => {
    navigate({ to: "/dashboard" });
  };

  return (
    <AdminLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8" dir={dir}>
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <ShieldOff className="h-16 w-16 text-primary mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {t("forbiddenTitle")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center">
            {t("forbiddenDescription1")}
            <br />
            {t("forbiddenDescription2")}
          </p>
          <Button
            size="lg"
            className={`flex items-center w-full justify-center ${dir === 'rtl' ? 'space-x-reverse' : ''} gap-2`}
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-5 w-5" />
            {t("backToDashboard")}
          </Button>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Jamcha Admin. {t("allRightsReserved")}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ForbiddenPage;
