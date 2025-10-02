import { authService } from "./auth";
import { t } from "i18next";


export interface ProfileUpdateRequest {
  authorName: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserUpdateRequest {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  provider?: string;
  providerId?: string;
}

export interface UserUpdateResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    isAdmin: boolean;
    isAuthor: boolean;
  };
}

// Direct user response from the backend
export interface UserDirectResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  provider?: string;
  providerId?: string;
}

class UserApiService {
  private baseUrl = "/api";

  /**
   * Update current user's profile (self-update)
   */
  async updateProfile(
    updateData: ProfileUpdateRequest,
  ): Promise<UserUpdateResponse> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error(t("noAuthTokenFound"));
      }

      const currentUser = authService.getCurrentUser();

      // Log the user's roles for debugging purposes
      console.log("User roles being sent to backend:", currentUser?.role);

      if (!currentUser || !currentUser.username) {
        throw new Error(t("noCurrentUser"));
      }

      const username = currentUser.username;

      const response = await fetch(`${this.baseUrl}/users/${username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        // Get the response text for debugging
        const responseText = await response.text();
        console.error("Profile update error response:", responseText);

        try {
          // Try to parse as JSON if possible
          const errorData = responseText ? JSON.parse(responseText) : {};
          console.error("Parsed error data:", errorData);

          if (response.status === 401) {
            throw new Error(t("unauthorized"));
          } else if (response.status === 403) {
            throw new Error(t("permissionDenied"));
          } else if (response.status === 400) {
            throw new Error(errorData.message || t("invalidData"));
          } else if (response.status === 409) {
            throw new Error(t("usernameOrEmailExists"));
          } else {
            throw new Error(
              `${t("updateFailed")}: ${errorData.message || responseText || "Unknown error"}`,
            );
          }
        } catch (parseError) {
          // If JSON parsing fails, use the raw response text
          console.error("Error parsing response:", parseError);
          throw new Error(
            `${t("updateFailed")} (${response.status}): ${responseText || "No error details available"}`,
          );
        }
      }

      try {
        const data = await response.json();

        // Check if the response is already in the expected format
        if (data && typeof data === "object" && "success" in data) {
          return data;
        }

        // If not, we're getting a direct user object from the backend
        // Transform it to match the expected UserUpdateResponse format
        return {
          success: true,
          message: "Profile updated successfully",
          user: {
            id: String(data.id),
            username: data.username,
            email: data.email,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            role: data.role ? data.role : "",
            isAdmin: data.role?.toLowerCase() === "admin",
            isAuthor: data.role?.toLowerCase() === "author",
          },
        };
      } catch (parseError) {
        console.error("Error parsing success response:", parseError);
        throw new Error("Received invalid response format from server");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserUpdateResponse> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        } else {
          throw new Error("Failed to fetch profile.");
        }
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.username) {
        throw new Error("No current user or username found");
      }

      const response = await fetch(
        `${this.baseUrl}/users/${currentUser.username}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to change password. Please try again.");
      }

      // Handle 204 No Content
      return { success: true, message: "Password changed successfully." };

    } catch (error: any) {
      console.error("Password change error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const userApiService = new UserApiService();
