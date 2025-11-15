// src/pages/AboutPage.tsx
import { Helmet } from "react-helmet-async";
import { AboutScreen } from "@/features/about/screens/AboutScreen";
import { generateMetadata } from "@/shared/utils/seo";

export default function AboutPage() {
  const metadata = generateMetadata({
    title: "À Propos - التاليين",
    description:
      "Découvrez notre mission, notre équipe et notre engagement à fournir du contenu de qualité et des actualités sur التاليين.",
    keywords: "à propos, mission, équipe, التاليين, organisation médiatique",
    canonicalUrl: "/about",
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

      <AboutScreen />
    </>
  );
}
