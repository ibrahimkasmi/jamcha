// src/pages/PodcastPage.tsx
import { Helmet } from "react-helmet-async";
import { PodcastDataProvider } from "@/features/podcast/contexts/PodcastDataProvider";
import { PodcastScreen } from "@/features/podcast/screens/PodcastScreen";
import { generateMetadata } from "@/shared/utils/seo";

export default function PodcastPage() {
  const metadata = generateMetadata({
    title: "Podcasts - Jamcha",
    description:
      "Écoutez nos derniers podcasts et contenus audio. Restez informé avec nos discussions d'experts sur Jamcha.",
    keywords: "podcasts, audio, discussions, interviews, actualités, jamcha",
    canonicalUrl: "/podcast",
    type: "website",
  });

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <link rel="canonical" href={metadata.canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:site_name" content="Jamcha" />
      </Helmet>

      <PodcastDataProvider>
        <PodcastScreen />
      </PodcastDataProvider>
    </>
  );
}
