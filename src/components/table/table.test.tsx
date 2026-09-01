import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

function renderTable() {
  return render(
    <Table data-testid="table">
      <TableCaption>A list of invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell>$10</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>$10</TableCell>
        </TableRow>
      </TableFooter>
    </Table>,
  );
}

describe('Table', () => {
  it('renders a <table> wrapped in a scroll container', () => {
    renderTable();
    const table = screen.getByRole('table');
    expect(table.tagName).toBe('TABLE');
    expect(table.parentElement?.className).toMatch(/overflow-auto/);
  });

  it('renders the full table structure', () => {
    renderTable();
    expect(screen.getByText('A list of invoices').tagName).toBe('CAPTION');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Total' })).toHaveLength(1);
  });

  it('forwards ref to the <table> element', () => {
    const ref = React.createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it('merges a custom className onto the table element', () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table').className).toMatch(/custom-table/);
  });
});

describe('TableHeader', () => {
  it('renders a <thead>', () => {
    render(
      <table>
        <TableHeader data-testid="thead">
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
      </table>,
    );
    expect(screen.getByTestId('thead').tagName).toBe('THEAD');
  });
});

describe('TableRow', () => {
  it('applies hover and border classes', () => {
    render(
      <table>
        <tbody>
          <TableRow data-testid="row">
            <TableCell>x</TableCell>
          </TableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('row').className).toMatch(/hover:bg-muted/);
  });
});

describe('TableHead', () => {
  it('renders a <th> with heading classes', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead data-testid="head">Name</TableHead>
          </tr>
        </thead>
      </table>,
    );
    const head = screen.getByTestId('head');
    expect(head.tagName).toBe('TH');
    expect(head.className).toMatch(/text-muted-foreground/);
  });
});

describe('TableCell', () => {
  it('renders a <td>', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell data-testid="cell">x</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('cell').tagName).toBe('TD');
  });
});

describe('TableFooter', () => {
  it('renders a <tfoot>', () => {
    render(
      <table>
        <TableFooter data-testid="tfoot">
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </table>,
    );
    expect(screen.getByTestId('tfoot').tagName).toBe('TFOOT');
  });
});

describe('TableCaption', () => {
  it('renders a <caption>', () => {
    render(
      <table>
        <TableCaption data-testid="caption">Caption text</TableCaption>
      </table>,
    );
    expect(screen.getByTestId('caption').tagName).toBe('CAPTION');
  });
});
