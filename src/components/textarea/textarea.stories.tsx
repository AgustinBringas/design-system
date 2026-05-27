import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    placeholder: 'Write something…',
    size: 'md',
    resize: 'vertical',
    disabled: false,
    hasError: false,
    showCharCount: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    disabled:      { control: 'boolean' },
    hasError:      { control: 'boolean' },
    showCharCount: { control: 'boolean' },
    label:         { control: 'text' },
    errorMessage:  { control: 'text' },
    placeholder:   { control: 'text' },
    maxLength:     { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us a little about yourself…',
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  name: 'All Sizes',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <Textarea size="sm" label="Small"  placeholder="Small textarea" />
      <Textarea size="md" label="Medium" placeholder="Medium textarea (default)" />
      <Textarea size="lg" label="Large"  placeholder="Large textarea" />
    </div>
  ),
};

// ─── States ───────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    label: 'Notes',
    defaultValue: 'This field cannot be edited.',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Terms',
    value: 'By using this service you agree to our terms and conditions…',
    readOnly: true,
    resize: 'none',
  },
};

export const WithError: Story = {
  name: 'Error State',
  args: {
    label: 'Message',
    defaultValue: 'hi',
    errorMessage: 'Message must be at least 20 characters.',
  },
};

// ─── Character count ──────────────────────────────────────────────────────────

export const WithCharCount: Story = {
  name: 'Character Count',
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself…',
    showCharCount: true,
    maxLength: 200,
  },
};

export const CharCountAtLimit: Story = {
  name: 'Character Count — At Limit',
  args: {
    label: 'Tweet',
    showCharCount: true,
    maxLength: 280,
    defaultValue:
      'This is exactly at the character limit to demonstrate how the counter turns destructive when you reach the maximum allowed length for this input field, which helps users understand they cannot type more characters. This message fills up the rest.',
  },
};

export const CharCountNoLimit: Story = {
  name: 'Character Count — No Max',
  args: {
    label: 'Notes',
    placeholder: 'Any length…',
    showCharCount: true,
  },
};

// ─── Resize modes ─────────────────────────────────────────────────────────────

export const ResizeModes: Story = {
  name: 'Resize Modes',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <Textarea resize="none"       label="resize: none"       placeholder="Cannot resize" />
      <Textarea resize="vertical"   label="resize: vertical"   placeholder="Vertical only (default)" />
      <Textarea resize="horizontal" label="resize: horizontal" placeholder="Horizontal only" />
      <Textarea resize="both"       label="resize: both"       placeholder="Both directions" />
    </div>
  ),
};

// ─── Combined ─────────────────────────────────────────────────────────────────

export const FullForm: Story = {
  name: 'Full Feature Demo',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <Textarea
        label="Support message"
        placeholder="Describe your issue in detail…"
        showCharCount
        maxLength={500}
        resize="vertical"
      />
      <Textarea
        label="Error example"
        defaultValue="Too short."
        errorMessage="Please provide at least 30 characters so we can help you better."
        showCharCount
        maxLength={500}
      />
    </div>
  ),
};
