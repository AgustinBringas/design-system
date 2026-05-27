import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Input } from '../input';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

const meta: Meta<typeof DrawerContent> = {
  title: 'Components/Drawer',
  component: DrawerContent,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    side: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DrawerContent>;

// ─── Default (right) ──────────────────────────────────────────────────────────

export const Right: Story = {
  name: 'Right (default)',
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open right drawer</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Manage your account preferences.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm text-muted-foreground">Drawer body content goes here.</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button>Save changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  args: { side: 'right' },
};

// ─── Left ─────────────────────────────────────────────────────────────────────

export const Left: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open left drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Browse your workspace.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <nav className="flex flex-col gap-1">
            {['Dashboard', 'Projects', 'Team', 'Settings'].map((item) => (
              <Button key={item} variant="ghost" className="justify-start">
                {item}
              </Button>
            ))}
          </nav>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

// ─── Top ──────────────────────────────────────────────────────────────────────

export const Top: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open top drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="top">
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>You have 3 unread notifications.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="max-h-48">
          <p className="text-sm text-muted-foreground">Notification list goes here.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

// ─── Bottom ───────────────────────────────────────────────────────────────────

export const Bottom: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open bottom drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="bottom">
        <DrawerHeader>
          <DrawerTitle>Share</DrawerTitle>
          <DrawerDescription>Share this item with others.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="max-h-48">
          <p className="text-sm text-muted-foreground">Share options go here.</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

// ─── With form ────────────────────────────────────────────────────────────────

export const WithForm: Story = {
  name: 'With Form',
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Edit profile</Button>
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Update your profile details. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div className="flex flex-col gap-4">
            <Input label="Name" placeholder="Your name" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Role" placeholder="Your role" />
          </div>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

// ─── Without close button ─────────────────────────────────────────────────────

export const NoCloseButton: Story = {
  name: 'No Close Button',
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open (no X button)</Button>
      </DrawerTrigger>
      <DrawerContent side="right" hideCloseButton>
        <DrawerHeader>
          <DrawerTitle>Controlled close</DrawerTitle>
          <DrawerDescription>Use the button below to close this drawer.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm text-muted-foreground">
            The X button is hidden. Only the Cancel button closes this drawer.
          </p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
