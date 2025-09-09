import type { Metadata } from 'next';
import Script from 'next/script';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'React Architect Lab',
  description:
    'Prep & patterns for React/Next/TypeScript consulting interviews',
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <Script
          id='theme-init'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
