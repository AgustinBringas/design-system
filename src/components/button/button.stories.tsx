import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Trash2, ArrowRight, Plus } from 'lucide-react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'default',
    size: 'md',
    disabled: false,
    isLoading: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style of the button.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Size variant.',
    },
    disabled: { control: 'boolean' },
    isLoading: {
      control: 'boolean',
      description: 'Shows a spinner and disables interaction.',
    },
    asChild: {
      control: 'boolean',
      description: 'Render children as the root element (polymorphic).',
    },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add item">
        <Plus />
      </Button>
    </div>
  ),
};

// ─── States ───────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map(
        (variant) => (
          <Button key={variant} variant={variant} disabled>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ),
      )}
    </div>
  ),
};

export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button isLoading>Saving…</Button>
      <Button variant="outline" isLoading>Loading</Button>
      <Button variant="destructive" isLoading>Deleting</Button>
    </div>
  ),
};

// ─── With icons ───────────────────────────────────────────────────────────────

export const WithLeadingIcon: Story = {
  name: 'With Leading Icon',
  args: {
    children: (
      <>
        <Mail />
        Send email
      </>
    ),
  },
};

export const WithTrailingIcon: Story = {
  name: 'With Trailing Icon',
  args: {
    children: (
      <>
        Continue
        <ArrowRight />
      </>
    ),
  },
};

export const IconOnly: Story = {
  name: 'Icon Only',
  args: {
    size: 'icon',
    variant: 'outline',
    'aria-label': 'Delete item',
    children: <Trash2 />,
  },
};

// ─── Polymorphic ──────────────────────────────────────────────────────────────

export const AsAnchor: Story = {
  name: 'As <a> (asChild)',
  parameters: { controls: { disable: true } },
  render: () => (
    <Button asChild variant="link">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        Open link
      </a>
    </Button>
  ),
};
