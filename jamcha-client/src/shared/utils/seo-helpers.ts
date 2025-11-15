// src/shared/utils/seo-helpers.ts
export const seoHelpers = {
  // Generate meta description from content
  generateMetaDescription: (
    content: string,
    maxLength: number = 160
  ): string => {
    const cleanContent = content.replace(/<[^>]*>/g, "").trim();
    return cleanContent.length > maxLength
      ? cleanContent.substring(0, maxLength - 3) + "..."
      : cleanContent;
  },

  // Generate keywords from content
  generateKeywords: (
    title: string,
    content: string,
    category?: string
  ): string => {
    const words = [title, content, category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3);

    const uniqueWords = [...new Set(words)];
    return uniqueWords.slice(0, 10).join(", ");
  },

  // Format structured data for articles
  formatArticleStructuredData: (article: any) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      "@type": "Person",
      name: article.author?.name || "Anonymous",
    },
    publisher: {
      "@type": "Organization",
      name: "Your Site Name", // ✅ Use hardcoded string instead of process.env
      logo: {
        "@type": "ImageObject",
        url: "/logo.png", // ✅ Use hardcoded path instead of process.env
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${window.location.origin}/article/${article.slug}`, // ✅ Use window.location instead of process.env
    },
  }),

  // Generate breadcrumb structured data
  generateBreadcrumbData: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  // Generate FAQ structured data
  generateFAQData: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),
};
