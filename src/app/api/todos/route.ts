import { NextRequest, NextResponse } from 'next/server';
import { addTodo, listTodos, sleep } from './_store';

export async function GET() {
  await sleep(200);
  return NextResponse.json(listTodos());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { title?: string };
  const title = (body.title ?? '').trim();
  if (!title)
    return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const created = addTodo(title);
  await sleep(150);
  return NextResponse.json(created, { status: 201 });
}
