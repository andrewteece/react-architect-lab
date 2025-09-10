import { defineRouting } from 'next-intl/routing';

const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  // optional:
  // localePrefix: 'as-needed'
});

// Export as both a named export (for your app's internal use)
export { routing };

// And as the default export (for next-intl to find)
export default routing;
