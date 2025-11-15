// src/features/about/screens/AboutScreen.tsx
import { memo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ErrorFallback } from "@/shared/components/ui/ErrorFallback";

import { AboutHeader } from "../components/AboutHeader/AboutHeader";
import { AboutCards } from "../components/AboutCards/AboutCards";
import { AboutContent } from "../components/AboutContent/AboutContent";

// memo on main screen component - though minimal benefit for static content
export const AboutScreen = memo(() => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <AboutHeader />
        <AboutCards />
        <AboutContent />
      </main>
      <Footer />
    </div>
  </ErrorBoundary>
));

AboutScreen.displayName = "AboutScreen";
