
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

export const useUsers = () => {
  const { isAdmin } = useAuth();
  const { data, isLoading, refetch } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: () => api.get("/users"),
    enabled: isAdmin,
  });
  return { data: data || [], isLoading, refetch };
};
