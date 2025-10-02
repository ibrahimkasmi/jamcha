// src/features/article/components/ArticleErrorState/ArticleErrorState.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { t } from "@/lib/i18n";

// ❌ NO memo() - Error state renders once
export const ArticleErrorState = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header />
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("article.notFound")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t("article.notFoundDescription")}
        </p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("article.backButton")}
          </Button>
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);
