import { t } from './i18n';

export const CATEGORIES = [
  { id: 'all', name: t('category.all'), icon: 'fas fa-fire', color: '#2563EB' },
  { id: 'main', name: t('category.main'), icon: 'fas fa-home', color: '#DC2626' },
  { id: 'politics', name: t('category.politics'), icon: 'fas fa-vote-yea', color: '#DC2626' },
  { id: 'society', name: t('category.society'), icon: 'fas fa-users', color: '#10B981' },
  { id: 'culture', name: t('category.culture'), icon: 'fas fa-palette', color: '#8B5CF6' },
  { id: 'sports', name: t('category.sports'), icon: 'fas fa-futbol', color: '#F59E0B' },
  { id: 'economy', name: t('category.economy'), icon: 'fas fa-chart-line', color: '#059669' },
  { id: 'international', name: t('category.international'), icon: 'fas fa-globe', color: '#2563EB' },
  { id: 'editorial', name: t('category.editorial'), icon: 'fas fa-edit', color: '#6B7280' },
  { id: 'opinions', name: t('category.opinions'), icon: 'fas fa-comment', color: '#7C3AED' },
  { id: 'top-flop', name: t('category.top-flop'), icon: 'fas fa-thumbs-up', color: '#EC4899' },
  { id: 'nostalgia', name: t('category.nostalgia'), icon: 'fas fa-history', color: '#D97706' },
  { id: 'podcast', name: t('category.podcast'), icon: 'fas fa-podcast', color: '#10B981' },
  // Legacy categories for backward compatibility
  { id: 'technology', name: t('category.technology'), icon: 'fas fa-microchip', color: '#2563EB' },
  { id: 'business', name: t('category.business'), icon: 'fas fa-chart-line', color: '#8B5CF6' },
  { id: 'science', name: t('category.science'), icon: 'fas fa-flask', color: '#06B6D4' },
];

export const LANGUAGES = [
  { code: 'en', name: t('language.en'), flag: '🇺🇸' },
  { code: 'es', name: t('language.es'), flag: '🇪🇸' },
  { code: 'fr', name: t('language.fr'), flag: '🇫🇷' },
  { code: 'ar', name: t('language.ar'), flag: '🇸🇦' },
];

export const TRENDING_TOPICS = [
  { title: t('trending.climateAction'), href: '/category/international' },
  { title: t('trending.aiRevolution'), href: '/category/culture' },
  { title: t('trending.spaceExploration'), href: '/category/culture' },
  { title: t('trending.globalEconomy'), href: '/category/economy' },
  { title: t('trending.healthcareInnovation'), href: '/category/society' },
];

export const POPULAR_AUTHORS = [
  { name: t('author.sarahAhmed'), articles: 124 },
  { name: t('author.drMohamedKhaled'), articles: 89 },
  { name: t('author.fatimaAlAli'), articles: 76 },
  { name: t('author.ahmedAlShami'), articles: 65 },
  { name: t('author.nouraAlMasri'), articles: 58 },
];
