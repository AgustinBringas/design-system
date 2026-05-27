import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from './modal';

function renderModal({
  open,
  onOpenChange,
  hideCloseButton,
  size,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
} = {}) {
  // Only spread defined props — exactOptionalPropertyTypes rejects explicit undefined.
  const modalProps = {
    ...(open !== undefined && { open }),
    ...(onOpenChange !== undefined && { onOpenChange }),
  };
  const contentProps = {
    ...(size !== undefined && { size }),
    ...(hideCloseButton !== undefined && { hideCloseButton }),
  };

  return render(
    <Modal {...modalProps}>
      <ModalTrigger asChild>
        <Button>Open</Button>
      </ModalTrigger>
      <ModalContent {...contentProps}>
        <ModalHeader>
          <ModalTitle>Test title</ModalTitle>
          <ModalDescription>Test description</ModalDescription>
        </ModalHeader>
        <p>Modal body</p>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>,
  );
}

describe('Modal', () => {
  it('does not render content before the trigger is clicked', () => {
    renderModal();
    expect(screen.queryByText('Test title')).not.toBeInTheDocument();
  });

  it('opens when the trigger is clicked', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toBeInTheDocument(),
    );
  });

  it('renders title, description and body when open', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByText('Test title')).toBeInTheDocument());
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('has the correct aria role', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toBeInTheDocument(),
    );
  });

  it('title is labelled correctly for screen readers', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: 'Test title' }),
      ).toBeInTheDocument(),
    );
  });

  // ─── Closing ──────────────────────────────────────────────────────────────

  it('closes when the X button is clicked', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('closes when the Cancel button (ModalClose) is clicked', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  // ─── X button visibility ──────────────────────────────────────────────────

  it('renders the X close button by default', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument(),
    );
  });

  it('hides the X close button when hideCloseButton is true', async () => {
    const user = userEvent.setup();
    renderModal({ hideCloseButton: true });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  // ─── Controlled ───────────────────────────────────────────────────────────

  it('renders as open when open=true is passed', () => {
    renderModal({ open: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when Escape is pressed in controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderModal({ open: true, onOpenChange });
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange(true) when trigger is clicked in controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderModal({ open: false, onOpenChange });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  // ─── Size variants ────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg', 'xl', 'full'] as const)(
    'applies the %s size class to the content panel',
    async (size) => {
      const user = userEvent.setup();
      renderModal({ size });
      await user.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
      expect(screen.getByRole('dialog').className).toMatch(/max-w-/);
    },
  );
});
