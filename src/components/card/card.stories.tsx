import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Input } from '../input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'ghost'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Card body content. Add any elements here.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
  args: { variant: 'default' },
};

// ─── Elevated ─────────────────────────────────────────────────────────────────

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-80">
      <CardHeader>
        <CardTitle>Elevated card</CardTitle>
        <CardDescription>No border — uses shadow depth instead.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Useful for layered surfaces or hero sections.</p>
      </CardContent>
    </Card>
  ),
};

// ─── Ghost ────────────────────────────────────────────────────────────────────

export const Ghost: Story = {
  render: () => (
    <div className="bg-muted p-8 rounded-lg">
      <Card variant="ghost" className="w-80">
        <CardHeader>
          <CardTitle>Ghost card</CardTitle>
          <CardDescription>Transparent — blends into its background.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Good for grouping content on coloured surfaces.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// ─── Clickable (asChild) ──────────────────────────────────────────────────────

export const Clickable: Story = {
  name: 'Clickable (asChild)',
  render: () => (
    <Card
      asChild
      className="w-80 cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <a href="#link">
        <CardHeader>
          <CardTitle>Clickable card</CardTitle>
          <CardDescription>The whole card is a link via asChild.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Uses Radix Slot to merge card styles onto an &lt;a&gt;.</p>
        </CardContent>
      </a>
    </Card>
  ),
};

// ─── Profile card ─────────────────────────────────────────────────────────────

export const Profile: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader className="items-center text-center">
        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
          AB
        </div>
        <CardTitle className="mt-2">Alex Brown</CardTitle>
        <CardDescription>Senior Engineer · Platform</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          Builds infrastructure that quietly powers everything else.
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button size="sm">View profile</Button>
      </CardFooter>
    </Card>
  ),
};

// ─── Stat card ────────────────────────────────────────────────────────────────

export const Stat: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Total users',    value: '12,430', delta: '+8%' },
        { label: 'Active today',   value: '3,821',  delta: '+2%' },
        { label: 'Revenue (MRR)',  value: '$48,200', delta: '+14%' },
      ].map(({ label, value, delta }) => (
        <Card key={label} className="min-w-40">
          <CardHeader className="pb-2">
            <CardDescription>{label}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-success mt-1">{delta} vs last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// ─── With form ────────────────────────────────────────────────────────────────

export const WithForm: Story = {
  name: 'With Form',
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Fill in your details to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Input label="Name" placeholder="Your name" />
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button className="w-full">Create account</Button>
      </CardFooter>
    </Card>
  ),
};
