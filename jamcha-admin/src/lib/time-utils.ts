import { formatDistanceToNow } from "date-fns";
import { arSA, enUS, fr } from "date-fns/locale";
import i18n from "./i18n";

// Re-export for use in other components
export { formatDistanceToNow };

/**
 * @deprecated Use formatDateFns instead for i18n support.
 */
export function formatTimeToArabic(date: Date): string {
  return formatDateFns(date);
}

/**
 * Formats a date to a relative time string (e.g., "4 hours ago")
 * with internationalization support.
 * @param date The date to format.
 * @returns A formatted, translated string.
 */
export function formatDateFns(date: Date): string {
  const language = i18n.language;

  const locales: { [key: string]: Locale } = {
    en: enUS,
    ar: arSA,
    fr: fr,
  };

  const locale = locales[language] || enUS; // Default to English if locale not found

  return formatDistanceToNow(date, { addSuffix: true, locale });
}
