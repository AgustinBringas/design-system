import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';

function renderContextMenu(content: React.ReactNode) {
  return render(
    <ContextMenu>
      <ContextMenuTrigger>
        <div data-testid="trigger">Right-click me</div>
      </ContextMenuTrigger>
      <ContextMenuContent>{content}</ContextMenuContent>
    </ContextMenu>,
  );
}

async function openMenu() {
  fireEvent.contextMenu(screen.getByTestId('trigger'));
  await waitFor(() =>
    expect(screen.getByRole('menu')).toBeInTheDocument(),
  );
}

import React from 'react';

describe('ContextMenu', () => {
  it('does not render content before right-click', () => {
    renderContextMenu(<ContextMenuItem>Item</ContextMenuItem>);
    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });

  it('opens on right-click (contextmenu event)', async () => {
    renderContextMenu(<ContextMenuItem>Item</ContextMenuItem>);
    await openMenu();
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('has role="menu" when open', async () => {
    renderContextMenu(<ContextMenuItem>Item</ContextMenuItem>);
    await openMenu();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderContextMenu(<ContextMenuItem>Item</ContextMenuItem>);
    await openMenu();
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
  });

  // ─── MenuItem ─────────────────────────────────────────────────────────────

  it('calls onSelect when an item is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderContextMenu(
      <ContextMenuItem onSelect={onSelect}>Save</ContextMenuItem>,
    );
    await openMenu();
    await user.click(screen.getByText('Save'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('does not call onSelect on a disabled item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderContextMenu(
      <ContextMenuItem disabled onSelect={onSelect}>Disabled</ContextMenuItem>,
    );
    await openMenu();
    await user.click(screen.getByText('Disabled'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  // ─── Label & Separator ────────────────────────────────────────────────────

  it('renders a label', async () => {
    renderContextMenu(<ContextMenuLabel>Section</ContextMenuLabel>);
    await openMenu();
    expect(screen.getByText('Section')).toBeInTheDocument();
  });

  it('renders a separator', async () => {
    renderContextMenu(
      <>
        <ContextMenuItem>A</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>B</ContextMenuItem>
      </>,
    );
    await openMenu();
    expect(document.querySelector('[role="separator"]')).toBeInTheDocument();
  });

  // ─── Shortcut ─────────────────────────────────────────────────────────────

  it('renders a keyboard shortcut', async () => {
    renderContextMenu(
      <ContextMenuItem>
        Copy
        <ContextMenuShortcut>⌘C</ContextMenuShortcut>
      </ContextMenuItem>,
    );
    await openMenu();
    expect(screen.getByText('⌘C')).toBeInTheDocument();
  });

  // ─── Checkbox item ────────────────────────────────────────────────────────

  it('renders a checked checkbox item', async () => {
    renderContextMenu(
      <ContextMenuCheckboxItem checked>Show grid</ContextMenuCheckboxItem>,
    );
    await openMenu();
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Show grid' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onCheckedChange when a checkbox item is clicked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    renderContextMenu(
      <ContextMenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
        Toggle
      </ContextMenuCheckboxItem>,
    );
    await openMenu();
    await user.click(screen.getByRole('menuitemcheckbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  // ─── Radio items ──────────────────────────────────────────────────────────

  it('renders radio items with correct checked state', async () => {
    renderContextMenu(
      <ContextMenuRadioGroup value="b">
        <ContextMenuRadioItem value="a">Option A</ContextMenuRadioItem>
        <ContextMenuRadioItem value="b">Option B</ContextMenuRadioItem>
      </ContextMenuRadioGroup>,
    );
    await openMenu();
    expect(
      screen.getByRole('menuitemradio', { name: 'Option A' }),
    ).toHaveAttribute('aria-checked', 'false');
    expect(
      screen.getByRole('menuitemradio', { name: 'Option B' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  // ─── Sub menu ─────────────────────────────────────────────────────────────

  it('renders a sub-menu trigger', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger">right-click</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Sub item</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>,
    );
    await openMenu();
    expect(screen.getByText('More options')).toBeInTheDocument();
  });

  // ─── Group ────────────────────────────────────────────────────────────────

  it('renders grouped items', async () => {
    renderContextMenu(
      <ContextMenuGroup>
        <ContextMenuItem>First</ContextMenuItem>
        <ContextMenuItem>Second</ContextMenuItem>
      </ContextMenuGroup>,
    );
    await openMenu();
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  // ─── Inset ────────────────────────────────────────────────────────────────

  it('applies inset padding to an inset item', async () => {
    renderContextMenu(<ContextMenuItem inset>Inset</ContextMenuItem>);
    await openMenu();
    expect(screen.getByText('Inset').closest('[role="menuitem"]')?.className).toMatch(/pl-8/);
  });
});
