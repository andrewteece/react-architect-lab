import type { Metadata } from 'next';
import Script from 'next/script';
import '../../styles/globals.css';
import QueryProviders from '../providers';

import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { locales } from '../../i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://react-architect-lab.vercel.app'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: [{ url: '/og.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og.png'],
    },
  };
}

const themeScript = `
(function(){
  try {
    const key = 'theme';
    const stored = localStorage.getItem(key);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Script
          id='theme-init'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProviders>{children}</QueryProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
