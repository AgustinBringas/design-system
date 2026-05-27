import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { buttonVariants } from './button.variants';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Merges all props onto the child element instead of rendering a <button>.
   * Useful for polymorphic usage (e.g. Next.js Link, <a>, custom components)
   * while preserving all button styles and accessibility props.
   */
  asChild?: boolean;
  /**
   * Renders a spinner and sets aria-busy + disabled. The spinner appears
   * before children so screen readers still announce the label.
   * Has no effect when asChild is true — loading state is the consumer's
   * responsibility in that case.
   */
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      isLoading = false,
      variant,
      size,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const resolvedClassName = cn(buttonVariants({ variant, size }), className);

    // Radix Slot requires exactly one child element. Keeping the spinner
    // conditional inside the same render branch as Slot would pass a `false`
    // node alongside children and trip React.Children.only. The two-path
    // split avoids this without sacrificing type safety.
    //
    // `disabled` is intentionally not forwarded to Slot — it is not a valid
    // attribute on arbitrary elements (e.g. <a>). When asChild is true, the
    // consumer is responsible for reflecting disabled state on their element.
    if (asChild) {
      return (
        <Slot ref={ref} className={resolvedClassName} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={resolvedClassName}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
