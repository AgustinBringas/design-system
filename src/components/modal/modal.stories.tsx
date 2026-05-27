import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Trash2 } from 'lucide-react';
import { Button } from '../button';
import { Input } from '../input';
import { Textarea } from '../textarea';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from './modal';

const meta: Meta = {
  title: 'Components/Modal',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Open modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Modal title</ModalTitle>
          <ModalDescription>
            This is the modal description. It provides context for the content below.
          </ModalDescription>
        </ModalHeader>
        <p className="text-sm text-foreground">
          Modal body content goes here. You can put any components, forms, or
          information inside the modal content area.
        </p>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

// ─── Confirmation / destructive ───────────────────────────────────────────────

export const ConfirmDelete: Story = {
  name: 'Confirm Delete',
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="destructive">
          <Trash2 />
          Delete item
        </Button>
      </ModalTrigger>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>Delete item?</ModalTitle>
          <ModalDescription>
            This action cannot be undone. The item will be permanently removed
            from our servers.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <Button variant="destructive">Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

// ─── Form inside modal ────────────────────────────────────────────────────────

export const WithForm: Story = {
  name: 'With Form',
  render: function WithFormStory() {
    const [open, setOpen] = useState(false);

    return (
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger asChild>
          <Button>Create project</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>New project</ModalTitle>
            <ModalDescription>
              Fill in the details below to create your project.
            </ModalDescription>
          </ModalHeader>

          <div className="flex flex-col gap-4">
            <Input label="Project name" placeholder="My awesome project" />
            <Input label="Slug" placeholder="my-awesome-project" />
            <Textarea
              label="Description"
              placeholder="What is this project about?"
              size="sm"
              resize="none"
              showCharCount
              maxLength={200}
            />
          </div>

          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Cancel</Button>
            </ModalClose>
            <Button onClick={() => setOpen(false)}>Create project</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  name: 'All Sizes',
  parameters: { controls: { disable: true } },
  render: function SizesStory() {
    const [openSize, setOpenSize] = useState<string | null>(null);
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;

    return (
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <Modal
            key={size}
            open={openSize === size}
            onOpenChange={(o) => setOpenSize(o ? size : null)}
          >
            <ModalTrigger asChild>
              <Button variant="outline">size="{size}"</Button>
            </ModalTrigger>
            <ModalContent size={size}>
              <ModalHeader>
                <ModalTitle>Modal — {size}</ModalTitle>
                <ModalDescription>
                  This modal uses the "{size}" size variant.
                </ModalDescription>
              </ModalHeader>
              <p className="text-sm text-muted-foreground">
                Content area for the {size} modal.
              </p>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="outline">Close</Button>
                </ModalClose>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ))}
      </div>
    );
  },
};

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  name: 'Controlled (open/onOpenChange)',
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <Button onClick={() => setOpen(true)}>Open modal programmatically</Button>
        <p className="text-sm text-muted-foreground">
          Status: <strong>{open ? 'open' : 'closed'}</strong>
        </p>
        <Modal open={open} onOpenChange={setOpen}>
          <ModalContent hideCloseButton>
            <ModalHeader>
              <ModalTitle>Controlled modal</ModalTitle>
              <ModalDescription>
                This modal is controlled externally via the open prop.
                The built-in X button is hidden.
              </ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  },
};
