import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminAppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Language
  language: 'ar' | 'en' | 'fr';
  setLanguage: (lang: 'ar' | 'en' | 'fr') => void;

  // UI State
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Admin-specific state
  selectedPage: string;
  setSelectedPage: (page: string) => void;

  // Session
  sessionId: string;
  setSessionId: (id: string) => void;
}

export const useStore = create<AdminAppState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Language
      language: 'ar', // Default to Arabic
      setLanguage: (lang: 'ar' | 'en' | 'fr') => set({ language: lang }),

      // UI State
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      isSidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

      // Admin-specific state
      selectedPage: 'dashboard',
      setSelectedPage: (page) => set({ selectedPage: page }),

      // Session
      sessionId: '',
      setSessionId: (id) => set({ sessionId: id }),
    }),
    {
      name: 'jamcha-admin-storage', // unique name for admin storage
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        isSidebarCollapsed: state.isSidebarCollapsed,
        selectedPage: state.selectedPage,
        sessionId: state.sessionId
      }),
    }
  )
);
