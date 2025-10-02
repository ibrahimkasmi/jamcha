import { AdminLayout } from "@/components/admin-layout";

export const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);