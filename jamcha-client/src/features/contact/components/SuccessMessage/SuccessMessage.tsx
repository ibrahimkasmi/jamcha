// src/features/contact/components/SuccessMessage/SuccessMessage.tsx
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { t } from "@/lib/i18n";

interface SuccessMessageProps {
  onSendAnother: () => void;
}

// No memo - simple component that renders after form submission
export const SuccessMessage = ({ onSendAnother }: SuccessMessageProps) => (
  <div className="text-center py-8">
    <div className="mb-4">
      <Send className="h-12 w-12 text-primary mx-auto" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {t("contact.form.successTitle")}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      {t("contact.form.successDescription")}
    </p>
    <Button onClick={onSendAnother} className="mt-4">
      {t("contact.form.sendAnother")}
    </Button>
  </div>
);
