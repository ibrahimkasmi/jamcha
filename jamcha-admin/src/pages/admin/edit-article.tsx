import { useTranslation } from "react-i18next";
import {
  useState,
  useEffect,
} from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/data/useCategories";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Eye, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ArticlePreview } from "@/components/article-preview";
import { AdminLayout } from "@/components/admin-layout";
import { useAuth } from "@/contexts/AuthContext";
import i18n from "@/lib/i18n";
import { SocialMediaLinksInput } from "@/components/ui/social-media-input";
import { SocialMediaLink } from "@/types/social-media-link";

export default function EditArticle() {
  const { t } = useTranslation();
  const { articleId } = useParams({ from: "/articles/edit/$articleId" });
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { loading: isAuthLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author: "",
    authorRole: "",
    category: "",
    featuredImage: "",
    videoUrl: "",
    isBreaking: false,
    language: "en",
    socialMediaLinks: [] as SocialMediaLink[],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Helper to get the correct image preview URL
  const getImagePreviewUrl = () => {
    // If imagePreview is set (from file upload or URL input), use it
    if (imagePreview) return imagePreview;
    // If formData.featuredImage is a full URL, use it directly
    if (formData.featuredImage && (formData.featuredImage.startsWith("http://") || formData.featuredImage.startsWith("https://"))) {
      return formData.featuredImage;
    }
    // If formData.featuredImage is a filename, use the API endpoint
    if (formData.featuredImage) {
      return `/api/files/download/${formData.featuredImage}`;
    }
    return "";
  };

  // Fetch article data
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/articles", articleId],
    queryFn: async () => {
      // Public endpoint - no auth required
      const response = await fetch(`/api/articles/id/${articleId}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `${t("failedToFetchArticle")} ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    },
    enabled: !!articleId,
  });

  // Fetch categories using hook

  const { data: categories = [] } = useCategories();

  // Load article data into form
  useEffect(() => {
    if (article) {
      // Helper function to safely get nested values
      const getCategorySlug = (category: any): string => {
        if (typeof category === "string") return category;
        return category?.slug || "politics";
      };

      const getAuthorName = (author: any): string => {
        if (typeof author === "string") return author;
        return author?.name || "";
      };

      const getAuthorBio = (author: any): string => {
        if (typeof author === "object" && author?.bio) return author.bio;
        return "";
      };

      const getTags = (tags: any): string[] => {
        if (Array.isArray(tags)) {
          return tags
            .map((tag) => (typeof tag === "string" ? tag : tag?.name || ""))
            .filter(Boolean);
        }
        return [];
      };

      setFormData({
        title: article.title || "",
        slug: article.slug || "",
        content: article.content || "",
        excerpt: article.excerpt || "",
        author: getAuthorName(article.author),
        authorRole: getAuthorBio(article.author),
        category: getCategorySlug(article.category),
        featuredImage: article.featuredImage || "",
        videoUrl: article.videoUrl || "",
        isBreaking: Boolean(article.isBreaking),
        language: article.language || "en",
        socialMediaLinks: article.socialMediaLinkResponseDtos || [],
      });

      setTagList(getTags(article.tags));

      // Set image preview for existing article
      if (article.featuredImage) {
        // If it's a full URL, use as is, else use API endpoint
        if (article.featuredImage.startsWith("http://") || article.featuredImage.startsWith("https://")) {
          setImagePreview(article.featuredImage);
        } else {
          setImagePreview(`/api/files/download/${article.featuredImage}`);
        }
      }
    }
  }, [article]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      // Find the category ID based on the selected category slug/name
      const selectedCategory = categories.find(
        (cat: { slug: any; name: string }) =>
          cat.slug === data.category ||
          cat.name.toLowerCase() === data.category.toLowerCase(),
      );

      if (!selectedCategory) {
        throw new Error(t("categoryNotFound", { category: data.category }));
      }

      const requestData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        videoUrl: data.videoUrl,
        categoryId: selectedCategory.id,
        tagIds: [], // You might need to map tag names to IDs
        // author: {
        //   name: data.author,
        //   bio: data.authorRole || t("staffWriter"),
        //   email: "author@jamcha.com", // Default email
        //   socialLinks: {},
        // },
        readingTime: Math.ceil(data.content.split(" ").length / 200),
        isBreaking: data.isBreaking,
        language: data.language,
        translations: null,
        publishedAt: new Date().toISOString(),
        socialMediaLinks: data.socialMediaLinks || [],
      };

      // Create FormData for multipart request (same as new-article)
      const formData = new FormData();

      console.log("Sending article data:", JSON.stringify(requestData, null, 2));

      // Add article as JSON blob
      formData.append(
        "article",
        new Blob([JSON.stringify(requestData)], {
          type: "application/json",
        }),
      );

      // Add image file if provided, otherwise create dummy file
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        // Create a dummy image file if no new image is provided
        const dummyFile = new File([""], "dummy.txt", { type: "text/plain" });
        formData.append("image", dummyFile);
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `${t("failedToUpdateArticle")} ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("updatedSuccessfully"),
        description: t("articleUpdatedSuccessfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      navigate({ to: "/articles", search: { refetch: "1" } });
    },
    onError: (error: any) => {
      toast({
        title: t("updateFailed"),
        description:
          error.message ||
          t("failedToUpdateArticleCheckConnection"),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasEmptySocialLink = formData.socialMediaLinks.some(link => !link.url.trim());
    if (hasEmptySocialLink) {
      toast({
        title: t("emptySocialLinkTitle"),
        description: t("emptySocialLinkDesc"),
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !tagList.includes(tagInput.trim())) {
      setTagList([...tagList, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTagList(tagList.filter((t) => t !== tag));
  };
  const dir = i18n.dir();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: t("fileTooLarge"),
          description: t("imageFileSizeLimit"),
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, featuredImage: "" });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/articles" })}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToArticles")}
            </Button>
            <h1 className="text-2xl font-bold">{t("loadingArticle")}</h1>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    // Removed console.error
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t("errorLoadingArticle")}</h2>
          <p className="text-red-600 mb-4">{t("error")} {error.message}</p>
          <p className="text-sm text-gray-600 mb-4">{t("articleId")} {articleId}</p>
          <p className="text-sm text-gray-600 mb-4">
            {t("checkConsole")}
          </p>
          <Button onClick={() => navigate({ to: "/articles" })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToArticles")}
          </Button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t("articleNotFound")}</h2>
          <p className="text-gray-600 mb-4">{t("articleId")} {articleId}</p>
          <p className="text-sm text-gray-600 mb-4">
            {t("articleNotFoundDescription")}
          </p>
          <Button onClick={() => navigate({ to: "/articles" })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToArticles")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/articles" })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToArticles")}
          </Button>
          <h1 className="text-2xl font-bold">{t("editArticle")}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("articleDetails")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="title">{t("titleRequired")}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder={t("enterArticleTitle")}
                    required
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="slug">{t("urlSlugRequired")}</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder={t("articleUrlSlug")}
                    required
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="excerpt">{t("excerpt")}</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder={t("briefDescription")}
                    rows={3}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="content">{t("contentRequired")}</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder={t("writeYourArticle")}
                    rows={15}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("wordCount")}
                    {formData.content.split(" ").filter((w) => w).length} {t("words")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("publishSettings")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="category">{t("categoryRequired")}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectCategory")}
                        // Always show placeholder if value is empty
                        {...(formData.category ? {} : { children: t("selectCategory") })}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="no-categories-available" disabled>
                          {t("noCategoriesAvailable")}
                        </SelectItem>
                      ) : (
                        categories.map(
                          (category: {
                            id: number;
                            slug: string;
                            name: string;
                          }) => (
                            <SelectItem
                              key={`category-${category.id}`}
                              value={category.slug}
                            >
                              {category.name}
                            </SelectItem>
                          ),
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="language">{t("language")}</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      setFormData({ ...formData, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="lang-en" value="en">
                        {t("english")}
                      </SelectItem>
                      <SelectItem key="lang-ar" value="ar">
                        {t("arabic")}
                      </SelectItem>
                      <SelectItem key="lang-fr" value="fr">
                        {t("french")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 gap-2" dir="ltr">
                  <Switch
                    dir="ltr"
                    id="breaking"
                    checked={formData.isBreaking}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isBreaking: checked })
                    }
                  />
                  <Label htmlFor="breaking">{t("breakingNews")}</Label>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>{t("authorInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author">{t("authorNameRequired")}</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder={t("authorName")}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="authorRole">{t("authorRole")}</Label>
                  <Input
                    id="authorRole"
                    value={formData.authorRole}
                    onChange={(e) =>
                      setFormData({ ...formData, authorRole: e.target.value })
                    }
                    placeholder={t("seniorReporterExample")}
                  />
                </div>
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader>
                <CardTitle>{t("tags")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2 gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder={t("addTag")}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tagList.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("socialMediaLinks")}</CardTitle>
              </CardHeader>
              <CardContent>
                <SocialMediaLinksInput
                  value={formData.socialMediaLinks}
                  onChange={(links) =>
                    setFormData({ ...formData, socialMediaLinks: links })
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("featuredMedia")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="featuredImage">{t("featuredImage")}</Label>
                  <div className="space-y-4">
                    {/* File Upload Option */}
                    <div>
                      <Input
                        id="featuredImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 h-15 weight-100"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("uploadImageOrUrl")}
                    </p>

                    {/* URL Input Option with Remove Button */}
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={t("enterImageUrl")}
                        value={formData.featuredImage}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            featuredImage: e.target.value,
                          });
                          if (e.target.value) {
                            setImagePreview(e.target.value);
                            setImageFile(null); // Clear file if URL is provided
                          }
                        }}
                      />
                      {(imagePreview || formData.featuredImage) && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                          title={t("removeImage")}
                          aria-label={t("removeImage")}
                        >
                          <span className="text-xl leading-none">×</span>
                        </button>
                      )}
                    </div>

                    {/* Image Preview */}
                    {getImagePreviewUrl() && (
                      <div className="mt-4">
                        <img
                          src={getImagePreviewUrl()}
                          alt={t("featured")}
                          className="w-full h-32 object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                          onLoad={() => { }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="videoUrl">{t("videoUrl")}</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrl: e.target.value })
                    }
                    placeholder={t("youtubeUrlExample")}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4 gap-2">
              <Button
                type="submit"
                disabled={updateMutation.isPending || isAuthLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? t("updating") : t("updateArticle")}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? t("hidePreview") : t("showPreview")}
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:col-span-3 mt-8">
              <h3 className="text-lg font-semibold mb-4">{t("articlePreview")}</h3>
              <ArticlePreview
                title={formData.title || t("articleTitle")}
                content={
                  formData.content || t("articleContentPlaceholder")
                }
                excerpt={
                  formData.excerpt || t("articleExcerptPlaceholder")
                }
                author={formData.author || t("authorNamePlaceholder")}
                authorRole={formData.authorRole || t("authorRolePlaceholder")}
                category={{
                  id: formData.category || "general",
                  name: formData.category || t("category"),
                  slug: formData.category || "category",
                  color: "#3b82f6",
                  icon: "📰",
                  translations: {},
                }}
                tags={tagList}
                featuredImage={imagePreview || formData.featuredImage}
                videoUrl={formData.videoUrl}
                isBreaking={formData.isBreaking}
                language={formData.language}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
