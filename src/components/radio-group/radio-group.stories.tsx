import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './radio-group';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="point-buy" aria-label="Ability score method">
      <RadioGroupItem value="point-buy" label="Point buy" />
      <RadioGroupItem value="standard-array" label="Standard array" />
      <RadioGroupItem value="manual" label="Manual" />
    </RadioGroup>
  ),
};

export const WithDisabledOption: Story = {
  name: 'With a disabled option',
  render: () => (
    <RadioGroup defaultValue="option-a" aria-label="Starting equipment">
      <RadioGroupItem value="option-a" label="Option A — Explorer's Pack" />
      <RadioGroupItem value="option-b" label="Option B — 50 GP" />
      <RadioGroupItem value="option-c" label="Homebrew loadout" disabled />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="a" className="grid-flow-col gap-6" aria-label="Layout">
      <RadioGroupItem value="a" label="A" />
      <RadioGroupItem value="b" label="B" />
      <RadioGroupItem value="c" label="C" />
    </RadioGroup>
  ),
};
