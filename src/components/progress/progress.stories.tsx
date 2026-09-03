import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { value: 40 },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: (args) => <Progress {...args} className="w-64" />,
};

export const Empty: Story = {
  args: { value: 0 },
  render: (args) => <Progress {...args} className="w-64" />,
};

export const Full: Story = {
  args: { value: 100 },
  render: (args) => <Progress {...args} className="w-64" />,
};

export const PointBuyBudget: Story = {
  name: 'Point buy budget (custom max)',
  args: { value: 18, max: 27 },
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Progress {...args} />
      <span className="text-xs text-muted-foreground">18 / 27 points spent</span>
    </div>
  ),
};
