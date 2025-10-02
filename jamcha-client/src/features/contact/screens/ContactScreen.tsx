// src/features/contact/screens/ContactScreen.tsx
import { memo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ErrorFallback } from "@/shared/components/ui/ErrorFallback";
import { t } from "@/lib/i18n";

import { useContactData } from "../hooks/useContactData";
import { ContactInformation } from "../components/ContactInformation/ContactInformation";
import { BusinessHours } from "../components/BusinessHours/BusinessHours";
import { ContactForm } from "../components/ContactForm/ContactForm";
import { SuccessMessage } from "../components/SuccessMessage/SuccessMessage";

// ✅ memo on main screen component
export const ContactScreen = memo(() => {
  const { form, isSubmitted, setIsSubmitted, onSubmit, isLoading } =
    useContactData();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 arabic-nav">
              {t("contact.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Contact Information */}
            <div className="space-y-6">
              <ContactInformation />
              <BusinessHours />
            </div>

            {/* Right Column - Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="arabic-nav">
                  {t("contact.formTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <SuccessMessage onSendAnother={() => setIsSubmitted(false)} />
                ) : (
                  <ContactForm
                    form={form}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
});

ContactScreen.displayName = "ContactScreen";
