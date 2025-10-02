// src/features/advertise/components/ContactInformation/ContactInformation.tsx
import { Mail, Phone } from "lucide-react";
import { t } from "@/lib/i18n";

// No memo - simple static component
export const ContactInformation = () => (
  <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 arabic-nav text-center">
      {t("advertise.contactTitle")}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
      <div className="flex items-center justify-center space-x-2">
        <Mail className="h-5 w-5 text-primary" />
        <span className="text-gray-700 dark:text-gray-300">
          ads@globalnews.com
        </span>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Phone className="h-5 w-5 text-primary" />
        <span className="text-gray-700 dark:text-gray-300">
          +971 4 123 4567
        </span>
      </div>
    </div>
  </div>
);
