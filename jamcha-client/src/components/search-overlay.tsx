import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import { useDebounce } from "@/hooks/useDebounce";
import { formatTimeToArabic } from "@/lib/time-utils";
import { Search, X, Clock, Calendar, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useArticles } from "@/hooks/useArticles";
import { useTranslation } from "react-i18next";
import { t } from "@/lib/i18n";

export function SearchOverlay() {
  const {
    isSearchOverlayOpen,
    setSearchOverlayOpen,
    setSearchQuery,
    selectedCategory,
  } = useStore();

  const [inputValue, setInputValue] = useState("");
  const debouncedSearchQuery = useDebounce(inputValue, 200);

  // Handle MinIO image URLs
  const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl)
      return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `/api/files/download/${imageUrl}`;
  };

  // Fetch all articles
  const { data: articles, isLoading: isLoadingArticles } = useArticles();

  // Flexible search logic with keyword matching
  const searchResults =
    debouncedSearchQuery.trim() === ""
      ? []
      : articles?.filter((article) => {
          const searchTerms = debouncedSearchQuery.toLowerCase().split(/\s+/);
          // Convert all searchable fields to a single string
          const articleText = [
            article.title || "",
            article.excerpt || "",
            article.content || "",
            article.category?.name || "",
            // Join tags into a single string if they exist
            (article.tags || []).join(" "),
          ]
            .filter(Boolean)
            .map((text) => text.toLowerCase())
            .join(" ");

          // Match if ALL search terms are found somewhere in the article
          const matchesAllTerms = searchTerms.every((term) => {
            // Check for exact match
            if (articleText.includes(term)) return true;

            // For Arabic text, check without 'ال' prefix
            if (term.startsWith("ال") && articleText.includes(term.slice(2)))
              return true;
            // Also check if the article text contains 'ال' + search term
            if (articleText.includes("ال" + term)) return true;

            // Check for hyphenated variations (e-sports matches esports)
            const withoutHyphen = term.replace(/-/g, "");
            if (articleText.includes(withoutHyphen)) return true;

            // Check for plural/singular variations
            const singularTerm = term.replace(/s$/, "");
            const pluralTerm = term.endsWith("s") ? term : term + "s";
            if (
              articleText.includes(singularTerm) ||
              articleText.includes(pluralTerm)
            )
              return true;

            // Check for partial matches (min 3 characters)
            if (
              term.length >= 3 &&
              articleText.includes(term.substring(0, term.length - 1))
            )
              return true;

            return false;
          });

          // If category is selected, only show results from that category
          if (
            selectedCategory !== "all" &&
            article.category.id !== selectedCategory
          ) {
            return false;
          }

          return matchesAllTerms;
        }) || [];

  const isLoading = isLoadingArticles;

  const recentSearches = [
    t("search.recent.climateChange"),
    t("search.recent.elections2024"),
    t("search.recent.aiTechnology"),
    t("search.recent.spaceExploration"),
    t("search.recent.globalEconomy"),
  ];

  const handleClose = () => {
    setSearchOverlayOpen(false);
    setInputValue("");
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setInputValue(query);
  };

  const handleArticleClick = () => {
    handleClose();
  };

  useEffect(() => {
    if (isSearchOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOverlayOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isSearchOverlayOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isSearchOverlayOpen]);

  if (!isSearchOverlayOpen) return null;

  return (
    <div className="fixed inset-0 search-overlay z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("search.title")}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder={t("search.placeholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {!debouncedSearchQuery.trim() ? (
            /* Recent Searches */
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t("search.recentSearches")}
              </h4>
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <Search className="inline h-3 w-3 mr-2" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            /* Loading State */
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse"
                >
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults?.length === 0 ? (
            /* No Results */
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {t("search.noResults")}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                {t("search.noResultsSuggestion")}
              </p>
            </div>
          ) : (
            /* Search Results */
            <div className="space-y-4">
              {searchResults?.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  onClick={handleArticleClick}
                  className="block"
                >
                  <div className="flex space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <img
                      src={getImageUrl(article.featuredImage)}
                      alt={article.title}
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {article.category.name}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatTimeToArabic(new Date(article.publishedAt))}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {article.author?.name}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>
                            {article.readingTime}{" "}
                            {t("article.readingTimePlural")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
