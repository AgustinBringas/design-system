import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

function renderDrawer(props: React.ComponentPropsWithoutRef<typeof DrawerContent> = {}) {
  return render(
    <Drawer>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent {...props}>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>Drawer description</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>Body content</DrawerBody>
        <DrawerFooter>
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>,
  );
}

describe('Drawer', () => {
  it('does not render content before the trigger is clicked', () => {
    renderDrawer();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens when the trigger is clicked', async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText('Open'));
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toBeInTheDocument(),
    );
  });

  it('renders title, description, and body when open', async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText('Open'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.getByText('Drawer title')).toBeInTheDocument();
    expect(screen.getByText('Drawer description')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('has role="dialog" when open', async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText('Open'));
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toBeInTheDocument(),
    );
  });

  it('title is labelled correctly for screen readers', async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText('Open'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(
      screen.getByRole('dialog', { name: 'Drawer title' }),
    ).toBeInTheDocument();
  });

  it('closes when the X button is clicked', async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText('Open'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('closes when the DrawerClose (Cancel) button in the footer is clicked', async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText('Open'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText('Open'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('renders the X close button by default', async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText('Open'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('hides the X close button when hideCloseButton is true', async () => {
    const user = userEvent.setup();
    renderDrawer({ hideCloseButton: true });
    await user.click(screen.getByText('Open'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    // The sr-only X button (named "Close") should be absent; the footer "Cancel" button remains
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  // ─── Controlled mode ──────────────────────────────────────────────────────

  it('renders as open when open=true is passed', async () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>Controlled</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toBeInTheDocument(),
    );
  });

  it('calls onOpenChange(false) when Escape is pressed in controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerTitle>Controlled</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange(true) when trigger is clicked in controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open={false} onOpenChange={onOpenChange}>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Controlled</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    await user.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  // ─── Side variants ────────────────────────────────────────────────────────

  it.each(['left', 'right', 'top', 'bottom'] as const)(
    'applies the %s side class to the content panel',
    async (side) => {
      const user = userEvent.setup();
      renderDrawer({ side });
      await user.click(screen.getByText('Open'));
      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
      const panel = screen.getByRole('dialog');
      expect(panel.className).toMatch(
        side === 'left' || side === 'right' ? /inset-y-0/ : /inset-x-0/,
      );
    },
  );
});
