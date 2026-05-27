import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ToastAction } from './toast';
import { Toaster } from './toaster';
import { toast, useToast, _resetForTests } from './use-toast';

// Synchronously wipe all module-level toast state between tests so nothing
// bleeds across — the 1000 ms REMOVE_TOAST delay would otherwise keep old
// toasts visible in subsequent test renders.
afterEach(() => act(() => { _resetForTests(); }));

function renderToaster() {
  return render(<Toaster />);
}

describe('toast() + Toaster', () => {
  it('renders nothing before any toast is triggered', () => {
    renderToaster();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows a toast with title when toast() is called', async () => {
    renderToaster();
    act(() => { toast({ title: 'Hello world' }); });
    await waitFor(() =>
      expect(screen.getByText('Hello world')).toBeInTheDocument(),
    );
  });

  it('shows a toast with description', async () => {
    renderToaster();
    act(() => {
      toast({ title: 'Saved', description: 'Your file was saved.' });
    });
    await waitFor(() =>
      expect(screen.getByText('Your file was saved.')).toBeInTheDocument(),
    );
  });

  it('renders the Close button on each toast', async () => {
    renderToaster();
    act(() => { toast({ title: 'Closeable' }); });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument(),
    );
  });

  it('closes a toast when the Close button is clicked', async () => {
    const user = userEvent.setup();
    renderToaster();
    act(() => { toast({ title: 'Dismiss me' }); });
    await waitFor(() =>
      expect(screen.getByText('Dismiss me')).toBeInTheDocument(),
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument(),
    );
  });

  // ─── Variants ─────────────────────────────────────────────────────────────

  it.each([
    ['default',     'border-border'],
    ['destructive', 'border-destructive'],
    ['success',     'border-success'],
    ['warning',     'border-warning'],
    ['info',        'border-info'],
  ] as const)('applies %s variant border class', async (variant, borderClass) => {
    renderToaster();
    act(() => { toast({ title: variant, variant }); });
    await waitFor(() =>
      expect(screen.getByText(variant)).toBeInTheDocument(),
    );
    const toastEl = screen.getByText(variant).closest('li');
    expect(toastEl?.className).toMatch(new RegExp(borderClass));
  });

  // ─── Action ───────────────────────────────────────────────────────────────

  it('renders an action button when provided', async () => {
    renderToaster();
    act(() => {
      toast({
        title: 'File deleted',
        action: (
          <ToastAction altText="Undo deletion">Undo</ToastAction>
        ),
      });
    });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument(),
    );
  });

  // ─── TOAST_LIMIT ─────────────────────────────────────────────────────────

  it('shows at most 3 toasts (TOAST_LIMIT)', async () => {
    renderToaster();
    act(() => {
      toast({ title: 'Toast 1' });
      toast({ title: 'Toast 2' });
      toast({ title: 'Toast 3' });
      toast({ title: 'Toast 4' }); // should be dropped
    });
    await waitFor(() =>
      expect(screen.getByText('Toast 4')).toBeInTheDocument(),
    );
    // Toast 1 was pushed out by the limit — newest wins, oldest dropped
    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
  });

  // ─── useToast hook ────────────────────────────────────────────────────────

  it('useToast returns toasts array that updates reactively', async () => {
    let count = 0;
    function Inspector() {
      const { toasts } = useToast();
      count = toasts.length;
      return null;
    }
    render(<><Toaster /><Inspector /></>);

    expect(count).toBe(0);
    act(() => { toast({ title: 'Watch me' }); });
    await waitFor(() => expect(count).toBe(1));
  });

  it('dismiss(id) removes only the matching toast', async () => {
    renderToaster();
    let dismissFirst!: () => void;
    act(() => {
      dismissFirst = toast({ title: 'First' }).dismiss;
      toast({ title: 'Second' });
    });
    await waitFor(() =>
      expect(screen.getByText('First')).toBeInTheDocument(),
    );

    act(() => { dismissFirst(); });

    await waitFor(() =>
      expect(screen.queryByText('First')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
