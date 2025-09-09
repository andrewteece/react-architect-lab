export type Todo = { id: string; title: string; done: boolean };

let seq = 1;
let todos: Todo[] = [{ id: String(seq++), title: 'write tests', done: false }];

export function listTodos(): Todo[] {
  return todos;
}

export function addTodo(title: string): Todo {
  const todo: Todo = { id: String(seq++), title, done: false };
  todos = [...todos, todo];
  return todo;
}

export function getTodo(id: string): Todo | undefined {
  return todos.find((t) => t.id === id);
}

export function toggleTodo(id: string): Todo {
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error('Not found');
  const updated: Todo = { ...todos[idx], done: !todos[idx].done };
  todos = [...todos.slice(0, idx), updated, ...todos.slice(idx + 1)];
  return updated;
}

export function removeTodo(id: string): void {
  todos = todos.filter((t) => t.id !== id);
}

export function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}
