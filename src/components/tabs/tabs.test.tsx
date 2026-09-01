import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return render(
    <Tabs defaultValue="account" {...props}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings</TabsContent>
      <TabsContent value="password">Password settings</TabsContent>
      <TabsContent value="billing">Billing settings</TabsContent>
    </Tabs>,
  );
}

describe('Tabs', () => {
  it('renders the default tab as active and shows its content', () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute(
      'data-state',
      'active',
    );
    expect(screen.getByText('Account settings')).toBeInTheDocument();
  });

  it('hides inactive tab content', () => {
    renderTabs();
    expect(screen.queryByText('Password settings')).not.toBeInTheDocument();
  });

  it('switches tabs when a trigger is clicked', async () => {
    const user = userEvent.setup();
    renderTabs();
    await user.click(screen.getByRole('tab', { name: 'Password' }));
    expect(screen.getByRole('tab', { name: 'Password' })).toHaveAttribute(
      'data-state',
      'active',
    );
    expect(screen.getByText('Password settings')).toBeInTheDocument();
    expect(screen.queryByText('Account settings')).not.toBeInTheDocument();
  });

  it('does not activate a disabled trigger', async () => {
    const user = userEvent.setup();
    renderTabs();
    await user.click(screen.getByRole('tab', { name: 'Billing' }));
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('disabled');
    expect(screen.queryByText('Billing settings')).not.toBeInTheDocument();
  });

  it('calls onValueChange when switching tabs', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs({ onValueChange });
    await user.click(screen.getByRole('tab', { name: 'Password' }));
    expect(onValueChange).toHaveBeenCalledWith('password');
  });
});

describe('TabsList', () => {
  it('applies base layout classes', () => {
    renderTabs();
    expect(screen.getByRole('tablist').className).toMatch(/inline-flex/);
  });
});

describe('TabsTrigger', () => {
  it('applies active-state classes when selected', () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: 'Account' }).className).toMatch(
      /data-\[state=active\]:bg-background/,
    );
  });
});

describe('TabsContent', () => {
  it('forwards a custom className', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a" className="custom-content">
          Content A
        </TabsContent>
      </Tabs>,
    );
    expect(screen.getByText('Content A').className).toMatch(/custom-content/);
  });
});
