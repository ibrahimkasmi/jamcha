import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/lib/auth";
import { JamchaUser } from "@/lib/auth-config";
import { queryClient } from "@/lib/queryClient";

interface AuthContextType {
  user: JamchaUser | null;
  loading: boolean;
  login: (usernameOrEmail: string, password:string) => Promise<JamchaUser>;
  logout: () => Promise<void>;
  testKeycloakConnection: () => Promise<boolean>;
  updateUserData: (updatedUser: Partial<JamchaUser>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JamchaUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token && !authService.isTokenExpired(token)) {
          if (authService.isAuthenticated()) {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
          }
        } else {
          setUser(null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
        }
      } catch (error) {
        console.warn("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (
    usernameOrEmail: string,
    password: string,
  ): Promise<JamchaUser> => {
    setLoading(true);
    try {
      const loggedInUser = await authService.login(usernameOrEmail, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout error:", error);
    } finally {
      setUser(null);
      queryClient.clear(); // Clear React Query cache
      setLoading(false);
    }
  };

  const testKeycloakConnection = async (): Promise<boolean> => {
    return await authService.testKeycloakConnection();
  };

  const updateUserData = (updatedUser: Partial<JamchaUser>): void => {
    if (!user) return;

    const newUser = { ...user, ...updatedUser };
    setUser(newUser);

    localStorage.setItem("user_data", JSON.stringify(newUser));
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    testKeycloakConnection,
    updateUserData,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isAuthor: user?.isAuthor || false,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
