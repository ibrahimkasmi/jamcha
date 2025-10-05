import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Eye, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ArticlePreview } from "@/components/article-preview";
import { useAuth } from "@/contexts/AuthContext";
import { SocialMediaLinksInput } from "@/components/ui/social-media-input";
import { SocialMediaLink } from "@/types/social-media-link";

export default function NewArticle() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();


  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    categoryId: 0,
    tags: "",
    featuredImage: "",
    videoUrl: "",
    isBreaking: false,
    language: "",
    socialMediaLinks: [] as SocialMediaLink[],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    field: keyof typeof formData,
    value: string | number | boolean | SocialMediaLink[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error(t("failedToFetchCategories"));
      }
      return response.json();
    },
  });
  const { data: languages = [] } = useQuery({
    queryKey: ["/api/language-settings"],
    queryFn: async () => {
      const response = await fetch("/api/language-settings");
      if (!response.ok) {
        throw new Error(t("failedToFetchLanguages"));
      }
      return response.json();
    },
  });



  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Check if we have a token
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error(t("noAuthToken"));
      }

      // Create the article request DTO
      const authorId = user?.role === 'AUTHOR' ? (user?.id ? Number(user.id) : null) : null;

      const articleDto = {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        videoUrl: data.videoUrl,
        categoryId: data.categoryId,
        tagIds: [], // You might need to map tag names to IDs
        authorId: authorId,
        readingTime: Math.ceil(data.content.split(" ").length / 200),
        isBreaking: data.isBreaking,
        language: data.language,
        translations: JSON.stringify({}),
        publishedAt: new Date().toISOString(),
        isActive: true,
        socialMediaLinks: data.socialMediaLinks || [],
      };

      // Create FormData for multipart request
      const formData = new FormData();

      // Add article as JSON blob
      formData.append(
        "article",
        new Blob([JSON.stringify(articleDto)], {
          type: "application/json",
        }),
      );

      // Add image file if provided
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        // Create a dummy image file if no image is provided
        const dummyFile = new File([""], t("dummyFileName"), { type: "text/plain" });
        formData.append("image", dummyFile);
      }

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });

      if (response.status === 401) {
        // Token expired or invalid - logout user
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        throw new Error(t("sessionExpired"));
      }

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(t("articleWithThisSlugAlreadyExists"));
        }
        const errorText = await response.text();
        throw new Error(
          `${t("failedToCreateArticle")} ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("articleCreatedSuccessfully"),
        description: t("articlePublishedSuccessfully"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles/my-articles"] });
      navigate({ to: "/articles" });
    },
    onError: (error: any) => {
      toast({
        title: t("failedToCreateArticleTitle"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: t("missingRequiredFields"),
        description: t("titleIsRequired"),
        variant: "destructive",
      });
      return;
    }
    if (!formData.content.trim()) {
      toast({
        title: t("missingRequiredFields"),
        description: t("contentIsRequired"),
        variant: "destructive",
      });
      return;
    }
    if (!formData.excerpt.trim()) {
      toast({
        title: t("missingRequiredFields"),
        description: t("excerptIsRequired"),
        variant: "destructive",
      });
      return;
    }
    if (formData.categoryId <= 0) {
      toast({
        title: t("missingRequiredFields"),
        description: t("categoryIsRequired"),
        variant: "destructive",
      });
      return;
    }
    if (!formData.language) {
      toast({
        title: t("missingRequiredFields"),
        description: t("languageIsRequired", "Please select a language."),
        variant: "destructive",
      });
      return;
    }

    const hasEmptySocialLink = formData.socialMediaLinks.some(link => !link.url.trim());
    if (hasEmptySocialLink) {
      toast({
        title: t("emptySocialLinkTitle"),
        description: t("emptySocialLinkDesc"),
        variant: "destructive",
      });
      return;
    }

    const articleData = {
      ...formData,
      tags: tagList,
      slug:
        formData.slug ||
        formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      readingTime: Math.ceil(formData.content.split(" ").length / 200),
      isActive: true,
    };

    createMutation.mutate(articleData);
  };

  const addTag = () => {
    if (formData.tags.trim() && !tagList.includes(formData.tags.trim())) {
      setTagList([...tagList, formData.tags.trim()]);
      handleChange("tags", "");
    }
  };

  const removeTag = (tag: string) => {
    setTagList(tagList.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("createNewArticle")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("writeAndPublish")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Redundant buttons removed for cleaner UI */}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("articleContent")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">{t("titleRequired")}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder={t("enterArticleTitle")}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="slug">{t("urlSlug")}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder={t("articleUrlSlugAutoGenerated")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="excerpt">{t("excerpt")}</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
                  placeholder={t("briefDescription")}
                  rows={3}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="content">{t("contentRequired")}</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
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
              <CardTitle>{t("articleSettings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">{t("categoryRequired")}</Label>
                <Select
                  value={String(formData.categoryId)}
                  onValueChange={(value) => handleChange("categoryId", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("selectCategory")}
                      {...(formData.categoryId ? {} : { children: t("selectCategory") })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="no-categories-available" disabled>
                        {t("noCategoriesAvailable")}
                      </SelectItem>
                    ) : (
                      categories.map((category: any) => (
                        <SelectItem
                          key={`category-${category.id}`}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="language">{t("language")}</Label>
                <Select
                  value={formData.language || ""}
                  onValueChange={(value) => handleChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectLanguage")} />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language: any) => (
                      <SelectItem
                        key={`language-${language.id}`}
                        value={language.code}
                      >
                        {t(language.name.toLowerCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 gap-2" dir="ltr">
                <Switch
                  id="breaking"
                  checked={formData.isBreaking}
                  onCheckedChange={(checked) => handleChange("isBreaking", checked)}
                />
                <Label htmlFor="breaking">{t("breakingNews")}</Label>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>{t("authorInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="author">{t("authorName")}</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder={t("authorName")}
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
                  placeholder={t("seniorReporterExample2")}
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
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder={t("addTag")}
                  onKeyPress={(e) =>
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
                onChange={(links) => handleChange("socialMediaLinks", links)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("featuredImage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="imageFile">{t("uploadImage")}</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        // Create preview URL
                        const previewUrl = URL.createObjectURL(file);
                        setFormData((prev) => ({
                          ...prev,
                          featuredImage: previewUrl,
                        }));
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("uploadImageFile")}
                  </p>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  {t("or")}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="featuredImage">{t("imageUrl")}</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        featuredImage: e.target.value,
                      }));
                      setImageFile(null); // Clear file if URL is used
                    }}
                    placeholder={t("imageUrlExample")}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("provideImageUrl")}
                  </p>
                </div>
              </div>

              {formData.featuredImage && (
                <div className="mt-4">
                  <img
                    src={formData.featuredImage}
                    alt={t("featured")}
                    className="w-full h-32 object-cover rounded-md"

                  />
                </div>
              )}

              <div className="flex flex-col gap-2 mt-4">
                <Label htmlFor="videoUrl">{t("videoUrl")}</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))
                  }
                  placeholder={t("youtubeUrlExample")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 mt-6 gap-2">
            <Button
              type="submit"
              disabled={createMutation.isPending || isAuthLoading}
              className="w-full lg:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending ? t("creating") : t("publishArticle")}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full lg:w-auto"
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
              author={user?.username || t("authorNamePlaceholder")}
              authorRole={user?.role || t("authorRolePlaceholder")}
              category={{
                id: String(formData.categoryId || 0),
                name: categories?.find((c: any) => c.id === formData.categoryId)?.name || t("category"),
                slug: categories?.find((c: any) => c.id === formData.categoryId)?.slug || "category",
                color: "#3B82F6",
                icon: "file-text",
                translations: {},
              }}
              tags={tagList}
              featuredImage={formData.featuredImage}
              videoUrl={formData.videoUrl}
              isBreaking={formData.isBreaking}
              language={formData.language}
            />
          </div>
        )}
      </form>
    </div>
  );
}
