/**
 * @bringas/ui — Tailwind CSS Preset
 * ─────────────────────────────────────────────────────────────────────────────
 * Add this preset to your tailwind.config.ts and point content at the
 * compiled library so Tailwind picks up all class names used in components.
 *
 * USAGE IN A CONSUMING APPLICATION
 * ─────────────────────────────────────────────────────────────────────────────
 *   import type { Config } from 'tailwindcss';
 *   import dsPreset from '@bringas/ui/tailwind/preset';
 *
 *   export default {
 *     presets: [dsPreset],
 *     darkMode: 'class',
 *     content: [
 *       './src/** /*.{ts,tsx}',
 *       './node_modules/@bringas/ui/dist/** /*.js',
 *     ],
 *   } satisfies Config;
 *
 * TOKEN THEMING
 * ─────────────────────────────────────────────────────────────────────────────
 * All colors reference CSS custom properties defined in the library's
 * index.css (imported once at your app root as '@bringas/ui/styles').
 * Override any token in your own CSS to customise the theme:
 *
 *   :root { --primary: #your-brand-color; }
 *
 * Note: opacity modifiers (bg-primary/50) are NOT supported because the
 * tokens use hex values. To use opacity modifiers, override the tokens
 * using HSL channel syntax, e.g. --primary: 239 84% 67%;
 */

import type { Config } from 'tailwindcss';

const preset = {
  theme: {
    extend: {
      colors: {
        /* ── Surfaces ──────────────────────────────────────────────────────── */
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },

        popover: {
          DEFAULT:    'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },

        /* ── Interactive ───────────────────────────────────────────────────── */
        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },

        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },

        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },

        /* ── Muted ─────────────────────────────────────────────────────────── */
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },

        /* ── Destructive ───────────────────────────────────────────────────── */
        destructive: {
          DEFAULT:    'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },

        /* ── Structural ────────────────────────────────────────────────────── */
        border: 'var(--border)',
        input:  'var(--input)',
        ring:   'var(--ring)',

        /* ── Semantic Status ───────────────────────────────────────────────── */
        success: {
          DEFAULT:    'var(--success)',
          foreground: 'var(--success-foreground)',
        },

        warning: {
          DEFAULT:    'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },

        info: {
          DEFAULT:    'var(--info)',
          foreground: 'var(--info-foreground)',
        },
      },

      /* ── Border Radius ─────────────────────────────────────────────────────── */
      // All radii derive from --radius. Change --radius in :root to globally
      // adjust roundedness across every component.
      borderRadius: {
        sm:   'calc(var(--radius) - 4px)',
        md:   'calc(var(--radius) - 2px)',
        lg:   'var(--radius)',
        xl:   'calc(var(--radius) + 4px)',
        '2xl':'calc(var(--radius) + 8px)',
        full: '9999px',
      },

      /* ── Typography ────────────────────────────────────────────────────────── */
      fontFamily: {
        sans: [
          'Geist Sans',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'Geist Mono',
          '"JetBrains Mono"',
          '"Fira Code"',
          '"Cascadia Code"',
          'Consolas',
          '"Courier New"',
          'monospace',
        ],
      },

      /* ── Keyframe Animations ───────────────────────────────────────────────── */
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to:   { opacity: '0' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-8px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to:   { transform: 'translateY(0)',   opacity: '1' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-8px)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(8px)', opacity: '0' },
          to:   { transform: 'translateX(0)',   opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to:   { transform: 'scale(1)',    opacity: '1' },
        },
        'spin': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'toast-slide-in': {
          from: { transform: 'translateX(calc(100% + 1rem))', opacity: '0' },
          to:   { transform: 'translateX(0)',                  opacity: '1' },
        },
        'toast-slide-out': {
          from: { transform: 'translateX(0)',                  opacity: '1' },
          to:   { transform: 'translateX(calc(100% + 1rem))', opacity: '0' },
        },
        'drawer-slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'drawer-slide-out-to-left': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-100%)' },
        },
        'drawer-slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'drawer-slide-out-to-right': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(100%)' },
        },
        'drawer-slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to:   { transform: 'translateY(0)' },
        },
        'drawer-slide-out-to-top': {
          from: { transform: 'translateY(0)' },
          to:   { transform: 'translateY(-100%)' },
        },
        'drawer-slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        'drawer-slide-out-to-bottom': {
          from: { transform: 'translateY(0)' },
          to:   { transform: 'translateY(100%)' },
        },
      },

      animation: {
        'fade-in':             'fade-in 150ms ease-out',
        'fade-out':            'fade-out 150ms ease-in',
        'slide-in-from-top':   'slide-in-from-top 200ms ease-out',
        'slide-in-from-bottom':'slide-in-from-bottom 200ms ease-out',
        'slide-in-from-left':  'slide-in-from-left 200ms ease-out',
        'slide-in-from-right': 'slide-in-from-right 200ms ease-out',
        'scale-in':            'scale-in 150ms ease-out',
        'spin':                'spin 1s linear infinite',
        'toast-slide-in':      'toast-slide-in 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-slide-out':     'toast-slide-out 200ms ease-in forwards',
        'drawer-slide-in-from-left':   'drawer-slide-in-from-left 300ms ease-out',
        'drawer-slide-out-to-left':    'drawer-slide-out-to-left 300ms ease-in',
        'drawer-slide-in-from-right':  'drawer-slide-in-from-right 300ms ease-out',
        'drawer-slide-out-to-right':   'drawer-slide-out-to-right 300ms ease-in',
        'drawer-slide-in-from-top':    'drawer-slide-in-from-top 300ms ease-out',
        'drawer-slide-out-to-top':     'drawer-slide-out-to-top 300ms ease-in',
        'drawer-slide-in-from-bottom': 'drawer-slide-in-from-bottom 300ms ease-out',
        'drawer-slide-out-to-bottom':  'drawer-slide-out-to-bottom 300ms ease-in',
      },
    },
  },
} satisfies Omit<Config, 'content'>;

export default preset;
