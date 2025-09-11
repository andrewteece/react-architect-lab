'use client';

import { useDeleteTodo, useTodos, useToggleTodo } from './useTodos';

export default function TodoList() {
  const { data, isLoading, isError, error } = useTodos();
  const toggle = useToggleTodo();
  const del = useDeleteTodo();

  if (isLoading) {
    return (
      <p className='text-sm' style={{ color: `rgb(var(--muted))` }}>
        Loading todos…
      </p>
    );
  }
  if (isError) {
    return <p className='text-red-500'>Error: {String(error)}</p>;
  }
  const todos = data ?? [];
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className='space-y-3'>
      <ul className='divide-y rounded-md border'>
        {todos.map((t) => (
          <li key={t.id} className='flex items-center gap-3 p-3'>
            <input
              id={`todo-${t.id}`}
              type='checkbox'
              checked={t.done}
              onChange={() => toggle.mutate(t.id)}
              className='h-4 w-4'
            />
            <label
              htmlFor={`todo-${t.id}`}
              className={`flex-1 ${t.done ? 'line-through opacity-60' : ''}`}
            >
              {t.title}
            </label>
            <button
              onClick={() => del.mutate(t.id)}
              className='rounded-md border px-2 py-1 text-xs'
              aria-label={`Delete ${t.title}`}
            >
              Delete
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className='p-3 text-sm' style={{ color: `rgb(var(--muted))` }}>
            No todos yet.
          </li>
        )}
      </ul>
      <p className='text-sm' style={{ color: `rgb(var(--muted))` }}>
        {remaining} remaining
      </p>
    </div>
  );
}
