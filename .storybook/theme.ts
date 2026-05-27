import { create } from '@storybook/theming/create';

/*
 * Storybook manager UI branding.
 * Values are intentionally hard-coded (not CSS variables) because this theme
 * runs inside the manager frame which does not load the library's globals.css.
 * Keep colours consistent with the light theme tokens in globals.css.
 */
export default create({
  base: 'light',

  // ── Brand ─────────────────────────────────────────────────────────────
  brandTitle: 'Design System',
  brandUrl:   '/',
  brandTarget: '_self',

  // ── Accent — mirrors --color-accent (blue-500, hsl 217.2 91.2% 59.8%) ─
  colorPrimary:   '#3b82f6',
  colorSecondary: '#2563eb',

  // ── Manager chrome ────────────────────────────────────────────────────
  appBg:          '#f8fafc',  // slate-50
  appContentBg:   '#ffffff',
  appBorderColor: '#e2e8f0',  // slate-200
  appBorderRadius: 6,

  // ── Typography ────────────────────────────────────────────────────────
  fontBase: '"Inter", system-ui, -apple-system, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',

  // ── Text ──────────────────────────────────────────────────────────────
  textColor:        '#0f172a',  // slate-900
  textInverseColor: '#ffffff',
  textMutedColor:   '#64748b',  // slate-500

  // ── Sidebar & toolbar ─────────────────────────────────────────────────
  barTextColor:     '#475569',  // slate-600
  barHoverColor:    '#0f172a',  // slate-900
  barSelectedColor: '#2563eb',  // blue-600
  barBg:            '#ffffff',

  // ── Form controls ─────────────────────────────────────────────────────
  inputBg:           '#ffffff',
  inputBorder:       '#cbd5e1',  // slate-300
  inputTextColor:    '#0f172a',  // slate-900
  inputBorderRadius: 6,
});
