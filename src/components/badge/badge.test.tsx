import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>React</Badge>);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders a <span> by default', () => {
    render(<Badge>label</Badge>);
    expect(screen.getByText('label').tagName).toBe('SPAN');
  });

  it('renders a <button> when onClick is provided', () => {
    render(<Badge onClick={vi.fn()}>clickable</Badge>);
    expect(screen.getByRole('button', { name: 'clickable' })).toBeInTheDocument();
  });

  it('has type="button" when rendered as a button', () => {
    render(<Badge onClick={vi.fn()}>btn</Badge>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('forwards ref to the span element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Badge ref={ref}>ref</Badge>);
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('forwards ref to the button element when interactive', () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <Badge ref={ref} onClick={vi.fn()}>
        ref
      </Badge>,
    );
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('merges a custom className without losing variant classes', () => {
    render(<Badge className="custom">styled</Badge>);
    const el = screen.getByText('styled');
    expect(el.classList.contains('custom')).toBe(true);
    expect(el.className).toMatch(/bg-primary/);
  });

  it('passes arbitrary HTML attributes to the root element', () => {
    render(
      <Badge data-testid="chip" aria-label="tag">
        TypeScript
      </Badge>,
    );
    expect(screen.getByTestId('chip').getAttribute('aria-label')).toBe('tag');
  });

  // ─── Variant classes ───────────────────────────────────────────────────────

  it.each([
    ['default', /bg-primary\/10/],
    ['secondary', /bg-muted\/50/],
    ['outline', /bg-transparent/],
  ] as const)('applies %s variant classes', (variant, pattern) => {
    render(<Badge variant={variant}>v</Badge>);
    expect(screen.getByText('v').className).toMatch(pattern);
  });

  // ─── Size classes ──────────────────────────────────────────────────────────

  it.each([
    ['sm', /text-xs/],
    ['md', /text-sm/],
    ['lg', /text-sm/],
  ] as const)('applies %s size classes', (size, pattern) => {
    render(<Badge size={size}>s</Badge>);
    expect(screen.getByText('s').className).toMatch(pattern);
  });

  it('applies sm padding', () => {
    render(<Badge size="sm">s</Badge>);
    expect(screen.getByText('s').className).toMatch(/px-2\.5/);
  });

  it('applies lg padding', () => {
    render(<Badge size="lg">s</Badge>);
    expect(screen.getByText('s').className).toMatch(/px-4/);
  });

  // ─── Interactive behaviour ─────────────────────────────────────────────────

  it('calls onClick when the button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>click me</Badge>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Badge onClick={onClick} disabled>
        disabled
      </Badge>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies interactive classes when onClick is provided', () => {
    render(<Badge onClick={vi.fn()}>interactive</Badge>);
    expect(screen.getByRole('button').className).toMatch(/cursor-pointer/);
  });

  it('does not apply interactive classes when onClick is absent', () => {
    render(<Badge>static</Badge>);
    expect(screen.getByText('static').className).not.toMatch(/cursor-pointer/);
  });

  it('applies compound hover class for default interactive variant', () => {
    render(
      <Badge variant="default" onClick={vi.fn()}>
        hover
      </Badge>,
    );
    expect(screen.getByRole('button').className).toMatch(/hover:bg-primary\/20/);
  });
});
