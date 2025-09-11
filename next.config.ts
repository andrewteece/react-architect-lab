// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

// Explicitly provide the configuration
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  // ...any other Next options you use
};

export default withNextIntl(nextConfig);
