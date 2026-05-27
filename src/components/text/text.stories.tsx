import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './text';

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['heading', 'body', 'label', 'code', 'caption'],
      description: 'Visual and semantic role of the text.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
      description: 'Font size mapped to Tailwind text-* utilities.',
    },
    weight: {
      control: 'select',
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight.',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment.',
    },
    truncate: {
      control: 'boolean',
      description: 'Clamps text to one line with an ellipsis.',
    },
    asChild: {
      control: 'boolean',
      description:
        'Merge props onto the child element instead of rendering a <p>.',
    },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const AsHeading: Story = {
  name: 'As Heading (asChild)',
  args: {
    asChild: true,
    variant: 'heading',
    size: '3xl',
    children: <h1>Design System Heading</h1>,
  },
};

export const BodyCopy: Story = {
  args: {
    variant: 'body',
    size: 'md',
    children:
      'Body copy is the workhorse of long-form content. It should be easy to scan, well-spaced, and typeset at a comfortable reading size.',
  },
};

export const LabelText: Story = {
  args: {
    variant: 'label',
    size: 'sm',
    children: 'Form label',
  },
};

export const CodeSnippet: Story = {
  args: {
    variant: 'code',
    size: 'sm',
    children: 'npm install @ds/ui',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    size: 'xs',
    children: 'Figure 1 — Token-driven design meets component composability.',
  },
};

// ─── Showcase ──────────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <Text variant="heading" size="2xl">Heading variant</Text>
      <Text variant="body">Body variant — default reading text.</Text>
      <Text variant="label" size="sm">Label variant</Text>
      <Text variant="code" size="sm">code variant</Text>
      <Text variant="caption" size="xs">Caption variant — supporting copy.</Text>
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const).map(
        (size) => (
          <Text key={size} size={size}>
            size="{size}" — The quick brown fox
          </Text>
        ),
      )}
    </div>
  ),
};

export const AllWeights: Story = {
  name: 'All Weights',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      {(['light', 'normal', 'medium', 'semibold', 'bold'] as const).map(
        (weight) => (
          <Text key={weight} weight={weight}>
            weight="{weight}" — The quick brown fox
          </Text>
        ),
      )}
    </div>
  ),
};

export const Truncated: Story = {
  args: {
    truncate: true,
    children:
      'This is a very long string that should be truncated with an ellipsis because it overflows the container width.',
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};
