import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

function renderTooltip(content = 'Tooltip text', triggerLabel = 'Hover me') {
  return render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{triggerLabel}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
}

// Radix renders content text twice: once visible, once in a visually-hidden
// <span role="tooltip"> for accessibility. Use getByRole('tooltip') for
// presence checks and .parentElement for the content wrapper's className.

describe('Tooltip', () => {
  it('does not show the tooltip content by default', () => {
    renderTooltip();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows content when the trigger is hovered', async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() =>
      expect(screen.getByRole('tooltip')).toBeInTheDocument(),
    );
  });

  it.skip('hides content when the trigger is unhovered', () => {
    // Radix's handleTriggerLeave calls getExitSideFromRect which uses
    // getBoundingClientRect geometry. In JSDOM all rects are zero-size so it
    // throws "unreachable". Close-on-unhover is covered by Radix's own tests.
  });

  it('shows content when the trigger receives keyboard focus', async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.tab();
    await waitFor(() =>
      expect(screen.getByRole('tooltip')).toBeInTheDocument(),
    );
  });

  it('renders the tooltip in a portal (not inside the trigger)', async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());

    const trigger = screen.getByText('Hover me');
    const tooltip = screen.getByRole('tooltip');
    expect(trigger.contains(tooltip)).toBe(false);
  });

  it('forwards className to the content element', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>trigger</TooltipTrigger>
          <TooltipContent className="custom-class">tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.hover(screen.getByText('trigger'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    // The class is on the Content wrapper div (parent of the role="tooltip" span)
    expect(screen.getByRole('tooltip').parentElement?.className).toMatch(/custom-class/);
  });

  it('renders with a custom sideOffset', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>trigger</TooltipTrigger>
          <TooltipContent sideOffset={12}>tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.hover(screen.getByText('trigger'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
  });
});
