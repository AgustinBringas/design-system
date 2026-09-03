import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const SingleCollapsible: Story = {
  name: 'Single, collapsible',
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="traits">
        <AccordionTrigger>Traits & Features</AccordionTrigger>
        <AccordionContent>Darkvision, Fey Ancestry, Trance.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="inventory">
        <AccordionTrigger>Inventory</AccordionTrigger>
        <AccordionContent>Longsword, shield, explorer&apos;s pack.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="spells">
        <AccordionTrigger>Spellbook</AccordionTrigger>
        <AccordionContent>Prestidigitation, Mage Armor, Magic Missile.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  name: 'Multiple items open',
  render: () => (
    <Accordion type="multiple" className="w-96" defaultValue={['traits', 'inventory']}>
      <AccordionItem value="traits">
        <AccordionTrigger>Traits & Features</AccordionTrigger>
        <AccordionContent>Darkvision, Fey Ancestry, Trance.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="inventory">
        <AccordionTrigger>Inventory</AccordionTrigger>
        <AccordionContent>Longsword, shield, explorer&apos;s pack.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
