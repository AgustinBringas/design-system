import { cva } from 'class-variance-authority';

export const textVariants = cva('', {
  variants: {
    variant: {
      // Font-weight is intentionally absent here — it's controlled solely by
      // the `weight` variant and compound overrides below. This prevents
      // twMerge from silently dropping the variant's weight class when the
      // `weight` default is also emitted later in the class string.
      heading: 'font-sans tracking-tight text-foreground',
      body: 'font-sans leading-relaxed text-foreground',
      label: 'font-sans leading-none text-foreground',
      code: 'font-mono text-foreground bg-muted rounded px-1 py-0.5',
      caption: 'font-sans leading-snug text-muted-foreground',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    truncate: {
      true: 'truncate',
      false: '',
    },
  },
  compoundVariants: [
    // Heading and label have semantic default weights that differ from the
    // global default (normal). Compound variants run after regular variants
    // in CVA's class string, so twMerge correctly selects them over the
    // weight variant's output.
    { variant: 'heading', weight: 'normal', class: 'font-semibold' },
    { variant: 'label', weight: 'normal', class: 'font-medium' },

    // Code is rendered in a monospace context — weight variation is
    // visually inconsistent across typefaces, so reset to normal always.
    { variant: 'code', weight: 'light', class: 'font-normal' },
    { variant: 'code', weight: 'medium', class: 'font-normal' },
    { variant: 'code', weight: 'semibold', class: 'font-normal' },
    { variant: 'code', weight: 'bold', class: 'font-normal' },
  ],
  defaultVariants: {
    variant: 'body',
    size: 'md',
    weight: 'normal',
    align: 'left',
    truncate: false,
  },
});
