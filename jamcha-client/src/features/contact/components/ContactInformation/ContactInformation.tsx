// src/features/contact/components/ContactInformation/ContactInformation.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { t } from "@/lib/i18n";

// No memo - simple static component
export const ContactInformation = () => (
  <Card>
    <CardHeader>
      <CardTitle className="arabic-nav">{t("contact.infoTitle")}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center space-x-3">
        <Mail className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {t("contact.email")}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            info@globalnews.com
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Phone className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {t("contact.phone")}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">+971 4 123 4567</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <MapPin className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {t("contact.address")}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {t("contact.addressValue")}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
