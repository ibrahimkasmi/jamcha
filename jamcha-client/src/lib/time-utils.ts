import { t } from './i18n';

export function formatTimeToArabic(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return t('time.now');
  } else if (diffInMinutes < 60) {
    return t('time.minutesAgo').replace('{count}', diffInMinutes.toString());
  } else if (diffInMinutes < 1440) { // less than 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return t('time.hoursAgo').replace('{count}', hours.toString());
  } else if (diffInMinutes < 10080) { // less than 7 days
    const days = Math.floor(diffInMinutes / 1440);
    return t('time.daysAgo').replace('{count}', days.toString());
  } else if (diffInMinutes < 43200) { // less than 30 days
    const weeks = Math.floor(diffInMinutes / 10080);
    return t('time.weeksAgo').replace('{count}', weeks.toString());
  } else if (diffInMinutes < 525600) { // less than 365 days
    const months = Math.floor(diffInMinutes / 43200);
    return t('time.monthsAgo').replace('{count}', months.toString());
  } else {
    const years = Math.floor(diffInMinutes / 525600);
    return t('time.yearsAgo').replace('{count}', years.toString());
  }
}