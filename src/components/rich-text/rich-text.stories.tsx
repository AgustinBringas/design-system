import type { Meta, StoryObj } from '@storybook/react';
import { RichText } from './rich-text';

const meta: Meta<typeof RichText> = {
  title: 'Typography/RichText',
  component: RichText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Renders freeform markdown/GFM text — bold, italic, headings, lists, blockquotes, and tables. Font size and color are left to the caller via className.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RichText>;

export const Default: Story = {
  args: {
    children:
      'You gain **proficiency** in the Insight, Perception, or Survival skill. This is a *lightly* emphasized aside.',
  },
};

export const WithHeadingsAndLists: Story = {
  args: {
    children: `#### Spellcasting

You know three cantrips of your choice.

- *Light*
- *Mage Hand*
- *Ray of Frost*

> Whenever you finish a Long Rest, you can replace one of your cantrips with another.`,
  },
};

export const WithTable: Story = {
  args: {
    children: `In the Special column, *C* means the spell requires Concentration, *R* means it's a Ritual, and *M* means it requires a Material component.

Table: Cantrips (Level 0 Cleric Spells)

|Spell|School|Special|
|---|---|---|
|Guidance|Divination|C|
|Light|Evocation|—|
|Sacred Flame|Evocation|—|`,
  },
};
