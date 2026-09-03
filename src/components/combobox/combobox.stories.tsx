import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Combobox, type ComboboxOption } from './combobox';

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const species: ComboboxOption[] = [
  { value: 'dragonborn', label: 'Dragonborn' },
  { value: 'dwarf', label: 'Dwarf' },
  { value: 'elf', label: 'Elf' },
  { value: 'gnome', label: 'Gnome' },
  { value: 'goliath', label: 'Goliath' },
  { value: 'halfling', label: 'Halfling' },
  { value: 'human', label: 'Human' },
  { value: 'orc', label: 'Orc' },
  { value: 'tiefling', label: 'Tiefling' },
];

const spells: ComboboxOption[] = [
  { value: 'fireball', label: 'Fireball', keywords: ['evocation', 'level 3'] },
  { value: 'magic-missile', label: 'Magic Missile', keywords: ['evocation', 'level 1'] },
  { value: 'mage-armor', label: 'Mage Armor', keywords: ['abjuration', 'level 1'] },
  { value: 'shield', label: 'Shield', keywords: ['abjuration', 'level 1'] },
  { value: 'counterspell', label: 'Counterspell', keywords: ['abjuration', 'level 3'] },
  { value: 'wish', label: 'Wish', keywords: ['conjuration', 'level 9'], disabled: true },
];

export const SingleSelect: Story = {
  name: 'Single select (species)',
  render: () => (
    <Combobox className="w-64" options={species} placeholder="Select a species" />
  ),
};

export const Controlled: Story = {
  name: 'Single select, controlled',
  render: () => {
    const [value, setValue] = React.useState('elf');
    return (
      <Combobox
        className="w-64"
        options={species}
        value={value}
        onValueChange={setValue}
        placeholder="Select a species"
      />
    );
  },
};

export const MultipleSelect: Story = {
  name: 'Multiple select (prepared spells)',
  render: () => {
    const [value, setValue] = React.useState<string[]>(['fireball']);
    return (
      <Combobox
        className="w-72"
        type="multiple"
        options={spells}
        value={value}
        onValueChange={setValue}
        placeholder="Prepare spells"
        searchPlaceholder="Search spells..."
      />
    );
  },
};

export const Disabled: Story = {
  render: () => <Combobox className="w-64" options={species} disabled />,
};

export const NoSearch: Story = {
  name: 'Without the search input (short filter lists)',
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    return (
      <Combobox
        className="w-auto min-w-[9rem]"
        type="multiple"
        options={species}
        value={value}
        onValueChange={setValue}
        placeholder="Species"
        hideSearch
      />
    );
  },
};
