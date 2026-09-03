import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { label: 'Accept terms and conditions' },
};

export const Checked: Story = {
  args: { label: 'Subscribed to newsletter', defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { label: 'Select all', checked: 'indeterminate' },
};

export const Disabled: Story = {
  args: { label: 'Unavailable option', disabled: true },
};

export const WithoutLabel: Story = {
  args: { 'aria-label': 'Standalone checkbox' },
};

export const List: Story = {
  name: 'Skill proficiency list',
  render: () => (
    <div className="flex flex-col gap-3">
      {['Arcana', 'History', 'Insight', 'Religion'].map((skill) => (
        <Checkbox key={skill} label={skill} />
      ))}
    </div>
  ),
};
