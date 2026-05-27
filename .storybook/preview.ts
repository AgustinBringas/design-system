import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

// 1. Tailwind base reset + utility classes (Storybook-only, not distributed).
import './preview.css';

// 2. Semantic CSS custom properties — same file the library ships to consumers.
//    Light → :root  |  Dark → .dark  |  High Contrast → .high-contrast
import '../src/index.css';

const preview: Preview = {
  // ─── Global decorators ──────────────────────────────────────────────────

  decorators: [
    /*
     * Syncs the theme toolbar selection with Tailwind's class-based dark mode.
     * On change, withThemeByClassName toggles the corresponding class on the
     * <html> element inside the preview iframe:
     *
     *   Light          →  no class        →  :root variables active
     *   Dark           →  class="dark"    →  .dark variables active
     *   High Contrast  →  class="high-contrast"  →  .high-contrast variables active
     *
     * This matches tailwind.config.ts darkMode: 'class' exactly.
     */
    withThemeByClassName({
      themes: {
        Light:           '',
        Dark:            'dark',
        'High Contrast': 'high-contrast',
      },
      defaultTheme: 'Light',
    }),
  ],

  // ─── Global parameters ──────────────────────────────────────────────────

  parameters: {
    // ── Controls ──────────────────────────────────────────────────────────
    controls: {
      matchers: {
        color: /(background|color|fill|stroke)$/i,
        date:  /date$/i,
      },
      sort: 'alpha',
    },

    // ── Actions ───────────────────────────────────────────────────────────
    actions: { argTypesRegex: '^on[A-Z].*' },

    // ── Backgrounds ───────────────────────────────────────────────────────
    // Disabled — the canvas background is controlled by the theme CSS
    // variables on <body> in preview.css, not the Storybook backgrounds addon.
    // Enabling both causes the canvas colour to be out of sync with the theme.
    backgrounds: { disable: true },

    // ── Layout ────────────────────────────────────────────────────────────
    layout: 'centered',

    // ── Docs ──────────────────────────────────────────────────────────────
    docs: {
      toc: true,
    },

    // ── Viewport ──────────────────────────────────────────────────────────
    viewport: {
      viewports: {
        xs: { name: 'Mobile S  (375)', styles: { width: '375px',  height: '812px'  } },
        sm: { name: 'Mobile L  (430)', styles: { width: '430px',  height: '932px'  } },
        md: { name: 'Tablet    (768)', styles: { width: '768px',  height: '1024px' } },
        lg: { name: 'Laptop   (1280)', styles: { width: '1280px', height: '800px'  } },
        xl: { name: 'Desktop  (1440)', styles: { width: '1440px', height: '900px'  } },
      },
      defaultViewport: 'responsive',
    },

    // ── Accessibility (axe-core) ───────────────────────────────────────────
    a11y: {
      manual: false,
      config: {
        rules: [
          { id: 'color-contrast',     enabled: true },
          { id: 'tabindex',           enabled: true },
          { id: 'aria-allowed-role',  enabled: true },
          { id: 'aria-required-attr', enabled: true },
        ],
      },
      options: {
        runOnly: {
          type:   'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
  },
};

export default preview;
