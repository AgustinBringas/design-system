import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders a <button> element by default', () => {
    render(<Button>native</Button>);
    expect(screen.getByRole('button').tagName).toBe('BUTTON');
  });

  it('forwards ref to the DOM node', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges a custom className without losing variant classes', () => {
    render(<Button className="custom">styled</Button>);
    const el = screen.getByRole('button');
    expect(el.classList.contains('custom')).toBe(true);
    expect(el.className).toMatch(/bg-primary/);
  });

  it('passes arbitrary HTML attributes to the root element', () => {
    render(<Button data-testid="btn" aria-label="save">Save</Button>);
    expect(screen.getByTestId('btn').getAttribute('aria-label')).toBe('save');
  });

  // ─── Variant / size classes ────────────────────────────────────────────────

  it.each([
    ['default',     /bg-primary/],
    ['destructive', /bg-destructive/],
    ['outline',     /border/],
    ['secondary',   /bg-secondary/],
    ['ghost',       /hover:bg-accent/],
    ['link',        /underline-offset-4/],
  ] as const)('applies %s variant classes', (variant, pattern) => {
    render(<Button variant={variant}>v</Button>);
    expect(screen.getByRole('button').className).toMatch(pattern);
  });

  it.each([
    ['sm',   /h-8/],
    ['md',   /h-9/],
    ['lg',   /h-10/],
    ['icon', /w-9/],
  ] as const)('applies %s size classes', (size, pattern) => {
    render(<Button size={size}>s</Button>);
    expect(screen.getByRole('button').className).toMatch(pattern);
  });

  // ─── Disabled state ────────────────────────────────────────────────────────

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>no-op</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>no-op</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  // ─── Loading state ─────────────────────────────────────────────────────────

  it('disables the button when isLoading is true', () => {
    render(<Button isLoading>Saving</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('sets aria-busy when isLoading is true', () => {
    render(<Button isLoading>Saving</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders a spinner when isLoading is true', () => {
    render(<Button isLoading>Saving</Button>);
    // Loader2 renders an svg; aria-hidden hides it from the accessible tree
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not render a spinner when isLoading is false', () => {
    render(<Button>Normal</Button>);
    expect(screen.getByRole('button').querySelector('svg')).toBeNull();
  });

  // ─── asChild ──────────────────────────────────────────────────────────────

  it('renders the child element instead of <button> when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>,
    );
    const el = screen.getByRole('link', { name: 'Home' });
    expect(el.tagName).toBe('A');
  });

  it('merges button variant classes onto the child element', () => {
    render(
      <Button asChild variant="outline">
        <a href="/">Link</a>
      </Button>,
    );
    const el = screen.getByRole('link');
    expect(el.className).toMatch(/border/);
  });

  it('does not render a spinner when asChild is true and isLoading is true', () => {
    render(
      <Button asChild isLoading>
        <a href="/">Link</a>
      </Button>,
    );
    const el = screen.getByRole('link');
    expect(el.querySelector('svg')).toBeNull();
  });

  it('forwards a ref when asChild is true', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Button asChild ref={ref}>
        <a href="/">ref link</a>
      </Button>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
