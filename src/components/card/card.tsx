import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Text } from '../text';

// ─── Variants ─────────────────────────────────────────────────────────────────

const cardVariants = cva(
  'rounded-lg bg-card text-card-foreground',
  {
    variants: {
      variant: {
        default:  'border border-border shadow-sm',
        elevated: 'shadow-md',
        ghost:    'bg-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
Card.displayName = 'Card';

// ─── CardHeader ───────────────────────────────────────────────────────────────

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// ─── CardTitle ────────────────────────────────────────────────────────────────

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <Text asChild variant="heading" size="xl" className={cn('leading-none', className)}>
    <h3 ref={ref} {...props} />
  </Text>
));
CardTitle.displayName = 'CardTitle';

// ─── CardDescription ─────────────────────────────────────────────────────────

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <Text ref={ref} variant="caption" size="sm" className={className} {...props} />
));
CardDescription.displayName = 'CardDescription';

// ─── CardContent ──────────────────────────────────────────────────────────────

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

// ─── CardFooter ───────────────────────────────────────────────────────────────

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
export type { CardProps };
