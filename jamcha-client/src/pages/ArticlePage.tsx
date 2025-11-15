import { ArticleDataProvider } from "@/features/article/contexts/ArticleDataProvider";
import { ArticlePageContent } from "./ArticlePageContent";

export default function ArticlePage() {
  return (
    <ArticleDataProvider>
      <ArticlePageContent />
    </ArticleDataProvider>
  );
}
