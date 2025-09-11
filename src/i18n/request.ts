import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is async in next-intl v3.22+ and may be undefined
  let locale = (await requestLocale) || defaultLocale;

  // Load messages; if the file for the locale is missing, fall back to default
  let messages: Record<string, unknown>;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    locale = defaultLocale;
    messages = (await import(`../messages/${defaultLocale}.json`)).default;
  }

  return { locale, messages };
});
