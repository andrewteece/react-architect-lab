import { NextResponse } from 'next/server';

type Todo = { id: string; title: string; done: boolean };

// In-memory store (resets on dev reloads—fine for a lab)
let todos: Todo[] = [
  { id: '1', title: 'Wire up React Query', done: true },
  { id: '2', title: 'Build Todos with optimistic updates', done: false },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET() {
  await sleep(200); // tiny delay to see loading state
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const body = (await req.json()) as { title?: string };
  const title = (body.title ?? '').trim();
  if (!title)
    return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const todo: Todo = { id: crypto.randomUUID(), title, done: false };
  todos = [todo, ...todos];
  await sleep(150);
  return NextResponse.json(todo, { status: 201 });
}
