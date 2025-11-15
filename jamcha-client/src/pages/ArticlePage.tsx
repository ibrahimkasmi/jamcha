// src/pages/ArticlePage.tsx
import { Helmet } from "react-helmet-async";
import { ArticleDataProvider } from "@/features/article/contexts/ArticleDataProvider";
import { ArticleScreen } from "@/features/article/screens/ArticleScreen";
import { generateMetadata } from "@/shared/utils/seo";
import { seoHelpers } from "@/shared/utils/seo-helpers";

export default function ArticlePage() {
  // Vous devrez récupérer les données de l'article ici, soit depuis:
  // - Les paramètres d'URL (en utilisant les hooks wouter)
  // - Les props passées
  // - Le contexte ou un appel API

  // Pour l'instant, utilisation d'un placeholder - remplacez par votre récupération de données
  const article = {
    title: "Titre de l'article", // Récupérer depuis vos données
    content: "Contenu de l'article...", // Récupérer depuis vos données
    slug: "slug-article", // Récupérer depuis les paramètres d'URL
    author: { name: "Nom de l'auteur" },
    createdAt: new Date().toISOString(),
    excerpt: "Extrait de l'article...",
  };

  const metadata = generateMetadata({
    title: `${article.title} - التاليين`,
    description: seoHelpers.generateMetaDescription(
      article.content || article.excerpt
    ),
    keywords: seoHelpers.generateKeywords(
      article.title,
      article.content || article.excerpt
    ),
    canonicalUrl: `/article/${article.slug}`,
    type: "article",
  });

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <link rel="canonical" href={metadata.canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:site_name" content="التاليين" />
        <meta property="article:author" content={article.author?.name} />
        <meta property="article:published_time" content={article.createdAt} />

        {/* Données structurées pour Google */}
        <script type="application/ld+json">
          {JSON.stringify(seoHelpers.formatArticleStructuredData(article))}
        </script>
      </Helmet>

      <ArticleDataProvider>
        <ArticleScreen />
      </ArticleDataProvider>
    </>
  );
}
