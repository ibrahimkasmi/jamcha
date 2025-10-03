// src/pages/TopFlopPage.tsx
import { useCurrentWeekTopFlop } from '@/hooks/useTopFlop';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Calendar, User, Grid, List } from 'lucide-react';
import type { TopFlopEntry } from '@/types/topflop';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Sidebar } from '@/components/sidebar';
import { useState } from 'react';
import { t } from '@/lib/i18n';
import { CategoryTabs } from '@/components/category-tabs';

// Utility functions
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ar-SA');
};

// Handle MinIO image URLs
const getImageUrl = (profileImage: string | null | undefined): string | null => {
  if (!profileImage) return null;
  if (profileImage.startsWith('http')) return profileImage;
  return `/api/files/download/${profileImage}`;
};

// Components
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 ml-4 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 dark:text-gray-500 mb-4">
      <TrendingUp className="h-16 w-16 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">{t('topFlop.noEntries')}</h3>
      <p>{t('topFlop.comingSoon')}</p>
    </div>
  </div>
);

interface EntryCardProps {
  entry: TopFlopEntry;
  viewMode: 'grid' | 'list';
}

const EntryCard = ({ entry, viewMode }: EntryCardProps) => {
  const isTop = entry.entryType === 'TOP';
  const imageUrl = getImageUrl(entry.profileImage);

  if (viewMode === 'grid') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        {imageUrl && (
          <div className="p-4 text-center">
            <img
              src={imageUrl}
              alt={entry.personName}
              className={`w-24 h-24 rounded-full object-cover mx-auto ${isTop
                ? 'border-4 border-green-200 dark:border-green-700'
                : 'border-4 border-red-200 dark:border-red-700'
                }`}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/96x96/gray/white?text=?';
              }}
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center justify-center mb-3">
            <span className={`px-3 py-1 text-sm rounded-full font-semibold ${isTop
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
              }`}>
              #{entry.position} - {entry.category.name}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center arabic-nav">
            {entry.personName}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3 arabic-nav">
            {entry.description}
          </p>

          <div className={`flex items-center justify-center text-sm mb-3 ${isTop
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
            }`}>
            {isTop ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="arabic-nav">{entry.reason}</span>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center mb-1">
              <User className="h-3 w-3 mr-1" />
              <span className="arabic-nav">{entry.author.name}</span>
            </div>
            <div className="flex items-center justify-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(entry.createdAt)}</span>
              <span className="mx-2">•</span>
              {/* <span>{entry.voteCount} {t('topFlop.votes')}</span> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt={entry.personName}
            className={`w-16 h-16 rounded-full object-cover ${isTop
              ? 'border-2 border-green-200 dark:border-green-700'
              : 'border-2 border-red-200 dark:border-red-700'
              }`}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/64x64/gray/white?text=?';
            }}
          />
        </div>
      )}

      <div className="flex-1 mr-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className={`px-2 py-1 text-xs rounded ${isTop
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
            }`}>
            #{entry.position}
          </span>
          <span className={`px-2 py-1 text-xs rounded ${isTop
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
            }`}>
            {entry.category.name}
          </span>
          <span className={`px-2 py-1 text-xs rounded ${isTop
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
            }`}>
            {isTop ? t('topFlop.filter.top') : t('topFlop.filter.flop')}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 arabic-nav">
          {entry.personName}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3 arabic-nav">
          {entry.description}
        </p>

        <div className={`flex items-center text-sm mb-3 ${isTop
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-600 dark:text-red-400'
          }`}>
          {isTop ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span className="arabic-nav">{entry.reason}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <User className="h-3 w-3 mr-1" />
            <span className="arabic-nav mr-2">{entry.author.name}</span>
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(entry.createdAt)}</span>
          </div>
          {/* <span className="text-xs text-gray-500 dark:text-gray-400">{entry.voteCount} {t('topFlop.votes')}</span> */}
        </div>
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, icon, color }: { title: string; icon: React.ReactNode; color: string }) => (
  <div className="flex items-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
    <div className={`p-2 rounded-lg ${color} mr-3`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white arabic-nav">{title}</h3>
  </div>
);

// Main component
export default function TopFlopPage() {
  const { data: entries, isLoading, error } = useCurrentWeekTopFlop();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filter, setFilter] = useState<'all' | 'top' | 'flop'>('all');

  const topEntries = entries?.filter(entry => entry.entryType === 'TOP')
    .sort((a, b) => a.position - b.position) || [];

  const flopEntries = entries?.filter(entry => entry.entryType === 'FLOP')
    .sort((a, b) => a.position - b.position) || [];

  const getFilteredEntries = () => {
    if (filter === 'top') return { type: 'single', entries: topEntries };
    if (filter === 'flop') return { type: 'single', entries: flopEntries };
    return { type: 'grouped', topEntries, flopEntries };
  };

  const filteredData = getFilteredEntries();

  const EntryGrid = () => {
    if (filteredData.type === 'single') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.entries?.map((entry) => (
            <EntryCard key={entry.id} entry={entry} viewMode="grid" />
          ))}
        </div>
      );
    } else if (filteredData.type === 'grouped') {
      // Grouped view
      return (
        <div className="space-y-12">
          {/* TOP Section */}
          {filteredData.topEntries.length > 0 && (
            <div className="space-x-2">
              <SectionHeader
                title={t('topFlop.topTitle')}
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                color="bg-green-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.topEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} viewMode="grid" />
                ))}
              </div>
            </div>
          )}

          {/* FLOP Section */}
          {filteredData.flopEntries.length > 0 && (
            <div>
              <SectionHeader
                title={t('topFlop.flopTitle')}
                icon={<TrendingDown className="h-6 w-6 text-white" />}
                color="bg-red-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.flopEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} viewMode="grid" />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const EntryList = () => {
    if (filteredData.type === 'single') {
      return (
        <div className="space-y-6">
          {filteredData.entries?.map((entry) => (
            <EntryCard key={entry.id} entry={entry} viewMode="list" />
          ))}
        </div>
      );
    } else if (filteredData.type === 'grouped') {
      // Grouped view
      return (
        <div className="space-y-12">
          {/* TOP Section */}
          {filteredData.topEntries.length > 0 && (
            <div>
              <SectionHeader
                title={t('topFlop.topTitle')}
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                color="bg-green-500"
              />
              <div className="space-y-6">
                {filteredData.topEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} viewMode="list" />
                ))}
              </div>
            </div>
          )}

          {/* FLOP Section */}
          {filteredData.flopEntries.length > 0 && (
            <div>
              <SectionHeader
                title={t('topFlop.flopTitle')}
                icon={<TrendingDown className="h-6 w-6 text-white" />}
                color="bg-red-500"
              />
              <div className="space-y-6">
                {filteredData.flopEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} viewMode="list" />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <CategoryTabs />

      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 arabic-nav">
              {t('topFlop.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 arabic-nav">
              {t('topFlop.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Top/Flop Content */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {t('topFlop.entries')}
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                {/* Filter Buttons */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    {t('topFlop.filter.all')}
                  </Button>
                  <Button
                    variant={filter === 'top' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('top')}
                    className="text-green-600"
                  >
                    {t('topFlop.filter.top')}
                  </Button>
                  <Button
                    variant={filter === 'flop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('flop')}
                    className="text-red-600"
                  >
                    {t('topFlop.filter.flop')}
                  </Button>
                </div>

                {/* View Mode Buttons */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="flex items-center space-x-1"
                  >
                    <Grid className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('category.viewMode.grid')}</span>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex items-center space-x-1"
                  >
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('category.viewMode.list')}</span>
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400 arabic-nav">
                  {t('topFlop.errorLoading')}
                </p>
              </div>
            ) : !entries || entries.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {viewMode === 'grid' ? <EntryGrid /> : <EntryList />}
              </>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}