'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Todo = { id: string; title: string; done: boolean };

const keys = {
  all: ['todos'] as const,
  item: (id: string) => ['todos', id] as const,
};

async function getJSON<T>(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export function useTodos() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => getJSON<Todo[]>('/api/todos'),
  });
}

export function useAddTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (title: string) =>
      getJSON<Todo>('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title }),
      }),
    onMutate: async (title: string) => {
      await qc.cancelQueries({ queryKey: keys.all });
      const prev = qc.getQueryData<Todo[]>(keys.all) ?? [];
      const optimistic: Todo = {
        id: `optimistic-${Date.now()}`,
        title,
        done: false,
      };
      qc.setQueryData<Todo[]>(keys.all, [optimistic, ...prev]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(keys.all, ctx.prev);
    },
    onSuccess: (created) => {
      qc.setQueryData<Todo[]>(keys.all, (curr) =>
        curr
          ? [created, ...curr.filter((t) => !t.id.startsWith('optimistic-'))]
          : [created]
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useToggleTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      getJSON<Todo>(`/api/todos/${id}`, { method: 'PATCH' }),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: keys.all });
      const prev = qc.getQueryData<Todo[]>(keys.all) ?? [];
      qc.setQueryData<Todo[]>(
        keys.all,
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => ctx?.prev && qc.setQueryData(keys.all, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      getJSON<{ ok: true }>(`/api/todos/${id}`, { method: 'DELETE' }),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: keys.all });
      const prev = qc.getQueryData<Todo[]>(keys.all) ?? [];
      qc.setQueryData<Todo[]>(
        keys.all,
        prev.filter((t) => t.id !== id)
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => ctx?.prev && qc.setQueryData(keys.all, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
