import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a <textarea> element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('forwards ref to the textarea DOM node', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('passes placeholder through', () => {
    render(<Textarea placeholder="Write here…" />);
    expect(screen.getByPlaceholderText('Write here…')).toBeInTheDocument();
  });

  it('calls onChange when the user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea disabled onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('merges a custom className without losing base classes', () => {
    render(<Textarea className="custom" />);
    const el = screen.getByRole('textbox');
    expect(el.classList.contains('custom')).toBe(true);
    expect(el.className).toMatch(/rounded-md/);
  });

  // ─── Size classes ─────────────────────────────────────────────────────────

  it.each([
    ['sm', /min-h-\[80px\]/],
    ['md', /min-h-\[120px\]/],
    ['lg', /min-h-\[160px\]/],
  ] as const)('applies %s size classes', (size, pattern) => {
    render(<Textarea size={size} />);
    expect(screen.getByRole('textbox').className).toMatch(pattern);
  });

  // ─── Resize classes ───────────────────────────────────────────────────────

  it.each([
    ['none',       /resize-none/],
    ['vertical',   /resize-y/],
    ['horizontal', /resize-x/],
    ['both',       /\bresize\b/],
  ] as const)('applies resize="%s" class', (resize, pattern) => {
    render(<Textarea resize={resize} />);
    expect(screen.getByRole('textbox').className).toMatch(pattern);
  });

  // ─── Label ────────────────────────────────────────────────────────────────

  it('renders a label when label prop is provided', () => {
    render(<Textarea label="Bio" />);
    expect(screen.getByText('Bio')).toBeInTheDocument();
  });

  it('associates label with textarea via htmlFor/id', () => {
    render(<Textarea label="Bio" />);
    const label = screen.getByText('Bio') as HTMLLabelElement;
    const textarea = screen.getByRole('textbox');
    expect(label.htmlFor).toBe(textarea.id);
  });

  it('uses the provided id for label association', () => {
    render(<Textarea label="Bio" id="bio-field" />);
    expect((screen.getByText('Bio') as HTMLLabelElement).htmlFor).toBe('bio-field');
    expect(screen.getByRole('textbox').id).toBe('bio-field');
  });

  // ─── Error state ──────────────────────────────────────────────────────────

  it('applies error border class when hasError is true', () => {
    render(<Textarea hasError />);
    expect(screen.getByRole('textbox').className).toMatch(/border-destructive/);
  });

  it('sets aria-invalid when hasError is true', () => {
    render(<Textarea hasError />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders errorMessage text', () => {
    render(<Textarea errorMessage="Required." />);
    expect(screen.getByText('Required.')).toBeInTheDocument();
  });

  it('infers hasError from errorMessage', () => {
    render(<Textarea errorMessage="Too short." />);
    const el = screen.getByRole('textbox');
    expect(el.className).toMatch(/border-destructive/);
    expect(el).toHaveAttribute('aria-invalid', 'true');
  });

  it('links errorMessage to textarea via aria-describedby', () => {
    render(<Textarea errorMessage="Required." />);
    const textarea = screen.getByRole('textbox');
    const error = screen.getByRole('alert');
    expect(textarea.getAttribute('aria-describedby')).toContain(error.id);
  });

  // ─── Character count ──────────────────────────────────────────────────────

  it('does not render a counter by default', () => {
    render(<Textarea maxLength={100} />);
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });

  it('renders 0/maxLength counter initially when showCharCount is true', () => {
    render(<Textarea showCharCount maxLength={200} />);
    expect(screen.getByText('0/200')).toBeInTheDocument();
  });

  it('updates the counter as the user types', async () => {
    const user = userEvent.setup();
    render(<Textarea showCharCount maxLength={200} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(screen.getByText('5/200')).toBeInTheDocument();
  });

  it('shows only the current count when showCharCount is true but no maxLength', () => {
    render(<Textarea showCharCount />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('reflects initial character count from defaultValue', () => {
    render(<Textarea showCharCount maxLength={50} defaultValue="pre-filled" />);
    expect(screen.getByText('10/50')).toBeInTheDocument();
  });

  it('reflects character count from controlled value', () => {
    render(<Textarea showCharCount maxLength={100} value="controlled" onChange={() => undefined} />);
    expect(screen.getByText('10/100')).toBeInTheDocument();
  });

  it('links counter to textarea via aria-describedby', () => {
    render(<Textarea showCharCount maxLength={100} />);
    const textarea = screen.getByRole('textbox');
    const counter = screen.getByText('0/100');
    expect(textarea.getAttribute('aria-describedby')).toContain(counter.id);
  });
});
