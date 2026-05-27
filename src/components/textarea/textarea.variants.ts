import { cva } from 'class-variance-authority';

export const textareaVariants = cva(
  [
    'flex w-full rounded-md border border-input bg-card px-3 py-2',
    'text-foreground placeholder:text-muted',
    'transition-colors duration-150',
    'hover:border-ring',
    'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-[80px]  text-xs',
        md: 'min-h-[120px] text-sm',
        lg: 'min-h-[160px] text-base',
      },
      hasError: {
        true:  'border-destructive hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive',
        false: '',
      },
      resize: {
        none:       'resize-none',
        vertical:   'resize-y',
        horizontal: 'resize-x',
        both:       'resize',
      },
    },
    defaultVariants: {
      size:     'md',
      hasError: false,
      resize:   'vertical',
    },
  },
);
