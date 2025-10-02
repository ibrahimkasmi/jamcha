import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  MousePointer,
  Calendar,
  Download,
} from "lucide-react";

import { useRequireAuth } from "@/hooks/authGuards";

export default function AdminAnalytics() {
  const { t } = useTranslation();
  useRequireAuth();
  const [dateRange, setDateRange] = useState("30d");

  const { isLoading } = useQuery({
    queryKey: ["/api/admin/stats", dateRange],
    queryFn: async () => {
      const response = await fetch(`/api/admin/stats?range=${dateRange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
  });

  const { data: topArticles = [] } = useQuery({
    queryKey: ["/api/articles"],
    queryFn: async () => {
      // Public endpoint - no auth required
      const response = await fetch("/api/articles");
      if (!response.ok) throw new Error("Failed to fetch top articles");
      return response.json();
    },
  });

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
  ];

  const mockTrafficData = [
    { date: "2025-01-01", visitors: 1200, pageViews: 3400, bounceRate: 0.45 },
    { date: "2025-01-02", visitors: 1800, pageViews: 4100, bounceRate: 0.42 },
    { date: "2025-01-03", visitors: 2200, pageViews: 5200, bounceRate: 0.38 },
    { date: "2025-01-04", visitors: 1900, pageViews: 4800, bounceRate: 0.41 },
    { date: "2025-01-05", visitors: 2500, pageViews: 6200, bounceRate: 0.35 },
    { date: "2025-01-06", visitors: 2800, pageViews: 7100, bounceRate: 0.33 },
    { date: "2025-01-07", visitors: 3100, pageViews: 8300, bounceRate: 0.3 },
  ];

  const mockReferralData = [
    { source: t("sourceGoogle"), visitors: 45, percentage: 45 },
    { source: t("sourceDirect"), visitors: 28, percentage: 28 },
    { source: t("sourceSocialMedia"), visitors: 15, percentage: 15 },
    { source: t("sourceEmail"), visitors: 8, percentage: 8 },
    { source: t("sourceOther"), visitors: 4, percentage: 4 },
  ];

  const mockDeviceData = [
    { device: t("deviceDesktop"), visitors: 52, color: "#3b82f6" },
    { device: t("deviceMobile"), visitors: 35, color: "#ef4444" },
    { device: t("deviceTablet"), visitors: 13, color: "#10b981" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">{t("loadingAnalytics")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("analytics")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("analyticsDescription")}
          </p>
        </div>
        <div className="flex items-center space-x-4 gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{t("last7days")}</SelectItem>
              <SelectItem value="30d">{t("last30days")}</SelectItem>
              <SelectItem value="90d">{t("last90days")}</SelectItem>
              <SelectItem value="1y">{t("lastYear")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t("export")}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{t("totalPageViews")}</span>
              <Eye className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t("pageViewsCount", { count: 47283 })}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12.5%</span>
              <span className="text-sm text-gray-500 ml-2">
                {t("comparedToLastPeriod")}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{t("uniqueVisitors")}</span>
              <Users className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t("visitorsCount", { count: 18542 })}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+8.2%</span>
              <span className="text-sm text-gray-500 ml-2">
                {t("comparedToLastPeriod")}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{t("bounceRate")}</span>
              <MousePointer className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.1%</div>
            <div className="flex items-center mt-1">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">-2.4%</span>
              <span className="text-sm text-gray-500 ml-2">
                {t("comparedToLastPeriod")}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{t("avgSessionDuration")}</span>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 32s</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+15.3%</span>
              <span className="text-sm text-gray-500 ml-2">
                {t("comparedToLastPeriod")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>{t("trafficOverview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockTrafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="visitors"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>{t("trafficSources")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReferralData.map((source, index) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span>{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {source.visitors}%
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle>{t("deviceTypes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockDeviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="visitors"
                >
                  {mockDeviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {mockDeviceData.map((entry, index) => (
                <div key={entry.device} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.device}</span>
                  <span className="text-sm text-gray-500">
                    ({entry.visitors}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Articles */}
      <Card>
        <CardHeader>
          <CardTitle>{t("topPerformingArticles")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("article")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("views")}</TableHead>
                <TableHead>{t("engagement")}</TableHead>
                <TableHead>{t("publishDate")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topArticles.map((article: any) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="font-medium">{article.title}</div>
                    <div className="text-sm text-gray-500">
                      {(() => {
                        if (article.author && typeof article.author === "object" && typeof article.author.name === "string") {
                          return article.author.name;
                        } else if (typeof article.author === "string") {
                          return article.author;
                        } else {
                          return t("unknownAuthor");
                        }
                      })()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {(() => {
                        if (article.category && typeof article.category === "object" && typeof article.category.name === "string") {
                          return article.category.name;
                        } else if (typeof article.category === "string") {
                          return article.category;
                        } else {
                          return t("uncategorized");
                        }
                      })()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {article.views || Math.floor(Math.random() * 5000) + 1000}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${Math.floor(Math.random() * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm">
                        {Math.floor(Math.random() * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
