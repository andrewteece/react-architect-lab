import ThemeToggle from '../settings/ThemeToggle';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

export default function TodosPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Todos</h1>
        <ThemeToggle />
      </header>

      <TodoForm />
      <TodoList />
    </main>
  );
}
