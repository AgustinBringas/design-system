import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm">Above the line</p>
      <Separator className="my-4" />
      <p className="text-sm">Below the line</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4 text-sm">
      <span>Home</span>
      <Separator orientation="vertical" />
      <span>About</span>
      <Separator orientation="vertical" />
      <span>Contact</span>
    </div>
  ),
};

export const InCard: Story = {
  name: 'In a card',
  render: () => (
    <div className="w-72 rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium">Profile</p>
      <Separator className="my-3" />
      <div className="flex flex-col gap-1 text-sm text-muted">
        <span>Alex Brown</span>
        <span>alex@example.com</span>
      </div>
    </div>
  ),
};
