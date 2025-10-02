import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

// Components
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { LoadingRedirect } from "@/components/LoadingRedirect";

// Pages
import AdminLogin from "@/pages/admin/login";
import Dashboard from "@/pages/admin/dashboard";
import Articles from "@/pages/admin/articles";
import Categories from "@/pages/admin/categories";
import Users from "@/pages/admin/users";
import Settings from "@/pages/admin/settings";
import Analytics from "@/pages/admin/analytics";
import Reports from "@/pages/admin/reports";
import Languages from "@/pages/admin/languages";
import Podcast from "@/pages/admin/podcast";
import TopFlop from "@/pages/admin/top-flop";
import Profile from "@/pages/admin/profile";
import NewArticle from "@/pages/admin/new-article";
import EditArticle from "@/pages/admin/edit-article";
import ForbiddenPage from "@/pages/errors/forbidden";

import { queryClient } from "@/lib/queryClient";

const checkAuth = (requiredRoles?: string[]) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw redirect({ to: "/login" });
  }

  if (requiredRoles) {
    const role = localStorage.getItem("jamcha_user_role");
    if (!role || !requiredRoles.includes(role)) {
      throw redirect({ to: "/forbidden" });
    }
  }
};

const checkAuthAndRedirect = () => {
  const token = localStorage.getItem("access_token");
  const user = localStorage.getItem("user_data");

  if (token && user) {
    throw redirect({ to: "/dashboard" });
  }
};

// Create root route
const rootRoute = createRootRoute({
  component: () => (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <div className="min-h-screen bg-background">
                <Outlet />
                <Toaster />
                <TanStackRouterDevtools />
              </div>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  ),
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    // Simple token check without expiration validation
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user_data");

    if (token && user) {
      throw redirect({ to: "/dashboard" });
    } else {
      throw redirect({ to: "/login" });
    }
  },
  component: LoadingRedirect,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: checkAuthAndRedirect,
  component: AdminLogin,
});



// Protected routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => checkAuth(["ADMIN", "AUTHOR"]),
  component: () => (
    <ProtectedLayout>
      <Dashboard />
    </ProtectedLayout>
  ),
});

const articlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/articles",
  beforeLoad: () => checkAuth(["ADMIN", "AUTHOR"]),
  component: () => (
    <ProtectedLayout>
      <Articles />
    </ProtectedLayout>
  ),
});

const newArticleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/articles/new",
  beforeLoad: () => checkAuth(["ADMIN", "AUTHOR"]),
  component: () => (
    <ProtectedLayout>
      <NewArticle />
    </ProtectedLayout>
  ),
});

const editArticleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/articles/edit/$articleId",
  beforeLoad: () => checkAuth(["ADMIN", "AUTHOR"]),
  component: () => (
    <ProtectedLayout>
      <EditArticle />
    </ProtectedLayout>
  ),
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categories",
  beforeLoad: () => checkAuth(["ADMIN", "AUTHOR"]),
  component: () => (
    <ProtectedLayout>
      <Categories />
    </ProtectedLayout>
  ),
});

const forbiddenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forbidden",
  component: ForbiddenPage,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  beforeLoad: () => checkAuth(["ADMIN"]),
  component: () => (
    <ProtectedLayout>
      <Users />
    </ProtectedLayout>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  beforeLoad: () => checkAuth(["ADMIN"]),
  component: () => (
    <ProtectedLayout>
      <Settings />
    </ProtectedLayout>
  ),
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  beforeLoad: () => checkAuth(["ADMIN", "AUTHOR"]),
  component: () => (
    <ProtectedLayout>
      <Analytics />
    </ProtectedLayout>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  beforeLoad: () => checkAuth(["ADMIN", "AUTHOR"]),
  component: () => (
    <ProtectedLayout>
      <Reports />
    </ProtectedLayout>
  ),
});

const languagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/languages",
  beforeLoad: () => checkAuth(["ADMIN"]),
  component: () => (
    <ProtectedLayout>
      <Languages />
    </ProtectedLayout>
  ),
});

const podcastRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/podcast",
  beforeLoad: () => checkAuth(["ADMIN", "AUTHOR"]),
  component: () => (
    <ProtectedLayout>
      <Podcast />
    </ProtectedLayout>
  ),
});

const topFlopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/top-flop",
  beforeLoad: () => checkAuth(["ADMIN", "AUTHOR"]),
  component: () => (
    <ProtectedLayout>
      <TopFlop />
    </ProtectedLayout>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  beforeLoad: () => checkAuth(["ADMIN", "AUTHOR"]),
  component: () => (
    <ProtectedLayout>
      <Profile />
    </ProtectedLayout>
  ),
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  articlesRoute,
  newArticleRoute,
  editArticleRoute,
  categoriesRoute,
  usersRoute,
  settingsRoute,
  analyticsRoute,
  reportsRoute,
  languagesRoute,
  podcastRoute,
  topFlopRoute,
  profileRoute,
  forbiddenRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}