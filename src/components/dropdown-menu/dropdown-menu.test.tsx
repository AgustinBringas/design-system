import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

function renderDropdown(content: React.ReactNode) {
  return render(
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{content}</DropdownMenuContent>
    </DropdownMenu>,
  );
}

describe('DropdownMenu', () => {
  it('does not render content before the trigger is clicked', () => {
    renderDropdown(<DropdownMenuItem>Item</DropdownMenuItem>);
    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });

  it('opens and shows content when trigger is clicked', async () => {
    const user = userEvent.setup();
    renderDropdown(<DropdownMenuItem>Item</DropdownMenuItem>);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => {
      expect(screen.getByText('Item')).toBeInTheDocument();
    });
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderDropdown(<DropdownMenuItem>Item</DropdownMenuItem>);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByText('Item')).toBeInTheDocument());
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Item')).not.toBeInTheDocument();
    });
  });

  // ─── MenuItem ─────────────────────────────────────────────────────────────

  it('calls onSelect when a menu item is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderDropdown(
      <DropdownMenuItem onSelect={onSelect}>Save</DropdownMenuItem>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByText('Save')).toBeInTheDocument());
    await user.click(screen.getByText('Save'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('does not call onSelect on a disabled item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderDropdown(
      <DropdownMenuItem disabled onSelect={onSelect}>
        Disabled
      </DropdownMenuItem>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByText('Disabled')).toBeInTheDocument(),
    );
    await user.click(screen.getByText('Disabled'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  // ─── Label & Separator ────────────────────────────────────────────────────

  it('renders a label', async () => {
    const user = userEvent.setup();
    renderDropdown(<DropdownMenuLabel>Section</DropdownMenuLabel>);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByText('Section')).toBeInTheDocument(),
    );
  });

  it('renders a separator', async () => {
    const user = userEvent.setup();
    renderDropdown(
      <>
        <DropdownMenuItem>A</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>B</DropdownMenuItem>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByText('A')).toBeInTheDocument());
    expect(document.querySelector('[role="separator"]')).toBeInTheDocument();
  });

  // ─── Shortcut ─────────────────────────────────────────────────────────────

  it('renders a keyboard shortcut', async () => {
    const user = userEvent.setup();
    renderDropdown(
      <DropdownMenuItem>
        Save
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByText('⌘S')).toBeInTheDocument());
  });

  // ─── Checkbox item ────────────────────────────────────────────────────────

  it('renders a checkbox item with correct checked state', async () => {
    const user = userEvent.setup();
    renderDropdown(
      <DropdownMenuCheckboxItem checked>Show grid</DropdownMenuCheckboxItem>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(
        screen.getByRole('menuitemcheckbox', { name: 'Show grid' }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Show grid' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onCheckedChange when a checkbox item is clicked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    renderDropdown(
      <DropdownMenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
        Toggle
      </DropdownMenuCheckboxItem>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('menuitemcheckbox')).toBeInTheDocument(),
    );
    await user.click(screen.getByRole('menuitemcheckbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  // ─── Radio items ──────────────────────────────────────────────────────────

  it('renders radio items with correct checked state', async () => {
    const user = userEvent.setup();
    renderDropdown(
      <DropdownMenuRadioGroup value="b">
        <DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="b">Option B</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('menuitemradio', { name: 'Option B' })).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('menuitemradio', { name: 'Option A' }),
    ).toHaveAttribute('aria-checked', 'false');
    expect(
      screen.getByRole('menuitemradio', { name: 'Option B' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  // ─── Sub menu ─────────────────────────────────────────────────────────────

  it('renders a sub menu trigger', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByText('More options')).toBeInTheDocument(),
    );
  });

  // ─── Group ────────────────────────────────────────────────────────────────

  it('renders grouped items', async () => {
    const user = userEvent.setup();
    renderDropdown(
      <DropdownMenuGroup>
        <DropdownMenuItem>First</DropdownMenuItem>
        <DropdownMenuItem>Second</DropdownMenuItem>
      </DropdownMenuGroup>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByText('First')).toBeInTheDocument());
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
