import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { ToastAction } from './toast';
import { Toaster } from './toaster';
import { toast } from './use-toast';

const meta: Meta = {
  title: 'Components/Toaster',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj;

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast({
          title: 'Event created',
          description: 'Your event has been scheduled.',
        })
      }
    >
      Show default toast
    </Button>
  ),
};

export const Success: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast({
          variant: 'success',
          title: 'Saved successfully',
          description: 'Your changes have been saved.',
        })
      }
    >
      Show success toast
    </Button>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() =>
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: 'Your request could not be completed. Please try again.',
        })
      }
    >
      Show error toast
    </Button>
  ),
};

export const Warning: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast({
          variant: 'warning',
          title: 'Unsaved changes',
          description: 'You have unsaved changes. They will be lost if you leave.',
        })
      }
    >
      Show warning toast
    </Button>
  ),
};

export const Info: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast({
          variant: 'info',
          title: 'New update available',
          description: 'Version 2.0 is ready to install.',
        })
      }
    >
      Show info toast
    </Button>
  ),
};

// ─── With action ──────────────────────────────────────────────────────────────

export const WithAction: Story = {
  name: 'With Action',
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast({
          title: 'Email sent',
          description: 'Your message has been delivered.',
          action: (
            <ToastAction altText="Undo send" onClick={() => console.log('Undo!')}>
              Undo
            </ToastAction>
          ),
        })
      }
    >
      Send email (with undo)
    </Button>
  ),
};

// ─── Title only ───────────────────────────────────────────────────────────────

export const TitleOnly: Story = {
  name: 'Title Only',
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast({ title: 'Link copied to clipboard.' })}
    >
      Copy link
    </Button>
  ),
};

// ─── All variants at once ────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        toast({ title: 'Default', description: 'Default toast notification.' });
        toast({ variant: 'success',     title: 'Success',     description: 'Operation completed.' });
        toast({ variant: 'warning',     title: 'Warning',     description: 'Proceed with caution.' });
      }}
    >
      Show 3 toasts
    </Button>
  ),
};
