
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NAVIGATION, RESTRICTED_FOR_AUTHORS } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import jamchaLogo from "@/assets/jamcha.png";
import { Globe } from "lucide-react";
import i18n from "@/lib/i18n";

interface SidebarProps {
  mobile?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export function Sidebar({ mobile = false, setSidebarOpen }: SidebarProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const dir = typeof i18n.dir === "function" ? i18n.dir() : "ltr";
  return (
    <div dir={dir} className={`flex flex-col h-full ${mobile ? "p-4" : ""}`}>
      {/* Logo */}
      <div className={`flex items-center p-6 ${dir === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2'} gap-2`}>
        <img src={jamchaLogo} alt="Jamcha Logo" className="h-8 w-auto" />
        <span className="text-xl font-bold">{t("adminPanel")}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {NAVIGATION.filter(
          (item) =>
            user?.isAdmin || !RESTRICTED_FOR_AUTHORS.includes(item.href)
        ).map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href}>
              <div
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer gap-2 ${dir === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3'
                  } ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                onClick={() => {
                  if (mobile && setSidebarOpen) setSidebarOpen(false);
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 ">
        <div className={`flex items-center p-2 ${dir === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3'} gap-3`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.username || t("admin")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.role === "ADMIN"
                ? t("systemAdmin")
                : user?.role === "AUTHOR"
                  ? t("author")
                  : t("contentManager")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
