import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  [
    // Surface: card gives a distinct background in dark mode (Zinc 900 vs Zinc 950 page)
    'flex w-full rounded-md border border-input bg-card',
    // Typography
    'text-foreground placeholder:text-muted',
    // Interaction
    'transition-colors duration-150',
    'hover:border-ring',
    'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    // States
    'disabled:cursor-not-allowed disabled:opacity-50',
    'file:border-0 file:bg-transparent file:font-medium file:text-foreground',
  ],
  {
    variants: {
      size: {
        sm: 'h-8  px-3 text-xs',
        md: 'h-9  px-3 text-sm',
        lg: 'h-10 px-4 text-base',
      },
      hasError: {
        true:  'border-destructive hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive',
        false: '',
      },
    },
    defaultVariants: {
      size:     'md',
      hasError: false,
    },
  },
);

export const inputWrapperVariants = cva('relative flex items-center', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'md' },
});

export const inputIconVariants = cva(
  'pointer-events-none absolute text-muted [&_svg]:shrink-0',
  {
    variants: {
      side: {
        left:  'left-3',
        right: 'right-3',
      },
      size: {
        sm: '[&_svg]:h-3 [&_svg]:w-3',
        md: '[&_svg]:h-4 [&_svg]:w-4',
        lg: '[&_svg]:h-5 [&_svg]:w-5',
      },
    },
    defaultVariants: { side: 'left', size: 'md' },
  },
);
