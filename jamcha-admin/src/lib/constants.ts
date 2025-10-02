import i18n from "./i18n";
import {
    AlertTriangle,
    BarChart3,
    FileText,
    Globe,
    Home,
    Library,
    Settings,
    Users
} from "lucide-react";

export const API_BASE_URL = "/api";

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  USER_ROLE: "user_role",
};

export const NAVIGATION = [
  { name: i18n.t("dashboard"), href: "/dashboard", icon: Home },
  { name: i18n.t("articles"), href: "/articles", icon: FileText },
  { name: i18n.t("categories"), href: "/categories", icon: Library },
  { name: i18n.t("topFlop"), href: "/top-flop", icon: Users },
  { name: i18n.t("podcast"), href: "/podcast", icon: Globe },
  { name: i18n.t("users"), href: "/users", icon: Users },
  { name: i18n.t("reports"), href: "/reports", icon: AlertTriangle },
  { name: i18n.t("languages"), href: "/languages", icon: Globe },
  { name: i18n.t("analytics"), href: "/analytics", icon: BarChart3 },
  { name: i18n.t("settings"), href: "/settings", icon: Settings },
];

export const RESTRICTED_FOR_AUTHORS = [
  "/users",
  "/categories",
  "/languages",
  "/settings",
];