import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import TodoForm from '../app/[locale]/(features)/todos/TodoForm';
import TodoList from '../app/[locale]/(features)/todos/TodoList';
import QueryProviders from '../app/providers';

function AppUnderTest() {
  return (
    <QueryProviders>
      <>
        <TodoForm />
        <TodoList />
      </>
    </QueryProviders>
  );
}

describe('Todos flow', () => {
  it('loads, adds (optimistic), toggles, and deletes', async () => {
    const user = userEvent.setup();
    render(<AppUnderTest />);

    // Loads initial todos
    await screen.findByText('Wire up React Query');
    await screen.findByText('Build Todos with optimistic updates');

    // Add a todo (optimistic should make it appear immediately)
    const input = screen.getByLabelText(/New todo title/i);
    await user.type(input, 'Write tests{enter}');
    // Appears (optimistic), then settles after server response
    await screen.findByText('Write tests');

    // Toggle a todo via accessible label (label associates to checkbox)
    const toggleBox = screen.getByLabelText(
      'Build Todos with optimistic updates'
    ) as HTMLInputElement;
    const wasChecked = toggleBox.checked;
    await user.click(toggleBox);
    // It flips quickly due to optimistic update
    expect(toggleBox.checked).toBe(!wasChecked);

    // Delete the newly added one
    const del = screen.getByRole('button', { name: 'Delete Write tests' });
    await user.click(del);
    // It should disappear
    expect(screen.queryByText('Write tests')).toBeNull();
  });
});
