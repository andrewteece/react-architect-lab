// src/app/api/todos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTodo, removeTodo, sleep, toggleTodo } from '../_store';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = getTodo(id);
  if (!existing)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = toggleTodo(id);
  await sleep(120);
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = getTodo(id);
  if (!existing)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  removeTodo(id);
  await sleep(100);
  return new NextResponse(null, { status: 204 });
}
