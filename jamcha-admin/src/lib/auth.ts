import axios from "axios";
import { authConfig, JamchaUser } from "./auth-config";

// Axios instance for backend API calls
const backendApi = axios.create({
  baseURL: authConfig.apiBaseUrl,
  timeout: 10000,
});

// Add token to requests automatically with graceful refresh
backendApi.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(authConfig.tokenKey);
  if (token) {


    // Check if token is actually expired (not just close to expiration)
    try {
      const payload = authService.parseJWT(token);
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp && payload.exp < now;

      if (isExpired) {
        try {
          const newToken = await authService.refreshToken();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
          } else {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error: any) {
          console.error("Token refresh failed:", error.message);
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses with smart retry logic
backendApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401s that haven't been retried and aren't auth endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/") &&
      !originalRequest.url?.includes("/token")
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await authService.refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return backendApi(originalRequest);
        }
      } catch (refreshError: any) {
        // Check if refresh token is invalid/expired
        if (
          refreshError.message.includes("No refresh token") ||
          refreshError.response?.status === 400 ||
          refreshError.response?.status === 401
        ) {
          // Clear all tokens before redirecting
          localStorage.removeItem(authConfig.tokenKey);
          localStorage.removeItem(authConfig.refreshTokenKey);
          localStorage.removeItem(authConfig.userKey);

          // Redirect to login
          window.location.href = "/login";
          return Promise.reject(new Error("Session expired"));
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

class AuthService {
  /**
   * Test backend connectivity
   */
  async testKeycloakConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${authConfig.apiBaseUrl}/auth/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.error("Backend connection test failed:", error);
      return false;
    }
  }

  /**
   * Login with username/email and password via backend API
   */
  async login(usernameOrEmail: string, password: string): Promise<JamchaUser> {
    try {
      const response = await axios.post(`${authConfig.apiBaseUrl}/auth/login`, {
        usernameOrEmail,
        password,
      });

      const data = response.data;

      if (!data.success || !data.accessToken) {
        throw new Error(data.message || "Login failed");
      }

      // Parse JWT token to get user info
      const tokenPayload = this.parseJWT(data.accessToken);
      // Use role as a string from backend response
      const userRole = data.role || tokenPayload.role || "AUTHOR";


      // Check if user has admin privileges
      const hasAdminAccess = authConfig.adminRoles.includes(userRole);

      if (!hasAdminAccess) {
        throw new Error(
          "Insufficient privileges. Admin or Author role required.",
        );
      }

      // Use backend response data and role as string
      const jamchaUser: JamchaUser = {
        id: data.userId?.toString() || tokenPayload.sub,
        username: data.username || tokenPayload.preferred_username,
        email: data.email || tokenPayload.email,
        firstName: data.firstname || tokenPayload.given_name,
        lastName: data.lastname || tokenPayload.family_name,
        role: userRole,
        isAdmin: userRole === "ADMIN",
        isAuthor: userRole === "AUTHOR",
      };

      // Store tokens and user data
      localStorage.setItem(authConfig.tokenKey, data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem(authConfig.refreshTokenKey, data.refreshToken);
      }
      localStorage.setItem(authConfig.userKey, JSON.stringify(jamchaUser));
      localStorage.setItem("jamcha_user_role", jamchaUser.role);

      return jamchaUser;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Invalid username or password");
      } else if (error.response?.status === 403) {
        throw new Error("Account is disabled or insufficient privileges");
      } else {
        throw new Error(
          error.response?.data?.message || "Login failed. Please try again.",
        );
      }
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem(authConfig.tokenKey);

      if (token) {
        // Call backend logout endpoint
        try {
          await axios.post(
            `${authConfig.apiBaseUrl}/auth/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } catch (error) {
          console.warn("Backend logout failed:", error);
        }
      }
    } finally {
      // Always clear local storage
      localStorage.removeItem(authConfig.tokenKey);
      localStorage.removeItem(authConfig.refreshTokenKey);
      localStorage.removeItem(authConfig.userKey);
    }
  }

  /**
   * Get current user from storage
   */
  getCurrentUser(): JamchaUser | null {
    try {
      const userData = localStorage.getItem(authConfig.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  /**
   * Check if user is authenticated with graceful validation
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(authConfig.tokenKey);
    const user = this.getCurrentUser();

    if (!token || !user) return false;

    // Check if token is expired with grace period
    try {
      const payload = this.parseJWT(token);
      if (!payload.exp) return false;

      const now = Math.floor(Date.now() / 1000);
      const gracePeriod = 10; // 10 seconds grace period
      return payload.exp > now - gracePeriod;
    } catch {
      // If we can't parse the token, but we have user data,
      // let the API calls determine validity
      return true;
    }
  }

  /**
   * Check if user has admin role
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin || false;
  }

  /**
   * Check if user has author role or higher
   */
  isAuthor(): boolean {
    const user = this.getCurrentUser();
    return user?.isAuthor || false;
  }

  /**
   * Get access token
   */
  getToken(): string | null {
    return localStorage.getItem(authConfig.tokenKey);
  }

  /**
   * Refresh access token - TODO: Implement backend refresh endpoint
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem(authConfig.refreshTokenKey);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // TODO: Implement actual backend refresh token endpoint call
    console.warn(
      "Token refresh not fully implemented - using placeholder logic",
    );

    // Simulate a failed refresh for now to force re-login
    throw new Error("Refresh token endpoint not implemented");
  }

  /**
   * Check if token is expired with conservative buffer
   */
  isTokenExpired(token: string, bufferTimeSeconds = 30): boolean {
    try {
      const payload = this.parseJWT(token);
      if (!payload.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime + bufferTimeSeconds;
    } catch (error: any) {
      console.warn("Error checking token expiration:", error.message);
      // If we can't parse, assume it's still valid and let API calls handle it
      return false;
    }
  }

  /**
   * Parse JWT token (simplified version)
   */
  parseJWT(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return {};
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export the backend API instance for use in other parts of the app
export { backendApi };
