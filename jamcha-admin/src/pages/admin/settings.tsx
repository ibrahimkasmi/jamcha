import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Globe,
  Mail,
  Shield,
  Palette,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useRequireAuth } from "@/hooks/authGuards";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

export default function AdminSettings() {
  useRequireAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  // Determine direction based on selected language
  const [generalSettings, setGeneralSettings] = useState({
    siteName: t("defaultSiteName"),
    siteDescription: t("defaultSiteDescription"),
    siteUrl: t("defaultSiteUrl"),
    adminEmail: t("defaultAdminEmail"),
    timezone: "UTC",
    language: "en",
    articlesPerPage: 10,
    enableComments: true,
    enableNewsletterSignup: true,
    enableDarkMode: true,
    enableMultiLanguage: true,
  });

  // Set direction based on selected language (rtl for Arabic)
  const dir = generalSettings.language === "ar" ? "rtl" : "ltr";


  // ...existing code...

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: t("defaultSmtpHost"),
    smtpPort: 587,
    smtpUser: t("defaultSmtpUser"),
    smtpPassword: "",
    senderName: t("defaultSenderName"),
    senderEmail: t("defaultSenderEmail"),
    enableEmailNotifications: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    enableLoginAttempts: true,
    maxLoginAttempts: 5,
    enableIpBlocking: true,
    enableSecurityLogs: true,
  });

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#ef4444",
    accentColor: "#10b981",
    fontSize: "medium",
    fontFamily: "Inter",
    logoUrl: "",
    faviconUrl: "",
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to save settings");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: t("settingsSavedSuccess") });
    },
    onError: (error: any) => {
      toast({
        title: t("settingsSavedError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveGeneral = () => {
    saveSettingsMutation.mutate({ type: "general", settings: generalSettings });
  };

  const handleSaveEmail = () => {
    saveSettingsMutation.mutate({ type: "email", settings: emailSettings });
  };

  const handleSaveSecurity = () => {
    saveSettingsMutation.mutate({
      type: "security",
      settings: securitySettings,
    });
  };

  const handleSaveTheme = () => {
    saveSettingsMutation.mutate({ type: "theme", settings: themeSettings });
  };

  return (
    <div dir={dir} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("settings")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t("settingsDescription")}
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">{t("generalTab")}</TabsTrigger>
          <TabsTrigger value="email">{t("emailTab")}</TabsTrigger>
          <TabsTrigger value="security">{t("securityTab")}</TabsTrigger>
          <TabsTrigger value="theme">{t("themeTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>{t("generalSettings")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="siteName">{t("siteNameLabel")}</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        siteName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="siteDescription">{t("siteDescriptionLabel")}</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      siteDescription: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="adminEmail">{t("adminEmailLabel")}</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        adminEmail: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="timezone">{t("timezoneLabel")}</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) =>
                      setGeneralSettings({
                        ...generalSettings,
                        timezone: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">{t("timezoneUTC")}</SelectItem>
                      <SelectItem value="America/New_York">{t("timezoneEastern")}</SelectItem>
                      <SelectItem value="America/Los_Angeles">{t("timezonePacific")}</SelectItem>
                      <SelectItem value="Europe/London">{t("timezoneLondon")}</SelectItem>
                      <SelectItem value="Asia/Tokyo">{t("timezoneTokyo")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="language">{t("defaultLanguageLabel")}</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) =>
                      setGeneralSettings({
                        ...generalSettings,
                        language: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t("languageEnglish")}</SelectItem>
                      <SelectItem value="es">{t("languageSpanish")}</SelectItem>
                      <SelectItem value="fr">{t("languageFrench")}</SelectItem>
                      <SelectItem value="ar">{t("languageArabic")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="articlesPerPage">{t("articlesPerPageLabel")}</Label>
                  <Input
                    id="articlesPerPage"
                    type="number"
                    value={generalSettings.articlesPerPage}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        articlesPerPage: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("featuresSection")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableComments"
                      checked={generalSettings.enableComments}
                      onCheckedChange={(checked) =>
                        setGeneralSettings({
                          ...generalSettings,
                          enableComments: checked,
                        })
                      }
                    />

                    <Label htmlFor="enableComments">{t("enableCommentsLabel")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableNewsletterSignup"
                      checked={generalSettings.enableNewsletterSignup}
                      onCheckedChange={(checked) =>
                        setGeneralSettings({
                          ...generalSettings,
                          enableNewsletterSignup: checked,
                        })
                      }
                    />
                    <Label htmlFor="enableNewsletterSignup">
                      {t("enableNewsletterSignupLabel")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableDarkMode"
                      checked={generalSettings.enableDarkMode}
                      onCheckedChange={(checked) =>
                        setGeneralSettings({
                          ...generalSettings,
                          enableDarkMode: checked,
                        })
                      }
                    />

                    <Label htmlFor="enableDarkMode">{t("enableDarkModeLabel")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableMultiLanguage"
                      checked={generalSettings.enableMultiLanguage}
                      onCheckedChange={(checked) =>
                        setGeneralSettings({
                          ...generalSettings,
                          enableMultiLanguage: checked,
                        })
                      }
                    />
                    <Label htmlFor="enableMultiLanguage">
                      {t("enableMultiLanguageLabel")}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveGeneral}
                  disabled={saveSettingsMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("saveGeneralSettingsButton")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>{t("emailSettingsSection")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>

                  <Label htmlFor="smtpHost">{t("smtpHostLabel")}</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpHost: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">{t("smtpPortLabel")}</Label>
                  <Label htmlFor="smtpPort">{t("smtpPortLabel")}</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpPort: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>

                  <Label htmlFor="smtpUser">{t("smtpUsernameLabel")}</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpUser: e.target.value,
                      })
                    }
                  />
                </div>
                <div>

                  <Label htmlFor="smtpPassword">{t("smtpPasswordLabel")}</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpPassword: e.target.value,
                      })
                    }
                    placeholder={t("enterToChangePasswordPlaceholder")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>

                  <Label htmlFor="senderName">{t("senderNameLabel")}</Label>
                  <Input
                    id="senderName"
                    value={emailSettings.senderName}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        senderName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>

                  <Label htmlFor="senderEmail">{t("senderEmailLabel")}</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={emailSettings.senderEmail}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        senderEmail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableEmailNotifications"
                  checked={emailSettings.enableEmailNotifications}
                  onCheckedChange={(checked) =>
                    setEmailSettings({
                      ...emailSettings,
                      enableEmailNotifications: checked,
                    })
                  }
                />
                <Label htmlFor="enableEmailNotifications">
                  {t("enableEmailNotificationsLabel")}
                </Label>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveEmail}
                  disabled={saveSettingsMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("saveEmailSettingsButton")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{t("securitySettingsSection")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">
                    {t("sessionTimeoutLabel")}
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">
                    {t("passwordMinLengthLabel")}
                  </Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        passwordMinLength: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="maxLoginAttempts">{t("maxLoginAttemptsLabel")}</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      maxLoginAttempts: parseInt(e.target.value),
                    })
                  }
                  disabled={!securitySettings.enableLoginAttempts}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("securityFeaturesSection")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableTwoFactor"
                      checked={securitySettings.enableTwoFactor}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({
                          ...securitySettings,
                          enableTwoFactor: checked,
                        })
                      }
                    />
                    <Label htmlFor="enableTwoFactor">
                      {t("enableTwoFactorLabel")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableLoginAttempts"
                      checked={securitySettings.enableLoginAttempts}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({
                          ...securitySettings,
                          enableLoginAttempts: checked,
                        })
                      }
                    />
                    <Label htmlFor="enableLoginAttempts">
                      {t("limitLoginAttemptsLabel")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableIpBlocking"
                      checked={securitySettings.enableIpBlocking}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({
                          ...securitySettings,
                          enableIpBlocking: checked,
                        })
                      }
                    />

                    <Label htmlFor="enableIpBlocking">{t("enableIpBlockingLabel")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableSecurityLogs"
                      checked={securitySettings.enableSecurityLogs}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({
                          ...securitySettings,
                          enableSecurityLogs: checked,
                        })
                      }
                    />
                    <Label htmlFor="enableSecurityLogs">
                      {t("enableSecurityLogsLabel")}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSecurity}
                  disabled={saveSettingsMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("saveSecuritySettingsButton")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>{t("themeSettingsSection")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="primaryColor">{t("primaryColorLabel")}</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={themeSettings.primaryColor}
                    onChange={(e) =>
                      setThemeSettings({
                        ...themeSettings,
                        primaryColor: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="secondaryColor">{t("secondaryColorLabel")}</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={themeSettings.secondaryColor}
                    onChange={(e) =>
                      setThemeSettings({
                        ...themeSettings,
                        secondaryColor: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="accentColor">{t("accentColorLabel")}</Label>
                  <Input
                    id="accentColor"
                    type="color"
                    value={themeSettings.accentColor}
                    onChange={(e) =>
                      setThemeSettings({
                        ...themeSettings,
                        accentColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="fontSize">{t("fontSizeLabel")}</Label>
                  <Select
                    value={themeSettings.fontSize}
                    onValueChange={(value) =>
                      setThemeSettings({ ...themeSettings, fontSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">{t("fontSizeSmall")}</SelectItem>
                      <SelectItem value="medium">{t("fontSizeMedium")}</SelectItem>
                      <SelectItem value="large">{t("fontSizeLarge")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="fontFamily">{t("fontFamilyLabel")}</Label>
                  <Select
                    value={themeSettings.fontFamily}
                    onValueChange={(value) =>
                      setThemeSettings({ ...themeSettings, fontFamily: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">{t("fontFamilyInter")}</SelectItem>
                      <SelectItem value="Roboto">{t("fontFamilyRoboto")}</SelectItem>
                      <SelectItem value="OpenSans">{t("fontFamilyOpenSans")}</SelectItem>
                      <SelectItem value="Lato">{t("fontFamilyLato")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="logoUrl">{t("logoUrlLabel")}</Label>
                  <Input
                    id="logoUrl"
                    value={themeSettings.logoUrl}
                    onChange={(e) =>
                      setThemeSettings({
                        ...themeSettings,
                        logoUrl: e.target.value,
                      })
                    }
                    placeholder={t("logoUrlPlaceholder")}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="faviconUrl">{t("faviconUrlLabel")}</Label>
                  <Input
                    id="faviconUrl"
                    value={themeSettings.faviconUrl}
                    onChange={(e) =>
                      setThemeSettings({
                        ...themeSettings,
                        faviconUrl: e.target.value,
                      })
                    }
                    placeholder={t("faviconUrlPlaceholder")}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveTheme}
                  disabled={saveSettingsMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("saveThemeSettingsButton")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
