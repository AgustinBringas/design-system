import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import {
  inputVariants,
  inputWrapperVariants,
  inputIconVariants,
} from './input.variants';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Icon rendered inside the left edge of the input. */
  leadingIcon?: React.ReactNode;
  /** Icon rendered inside the right edge of the input. */
  trailingIcon?: React.ReactNode;
  /** Validation error message. Sets aria-invalid and renders helper text in destructive colour. */
  errorMessage?: string;
  /** Accessible label text rendered above the input. Prefer <Label> when you need more control. */
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      hasError,
      leadingIcon,
      trailingIcon,
      errorMessage,
      label,
      id,
      className,
      ...props
    },
    ref,
  ) => {
    const resolvedHasError = hasError ?? !!errorMessage;
    const inputId = id ?? (label ? React.useId() : undefined);
    const errorId = errorMessage ? `${inputId}-error` : undefined;

    // Build padding overrides when icons are present so text doesn't run under them.
    const iconPadding = cn(
      leadingIcon  && (size === 'sm' ? 'pl-8'  : size === 'lg' ? 'pl-10' : 'pl-9'),
      trailingIcon && (size === 'sm' ? 'pr-8'  : size === 'lg' ? 'pr-10' : 'pr-9'),
    );

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}

        <div className={inputWrapperVariants({ size })}>
          {leadingIcon && (
            <span className={inputIconVariants({ side: 'left', size })}>
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ size, hasError: resolvedHasError }),
              iconPadding,
              className,
            )}
            aria-invalid={resolvedHasError || undefined}
            aria-describedby={errorId}
            {...props}
          />

          {trailingIcon && (
            <span className={inputIconVariants({ side: 'right', size })}>
              {trailingIcon}
            </span>
          )}
        </div>

        {errorMessage && (
          <p id={errorId} className="text-xs text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
