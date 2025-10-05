import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'wouter';

import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { t } from '@/lib/i18n';
import {
  Search,
  Menu,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';


interface NavigationItem {
  name: string;
  href: string;
}

// ...existing code...

// ...existing code...

interface NavigationProps {
  items: readonly NavigationItem[];
  currentLocation: string;
  className?: string;
}

const Navigation = ({ items, currentLocation, className }: NavigationProps) => {
  const isActiveLink = (href: string) => currentLocation === href;

  return (
    <nav className={className}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            text-gray-700 dark:text-gray-300 
            hover:text-primary dark:hover:text-primary 
            px-2 py-2 text-sm font-medium 
            transition-colors whitespace-nowrap 
            border-b-2 border-transparent 
            hover:border-primary arabic-nav
            ${isActiveLink(item.href)
              ? 'text-primary dark:text-primary border-primary'
              : ''
            }
          `}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
}

const ActionButton = ({ onClick, icon: Icon, label, className }: ActionButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={`p-1.5 sm:p-2 ${className || ''}`}
    aria-label={label}
  >
    <Icon className="h-4 w-4" />
  </Button>
);

// const LanguageSelector = () => {
//   const { language, setLanguage } = useStore();
//   const { data: languageSettings } = useLanguageSettings();

//   const enabledLanguages = useMemo(() => 
//     languageSettings?.filter(lang => lang.isEnabled) || [], 
//     [languageSettings]
//   );

//   if (enabledLanguages.length <= 1) return null;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <ActionButton
//           onClick={() => {}}
//           icon={Globe}
//           label="Select language"
//         />
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         {enabledLanguages.map((lang) => (
//           <DropdownMenuItem
//             key={lang.code}
//             onClick={() => setLanguage(lang?.code)}
//             className={`cursor-pointer ${
//               language === lang.code ? 'bg-accent' : ''
//             }`}
//           >
//             <span className="mr-2">{lang.flagEmoji}</span>
//             <span>{lang.name}</span>
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };


import jamchaLogo from '@/assets/jamcha.png';
import whiteVersionLogo from '@/assets/white_version.png';

export function Header() {
  // Logo component inside Header to access t
  const Logo = () => {
    const { theme } = useStore();
    const logoSrc = theme === 'light' ? jamchaLogo : whiteVersionLogo;

    return (
      <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
        <img src={logoSrc} alt="" className="h-8 w-auto" />
        <span className="text-lg sm:text-xl font-bold text-primary dark:text-white arabic-nav">
          {t('header.brandName')}
        </span>
      </Link>
    );
  };

  // HeaderActions component inside Header to access t
  const HeaderActions = () => {
    const { theme, toggleTheme, setMobileMenuOpen, setSearchOverlayOpen } = useStore();
    const { toast } = useToast();

    const handleThemeToggle = () => {
      toggleTheme();
      const newThemeLabel = theme === 'light' ? t('header.theme.dark') : t('header.theme.light');
      toast({
        title: `${t('message.themeChanged')} ${newThemeLabel}`,
        duration: 2000,
      });
    };

    return (
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        <ActionButton
          onClick={() => setSearchOverlayOpen(true)}
          icon={Search}
          label={t('header.search')}
        />
        {/* <LanguageSelector /> */}
        <ActionButton
          onClick={handleThemeToggle}
          icon={theme === 'light' ? Moon : Sun}
          label={t('header.toggleTheme')}
        />
        <ActionButton
          onClick={() => setMobileMenuOpen(true)}
          icon={Menu}
          label={t('header.openMenu')}
          className="xl:hidden"
        />
      </div>
    );
  };
  const { setMobileMenuOpen } = useStore();
  const [location] = useLocation();


  // Define NAVIGATION_ITEMS inside the component so t is available
  const NAVIGATION_ITEMS: NavigationItem[] = [
    { name: t('category.main'), href: '/main' },
    { name: t('category.politics'), href: '/politics' },
    { name: t('category.society'), href: '/society' },
    { name: t('category.culture'), href: '/culture' },
    { name: t('category.sports'), href: '/sports' },
    { name: t('category.economy'), href: '/economy' },
    { name: t('category.international'), href: '/international' },
    { name: t('category.editorial'), href: '/editorial' },
    { name: t('category.nostalgia'), href: '/nostalgia' },
    { name: t('category.opinions'), href: '/opinions' },
    { name: t('category.top-flop'), href: '/top-flop' },
    { name: t('category.podcast'), href: '/podcast' },
  ];

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location, setMobileMenuOpen]);

  const tabletNavItems = useMemo(() =>
    NAVIGATION_ITEMS.slice(0, 6),
    [NAVIGATION_ITEMS]
  );

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-500">
        <div className="flex items-center justify-between h-16 min-w-0 transition-colors duration-500">
          <Logo />

          {/* Desktop Navigation */}
          <Navigation
            items={NAVIGATION_ITEMS}
            currentLocation={location}
            className="hidden xl:flex space-x-reverse space-x-2 flex-wrap justify-center transition-colors duration-500"
          />

          {/* Tablet Navigation */}
          <div className="hidden md:flex xl:hidden space-x-reverse space-x-1 transition-colors duration-500">
            <Navigation
              items={tabletNavItems}
              currentLocation={location}
              className="flex space-x-reverse space-x-1 transition-colors duration-500"
            />
            <ActionButton
              onClick={() => setMobileMenuOpen(true)}
              icon={ChevronDown}
              label={t('header.more')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-500"
            />
          </div>

          <HeaderActions />
        </div>
      </div>
    </header>
  );
}