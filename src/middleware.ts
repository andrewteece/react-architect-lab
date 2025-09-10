import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // URLs: / (en), /es
});

export const config = {
  // Skip files, assets and API
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
