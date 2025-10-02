import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { language } = useStore();

  useEffect(() => {
    const root = window.document.documentElement;
    const body = document.body;
    
    // Set language and direction
    root.setAttribute('lang', language);
    
    if (language === 'ar') {
      root.setAttribute('dir', 'rtl');
      body.classList.add('rtl');
    } else {
      root.setAttribute('dir', 'ltr');
      body.classList.remove('rtl');
    }
  }, [language]);

  return <>{children}</>;
}
