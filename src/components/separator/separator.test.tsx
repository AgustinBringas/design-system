import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    render(<Separator />);
    const el = screen.getByRole('none');
    expect(el).toBeInTheDocument();
    expect(el.className).toMatch(/h-px/);
    expect(el.className).toMatch(/w-full/);
  });

  it('renders a vertical separator', () => {
    render(<Separator orientation="vertical" />);
    const el = document.querySelector('[data-orientation="vertical"]');
    expect(el).toBeInTheDocument();
    expect(el?.className).toMatch(/w-px/);
    expect(el?.className).toMatch(/h-full/);
  });

  it('is decorative by default (role="none")', () => {
    render(<Separator />);
    expect(screen.getByRole('none')).toBeInTheDocument();
  });

  it('has role="separator" when decorative is false', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('merges a custom className', () => {
    render(<Separator className="my-4" />);
    expect(screen.getByRole('none').className).toMatch(/my-4/);
  });

  it('forwards ref to the DOM node', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
