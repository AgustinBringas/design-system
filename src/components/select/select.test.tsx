import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

function renderSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  return render(
    <Select {...props}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectSeparator />
          <SelectItem value="grape" disabled>
            Grape
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>,
  );
}

describe('Select', () => {
  it('shows the placeholder when no value is selected', () => {
    renderSelect();
    expect(screen.getByText('Select a fruit')).toBeInTheDocument();
  });

  it('does not render options before the trigger is opened', () => {
    renderSelect();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('opens and shows options when the trigger is clicked', async () => {
    const user = userEvent.setup();
    renderSelect();
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('renders a group label and separator', async () => {
    const user = userEvent.setup();
    renderSelect();
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await waitFor(() => expect(screen.getByText('Fruits')).toBeInTheDocument());
    expect(document.querySelector('.bg-border')).toBeInTheDocument();
  });

  it('selects an item and calls onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await waitFor(() => expect(screen.getByText('Banana')).toBeInTheDocument());
    await user.click(screen.getByText('Banana'));
    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('shows the selected value after choosing an item', async () => {
    const user = userEvent.setup();
    renderSelect();
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await waitFor(() => expect(screen.getByText('Apple')).toBeInTheDocument());
    await user.click(screen.getByText('Apple'));
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Apple');
    });
  });

  it('marks a disabled item as unselectable', async () => {
    const user = userEvent.setup();
    renderSelect();
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await waitFor(() => expect(screen.getByText('Grape')).toBeInTheDocument());
    expect(screen.getByText('Grape').closest('[role="option"]')).toHaveAttribute(
      'data-disabled',
    );
  });

  it('respects a controlled disabled state on the trigger', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Fruit" disabled>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeDisabled();
  });
});
