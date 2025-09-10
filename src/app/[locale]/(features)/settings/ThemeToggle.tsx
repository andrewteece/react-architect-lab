'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  const t = document.documentElement.dataset.theme as Theme | undefined;
  return t === 'dark' ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  // Read the current theme after mount (dataset is set by the inline script)
  useEffect(() => {
    setTheme(readTheme());
  }, []);

  // Optional: keep in sync with system/theme changes (multi-tab, OS)
  useEffect(() => {
    const mm = window.matchMedia?.('(prefers-color-scheme: dark)');
    const handleMedia = () => setTheme(readTheme());
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme') setTheme(readTheme());
    };
    mm?.addEventListener?.('change', handleMedia);
    window.addEventListener('storage', handleStorage);
    return () => {
      mm?.removeEventListener?.('change', handleMedia);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const next = theme === 'dark' ? 'light' : 'dark';

  function toggle() {
    const el = document.documentElement;
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    el.dataset.theme = newTheme;
    try {
      localStorage.setItem('theme', newTheme);
    } catch {}
    setTheme(newTheme); // <-- update state so the button text flips
  }

  return (
    <button
      onClick={toggle}
      className='rounded-lg border px-3 py-1 text-sm hover:opacity-90'
      aria-label='Toggle dark mode'
      aria-pressed={theme === 'dark'}
    >
      Switch to {next} mode
    </button>
  );
}
