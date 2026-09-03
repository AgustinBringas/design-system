import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup, RadioGroupItem } from './radio-group';

function renderGroup(onValueChange = vi.fn()) {
  render(
    <RadioGroup aria-label="Ability score method" onValueChange={onValueChange}>
      <RadioGroupItem value="point-buy" label="Point buy" />
      <RadioGroupItem value="standard-array" label="Standard array" />
      <RadioGroupItem value="manual" label="Manual" disabled />
    </RadioGroup>,
  );
  return onValueChange;
}

describe('RadioGroup', () => {
  it('renders each item with role="radio"', () => {
    renderGroup();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('renders labels wired to their radio via htmlFor/id', () => {
    renderGroup();
    const radio = screen.getByRole('radio', { name: 'Point buy' });
    const label = screen.getByText('Point buy');
    expect(label.getAttribute('for')).toBe(radio.id);
  });

  it('selects an item on click and calls onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = renderGroup();
    await user.click(screen.getByRole('radio', { name: 'Standard array' }));
    expect(onValueChange).toHaveBeenCalledWith('standard-array');
  });

  it('only allows one item to be checked at a time', async () => {
    const user = userEvent.setup();
    renderGroup();
    await user.click(screen.getByRole('radio', { name: 'Point buy' }));
    await user.click(screen.getByRole('radio', { name: 'Standard array' }));
    expect(screen.getByRole('radio', { name: 'Point buy' })).toHaveAttribute(
      'data-state',
      'unchecked',
    );
    expect(screen.getByRole('radio', { name: 'Standard array' })).toHaveAttribute(
      'data-state',
      'checked',
    );
  });

  it('does not select a disabled item', async () => {
    const user = userEvent.setup();
    const onValueChange = renderGroup();
    await user.click(screen.getByRole('radio', { name: 'Manual' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('toggles when the associated label is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = renderGroup();
    await user.click(screen.getByText('Point buy'));
    expect(onValueChange).toHaveBeenCalledWith('point-buy');
  });

  it('renders without a <label> element when no label prop is given', () => {
    render(
      <RadioGroup aria-label="Unlabeled">
        <RadioGroupItem value="a" aria-label="A" />
      </RadioGroup>,
    );
    expect(document.querySelector('label')).not.toBeInTheDocument();
  });

  it('forwards ref on the group root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref}>
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('merges a custom className on the group', () => {
    render(
      <RadioGroup className="my-group">
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup').className).toMatch(/my-group/);
  });
});
