import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Text } from '../text';

// ─── Re-export unstyled primitives ────────────────────────────────────────────

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;
const ModalPortal = DialogPrimitive.Portal;

// ─── Size variants ────────────────────────────────────────────────────────────

const modalContentVariants = cva(
  [
    'grid w-full gap-4 rounded-lg border border-border bg-background p-6 shadow-lg',
    'duration-200',
    'data-[state=open]:animate-in   data-[state=open]:fade-in-0   data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
    'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
  ],
  {
    variants: {
      size: {
        sm:   'max-w-sm',
        md:   'max-w-lg',
        lg:   'max-w-2xl',
        xl:   'max-w-4xl',
        full: 'max-w-[calc(100vw-2rem)]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

// ─── Overlay ──────────────────────────────────────────────────────────────────

const ModalOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
      'data-[state=open]:animate-in   data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className,
    )}
    {...props}
  />
));
ModalOverlay.displayName = 'ModalOverlay';

// ─── Content ──────────────────────────────────────────────────────────────────

interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalContentVariants> {
  /** Hide the default X close button in the top-right corner. */
  hideCloseButton?: boolean;
}

const ModalContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, size, hideCloseButton = false, children, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
        modalContentVariants({ size }),
        className,
      )}
      {...props}
    >
      {children}
      {!hideCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = 'ModalContent';

// ─── Header ───────────────────────────────────────────────────────────────────

function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
}
ModalHeader.displayName = 'ModalHeader';

// ─── Footer ───────────────────────────────────────────────────────────────────

function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}
ModalFooter.displayName = 'ModalFooter';

// ─── Title ────────────────────────────────────────────────────────────────────

const ModalTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <Text asChild variant="heading" size="lg" className={cn('leading-none', className)}>
    <DialogPrimitive.Title ref={ref} {...props} />
  </Text>
));
ModalTitle.displayName = 'ModalTitle';

// ─── Description ──────────────────────────────────────────────────────────────

const ModalDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <Text asChild variant="caption" size="sm" className={className}>
    <DialogPrimitive.Description ref={ref} {...props} />
  </Text>
));
ModalDescription.displayName = 'ModalDescription';

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
export type { ModalContentProps };
