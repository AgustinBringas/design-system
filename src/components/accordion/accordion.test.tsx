import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

function items() {
  return (
    <>
      <AccordionItem value="hp">
        <AccordionTrigger>Hit Points</AccordionTrigger>
        <AccordionContent>Max 24, current 18</AccordionContent>
      </AccordionItem>
      <AccordionItem value="inventory">
        <AccordionTrigger>Inventory</AccordionTrigger>
        <AccordionContent>Longsword, shield, rations</AccordionContent>
      </AccordionItem>
    </>
  );
}

function renderSingle() {
  return render(
    <Accordion type="single" collapsible>
      {items()}
    </Accordion>,
  );
}

function renderMultiple() {
  return render(<Accordion type="multiple">{items()}</Accordion>);
}

describe('Accordion', () => {
  it('renders every trigger', () => {
    renderSingle();
    expect(screen.getByRole('button', { name: 'Hit Points' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Inventory' })).toBeInTheDocument();
  });

  it('collapses content by default', () => {
    renderSingle();
    expect(screen.getByRole('button', { name: 'Hit Points' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('expands an item on click', async () => {
    const user = userEvent.setup();
    renderSingle();
    await user.click(screen.getByRole('button', { name: 'Hit Points' }));
    expect(screen.getByRole('button', { name: 'Hit Points' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Max 24, current 18')).toBeInTheDocument();
  });

  it('collapses the open item when clicked again (collapsible)', async () => {
    const user = userEvent.setup();
    renderSingle();
    const trigger = screen.getByRole('button', { name: 'Hit Points' });
    await user.click(trigger);
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('only keeps one item open at a time for type="single"', async () => {
    const user = userEvent.setup();
    renderSingle();
    await user.click(screen.getByRole('button', { name: 'Hit Points' }));
    await user.click(screen.getByRole('button', { name: 'Inventory' }));
    expect(screen.getByRole('button', { name: 'Hit Points' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Inventory' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('allows multiple items open at once for type="multiple"', async () => {
    const user = userEvent.setup();
    renderMultiple();
    await user.click(screen.getByRole('button', { name: 'Hit Points' }));
    await user.click(screen.getByRole('button', { name: 'Inventory' }));
    expect(screen.getByRole('button', { name: 'Hit Points' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Inventory' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('rotates the chevron via data-state on the trigger', async () => {
    const user = userEvent.setup();
    renderSingle();
    const trigger = screen.getByRole('button', { name: 'Hit Points' });
    expect(trigger).toHaveAttribute('data-state', 'closed');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'open');
  });
});
