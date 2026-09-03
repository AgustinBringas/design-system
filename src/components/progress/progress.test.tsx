import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { Progress } from './progress';

describe('Progress', () => {
  it('renders with role="progressbar"', () => {
    render(<Progress value={50} aria-label="Points remaining" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('exposes the current value via aria-valuenow', () => {
    render(<Progress value={50} aria-label="Points remaining" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
  });

  it('translates the indicator based on value out of the default max of 100', () => {
    render(<Progress value={25} aria-label="Points remaining" />);
    const indicator = document.querySelector('[class*="bg-primary"]') as HTMLElement;
    expect(indicator.style.transform).toBe('translateX(-75%)');
  });

  it('translates the indicator correctly for a custom max', () => {
    render(<Progress value={9} max={27} aria-label="Points remaining" />);
    const indicator = document.querySelector('[class*="bg-primary"]') as HTMLElement;
    // 9/27 = 33.33...% filled -> translateX(-66.67%)
    expect(indicator.style.transform).toMatch(/translateX\(-66\.6\d*%\)/);
  });

  it('treats an undefined value as 0', () => {
    render(<Progress aria-label="Points remaining" />);
    const indicator = document.querySelector('[class*="bg-primary"]') as HTMLElement;
    expect(indicator.style.transform).toBe('translateX(-100%)');
  });

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={10} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('merges a custom className', () => {
    render(<Progress value={10} className="my-progress" />);
    expect(screen.getByRole('progressbar').className).toMatch(/my-progress/);
  });
});
