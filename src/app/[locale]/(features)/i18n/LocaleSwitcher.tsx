'use client';

import { Link, usePathname } from '@/i18n/navigation'; // <- NEW
import { useLocale } from 'next-intl';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname(); // locale-agnostic
  const next = locale === 'es' ? 'en' : 'es';

  return (
    <Link
      href={pathname || '/'}
      locale={next}
      className='rounded-lg border px-3 py-1 text-sm hover:opacity-90'
      aria-label={`Switch locale to ${next}`}
    >
      {next.toUpperCase()}
    </Link>
  );
}
