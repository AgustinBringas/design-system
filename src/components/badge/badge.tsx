import { cn } from '@/utils/cn';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { badgeVariants } from './badge.variants';

export type BadgeProps = React.HTMLAttributes<HTMLElement> &
  Omit<VariantProps<typeof badgeVariants>, 'interactive'> & {
    disabled?: boolean;
  };

const Badge = React.forwardRef<HTMLElement, BadgeProps>(
  ({ variant, size, className, onClick, children, ...props }, ref) => {
    const interactive = onClick !== undefined;
    const classes = cn(badgeVariants({ variant, size, interactive }), className);

    if (interactive) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={classes}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={classes} {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export { Badge };
