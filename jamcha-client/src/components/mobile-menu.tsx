import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/store/useStore";

import {
  X,
  Home,
  Globe,
  Sun,
  Moon,
  Search,
  User,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { t } from "@/lib/i18n";

export function MobileMenu() {
  const {
    isMobileMenuOpen,
    setMobileMenuOpen,
    theme,
    toggleTheme,
    setSearchOverlayOpen,
  } = useStore();

  const { toast } = useToast();
  const [location] = useLocation();

  const navigation = [
    { name: t("category.main"), href: "/main", icon: Home },
    { name: t("category.politics"), href: "/politics", icon: Globe },
    { name: t("category.society"), href: "/society", icon: User },
    { name: t("category.culture"), href: "/culture", icon: Globe },
    { name: t("category.sports"), href: "/sports", icon: Globe },
    { name: t("category.economy"), href: "/economy", icon: Settings },
    { name: t("category.international"), href: "/international", icon: Globe },
    { name: t("category.editorial"), href: "/editorial", icon: Globe },
    { name: t("category.opinions"), href: "/opinions", icon: Globe },
    { name: t("category.top-flop"), href: "/top-flop", icon: Globe },
    { name: t("category.nostalgia"), href: "/nostalgia", icon: Globe },
    { name: t("category.podcast"), href: "/podcast", icon: Globe },
  ];

  const handleClose = () => {
    setMobileMenuOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    toast({
      title:
        t("message.themeChanged") +
        (theme === "light"
          ? t("mobileMenu.theme.dark")
          : t("mobileMenu.theme.light")),
      duration: 2000,
    });
  };

  const handleSearchOpen = () => {
    setSearchOverlayOpen(true);
    handleClose();
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Close mobile menu when location changes
    setMobileMenuOpen(false);
  }, [location, setMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isMobileMenuOpen]);

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={handleClose}
      />

      {/* Mobile Menu */}
      <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-black shadow-xl z-50 lg:hidden mobile-menu open rtl-content">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-primary arabic-nav">
                {t("header.brandName")}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      location === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium arabic-nav">
                        {item.name}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={handleSearchOpen}
                className="w-full justify-start p-3 h-auto"
              >
                <Search className="h-5 w-5 mr-3" />
                <span className="arabic-nav">{t("common.search")}</span>
              </Button>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {/* Theme Toggle */}
            <div className="space-y-2 mb-4">
              <Button
                variant="ghost"
                onClick={handleThemeToggle}
                className="w-full justify-start p-3 h-auto"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 mr-3" />
                ) : (
                  <Sun className="h-5 w-5 mr-3" />
                )}
                <span className="arabic-nav">
                  {theme === "light"
                    ? t("mobileMenu.theme.dark")
                    : t("mobileMenu.theme.light")}
                </span>
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center arabic-nav">
              {t("mobileMenu.copyright")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
