import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
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
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Play, Video } from "lucide-react";
import { formatTimeToArabic } from "@/lib/time-utils";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { AnimatedDeleteButton } from "@/components/ui/animated-delete-button";
import { useRequireAuth } from "@/hooks/authGuards";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/data/useCategories";
import { useData } from "@/contexts/DataContext";
import i18n from "@/lib/i18n";

interface Author {
  id?: number;
  name: string;
  email?: string;
  avatar?: string | null;
  provider?: string;
  providerId?: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}
interface Category {
  id: number;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  translations?: Record<string, any> | object;
}

interface PodcastVideo {
  id: number;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: Category;
  tags: Tag[];
  author: Author;
  duration: number;
  viewCount: number;
  publishedAt: string;
  isFeatured: boolean;
  language: string;
  translations?: string;
  createdAt: string;
  updatedAt: string;
}

const initialFormData = {
  title: "",
  slug: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: "",
  duration: 0,
  categoryId: 0,
  authorId: 0,
  language: i18n.language,
  isFeatured: false,
};

export default function AdminPodcast() {
  const { t } = useTranslation();
  const dir = i18n.dir?.() || 'ltr';
  useRequireAuth();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PodcastVideo | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [podcastToDelete, setPodcastToDelete] = useState<PodcastVideo | null>(
    null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useCategories();

  const { data: authors = [] } = useQuery<Author[]>({
    queryKey: ["/api/authors"],
    queryFn: async () => {
      const response = await fetch("/api/authors");
      if (!response.ok) throw new Error(t("failedToFetchAuthors"));
      return response.json();
    },
  });

  const {
    data: podcastVideos = [],
    isLoading,
    refetch,
  } = useQuery<PodcastVideo[]>({
    queryKey: ["/api/podcasts"],
    queryFn: async () => {
      const response = await fetch("/api/podcasts");
      if (!response.ok) throw new Error(t("failedToFetchPodcastVideos"));
      return response.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (podcastData: any) => {
      const url = editingItem
        ? `/api/podcasts/${editingItem.id}`
        : "/api/podcasts";

      const body = new FormData();
      body.append(
        "podcast",
        new Blob([JSON.stringify(podcastData)], {
          type: "application/json",
        }),
      );

      if (imageFile) {
        body.append("thumbnail", imageFile);
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
          message: t(editingItem ? "failedToUpdatePodcast" : "failedToCreatePodcast"),
        }));
        throw new Error(
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      // Expect backend to return the saved podcast, including the thumbnail filename
      return response.json();
    },
    onSuccess: (data) => {
      // Set the thumbnailUrl to the filename/path returned by backend (not a blob)
      if (data && data.thumbnailUrl) {
        setFormData((prev: any) => ({ ...prev, thumbnailUrl: data.thumbnailUrl }));
        setImagePreview(""); // clear local preview, use backend
      }
      toast({
        title: editingItem
          ? t("videoUpdatedSuccessfully")
          : t("videoAddedSuccessfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/podcasts"] });
      refetch();
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
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/podcasts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: t("failedToDeletePodcast") }));
        throw new Error(
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return { deletedId: id };
    },
    onSuccess: () => {
      toast({ title: t("videoDeletedSuccessfully") });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: t("failedToDeleteVideo"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingItem(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleEdit = (item: PodcastVideo) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description,
      videoUrl: item.videoUrl,
      thumbnailUrl: item.thumbnailUrl,
      duration: item.duration,
      categoryId: item.category.id,
      authorId: item.author.id ?? 0,
      language: item.language,
      isFeatured: item.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const handleAnimatedDelete = (podcast: PodcastVideo) => {
    setPodcastToDelete(podcast);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (podcastToDelete) {
      deleteMutation.mutate(podcastToDelete.id);
    }
    setDeleteDialogOpen(false);
    setPodcastToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setPodcastToDelete(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let authorId: number | null = null;

    if (editingItem) {
      // When editing, find the author's ID from the new authors list
      const originalAuthor = authors.find(
        (author) => author.name === editingItem.author.name,
      );
      if (originalAuthor) {
        authorId = Number(originalAuthor.id);
      } else {
        toast({
          title: t("anErrorOccurred"),
          description: `Could not find the original author "${editingItem.author.name}" in the author list.`,
          variant: "destructive",
        });
        return;
      }
    } else {
      // When creating, use the current logged-in user's ID
      authorId = currentUser?.id ? Number(currentUser.id) : null;
    }

    if (!authorId) {
      toast({
        title: t("anErrorOccurred"),
        description: "Author ID is missing. Please ensure you are logged in.",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      videoUrl: formData.videoUrl,
      thumbnailUrl: formData.thumbnailUrl,
      duration: formData.duration,
      categoryId: formData.categoryId,
      authorId: authorId,
      language: formData.language,
      isFeatured: formData.isFeatured,
    };

    saveMutation.mutate(submissionData);
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    );
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";
  };

  const getImageUrl = (thumbnailUrl: string | null | undefined): string | undefined => {
    if (!thumbnailUrl) return undefined;
    if (thumbnailUrl.startsWith('http') || thumbnailUrl.startsWith('blob:')) return thumbnailUrl;
    return `/api/files/download/${thumbnailUrl}`;
  };

  return (
    <div dir={dir} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("podcastManagement")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("manageYouTubePodcastVideos")}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => resetForm()}
            >
              <Plus className="h-4 w-4" />
              <span>{t("addVideo")}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? t("editVideo") : t("addNewVideo")}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? t("updatePodcastVideoDescription") : t("addPodcastVideoDescription")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("title")}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder={t("titlePlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">{t("slug")}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder={t("slugPlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("descriptionPlaceholder")}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">{t("videoUrl")}</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    setFormData({
                      ...formData,
                      videoUrl: url,
                      thumbnailUrl: getYouTubeThumbnail(url),
                    });
                  }}
                  placeholder={t("videoUrlPlaceholder")}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">{t("duration")}</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder={t("durationPlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t("category")}</Label>
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
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="language">{t("language")}</Label>
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
                <Label htmlFor="thumbnailUrl">{t("featuredImage")}</Label>
                <div className="flex items-center space-x-2 gap-2">
                  <Input
                    id="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        thumbnailUrl: e.target.value,
                      });
                      setImageFile(null);
                    }}
                    placeholder={t("imageUrlExample")}
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

              {(imagePreview || formData.thumbnailUrl) && (
                <div className="mt-2">
                  <img
                    src={imagePreview || getImageUrl(formData.thumbnailUrl)}
                    alt="Thumbnail Preview"
                    className="w-full h-32 object-cover rounded-md border"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2 gap-2" dir="ltr" >
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFeatured: checked })
                  }
                />
                <Label htmlFor="isFeatured" className="text-sm font-medium">
                  {t("featured")}
                </Label>
              </div>
              {formData.videoUrl && (
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 ">
                  <h4 className="font-medium mb-2">{t("preview")}</h4>
                  <div className="flex items-center space-x-3 gap-2">
                    <img
                      src={getYouTubeThumbnail(formData.videoUrl)}
                      alt="Thumbnail"
                      className="w-24 h-18 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{formData.title}</p>
                      <p className="text-sm text-gray-600">
                        {formData.duration}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-4 gap-2">
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
      <Card>
        <CardHeader>
          <CardTitle>{t("allPodcastVideos", { count: podcastVideos.length })}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("loadingPodcast")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table dir={dir}>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("video")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("category")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("duration")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("views")}</TableHead>
                    <TableHead className="hidden xl:table-cell">{t("publishedAt")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {podcastVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                              {video.thumbnailUrl ? (
                                <img
                                  src={getImageUrl(video.thumbnailUrl)}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Video className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {video.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {video.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">
                          {video.category?.name || t("notSpecified")}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {Math.floor(video.duration / 60)}:
                        {(video.duration % 60).toString().padStart(2, "0")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {video.viewCount || 0}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <span className="text-sm">
                          {formatTimeToArabic(new Date(video.publishedAt))}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(video.videoUrl, "_blank")
                            }
                            className="flex-shrink-0"
                          >
                            <Play className="h-4 w-4 " />
                          </Button>
                          {currentUser?.role.toUpperCase() === "ADMIN" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(video)}
                              className="flex-shrink-0"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden sm:inline mr-1">{t("edit")}</span>
                            </Button>
                          )}
                          {currentUser?.role !== "AUTHOR" && (
                            <AnimatedDeleteButton
                              size="sm"
                              onAnimatedClick={() => handleAnimatedDelete(video)}
                              disabled={deleteMutation.isPending}
                            />
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
        title={t("deletePodcastTitle")}
        description={t("deletePodcastDescription", { title: podcastToDelete?.title })}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText={t("delete")}
        cancelText={t("cancel")}
      />
    </div>
  );
}