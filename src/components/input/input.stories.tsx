import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Search, Eye, Lock, AlertCircle } from 'lucide-react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Placeholder text…',
    size: 'md',
    disabled: false,
    hasError: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled:     { control: 'boolean' },
    hasError:     { control: 'boolean' },
    label:        { control: 'text' },
    errorMessage: { control: 'text' },
    placeholder:  { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  name: 'All Sizes',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium (default)" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};

// ─── States ───────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    label: 'Username',
    placeholder: 'disabled-user',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'API Key',
    value: 'sk-••••••••••••••••••••••••••••••••',
    readOnly: true,
  },
};

export const WithError: Story = {
  name: 'Error State',
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
    defaultValue: 'not-an-email',
    errorMessage: 'Please enter a valid email address.',
  },
};

export const AllStates: Story = {
  name: 'All States',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Default"   placeholder="Enter value…" />
      <Input label="Disabled"  placeholder="Cannot edit"  disabled />
      <Input label="Read only" value="read-only value"    readOnly />
      <Input
        label="Error"
        defaultValue="bad input"
        errorMessage="This field is required."
      />
    </div>
  ),
};

// ─── Icon slots ───────────────────────────────────────────────────────────────

export const WithLeadingIcon: Story = {
  name: 'With Leading Icon',
  args: {
    label: 'Search',
    placeholder: 'Search…',
    leadingIcon: <Search />,
  },
};

export const WithTrailingIcon: Story = {
  name: 'With Trailing Icon',
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    trailingIcon: <Eye />,
  },
};

export const WithBothIcons: Story = {
  name: 'Leading + Trailing Icons',
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    leadingIcon: <Mail />,
    trailingIcon: <AlertCircle />,
  },
};

export const PasswordField: Story = {
  name: 'Password Field',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        leadingIcon={<Lock />}
        trailingIcon={<Eye />}
      />
      <Input
        label="Password (error)"
        type="password"
        defaultValue="short"
        leadingIcon={<Lock />}
        errorMessage="Password must be at least 8 characters."
      />
    </div>
  ),
};
