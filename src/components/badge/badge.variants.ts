import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full font-medium',
    'cursor-default transition-colors duration-150',
  ],
  {
    variants: {
      variant: {
        default: 'border border-primary/30 bg-primary/10 text-primary',
        secondary: 'border border-border bg-muted/50 text-muted-foreground',
        outline: 'border border-border bg-transparent text-foreground',
      },
      size: {
        sm: 'px-2.5 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-sm',
      },
      interactive: {
        true: [
          'cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
        ],
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        interactive: true,
        className: 'hover:bg-primary/20 hover:border-primary/50',
      },
      {
        variant: 'secondary',
        interactive: true,
        className: 'hover:bg-muted hover:border-border',
      },
      {
        variant: 'outline',
        interactive: true,
        className: 'hover:bg-accent hover:text-accent-foreground',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: false,
    },
  },
);
