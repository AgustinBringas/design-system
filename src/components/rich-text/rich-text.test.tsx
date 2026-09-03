import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { RichText } from './rich-text';

describe('RichText', () => {
  it('renders plain text as a paragraph', () => {
    render(<RichText>Just plain text.</RichText>);
    expect(screen.getByText('Just plain text.').tagName).toBe('P');
  });

  it('renders **bold** as strong', () => {
    render(<RichText>This is **important**.</RichText>);
    expect(screen.getByText('important').tagName).toBe('STRONG');
  });

  it('renders *italic* as em', () => {
    render(<RichText>This is *subtle*.</RichText>);
    expect(screen.getByText('subtle').tagName).toBe('EM');
  });

  it('renders a blockquote', () => {
    render(<RichText>{'> A quoted line.'}</RichText>);
    expect(screen.getByText('A quoted line.').closest('blockquote')).toBeInTheDocument();
  });

  it('renders headings', () => {
    render(<RichText>{'#### A Heading'}</RichText>);
    expect(
      screen.getByRole('heading', { level: 4, name: 'A Heading' }),
    ).toBeInTheDocument();
  });

  it('renders an unordered list', () => {
    render(<RichText>{'- One\n- Two'}</RichText>);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders a GFM table with a scrollable wrapper', () => {
    const table = '|Spell|School|\n|---|---|\n|Light|Evocation|';
    render(<RichText>{table}</RichText>);
    expect(screen.getByRole('columnheader', { name: 'Spell' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Light' })).toBeInTheDocument();
    const wrapper = screen.getByRole('table').parentElement;
    expect(wrapper?.className).toMatch(/overflow-x-auto/);
  });

  it('separates paragraphs on a blank line', () => {
    render(<RichText>{'First paragraph.\n\nSecond paragraph.'}</RichText>);
    expect(screen.getByText('First paragraph.').tagName).toBe('P');
    expect(screen.getByText('Second paragraph.').tagName).toBe('P');
  });

  it('forwards ref to the wrapper div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RichText ref={ref}>Text</RichText>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a custom className on the wrapper', () => {
    render(<RichText className="text-muted-foreground">Text</RichText>);
    expect(screen.getByText('Text').parentElement?.className).toMatch(
      /text-muted-foreground/,
    );
  });
});
