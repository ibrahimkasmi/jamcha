// src/features/advertise/screens/AdvertiseScreen.tsx
import { memo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ErrorFallback } from "@/shared/components/ui/ErrorFallback";
import { t } from "@/lib/i18n";

import { useAdvertiseData } from "../hooks/useAdvertiseData";
import { StatisticsSection } from "../components/StatisticsSection/StatisticsSection";
import { AdvertisingOptions } from "../components/AdvertisingOptions/AdvertisingOptions";
import { WhyUsSection } from "../components/WhyUsSection/WhyUsSection";
import { AdvertiseForm } from "../components/AdvertiseForm/AdvertiseForm";
import { SuccessMessage } from "../components/SuccessMessage/SuccessMessage";
import { ContactInformation } from "../components/ContactInformation/ContactInformation";

// ✅ memo on main screen component
export const AdvertiseScreen = memo(() => {
  const {
    form,
    isSubmitted,
    setIsSubmitted,
    onSubmit,
    isLoading,
    adTypes,
    budgetRanges,
  } = useAdvertiseData();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Header />
        <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 arabic-nav">
              {t("advertise.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("advertise.subtitle")}
            </p>
          </div>

          <StatisticsSection />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Information */}
            <div className="space-y-6">
              <AdvertisingOptions />
              <WhyUsSection />
            </div>

            {/* Right Column - Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="arabic-nav">
                  {t("advertise.formTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <SuccessMessage onSendAnother={() => setIsSubmitted(false)} />
                ) : (
                  <AdvertiseForm
                    form={form}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    adTypes={adTypes}
                    budgetRanges={budgetRanges}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <ContactInformation />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
});

AdvertiseScreen.displayName = "AdvertiseScreen";
