'use client';

import { useState } from 'react';
import { useAddTodo } from './useTodos';

export default function TodoForm() {
  const [title, setTitle] = useState('');
  const add = useAddTodo();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setTitle('');
    add.mutate(t);
  }

  return (
    <form onSubmit={onSubmit} className='flex gap-2'>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Add a todo…'
        className='min-w-0 flex-1 rounded-md border px-3 py-2'
        aria-label='New todo title'
      />
      <button
        type='submit'
        className='rounded-md border px-3 py-2'
        disabled={add.isPending}
      >
        {add.isPending ? 'Adding…' : 'Add'}
      </button>
    </form>
  );
}
