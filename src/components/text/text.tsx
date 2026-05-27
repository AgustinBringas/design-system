import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { textVariants } from './text.variants';

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  /**
   * When true, the component renders its child element directly, merging all
   * props and styles into it. Enables polymorphic rendering without losing
   * type safety — e.g. `<Text asChild><h1>Title</h1></Text>` renders an <h1>
   * with all Text styles applied.
   */
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      asChild = false,
      variant,
      size,
      weight,
      align,
      truncate,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'p';

    return (
      <Component
        ref={ref}
        className={cn(
          textVariants({ variant, size, weight, align, truncate }),
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = 'Text';

export { Text };
