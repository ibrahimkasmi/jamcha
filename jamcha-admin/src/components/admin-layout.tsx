import { useState } from "react";
import i18n from '@/lib/i18n';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dir = typeof i18n.dir === "function" ? i18n.dir() : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-gray-50 dark:bg-gray-900 admin-layout">
      <div
        className={`hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 ${dir === 'rtl'
          ? 'lg:right-0 lg:border-l dark:lg:border-l lg:border-gray-200 dark:lg:border-gray-700'
          : 'lg:left-0 lg:border-r dark:lg:border-r lg:border-gray-200 dark:lg:border-gray-700'
          } lg:bg-white dark:lg:bg-gray-800 lg:z-50 sidebar`}
      >
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-64 p-0">
          <Sidebar mobile setSidebarOpen={setSidebarOpen} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={`${dir === 'rtl' ? 'lg:mr-64' : 'lg:ml-64'} flex flex-col flex-1 main-content`}>
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
