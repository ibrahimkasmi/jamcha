// src/pages/HomePage.tsx
import { Helmet } from "react-helmet-async";
import { HomeDataProvider } from "@/features/home/contexts/HomeDataProvider";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { generateMetadata } from "@/shared/utils/seo";

export default function HomePage() {
  const metadata = generateMetadata({
    title: "Accueil - التاليين",
    description:
      "Bienvenue sur التاليين. Découvrez les derniers articles, podcasts et actualités du moment.",
    keywords: "accueil, actualités, articles, podcasts, التاليين, news",
    canonicalUrl: "/",
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
        <meta property="og:url" content="/" />
        <meta property="og:site_name" content="التاليين" />
      </Helmet>

      <HomeDataProvider>
        <HomeScreen />
      </HomeDataProvider>
    </>
  );
}
