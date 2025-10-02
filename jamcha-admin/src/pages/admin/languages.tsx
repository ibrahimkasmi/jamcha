import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Languages, Globe, Check } from "lucide-react";

import { useRequireAuth } from "@/hooks/authGuards";

export default function AdminLanguages() {
  const { t } = useTranslation();
  // 1. All hooks at the top
  useRequireAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();



  const { data: languages, isLoading } = useQuery({
    queryKey: ["/api/language-settings"],
    queryFn: async () => {
      // Public endpoint - no auth required
      const response = await fetch("/api/language-settings");
      if (!response.ok) throw new Error(t("failedToFetchLanguageSettings"));
      return response.json() as unknown as LanguageSettings[];
    },
  });

  const updateLanguageMutation = useMutation({
    mutationFn: async ({
      id,
      settings,
    }: {
      id: number;
      settings: Partial<LanguageSettings>;
    }) => {
      // Create proper request body matching backend DTO
      const requestBody = {
        code: settings.code,
        name: settings.name,
        isEnabled: settings.isEnabled,
        isDefault: settings.isDefault,
        direction: settings.direction,
      };

      const updateLanguage = (id: string, data: Record<string, unknown>) => {
        const requestBody = { ...data };
        updateMutation.mutate({ id, data: requestBody });
      };

      const response = await fetch(`/api/language-settings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Removed console.error
        throw new Error(
          `${t("failedToUpdateLanguageSettings")} ${response.status} ${errorText}`,
        );
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("success"),
        description: t("languageSettingsUpdatedSuccessfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/language-settings"] });
    },
    onError: (error: any) => {
      toast({
        title: t("error"),
        description: error.message || t("failedToUpdateLanguageSettings"),
        variant: "destructive",
      });
    },
  });

  const handleToggleEnabled = (id: number, isEnabled: boolean) => {
    const language = languages?.find((l) => l.id === id);
    if (!language) return;

    const enabledLanguages = languages?.filter((l) => l.isEnabled).length || 0;
    if (!isEnabled && enabledLanguages <= 1) {
      toast({
        title: t("cannotDisableLastLanguage"),
        description: t("atLeastOneLanguageMustBeEnabled"),
        variant: "destructive",
      });
      return;
    }

    updateLanguageMutation.mutate({
      id,
      settings: {
        code: language.code,
        name: language.name,
        isEnabled,
        isDefault: language.isDefault,
        direction: language.direction,
      },
    });
  };

  const handleSetDefault = (id: number) => {
    const language = languages?.find((l) => l.id === id);
    if (!language) return;

    updateLanguageMutation.mutate({
      id,
      settings: {
        code: language.code,
        name: language.name,
        isEnabled: language.isEnabled,
        isDefault: true,
        direction: language.direction,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6 gap-2">
          <Languages className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold">{t("languageSettings")}</h1>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6 gap-2">
        <Languages className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold">{t("languageSettings")}</h1>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("languageConfiguration")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t("languageConfigurationDescription")}
            </p>

            <div className="grid gap-4">
              {languages?.map((lang) => (
                <div
                  key={lang.code}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2" dir="ltr">
                      <span className="text-2xl">
                        {lang.code === "ar"
                          ? "🇸🇦"
                          : lang.code === "en"
                            ? "🇺🇸"
                            : lang.code === "fr"
                              ? "🇫🇷"
                              : "🇪🇸"}
                      </span>
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          {lang.name}
                          {lang.isDefault && (
                            <Badge variant="default">{t("default")}</Badge>
                          )}
                          {lang.direction === "rtl" && (
                            <Badge variant="outline">{t("rtl")}</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t("code")} {lang.code}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4" dir="ltr">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`enabled-${lang.code}`}
                        checked={lang.isEnabled}
                        onCheckedChange={(checked) =>
                          handleToggleEnabled(lang.id, checked)
                        }
                        disabled={updateLanguageMutation.isPending}
                      />
                      <Label
                        htmlFor={`enabled-${lang.code}`}
                        className="text-sm"
                      >
                        {lang.isEnabled ? t("enabled") : t("disabled")}
                      </Label>
                    </div>

                    {lang.isEnabled && !lang.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(lang.id)}
                        disabled={updateLanguageMutation.isPending}
                      >
                        {t("setAsDefault")}
                      </Button>
                    )}

                    {lang.isDefault && (
                      <Badge
                        variant="default"
                        className="flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        {t("default")}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("languageStatusSummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {languages?.filter((l) => l.isEnabled).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("enabledLanguages")}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {languages?.find((l) => l.isDefault)?.name || t("none")}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("defaultLanguage")}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {languages?.filter((l) => l.direction === "rtl").length || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t("rtlLanguages")}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
