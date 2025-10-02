import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/auth";

/**
 * Hook for protected routes.
 * Redirects to login if not authenticated.
 */
export function useRequireAuth() {
  const auth = useAuth();
  const redirected = useRef(false);

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated && !redirected.current) {
      redirected.current = true;
      if (!authService.isAuthenticated()) {
        window.location.href = "/login";
      }
    }
  }, [auth.loading, auth.isAuthenticated]);

  return auth;
}

/**
 * Hook for admin-only routes.
 * Redirects to login if not authenticated, throws error if not admin.
 */
export function useRequireAdmin() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading) {
      const timeoutId = setTimeout(() => {
        const serviceIsAuthenticated = authService.isAuthenticated();

        if (!serviceIsAuthenticated) {
          window.location.href = "/login";
        } else if (!auth.isAdmin) {
          throw new Error("Admin access required");
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [auth.loading, auth.isAuthenticated, auth.isAdmin]);

  return auth;
}

/**
 * Hook for author-only routes.
 * Redirects to login if not authenticated, throws error if not author.
 */
export function useRequireAuthor() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading) {
      const timeoutId = setTimeout(() => {
        if (!authService.isAuthenticated()) {
          window.location.href = "/login";
        } else if (!auth.isAuthor) {
          throw new Error("Author or Admin access required");
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [auth.loading, auth.isAuthenticated, auth.isAuthor]);

  return auth;
}

/**
 * Hook for routes that should ONLY be accessible by admins (not authors).
 * Redirects to dashboard if user is author, throws error if not authenticated.
 */
export function useRequireAdminOnly() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading) {
      const timeoutId = setTimeout(() => {
        if (!authService.isAuthenticated()) {
          window.location.href = "/login";
        } else if (!auth.isAdmin) {
          // Redirect authors to forbidden page
          window.location.href = "/forbidden";
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [auth.loading, auth.isAuthenticated, auth.isAdmin]);

  return auth;
}
