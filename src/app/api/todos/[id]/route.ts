import { NextResponse } from 'next/server';
import { deleteTodo, sleep, toggleTodo } from '../_store';

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const updated = toggleTodo(params.id);
  await sleep(120);
  if (!updated)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const ok = deleteTodo(params.id);
  await sleep(120);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
