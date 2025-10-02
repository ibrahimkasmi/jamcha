import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FileText,
  Users,
  Eye,
  Calendar,
  Bookmark,
  Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const {
    articles: { data: articlesData, isLoading: isLoadingArticles },
    categories: { data: categories, isLoading: isLoadingCategories },
    users: { data: users, isLoading: isLoadingUsers },
  } = useData();
  const { isAdmin } = useAuth();

  const isLoading = isLoadingArticles || isLoadingCategories || isLoadingUsers;

  // Ensure articles is always an array, regardless of backend response shape
  const articles = Array.isArray(articlesData)
    ? articlesData
    : articlesData?.articles || [];

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  const totalArticles = articles.length;
  const totalCategories = categories.length;
  const totalViews = articles.reduce((acc, article) => acc + (article.views || 0), 0);
  const totalBookmarks = articles.reduce((acc, article) => acc + (article.bookmarks || 0), 0);
  const totalNewsletterSubscribers = users.length;

  const articlesPerCategory = categories.map((category) => ({
    name: category.name,
    value: articles.filter((article) => article.category.id === category.id).length,
  }));

  const viewsOverTime = [
    { name: t("dayMon"), views: 2400 },
    { name: t("dayTue"), views: 1398 },
    { name: t("dayWed"), views: 9800 },
    { name: t("dayThu"), views: 3908 },
    { name: t("dayFri"), views: 4800 },
    { name: t("daySat"), views: 3800 },
    { name: t("daySun"), views: 4300 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("welcomeBack")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("welcomeBackDescription")}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {t("dateFormat", { date: new Date() })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalArticles")}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalArticles}
            </div>
            <p className="text-xs text-muted-foreground">
              +2 {t("fromLastWeek")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("categories")}</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCategories}
            </div>
            <p className="text-xs text-muted-foreground">{t("activeCategories")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalViews")}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% {t("fromLastMonth")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("bookmarks")}</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBookmarks}
            </div>
            <p className="text-xs text-muted-foreground">
              +5% {t("fromLastWeek")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("subscribers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalNewsletterSubscribers}
            </div>
            <p className="text-xs text-muted-foreground">+8% {t("fromLastMonth")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("viewsOverTime")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("articlesByCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={articlesPerCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {articlesPerCategory.map(
                    (entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ),
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/articles">
                <Button className="h-20 w-full flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>{t("createArticle")}</span>
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  variant="outline"
                  className="h-20 w-full flex flex-col items-center justify-center space-y-2"
                >
                  <Globe className="h-6 w-6" />
                  <span>{t("manageCategories")}</span>
                </Button>
              </Link>
              <Link to="/users">
                <Button
                  variant="outline"
                  className="h-20 w-full flex flex-col items-center justify-center space-y-2"
                >
                  <Users className="h-6 w-6" />
                  <span>{t("viewSubscribers")}</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
