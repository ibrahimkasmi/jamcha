// src/config/seo.ts
export const seoConfig = {
  defaultTitle: "Your Amazing Blog - Latest Articles and Insights",
  titleTemplate: "%s | Your Amazing Blog",
  defaultDescription:
    "Discover the latest articles, insights, and stories on topics that matter. Stay informed with our comprehensive blog covering technology, lifestyle, and more.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Your Amazing Blog",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Your Amazing Blog",
      },
    ],
  },

  twitter: {
    handle: "@yourhandle",
    site: "@yoursite",
    cardType: "summary_large_image",
  },

  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
    },
    {
      name: "theme-color",
      content: "#ffffff",
    },
    {
      name: "application-name",
      content: "Your Amazing Blog",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "default",
    },
  ],

  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/icons/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "manifest",
      href: "/manifest.json",
    },
  ],
};
