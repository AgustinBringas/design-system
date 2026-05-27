import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

// ─── Card ─────────────────────────────────────────────────────────────────────

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders as a <div> by default', () => {
    render(<Card data-testid="card">content</Card>);
    expect(screen.getByTestId('card').tagName).toBe('DIV');
  });

  it('forwards ref to the DOM node', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Card ref={ref}>ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a custom className without losing variant classes', () => {
    render(<Card className="custom-class" data-testid="card">x</Card>);
    const el = screen.getByTestId('card');
    expect(el.className).toMatch(/rounded-lg/);
    expect(el.className).toMatch(/custom-class/);
  });

  it('passes arbitrary HTML attributes to the root element', () => {
    render(<Card data-testid="card" aria-label="my card">x</Card>);
    expect(screen.getByTestId('card')).toHaveAttribute('aria-label', 'my card');
  });

  // ─── Variants ───────────────────────────────────────────────────────────────

  it('applies default variant classes', () => {
    render(<Card data-testid="card">x</Card>);
    expect(screen.getByTestId('card').className).toMatch(/border-border/);
    expect(screen.getByTestId('card').className).toMatch(/shadow-sm/);
  });

  it('applies elevated variant classes', () => {
    render(<Card variant="elevated" data-testid="card">x</Card>);
    expect(screen.getByTestId('card').className).toMatch(/shadow-md/);
  });

  it('applies ghost variant classes', () => {
    render(<Card variant="ghost" data-testid="card">x</Card>);
    expect(screen.getByTestId('card').className).toMatch(/bg-transparent/);
  });

  // ─── asChild ────────────────────────────────────────────────────────────────

  it('renders the child element instead of <div> when asChild is true', () => {
    render(
      <Card asChild>
        <a href="/link">Link card</a>
      </Card>,
    );
    expect(screen.getByRole('link', { name: 'Link card' }).tagName).toBe('A');
  });

  it('merges card variant classes onto the child element', () => {
    render(
      <Card asChild variant="elevated">
        <a href="/link">Link card</a>
      </Card>,
    );
    expect(screen.getByRole('link').className).toMatch(/rounded-lg/);
    expect(screen.getByRole('link').className).toMatch(/shadow-md/);
  });

  it('forwards a ref when asChild is true', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Card asChild ref={ref}>
        <a href="/link">Link card</a>
      </Card>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});

// ─── CardHeader ───────────────────────────────────────────────────────────────

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>header</CardHeader>);
    expect(screen.getByText('header')).toBeInTheDocument();
  });

  it('renders as a <div>', () => {
    render(<CardHeader data-testid="h">x</CardHeader>);
    expect(screen.getByTestId('h').tagName).toBe('DIV');
  });

  it('applies base layout classes', () => {
    render(<CardHeader data-testid="h">x</CardHeader>);
    expect(screen.getByTestId('h').className).toMatch(/flex/);
    expect(screen.getByTestId('h').className).toMatch(/flex-col/);
    expect(screen.getByTestId('h').className).toMatch(/p-6/);
  });
});

// ─── CardTitle ────────────────────────────────────────────────────────────────

describe('CardTitle', () => {
  it('renders children', () => {
    render(<CardTitle>My title</CardTitle>);
    expect(screen.getByText('My title')).toBeInTheDocument();
  });

  it('renders as an <h3>', () => {
    render(<CardTitle>title</CardTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('applies semibold class', () => {
    render(<CardTitle data-testid="t">title</CardTitle>);
    expect(screen.getByTestId('t').className).toMatch(/font-semibold/);
  });
});

// ─── CardDescription ─────────────────────────────────────────────────────────

describe('CardDescription', () => {
  it('renders children', () => {
    render(<CardDescription>desc</CardDescription>);
    expect(screen.getByText('desc')).toBeInTheDocument();
  });

  it('renders as a <p>', () => {
    render(<CardDescription data-testid="d">desc</CardDescription>);
    expect(screen.getByTestId('d').tagName).toBe('P');
  });

  it('applies muted text class', () => {
    render(<CardDescription data-testid="d">desc</CardDescription>);
    expect(screen.getByTestId('d').className).toMatch(/text-muted/);
  });
});

// ─── CardContent ──────────────────────────────────────────────────────────────

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>content</CardContent>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies padding classes', () => {
    render(<CardContent data-testid="c">x</CardContent>);
    expect(screen.getByTestId('c').className).toMatch(/p-6/);
  });
});

// ─── CardFooter ───────────────────────────────────────────────────────────────

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>footer</CardFooter>);
    expect(screen.getByText('footer')).toBeInTheDocument();
  });

  it('applies flex layout classes', () => {
    render(<CardFooter data-testid="f">x</CardFooter>);
    expect(screen.getByTestId('f').className).toMatch(/flex/);
    expect(screen.getByTestId('f').className).toMatch(/items-center/);
  });
});
