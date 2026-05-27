import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const meta: Meta<typeof TooltipContent> = {
  title: 'Components/Tooltip',
  component: TooltipContent,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TooltipContent>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Quick tip about this button</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: Story = {
  name: 'All sides',
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-32">
              {side.charAt(0).toUpperCase() + side.slice(1)}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const WithLongContent: Story = {
  name: 'Long content',
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">More info</Button>
      </TooltipTrigger>
      <TooltipContent>
        This tooltip contains a longer description that wraps across multiple lines to demonstrate the max-width capping behaviour.
      </TooltipContent>
    </Tooltip>
  ),
};

export const OnIcon: Story = {
  name: 'On an icon button',
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Settings</TooltipContent>
    </Tooltip>
  ),
};
