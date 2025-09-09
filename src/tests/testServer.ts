import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

type Todo = { id: string; title: string; done: boolean };

let todos: Todo[] = [
  { id: '1', title: 'Wire up React Query', done: true },
  { id: '2', title: 'Build Todos with optimistic updates', done: false },
];

export const server = setupServer(
  http.get('/api/todos', async () => {
    await delay(50);
    return HttpResponse.json(todos);
  }),

  http.post('/api/todos', async ({ request }) => {
    const { title } = (await request.json()) as { title: string };
    const todo: Todo = { id: 'server-' + Date.now(), title, done: false };
    todos = [todo, ...todos];
    await delay(50);
    return HttpResponse.json(todo, { status: 201 });
  }),

  http.patch('/api/todos/:id', async ({ params }) => {
    const id = String(params.id);
    todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    const updated = todos.find((t) => t.id === id)!;
    await delay(25);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/todos/:id', async ({ params }) => {
    const id = String(params.id);
    todos = todos.filter((t) => t.id !== id);
    await delay(25);
    return HttpResponse.json({ ok: true });
  })
);
