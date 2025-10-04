// Authentication configuration and types for Jamcha Admin

export const authConfig = {
  // Backend API base URL (the ONLY endpoint frontend communicates with)
  apiBaseUrl: "/api",

  // Admin roles that can access the admin panel
  adminRoles: ["ADMIN", "AUTHOR"],

  // Token storage keys
  tokenKey: "access_token",
  refreshTokenKey: "refresh_token",
  userKey: "user_data",
  roleKey: "user_role",
};

// User interface based on Keycloak JWT claims
export interface KeycloakUser {
  sub: string; // User ID
  email: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
  realm_access: {
    roles: string[];
  };
}

// Application user interface
export interface JamchaUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string; 
  isAdmin: boolean;
  isAuthor: boolean;
  authorName?: string; // Add this line

}

// Authentication response interface (from backend)
export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken?: string;
  user: JamchaUser;
}
