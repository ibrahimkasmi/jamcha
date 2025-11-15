// src/pages/PodcastPage.tsx
import { Helmet } from "react-helmet-async";
import { TopFlopDataProvider } from "@/features/topflop/contexts/TopFlopDataProvider";
import { generateMetadata } from "@/shared/utils/seo";
import { TopFlopScreen } from "@/features/topflop/screens/TopFlopScreen";

export default function PodcastPage() {
  const metadata = generateMetadata({
    title: "Topflop",
    description:
      "Découvrez et pariez sur les sujets les plus tendances et d'actualité. Restez informé avec nos analyses et discussions d'experts sur Topflop.",
    keywords:
      "paris, tendances, actualités, discussions, analyses, topflop, sujets chauds, pronostics",
    canonicalUrl: "/topflop",
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
        <meta property="og:site_name" content="التاليين" />
      </Helmet>

      <TopFlopDataProvider>
        <TopFlopScreen />
      </TopFlopDataProvider>
    </>
  );
}
