import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './popover';

function renderPopover() {
  return render(
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>
        <p>Popover body</p>
        <PopoverClose>Close</PopoverClose>
      </PopoverContent>
    </Popover>,
  );
}

describe('Popover', () => {
  it('does not render content before the trigger is opened', () => {
    renderPopover();
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
  });

  it('opens content when the trigger is clicked', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByText('Open'));
    await waitFor(() => expect(screen.getByText('Popover body')).toBeInTheDocument());
  });

  it('closes when PopoverClose is clicked', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByText('Open'));
    await waitFor(() => expect(screen.getByText('Popover body')).toBeInTheDocument());
    await user.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    });
  });

  it('merges a custom className on the content', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent className="my-popover">Body</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByText('Open'));
    await waitFor(() => {
      expect(screen.getByText('Body').className).toMatch(/my-popover/);
    });
  });
});
