import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm font-medium">Filter spells</p>
        <p className="text-sm text-muted-foreground">
          Filter controls (class, level, school) would live here.
        </p>
      </PopoverContent>
    </Popover>
  ),
};
