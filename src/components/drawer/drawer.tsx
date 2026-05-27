import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Text } from '../text';

// ─── Re-export unstyled primitives ────────────────────────────────────────────

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerPortal = DialogPrimitive.Portal;

// ─── Side variants ────────────────────────────────────────────────────────────

const drawerContentVariants = cva(
  'fixed z-50 flex flex-col bg-background shadow-lg',
  {
    variants: {
      side: {
        left: [
          'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-border',
          'data-[state=open]:animate-drawer-slide-in-from-left',
          'data-[state=closed]:animate-drawer-slide-out-to-left',
        ],
        right: [
          'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-border',
          'data-[state=open]:animate-drawer-slide-in-from-right',
          'data-[state=closed]:animate-drawer-slide-out-to-right',
        ],
        top: [
          'inset-x-0 top-0 w-full border-b border-border',
          'data-[state=open]:animate-drawer-slide-in-from-top',
          'data-[state=closed]:animate-drawer-slide-out-to-top',
        ],
        bottom: [
          'inset-x-0 bottom-0 w-full border-t border-border',
          'data-[state=open]:animate-drawer-slide-in-from-bottom',
          'data-[state=closed]:animate-drawer-slide-out-to-bottom',
        ],
      },
    },
    defaultVariants: { side: 'right' },
  },
);

// ─── Overlay ──────────────────────────────────────────────────────────────────

const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
      'data-[state=open]:animate-fade-in',
      'data-[state=closed]:animate-fade-out',
      className,
    )}
    {...props}
  />
));
DrawerOverlay.displayName = 'DrawerOverlay';

// ─── Content ──────────────────────────────────────────────────────────────────

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerContentVariants> {
  /** Hide the default X close button. */
  hideCloseButton?: boolean;
}

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, side, hideCloseButton = false, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn('relative', drawerContentVariants({ side }), className)}
      {...props}
    >
      {!hideCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
      {children}
    </DialogPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

// ─── Header ───────────────────────────────────────────────────────────────────

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 p-6', className)}
      {...props}
    />
  );
}
DrawerHeader.displayName = 'DrawerHeader';

// ─── Body (scrollable middle region) ─────────────────────────────────────────

function DrawerBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto px-6 py-2', className)}
      {...props}
    />
  );
}
DrawerBody.displayName = 'DrawerBody';

// ─── Footer ───────────────────────────────────────────────────────────────────

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 p-6 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}
DrawerFooter.displayName = 'DrawerFooter';

// ─── Title ────────────────────────────────────────────────────────────────────

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <Text asChild variant="heading" size="lg" className={cn('leading-none', className)}>
    <DialogPrimitive.Title ref={ref} {...props} />
  </Text>
));
DrawerTitle.displayName = 'DrawerTitle';

// ─── Description ──────────────────────────────────────────────────────────────

const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <Text asChild variant="caption" size="sm" className={className}>
    <DialogPrimitive.Description ref={ref} {...props} />
  </Text>
));
DrawerDescription.displayName = 'DrawerDescription';

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
export type { DrawerContentProps };
