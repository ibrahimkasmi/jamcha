// src/features/article/components/ArticleContent/ArticleContent.tsx
import  { memo } from "react";

interface ArticleContentProps {
  content: string;
}

// ✅ memo() - Content processing might be expensive for long articles
export const ArticleContent = memo<ArticleContentProps>(({ content }) => (
  <div className="prose prose-lg dark:prose-invert max-w-none">
    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
      {content?.split("\n\n").map((paragraph, index) => (
        <p key={index} className="mb-6 text-lg leading-8">
          {paragraph}
        </p>
      ))}
    </div>
  </div>
));

ArticleContent.displayName = "ArticleContent";
