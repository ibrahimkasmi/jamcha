import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArticlePreview } from "@/components/article-preview";
import type { Article } from "@/types/article";
import { useTranslation } from "react-i18next";

interface ArticleStatusConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: Article | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ArticleStatusConfirmationDialog({ 
  open, 
  onOpenChange, 
  article, 
  onConfirm, 
  onCancel 
}: ArticleStatusConfirmationDialogProps) {
  const { t } = useTranslation();

  if (!article) return null;

  const prepareImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:image')) {
      return path;
    }
    return `/api/files/download/${path}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[80%]">
        <DialogHeader>
          <DialogTitle>{t("articlePreview")}</DialogTitle>
          <DialogDescription>
            {t("articlePreviewDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto">
          <ArticlePreview 
            title={article.title}
            content={article.content}
            excerpt={article.excerpt}
            author={article.author?.name || 'Admin'}
            authorRole={article.author?.role as string || 'Admin'}
            category={{
              id: String(article.category.id),
              name: article.category.name,
              slug: article.category.slug,
              color: article.category.color || '#000000',
              icon: article.category.icon || 'default-icon',
              translations: article.category.translations
            }}
            tags={article.tags ? article.tags.map(t => t.name) : []}
            featuredImage={prepareImageUrl(article.featuredImage)}
            videoUrl={article.videoUrl}
            isBreaking={article.isBreaking}
            language={article.language}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>{t("cancel")}</Button>
          <Button onClick={onConfirm}>{t("accepted")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
