import { cn } from '@/utils/cn';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import * as React from 'react';

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Label rendered next to the checkbox, wired up via htmlFor/id for a correct click target. */
  label?: React.ReactNode;
}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, id, label, ...props }, ref) => {
  const generatedId = React.useId();
  const checkboxId = id ?? (label ? generatedId : undefined);

  const checkbox = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={checkboxId}
      className={cn(
        'peer flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-input shadow-sm',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {props.checked === 'indeterminate' ? (
          <Minus className="h-3.5 w-3.5" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label) {
    return checkbox;
  }

  return (
    <div className="flex items-center gap-2">
      {checkbox}
      <label
        htmlFor={checkboxId}
        className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
