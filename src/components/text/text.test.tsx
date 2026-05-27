import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './text';

describe('Text', () => {
  it('renders children', () => {
    render(<Text>Hello world</Text>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders a <p> by default', () => {
    render(<Text>paragraph</Text>);
    expect(screen.getByText('paragraph').tagName).toBe('P');
  });

  it('forwards ref to the DOM node', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<Text ref={ref}>ref check</Text>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it('merges a custom className without losing variant classes', () => {
    render(<Text className="custom-class">styled</Text>);
    const el = screen.getByText('styled');
    expect(el.classList.contains('custom-class')).toBe(true);
    // default variant class should still be present
    expect(el.className).toMatch(/font-normal/);
  });

  it('applies variant classes', () => {
    render(<Text variant="heading">heading</Text>);
    const el = screen.getByText('heading');
    expect(el.className).toMatch(/tracking-tight/);
    // heading + default weight=normal → compound promotes to font-semibold
    expect(el.className).toMatch(/font-semibold/);
    expect(el.className).not.toMatch(/font-normal/);
  });

  it('applies size classes', () => {
    render(<Text size="xl">big</Text>);
    expect(screen.getByText('big').className).toMatch(/text-xl/);
  });

  it('applies weight classes', () => {
    render(<Text weight="bold">bold</Text>);
    expect(screen.getByText('bold').className).toMatch(/font-bold/);
  });

  it('applies align classes', () => {
    render(<Text align="center">centered</Text>);
    expect(screen.getByText('centered').className).toMatch(/text-center/);
  });

  it('applies truncate class when truncate is true', () => {
    render(<Text truncate>long text</Text>);
    expect(screen.getByText('long text').className).toMatch(/truncate/);
  });

  it('does not apply truncate class by default', () => {
    render(<Text>normal</Text>);
    expect(screen.getByText('normal').className).not.toMatch(/truncate/);
  });

  describe('asChild', () => {
    it('renders the child element instead of <p>', () => {
      render(
        <Text asChild>
          <h1>Title</h1>
        </Text>,
      );
      const el = screen.getByText('Title');
      expect(el.tagName).toBe('H1');
    });

    it('merges Text variant classes onto the child element', () => {
      render(
        <Text asChild variant="heading" size="2xl">
          <h2>Section</h2>
        </Text>,
      );
      const el = screen.getByText('Section');
      expect(el.tagName).toBe('H2');
      expect(el.className).toMatch(/text-2xl/);
      // heading + default weight=normal → compound promotes to font-semibold
      expect(el.className).toMatch(/font-semibold/);
      expect(el.className).not.toMatch(/font-normal/);
    });

    it('merges child className with Text variant classes', () => {
      render(
        <Text asChild className="extra">
          <span>span text</span>
        </Text>,
      );
      const el = screen.getByText('span text');
      expect(el.tagName).toBe('SPAN');
      expect(el.classList.contains('extra')).toBe(true);
    });

    it('forwards a ref when asChild is true', () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(
        <Text asChild ref={ref}>
          <span>ref span</span>
        </Text>,
      );
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('code variant compound behaviour', () => {
    it('resets weight to normal for code variant regardless of weight prop', () => {
      render(
        <Text variant="code" weight="bold">
          code bold
        </Text>,
      );
      const el = screen.getByText('code bold');
      // compound variant overrides bold → normal
      expect(el.className).not.toMatch(/font-bold/);
      expect(el.className).toMatch(/font-normal/);
    });
  });

  it('passes additional HTML attributes to the root element', () => {
    render(
      <Text data-testid="custom" aria-label="description">
        attr
      </Text>,
    );
    const el = screen.getByTestId('custom');
    expect(el.getAttribute('aria-label')).toBe('description');
  });
});
