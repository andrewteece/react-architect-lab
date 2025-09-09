export type Todo = { id: string; title: string; done: boolean };

// Simple in-memory state (resets on dev reloads)
const state: { todos: Todo[] } = {
  todos: [
    { id: '1', title: 'Wire up React Query', done: true },
    { id: '2', title: 'Build Todos with optimistic updates', done: false },
  ],
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function listTodos(): Todo[] {
  return state.todos;
}

export function addTodo(title: string): Todo {
  const t = title.trim();
  const todo: Todo = { id: crypto.randomUUID(), title: t, done: false };
  state.todos = [todo, ...state.todos];
  return todo;
}

export function toggleTodo(id: string): Todo | undefined {
  const idx = state.todos.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  const updated: Todo = { ...state.todos[idx], done: !state.todos[idx].done };
  state.todos[idx] = updated;
  return updated;
}

export function deleteTodo(id: string): boolean {
  const exists = state.todos.some((t) => t.id === id);
  if (!exists) return false;
  state.todos = state.todos.filter((t) => t.id !== id);
  return true;
}
