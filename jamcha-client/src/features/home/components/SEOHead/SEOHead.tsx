// src/features/home/components/SEOHead/SEOHead.tsx
import { memo } from "react";
import { useHomeSEO } from "../../hooks/useHomeSEO";

export const SEOHead = memo(() => {
  const seoData = useHomeSEO();

  return (
    <div>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <link rel="canonical" href={seoData.canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.image} />
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta property="og:type" content={seoData.type} />
      <meta property="og:site_name" content="Your Site Name" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.image} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Your Site Name",
          url: seoData.canonicalUrl,
          description: seoData.description,
          potentialAction: {
            "@type": "SearchAction",
            target: `${seoData.canonicalUrl}search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        })}
      </script>

      {/* Breadcrumb Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: seoData.canonicalUrl,
            },
          ],
        })}
      </script>
    </div>
  );
});

SEOHead.displayName = "SEOHead";
