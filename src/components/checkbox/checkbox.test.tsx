import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox aria-label="Accept" />);
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toHaveAttribute(
      'data-state',
      'unchecked',
    );
  });

  it('renders checked when controlled', () => {
    render(<Checkbox aria-label="Accept" checked />);
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toHaveAttribute(
      'data-state',
      'checked',
    );
  });

  it('renders the indeterminate state', () => {
    render(<Checkbox aria-label="Accept" checked="indeterminate" />);
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toHaveAttribute(
      'data-state',
      'indeterminate',
    );
  });

  it('calls onCheckedChange when toggled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('checkbox', { name: 'Accept' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" disabled onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('checkbox', { name: 'Accept' }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('renders a label and wires it to the checkbox via htmlFor/id', () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    const label = screen.getByText('Accept terms');
    expect(label.getAttribute('for')).toBe(checkbox.id);
  });

  it('toggles when the associated label is clicked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept terms" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByText('Accept terms'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('renders without a <label> element when no label prop is given', () => {
    render(<Checkbox aria-label="Accept" />);
    expect(document.querySelector('label')).not.toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Checkbox aria-label="Accept" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('merges a custom className', () => {
    render(<Checkbox aria-label="Accept" className="my-checkbox" />);
    expect(screen.getByRole('checkbox').className).toMatch(/my-checkbox/);
  });
});
