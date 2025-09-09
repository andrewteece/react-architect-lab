import { NextResponse } from 'next/server';

type Todo = { id: string; title: string; done: boolean };

let todosRef: Todo[]; // will be shared with parent module if same process
try {
  // @ts-ignore allow dynamic import to reuse array if already loaded
  const mod = await import('../route');
  // pull the module-scoped todos via a side-channel (dev server often shares context)
  // Fallback: no-op; each file has its own copy during HMR sometimes.
  // This isn't production code—good enough for a lab.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  todosRef = (mod as any).__todos as Todo[];
} catch {}

let todos: Todo[] = (globalThis as any).__todos ?? [];

if (!Array.isArray(todos) || todos.length === 0) {
  // Best effort: keep a separate store if parent isn't loaded.
  (globalThis as any).__todos = todos;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = { ...todos[idx], done: !todos[idx].done };
  todos[idx] = updated;
  await sleep(120);
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const exists = todos.some((t) => t.id === id);
  if (!exists)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  todos = todos.filter((t) => t.id !== id);
  await sleep(120);
  return NextResponse.json({ ok: true });
}
