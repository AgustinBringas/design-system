import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Copy, Scissors, Clipboard, Trash2, FolderOpen,
  FilePlus, RotateCcw, RotateCw, Link, ImagePlus,
} from 'lucide-react';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';

const meta: Meta = {
  title: 'Components/ContextMenu',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

// Reusable trigger zone
function TriggerZone({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-40 w-80 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground select-none">
      {children}
    </div>
  );
}

import React from 'react';

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerZone>Right-click anywhere here</TriggerZone>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem>
          <FilePlus />
          New file
          <ContextMenuShortcut>⌘N</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <FolderOpen />
          Open folder
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Scissors />
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Clipboard />
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <RotateCcw />
          Undo
          <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <RotateCw />
          Redo
          <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:text-destructive">
          <Trash2 />
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

// ─── With sub-menu ────────────────────────────────────────────────────────────

export const WithSubMenu: Story = {
  name: 'With Sub Menu',
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerZone>Right-click for sub-menu demo</TriggerZone>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem>
          <Copy />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Link />
            Share
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Copy link</ContextMenuItem>
            <ContextMenuItem>Email</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>More options…</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <ImagePlus />
            Insert
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Image</ContextMenuItem>
            <ContextMenuItem>Table</ContextMenuItem>
            <ContextMenuItem>Code block</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:text-destructive">
          <Trash2 />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

// ─── Checkbox items ───────────────────────────────────────────────────────────

export const WithCheckboxItems: Story = {
  name: 'Checkbox Items',
  render: function CheckboxStory() {
    const [showGrid, setShowGrid] = useState(true);
    const [showRulers, setShowRulers] = useState(false);
    const [snapToGrid, setSnapToGrid] = useState(true);

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <TriggerZone>Right-click for view options</TriggerZone>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-52">
          <ContextMenuLabel>View</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={showGrid}
            onCheckedChange={setShowGrid}
          >
            Show grid
            <ContextMenuShortcut>⌘'</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showRulers}
            onCheckedChange={setShowRulers}
          >
            Show rulers
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={snapToGrid}
            onCheckedChange={setSnapToGrid}
          >
            Snap to grid
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

// ─── Radio items ──────────────────────────────────────────────────────────────

export const WithRadioItems: Story = {
  name: 'Radio Items',
  render: function RadioStory() {
    const [zoom, setZoom] = useState('100');

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <TriggerZone>Right-click for zoom level</TriggerZone>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuLabel>Zoom</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
            <ContextMenuRadioItem value="50">50%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="75">75%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="100">100%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="125">125%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="150">150%</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

// ─── Grouped ─────────────────────────────────────────────────────────────────

export const Grouped: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerZone>Right-click for grouped actions</TriggerZone>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuGroup>
          <ContextMenuLabel>Clipboard</ContextMenuLabel>
          <ContextMenuItem>
            <Scissors />
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy />
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Clipboard />
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>History</ContextMenuLabel>
          <ContextMenuItem>
            <RotateCcw />
            Undo
            <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <RotateCw />
            Redo
            <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
