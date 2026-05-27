import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Search, Eye } from 'lucide-react';
import { Input } from './input';

describe('Input', () => {
  it('renders an <input> element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('forwards ref to the input DOM node', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes a placeholder through', () => {
    render(<Input placeholder="Search…" />);
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument();
  });

  it('calls onChange when the user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input disabled onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('merges a custom className without losing base classes', () => {
    render(<Input className="custom" />);
    const input = screen.getByRole('textbox');
    expect(input.classList.contains('custom')).toBe(true);
    expect(input.className).toMatch(/rounded-md/);
  });

  // ─── Size classes ─────────────────────────────────────────────────────────

  it.each([
    ['sm', /h-8/],
    ['md', /h-9/],
    ['lg', /h-10/],
  ] as const)('applies %s size classes', (size, pattern) => {
    render(<Input size={size} />);
    expect(screen.getByRole('textbox').className).toMatch(pattern);
  });

  // ─── Label ────────────────────────────────────────────────────────────────

  it('renders a label when label prop is provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor/id', () => {
    render(<Input label="Email" />);
    const label = screen.getByText('Email') as HTMLLabelElement;
    const input = screen.getByRole('textbox');
    expect(label.htmlFor).toBe(input.id);
  });

  it('uses the provided id for label association', () => {
    render(<Input label="Email" id="email-field" />);
    const label = screen.getByText('Email') as HTMLLabelElement;
    expect(label.htmlFor).toBe('email-field');
    expect(screen.getByRole('textbox').id).toBe('email-field');
  });

  // ─── Error state ─────────────────────────────────────────────────────────

  it('applies error border class when hasError is true', () => {
    render(<Input hasError />);
    expect(screen.getByRole('textbox').className).toMatch(/border-destructive/);
  });

  it('sets aria-invalid when hasError is true', () => {
    render(<Input hasError />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders errorMessage text', () => {
    render(<Input errorMessage="Required field." />);
    expect(screen.getByText('Required field.')).toBeInTheDocument();
  });

  it('infers hasError from errorMessage', () => {
    render(<Input errorMessage="Bad input." />);
    const input = screen.getByRole('textbox');
    expect(input.className).toMatch(/border-destructive/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('associates errorMessage with input via aria-describedby', () => {
    render(<Input errorMessage="Oops." />);
    const input = screen.getByRole('textbox');
    const errorEl = screen.getByRole('alert');
    expect(input.getAttribute('aria-describedby')).toBe(errorEl.id);
  });

  // ─── Icon slots ───────────────────────────────────────────────────────────

  it('renders leadingIcon', () => {
    render(<Input leadingIcon={<Search data-testid="lead-icon" />} />);
    expect(screen.getByTestId('lead-icon')).toBeInTheDocument();
  });

  it('renders trailingIcon', () => {
    render(<Input trailingIcon={<Eye data-testid="trail-icon" />} />);
    expect(screen.getByTestId('trail-icon')).toBeInTheDocument();
  });

  it('adds left padding when leadingIcon is present', () => {
    render(<Input leadingIcon={<Search />} size="md" />);
    expect(screen.getByRole('textbox').className).toMatch(/pl-9/);
  });

  it('adds right padding when trailingIcon is present', () => {
    render(<Input trailingIcon={<Eye />} size="md" />);
    expect(screen.getByRole('textbox').className).toMatch(/pr-9/);
  });
});
