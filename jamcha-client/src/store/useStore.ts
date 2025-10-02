import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Language
  language: 'ar' | 'en' | 'fr';
  setLanguage: (lang: 'ar' | 'en' | 'fr') => void;

  // UI State
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  isSearchOverlayOpen: boolean;
  setSearchOverlayOpen: (open: boolean) => void;

  // Article state
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Session
  sessionId: string;
  setSessionId: (id: string) => void;
}

// Detect system theme preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme - initialize with system preference
      theme: getSystemTheme(),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setTheme: (theme) => set({ theme }),

      // Language
      language: 'ar', // Default to Arabic
      setLanguage: (lang: 'ar' | 'en' | 'fr') => set({ language: lang }),

      // UI State
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      isSearchOverlayOpen: false,
      setSearchOverlayOpen: (open) => set({ isSearchOverlayOpen: open }),

      // Article state
      selectedCategory: 'all',
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Session
      sessionId: '',
      setSessionId: (id) => set({ sessionId: id }),
    }),
    {
      name: 'news-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        sessionId: state.sessionId
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately after rehydration
        if (state && typeof window !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(state.theme);
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);