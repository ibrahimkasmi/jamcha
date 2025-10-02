
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User, Bell, Search, Plus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

import i18n from '@/lib/i18n';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t("loggedOutSuccessfully"),
        description: t("loggedOutDescription"),
      });
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: t("logoutErrorTitle"),
        description: t("logoutErrorDescription"),
        variant: "destructive",
      });
      // Still navigate to login even if logout fails
      navigate({ to: "/login" });
    }
  };
  const dir = i18n.dir();

  const handleNavigation = (path: string) => {
    navigate({ to: path });
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder={t("search")}
              className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
        </div>

        {/* Right side */}
        <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : 'space-x-4'} gap-2`}>
          <Link to="/articles/new">
            <Button size="sm" className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : 'space-x-2'}`}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t("newArticle")}</span>
            </Button>
          </Link>

          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : 'space-x-2'}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" dir={dir}>
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">
                  {user?.username || t("admin")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || t("adminEmail")}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleNavigation("/profile")}
              >
                <User className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {t("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigation("/settings")}
              >
                <Settings className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {t("settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
