// src/features/article/components/ArticleActions/ArticleActions.tsx
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark } from "lucide-react";
import { t } from "@/lib/i18n";

interface ArticleActionsProps {
  onShare: () => Promise<void>;
}

// ✅ memo() - Pure UI component
export const ArticleActions = memo<ArticleActionsProps>(({ onShare }) => (
  <div className="flex items-center space-x-4">
    <Button variant="outline" size="sm" onClick={onShare}>
      <Share2 className="mr-2 h-4 w-4" />
      {t("article.shareButton")}
    </Button>

    <Button variant="outline" size="sm">
      <Bookmark className="mr-2 h-4 w-4" />
      {t("article.bookmarkButton")}
    </Button>
  </div>
));

ArticleActions.displayName = "ArticleActions";
