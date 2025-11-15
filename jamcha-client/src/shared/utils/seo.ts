// src/shared/utils/seo.ts
interface MetadataOptions {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  type?: "website" | "article";
  image?: string;
  articleCount?: number;
}

export const generateMetadata = (options: MetadataOptions) => {
  const {
    title,
    description,
    keywords,
    canonicalUrl,
    type = "website",
    image = "/images/التاليين_light.png",
    articleCount = 0,
  } = options;

  // Ensure proper length limits for SEO
  const truncatedTitle =
    title.length > 60 ? title.substring(0, 57) + "..." : title;
  const truncatedDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  return {
    title: truncatedTitle,
    description: truncatedDescription,
    keywords: keywords.substring(0, 255), // Limit keywords
    canonicalUrl,
    type,
    image: image.startsWith("http")
      ? image
      : `${window.location.origin}${image}`,
    articleCount,
  };
};
