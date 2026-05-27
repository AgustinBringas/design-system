import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { textareaVariants } from './textarea.variants';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  /** Accessible label rendered above the textarea. */
  label?: string;
  /** Validation error message. Sets aria-invalid and renders helper text in destructive colour. */
  errorMessage?: string;
  /**
   * Show a live character counter below the textarea.
   * Requires `maxLength` to display the limit (e.g. "42/200").
   * Without `maxLength`, shows just the current count.
   */
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size,
      hasError,
      resize,
      label,
      errorMessage,
      showCharCount = false,
      id,
      className,
      onChange,
      value,
      defaultValue,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;
    const countId = `${textareaId}-count`;

    const resolvedHasError = hasError ?? !!errorMessage;

    // Track character count for both controlled and uncontrolled usage.
    const isControlled = value !== undefined;
    const [uncontrolledCount, setUncontrolledCount] = React.useState<number>(
      typeof defaultValue === 'string' ? defaultValue.length : 0,
    );
    const charCount = isControlled ? String(value).length : uncontrolledCount;

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) setUncontrolledCount(e.target.value.length);
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    const showCount = showCharCount;
    const atLimit = maxLength !== undefined && charCount >= maxLength;

    const describedBy = [
      errorMessage ? errorId : undefined,
      showCount    ? countId : undefined,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            textareaVariants({ size, hasError: resolvedHasError, resize }),
            className,
          )}
          aria-invalid={resolvedHasError || undefined}
          aria-describedby={describedBy || undefined}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          {...props}
        />

        {(errorMessage || showCount) && (
          <div className="flex items-start justify-between gap-2">
            {errorMessage ? (
              <p id={errorId} className="text-xs text-destructive" role="alert">
                {errorMessage}
              </p>
            ) : (
              <span />
            )}

            {showCount && (
              <span
                id={countId}
                aria-live="polite"
                className={cn(
                  'ml-auto shrink-0 text-xs tabular-nums text-muted-foreground',
                  atLimit && 'text-destructive',
                )}
              >
                {maxLength !== undefined ? `${charCount}/${maxLength}` : charCount}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
