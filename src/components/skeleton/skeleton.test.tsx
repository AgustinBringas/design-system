import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders as a <div>', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton').tagName).toBe('DIV');
  });

  it('applies the pulse animation and base classes', () => {
    render(<Skeleton data-testid="skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toMatch(/animate-pulse/);
    expect(el.className).toMatch(/rounded-md/);
    expect(el.className).toMatch(/bg-muted/);
  });

  it('merges a custom className without losing base classes', () => {
    render(<Skeleton data-testid="skeleton" className="h-4 w-32" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toMatch(/animate-pulse/);
    expect(el.className).toMatch(/h-4/);
    expect(el.className).toMatch(/w-32/);
  });

  it('forwards ref to the DOM node', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes arbitrary HTML attributes to the root element', () => {
    render(<Skeleton data-testid="skeleton" aria-label="loading" />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-label', 'loading');
  });
});
