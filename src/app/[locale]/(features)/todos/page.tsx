import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../i18n/LocaleSwitcher';
import ThemeToggle from '../settings/ThemeToggle';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

export default function TodosPage() {
  const t = useTranslations('Todos');

  return (
    <main className='mx-auto max-w-2xl p-6 space-y-6'>
      <header className='flex items-center justify-between gap-3'>
        <h1 className='text-2xl font-semibold'>{t('title')}</h1>
        <div className='flex items-center gap-2'>
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <TodoForm />
      <TodoList />
    </main>
  );
}
