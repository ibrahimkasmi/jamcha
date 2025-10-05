import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Plus, Edit, Eye, Filter, Flame } from "lucide-react";
import { formatTimeToArabic } from "@/lib/time-utils";
import type { Article } from "@/types/article";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { AnimatedDeleteButton } from "@/components/ui/animated-delete-button";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { ArticleStatusConfirmationDialog } from "@/components/ui/article-status-confirmation-dialog";
import { usePaginatedArticles } from "@/hooks/data/usePaginatedArticles";
import { Switch } from "@/components/ui/switch";
import { ToggleArticleStateDialog } from "@/components/ui/toggle-article-state-dialog";

import { useAuth } from "@/contexts/AuthContext";
import { useArticles } from "@/hooks/data/useArticles";
import i18n from "@/lib/i18n";
import { api } from "@/lib/api";

export default function ArticlesPage() {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();

  // Preview URL config
  const CLIENT_HOST = import.meta.env.VITE_CLIENT_HOST;
  const CLIENT_PORT = import.meta.env.VITE_CLIENT_PORT;
  const getPreviewUrl = (slug: string) =>
    `http://${CLIENT_HOST}:${CLIENT_PORT}/article/${slug}`;
  const queryClient = useQueryClient();
  const dir = typeof i18n.dir === "function" ? i18n.dir() : "ltr";
  const [page, setPage] = useState(0);
  const limit = 10;
  const {
    data: articles = [],
    isLoading,
    refetch,
  } = usePaginatedArticles(page, limit);

  // If we received the full number of items, we assume there might be a next page.
  // This isn't perfect, but it's the best we can do without a total count.
  const hasNextPage = articles.length === limit;

  const { toast } = useToast();
  const navigate = useNavigate();
  const search = useSearch({ from: "/articles" });
  const refetchSearch = (search as any)?.refetch;
  const { toggleArticleActive, isToggling } = useArticles();

  useEffect(() => {
    if (refetchSearch === "1") {
      refetch();
      // Clean the URL after refetch
      navigate({ to: "/articles", search: {} });
    }
  }, [refetchSearch, refetch, navigate]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [toggleStateDialogOpen, setToggleStateDialogOpen] = useState(false);
  const [articleToToggle, setArticleToToggle] = useState<Article | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [articleForConfirmation, setArticleForConfirmation] = useState<Article | null>(null);

  const { categories: { data: categories } } = useData();

  const editArticleStatusMutation = useMutation({
    mutationFn: ({ articleId, status }: { articleId: number; status: string }) => 
      api.editArticleStatus(articleId, status),
    onSuccess: () => {
      toast({
        title: t("articleStatusUpdatedSuccessfully"),
        variant: "default",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: t("failedToUpdateArticleStatus"),
        description: error.message,
        variant: "destructive",
      });
    },
  });



  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedCategory]);




  // Utility functions to safely access nested properties
  const getCategoryName = (category: any): string => {
    if (typeof category === "string") return category;
    return category?.name || t("notSpecified");
  };

  const getAuthorName = (author: any): string => {
    if (!author || !author.name) return t("admin");
    if (typeof author === "string") return author;
    return author?.name || t("notSpecified");
  };

  const deleteArticleMutation = useMutation({
    mutationFn: (articleId: number) => api.delete(`/articles/${articleId}`),

    onSuccess: (_, articleId) => {
      toast({
        title: t("articleDeletedSuccessfully"),
        description: t("articleDeletedDescription"),
        variant: "default",
      });
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["/api/articles", articleId.toString()],
      });
    },

    onError: (error: any) => {
      toast({
        title: t("failedToDeleteArticleTitle"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnimatedDelete = (article: Article) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (articleToDelete) {
      deleteArticleMutation.mutate(articleToDelete.id);
    }
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };

  const handleToggleState = (article: Article) => {
    setArticleToToggle(article);
    setToggleStateDialogOpen(true);
  };

  const confirmToggleState = () => {
    if (articleToToggle) {
      toggleArticleActive(articleToToggle.id);
    }
    setToggleStateDialogOpen(false);
    setArticleToToggle(null);
  };

  const cancelToggleState = () => {
    setToggleStateDialogOpen(false);
    setArticleToToggle(null);
  };

  const handleOpenConfirmationDialog = (article: Article) => {
    setArticleForConfirmation(article);
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (articleForConfirmation) {
      editArticleStatusMutation.mutate({
        articleId: articleForConfirmation.id,
        status: "Accepted",
      });
    }
    setIsConfirmationDialogOpen(false);
    setArticleForConfirmation(null);
  };

  const handleCancelStatusChange = () => {
    setIsConfirmationDialogOpen(false);
    setArticleForConfirmation(null);
  };





  const filteredArticles = articles
    .filter((article: Article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getAuthorName(article.author)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || article.category?.slug === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a: Article, b: Article) => {
      // Urgent (isBreaking) articles first
      if (a.isBreaking !== b.isBreaking) {
        return a.isBreaking ? -1 : 1;
      }
      // Then by date (newest first)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });



  return (
    <div className="space-y-6" dir={dir}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("articles")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("articlesDescription")}
          </p>
        </div>
        <Button
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate({ to: "/articles/new" })}
        >
          <Plus className="h-4 w-4" />
          <span>{t("newArticle")}</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchArticles")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
              >
                <option value="all">{t("allCategories")}</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("allArticles")} ({filteredArticles?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("loadingArticles")}</div>
          ) : !articles || articles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{t("noArticlesFound")}</p>
            </div>
          ) : (
            <Table dir={dir}>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("title")}</TableHead>
                  <TableHead>{t("author")}</TableHead>
                  <TableHead>{t("category")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("publishDate")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles?.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-xs">
                        {article.isBreaking && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Flame className="h-4 w-4 text-red-600 flex-shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("breakingNews")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate">{article.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {getAuthorName(article.author)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {article.author ? t("author") : t("admin")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {getCategoryName(article.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          if (isAdmin && article.status === 'InProgress') {
                            handleOpenConfirmationDialog(article);
                          }
                        }}
                        disabled={!isAdmin || article.status === 'Accepted'}
                      >
                        <Badge
                          variant={
                            article.status === "Accepted"
                              ? "success"
                              : article.status === "InProgress"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {t(article.status)}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatTimeToArabic(new Date(article.publishedAt))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          dir={"ltr"}
                          checked={article.isActive}
                          onCheckedChange={() => handleToggleState(article)}
                          disabled={isToggling || article.status === "InProgress"}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={article.status === "InProgress"}
                          onClick={() => {
                            if (!article.isActive) {
                              toast({
                                title: t("articleIsDisabled"),
                                variant: "destructive",
                              });
                              // Optionally, add a transition effect here (e.g., shake or fade)
                              return;
                            }
                            window.open(getPreviewUrl(article.slug), "_blank");
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={article.status === "InProgress" && !isAdmin}
                          onClick={() => {
                            navigate({
                              to: "/articles/edit/$articleId",
                              params: { articleId: article.id.toString() },
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AnimatedDeleteButton
                          size="sm"
                          onAnimatedClick={() => handleAnimatedDelete(article)}
                          disabled={deleteArticleMutation.isPending || (article.status === "InProgress" && !isAdmin)}
                          className="text-red-600 hover:text-red-700"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (page > 0) setPage((prev) => Math.max(prev - 1, 0));
              }}
              aria-disabled={page === 0}
              tabIndex={page === 0 ? -1 : 0}
              className={page === 0 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="p-2 text-sm font-medium">
              {t("page")} {page + 1}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (hasNextPage) setPage((prev) => prev + 1);
              }}
              aria-disabled={!hasNextPage}
              tabIndex={!hasNextPage ? -1 : 0}
              className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title={t("deleteArticle")}
        description={t("deleteArticleConfirmation", { title: articleToDelete?.title })}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText={t("delete")}
        cancelText={t("cancel")}
      />



      {articleToToggle && (
        <ToggleArticleStateDialog
          open={toggleStateDialogOpen}
          title={t(
            articleToToggle.isActive
              ? "toggle_article_active_confirmation_title_disable"
              : "toggle_article_active_confirmation_title_enable",
          )}
          description={t(
            articleToToggle.isActive
              ? "toggle_article_active_confirmation_description_disable"
              : "toggle_article_active_confirmation_description_enable",
          )}
          onConfirm={confirmToggleState}
          onCancel={cancelToggleState}
          confirmText={t(articleToToggle.isActive ? "disable" : "enable")}
          cancelText={t("cancel")}
          isActive={!articleToToggle.isActive}
                />
              )}
        
              <ArticleStatusConfirmationDialog
                open={isConfirmationDialogOpen}
                onOpenChange={setIsConfirmationDialogOpen}
                article={articleForConfirmation}
                onConfirm={handleConfirmStatusChange}
                onCancel={handleCancelStatusChange}
              />
            </div>  );
}
