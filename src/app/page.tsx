import ThemeToggle from './(features)/settings/ThemeToggle';

export default function Home() {
  return (
    <main className='mx-auto max-w-2xl p-6 space-y-6'>
      <header className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>React Architect Lab</h1>
        <ThemeToggle />
      </header>
      <p className='text-sm' style={{ color: `rgb(var(--muted))` }}>
        Practice ground for caching, dark mode, i18n, SSR/ISR, testing, and
        migrations.
      </p>
    </main>
  );
}
