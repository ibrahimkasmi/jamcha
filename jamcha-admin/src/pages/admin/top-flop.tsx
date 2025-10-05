import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, TrendingUp, TrendingDown } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useData } from "@/contexts/DataContext";
import { useTopFlop } from "@/hooks/data/useTopFlop";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { AnimatedDeleteButton } from "@/components/ui/animated-delete-button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// DTO interfaces to match backend structure
interface CategoryResponseDto {
  id: number;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  translations?: any;
}

interface AuthorResponseDto {
  id: number;
  name: string;
  slug: string;
  bio?: string;
}

interface TopFlopEntry {
  id: number;
  personName: string;
  slug: string;
  description: string;
  reason: string;
  position: number;
  profileImage?: string;
  entryType: "TOP" | "FLOP";
  category: CategoryResponseDto;
  author: AuthorResponseDto;
  weekOf: string;
  voteCount: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}

import { useRequireAuth } from "@/hooks/authGuards";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function AdminTopFlop() {
  useRequireAuth();
  const { user: currentUser, loading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const dir = typeof i18n.dir === "function" ? i18n.dir() : "ltr";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TopFlopEntry | null>(null);
  const [formData, setFormData] = useState({
    personName: "",
    slug: "",
    description: "",
    reason: "",
    position: 1,
    profileImage: "",
    entryType: "TOP" as "TOP" | "FLOP",
    categoryId: 0,
    authorId: 0,
    weekOf: new Date().toISOString().split("T")[0],
    language: "ar",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<TopFlopEntry | null>(
    null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser?.id) {
      setFormData((prev) => ({
        ...prev,
        authorId: Number(currentUser.id),
      }));
    }
  }, [currentUser]);

  // Utility functions to safely access nested properties
  const getCategoryName = (category: any): string => {
    if (typeof category === "string") return category;
    return category?.name || t("notSpecified");
  };

  const getAuthorName = (author: any): string => {
    if (typeof author === "string") return author;
    return author?.name || t("notSpecified");
  };

  const { categories, users } = useData();

  const {
    data: topFlopData,
    isLoading,
    refetch: refetchTopFlop,
  } = useTopFlop();
  // Log the data returned from the backend
  useEffect(() => {
    if (topFlopData) {
    }
  }, [topFlopData]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = editingItem
        ? `/api/topflop/${editingItem.id}`
        : "/api/topflop";

      const entryDto = {
        ...data,
        profileImage: imageFile ? "" : data.profileImage, // Send empty if file is present
      };

      const body = new FormData();
      body.append(
        "entry",
        new Blob([JSON.stringify(entryDto)], { type: "application/json" }),
      );

      if (imageFile) {
        body.append("image", imageFile);
      }

      const response = await fetch(url, {
        method: editingItem ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: t(
            editingItem
              ? "updateTopFlopEntryFailed"
              : "createTopFlopEntryFailed",
          ),
        }));
        throw new Error(
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      // Expect backend to return the saved entry, including the profileImage filename
      return response.json();
    },
    onSuccess: (data) => {
      // Set the profileImage to the filename/path returned by backend (not a blob)
      if (data && data.profileImage) {
        setFormData((prev: any) => ({ ...prev, profileImage: data.profileImage }));
        setImagePreview(""); // clear local preview, use backend
      }
      toast({
        title: editingItem
          ? t("updateTopFlopEntrySuccess")
          : t("createTopFlopEntrySuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/topflop"] });
      refetchTopFlop();
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: t("anErrorOccurred"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/topflop/${id}`),

    // SILENT OPTIMISTIC UPDATE: Update cache immediately (before server response)
    onMutate: async (personId) => {
      await queryClient.cancelQueries({
        queryKey: ["/api/topflop/current-week"],
      });

      // Snapshot the previous value (for rollback if error)
      const previousTopFlopData = queryClient.getQueryData([
        "/api/topflop/current-week",
      ]);

      // Optimistically update cache - REMOVE person immediately
      queryClient.setQueryData(
        ["/api/topflop/current-week"],
        (oldData: any) => {
          if (!oldData) return oldData;

          // Handle array response
          if (Array.isArray(oldData)) {
            return oldData.filter((person) => person.id !== personId);
          }

          return oldData;
        },
      );

      return { previousTopFlopData };
    },

    onSuccess: () => {
      toast({
        title: t("personDeletedSuccess"),
        description: t("personRemovedFromList"),
      });
      // Refresh data from server to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["/api/topflop/current-week"],
      });
    },

    onError: (error: any, personId, context) => {
      // Only show error notifications
      toast({
        title: t("deletePersonFailed"),
        description: error.message,
        variant: "destructive",
      });

      // ROLLBACK: Restore previous cache data if error occurs
      if (context?.previousTopFlopData) {
        queryClient.setQueryData(
          ["/api/topflop/current-week"],
          context.previousTopFlopData,
        );
      }
    },

    // Always refetch after mutation to ensure sync with server
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/topflop/current-week"],
      });
    },
  });

  const resetForm = () => {
    setFormData({
      personName: "",
      slug: "",
      description: "",
      reason: "",
      position: 1,
      profileImage: "",
      entryType: "TOP",
      categoryId: 0,
      authorId: currentUser?.id ? Number(currentUser.id) : 0,
      weekOf: new Date().toISOString().split("T")[0],
      language: "ar",
    });
    setEditingItem(null);
  };

  const handleEdit = (item: TopFlopEntry) => {
    setEditingItem(item);
    setFormData({
      personName: item.personName,
      slug: item.slug,
      description: item.description,
      reason: item.reason,
      position: item.position,
      profileImage: item.profileImage || "",
      entryType: item.entryType,
      categoryId: item.category?.id || 0,
      authorId: item.author?.id || 0,
      weekOf: item.weekOf,
      language: item.language,
    });
    setIsDialogOpen(true);
  };

  const handleAnimatedDelete = (person: TopFlopEntry) => {
    setPersonToDelete(person);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (personToDelete) {
      deleteMutation.mutate(personToDelete.id);
    }
    setDeleteDialogOpen(false);
    setPersonToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setPersonToDelete(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.authorId) {
      toast({
        title: t("errorOccurred"),
        description: "Author ID is missing. Please ensure you are logged in.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  const topPeople = topFlopData.filter((item) => item.entryType === "TOP");
  const flopPeople = topFlopData.filter((item) => item.entryType === "FLOP");

  const getImageUrl = (profileImage: string | null | undefined): string | undefined => {
    if (!profileImage) return undefined;
    if (profileImage.startsWith('http') || profileImage.startsWith('blob:')) return profileImage;
    return `/api/files/download/${profileImage}`;
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>{t("loadingUserData")}</div>
      </div>
    );
  }

  return (
    <div dir={dir} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("topFlopAdminTitle")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("topFlopAdminDescription")}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => resetForm()}
            >
              <Plus className="h-4 w-4" />
              <span>{t("addPerson")}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? t("editPerson") : t("addNewPerson")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personName">{t("personNameLabel")}</Label>
                  <Input
                    id="personName"
                    value={formData.personName}
                    onChange={(e) =>
                      setFormData({ ...formData, personName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">{t("slugLabel")}</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("entryTypeLabel")}</Label>
                  <Select
                    value={formData.entryType}
                    onValueChange={(value: "TOP" | "FLOP") =>
                      setFormData({ ...formData, entryType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("entryTypeLabel")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOP">{t("entryTypeTop")}</SelectItem>
                      <SelectItem value="FLOP">{t("entryTypeFlop")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="position">{t("positionLabel")}</Label>
                  <Input
                    id="position"
                    type="number"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        position: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("descriptionLabel")}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">{t("reasonLabel")}</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 ">
                <div className="space-y-2">
                  <Label htmlFor="category">{t("categoryLabel")}</Label>
                  <Select
                    value={String(formData.categoryId)}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: Number(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.data.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weekOf">{t("weekLabel")}</Label>
                  <Input
                    id="weekOf"
                    type="date"
                    value={formData.weekOf}
                    onChange={(e) =>
                      setFormData({ ...formData, weekOf: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">{t("languageLabel")}</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      setFormData({ ...formData, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("languageLabel")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">{t("arabic")}</SelectItem>
                      <SelectItem value="fr">{t("french")}</SelectItem>
                      <SelectItem value="en">{t("english")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImage">{t("profileImageLabel")}</Label>
                <div className="flex items-center space-x-2 gap-2">
                  <Input
                    id="profileImage"
                    value={formData.profileImage}
                    onChange={(e) => {
                      setFormData({ ...formData, profileImage: e.target.value });
                      setImageFile(null);
                    }}
                    placeholder={t("profileImagePlaceholder")}
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t("uploadImage")}
                  </Button>
                </div>
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file)); // local preview only
                    }
                  }}
                />
              </div>

              {(imagePreview || formData.profileImage) && (
                <div className="mt-2">
                  <img
                    src={imagePreview || getImageUrl(formData.profileImage)}
                    alt="Profile Preview"
                    className="w-full h-32 object-cover rounded-md border"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">{t("displayOrderLabel")}</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        position: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? t("saving") : t("save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Top People */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>{t("topSectionTitle", { count: topPeople.length })}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("loading")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table dir={dir}>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("personNameHeader")}</TableHead>
                    <TableHead className="hidden md:table-cell">
                      {t("reasonHeader")}
                    </TableHead>
                    <TableHead>{t("positionHeader")}</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      {t("categoryHeader")}
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      {t("authorHeader")}</TableHead>
                    <TableHead className="hidden xl:table-cell">
                      {t("voteCountHeader")}
                    </TableHead>
                    <TableHead>{t("actionsHeader")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPeople.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <Avatar>
                            <AvatarImage src={getImageUrl(person.profileImage)} alt={person.personName} />
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {person.personName}
                            </p>
                            <p className="text-sm text-muted-foreground truncate md:hidden">
                              {person.reason}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {person.reason}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">#{person.position}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">
                          {getCategoryName(person.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getAuthorName(person.author)}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <Badge variant="default">{person.voteCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {currentUser?.role !== "AUTHOR" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(person)}
                                className="flex-shrink-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="hidden sm:inline mr-1">{t("edit")}</span>
                              </Button>
                              <AnimatedDeleteButton
                                size="sm"
                                onAnimatedClick={() => handleAnimatedDelete(person)}
                                disabled={deleteMutation.isPending}
                              />
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flop People */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <span>{t("flopSectionTitle", { count: flopPeople.length })}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("loading")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table dir={dir}>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("personNameHeader")}</TableHead>
                    <TableHead className="hidden md:table-cell">
                      {t("reasonHeader")}
                    </TableHead>
                    <TableHead>{t("positionHeader")}</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      {t("categoryHeader")}
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      {t("authorHeader")}
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">
                      {t("voteCountHeader")}
                    </TableHead>
                    <TableHead>{t("actionsHeader")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flopPeople.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <Avatar>
                            <AvatarImage src={getImageUrl(person.profileImage)} alt={person.personName} />
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {person.personName}
                            </p>
                            <p className="text-sm text-muted-foreground truncate md:hidden">
                              {person.reason}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {person.reason}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">#{person.position}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">
                          {getCategoryName(person.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getAuthorName(person.author)}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <Badge variant="default">{person.voteCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {currentUser?.role !== "AUTHOR" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(person)}
                                className="flex-shrink-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="hidden sm:inline mr-1">{t("edit")}</span>
                              </Button>
                              <AnimatedDeleteButton
                                size="sm"
                                onAnimatedClick={() => handleAnimatedDelete(person)}
                                disabled={deleteMutation.isPending}
                              />
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title={t("deletePersonTitle")}
        description={t("deletePersonDescription", { name: personToDelete?.personName, section: personToDelete?.entryType === "TOP" ? t("entryTypeTop") : t("entryTypeFlop") })}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText={t("delete")}
        cancelText={t("cancel")}
      />
    </div>
  );
}