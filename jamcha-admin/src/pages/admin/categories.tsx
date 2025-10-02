import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { AnimatedDeleteButton } from "@/components/ui/animated-delete-button";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";

import type { Category } from "@/types/category";

export default function AdminCategories() {
  const { t } = useTranslation();
  const { categories: { data: categories, isLoading, refetch } } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "#3b82f6",
    icon: t("folder"),
    translations: {},
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/categories", data);
      return response.data;
    },
    onSuccess: () => {
      toast({ title: t("categoryCreatedSuccessfully") });
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: t("failedToCreateCategory"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast({ title: t("categoryUpdatedSuccessfully") });
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: t("failedToUpdateCategory"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`);
      return { deletedId: id };
    },
    onSuccess: () => {
      toast({
        title: t("categoryDeletedSuccessfully"),
        description: t("categoryDeletedDescription"),
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: t("failedToDeleteCategory", { lng: "ar" }),
        description: error.message ? t(error.message, { lng: "ar" }) : t("deleteCategoryErrorDescription", { lng: "ar" }),
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      color: "#3b82f6",
      icon: t("folder"),
      translations: {},
    });
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, slug, color, icon } = formData;
    const payload = { name, slug, color, icon, translations: "" };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      color: category.color,
      icon: category.icon,
      translations:
        typeof category.translations === "string"
          ? JSON.parse(category.translations || "{}")
          : category.translations || {},
    });
    setIsDialogOpen(true);
  };

  const handleAnimatedDelete = (id: number) => {
    const category = (categories as Category[]).find((cat) => cat.id === id);
    setCategoryToDelete(category || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id);
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t("categories")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("categoriesDescription")}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              {t("newCategory")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? t("editCategory") : t("createNewCategory")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">

                <Label htmlFor="name" >{t("name")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slug">{t("slug")}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder={t("categorySlug")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="color">{t("color")}</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                />
              </div>
              <div className="flex space-x-2 gap-2">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editingCategory ? t("update") : t("create")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("allCategories")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("loadingCategories")}</div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">{t("noCategoriesAvailable")}</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("createFirstCategory")}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead dir="ltr">{t("name")}</TableHead>
                  <TableHead>{t("slug")}</TableHead>
                  <TableHead>{t("articles")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories && categories.map((category: any) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2 gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: category.color || "#3b82f6",
                          }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell dir="ltr">{category.slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {category.articleCount || 0}{t("articlesCount")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AnimatedDeleteButton
                          size="sm"
                          onAnimatedClick={() =>
                            handleAnimatedDelete(category.id)
                          }
                          disabled={deleteMutation.isPending}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="mt-4 text-sm text-gray-500">
            {t("totalCategories")} {categories?.length || 0}
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title={t("deleteCategory")}
        description={t("deleteCategoryConfirmation", { name: categoryToDelete?.name })}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText={t("delete")}
        cancelText={t("cancel")}
      />
    </div>
  );
}