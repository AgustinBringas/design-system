/**
 * @fileoverview Design Token Schema & Engineering Reference
 *
 * This file is the authoritative mapping between three layers:
 *
 *   CSS Layer      src/index.css         --background: 0 0% 100%
 *   Tailwind Layer tailwind/preset.ts    background: 'hsl(var(--background) / ...)'
 *   Type Layer     src/types/tokens.ts   ← YOU ARE HERE
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ENGINEERING TERMINOLOGY GLOSSARY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TOKEN
 *   A named, version-controlled design decision. A token is the contract
 *   between design and engineering — never use raw values (hex, px) in
 *   component code when a token exists.
 *
 * PRIMITIVE TOKEN
 *   Maps a name to a raw value. Not used directly in components.
 *   Example: blue-600 = #2563eb
 *
 * SEMANTIC TOKEN
 *   Maps a PURPOSE to a value, not the other way around.
 *   "primary" survives a brand rebrand; "#2563eb" does not.
 *   Example: --primary = 221.2 83.2% 53.3%  (references the blue-600 primitive)
 *
 * SURFACE TOKEN
 *   Describes a background layer that contains other elements.
 *   Every surface token has a paired FOREGROUND token.
 *   Example: --card (background) paired with --card-foreground (text on card)
 *
 * FOREGROUND TOKEN
 *   Content rendered on top of its paired surface.
 *   Rule: foreground tokens ONLY appear as text-* or fill-* utilities.
 *         Do NOT use them for bg-* or border-* utilities.
 *
 * INTERACTIVE TOKEN
 *   A token reserved for clickable / actionable elements.
 *   Rule: do NOT use --primary for decorative, non-interactive UI.
 *
 * MODE
 *   A named theme variant. This system defines three:
 *   light (default) | dark (.dark class) | high-contrast (.high-contrast class)
 *
 * ALPHA-VALUE SYNTAX
 *   CSS variables are stored as raw HSL channels (e.g. "221.2 83.2% 53.3%")
 *   rather than full hsl() values. This enables Tailwind's opacity modifier:
 *   bg-primary/50 → hsl(var(--primary) / 0.5)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * TOKEN → UTILITY CLASS QUICK REFERENCE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Token              CSS Variable              Tailwind Utilities
 * ─────────────────  ────────────────────────  ────────────────────────────────
 * background         --background              bg-background  text-background
 * foreground         --foreground              text-foreground
 * card               --card                    bg-card  border-card
 * card-foreground    --card-foreground          text-card-foreground
 * popover            --popover                  bg-popover  border-popover
 * popover-foreground --popover-foreground       text-popover-foreground
 * primary            --primary                  bg-primary  text-primary  border-primary
 * primary-foreground --primary-foreground       text-primary-foreground
 * secondary          --secondary                bg-secondary  text-secondary
 * secondary-fg       --secondary-foreground     text-secondary-foreground
 * muted              --muted                    bg-muted
 * muted-foreground   --muted-foreground         text-muted-foreground
 * accent             --accent                   bg-accent  hover:bg-accent
 * accent-foreground  --accent-foreground        text-accent-foreground
 * destructive        --destructive              bg-destructive  text-destructive
 * destructive-fg     --destructive-foreground   text-destructive-foreground
 * border             --border                   border-border  divide-border
 * input              --input                    border-input
 * ring               --ring                     ring-ring  outline-ring
 * brand-primary      --brand-primary            bg-brand-primary  text-brand-primary
 * brand-secondary    --brand-secondary          bg-brand-secondary  text-brand-secondary
 * success            --success                  bg-success  text-success
 * success-fg         --success-foreground       text-success-foreground
 * warning            --warning                  bg-warning  text-warning
 * warning-fg         --warning-foreground       text-warning-foreground
 * info               --info                     bg-info  text-info
 * info-fg            --info-foreground          text-info-foreground
 */


/* ═══════════════════════════════════════════════════════════════════════════
   CSS VARIABLE REFERENCE TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

/** A raw CSS custom property name, including the -- prefix. */
export type CSSVariableName = `--${string}`;

/**
 * A Tailwind-compatible HSL colour reference using the alpha-value syntax.
 * Tailwind replaces <alpha-value> with the opacity modifier value at compile time.
 */
export type TailwindColorValue = `hsl(var(${CSSVariableName}) / <alpha-value>)`;

/** A resolved HSL colour as raw channels (the format stored in the CSS variable). */
export type HSLChannels = string; // e.g. "221.2 83.2% 53.3%"


/* ═══════════════════════════════════════════════════════════════════════════
   TOKEN CATEGORY CLASSIFICATION
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Classifies what role a token plays in the design system.
 * Use this when building tooling, docs generators, or theme editors.
 */
export type TokenCategory =
  | 'surface'       // Background regions: background, card, popover
  | 'typography'    // Text colours: foreground, muted-foreground
  | 'interactive'   // Actionable states: primary, secondary, accent, destructive
  | 'feedback'      // Status communication: success, warning, info
  | 'structural'    // Layout scaffolding: border, input, ring
  | 'brand';        // Identity tokens: brand-primary, brand-secondary


/* ═══════════════════════════════════════════════════════════════════════════
   SEMANTIC TOKEN NAME REGISTRY
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Every semantic colour token in the system.
 * This type is the canonical list — if a token isn't here, it doesn't exist.
 *
 * Naming convention:
 *   <surface>                → a background region
 *   <surface>-foreground     → content rendered ON that surface
 *   brand-<identifier>       → brand-specific colours, not semantic UI roles
 */
export type SemanticColorToken =
  // Surfaces
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  // Interactive
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground'
  // Structural
  | 'border'
  | 'input'
  | 'ring'
  // Brand
  | 'brand-primary'
  | 'brand-secondary'
  // Feedback
  | 'success'
  | 'success-foreground'
  | 'warning'
  | 'warning-foreground'
  | 'info'
  | 'info-foreground';

/** Maps a semantic token name to its CSS custom property. */
export type CSSVariableFor<T extends SemanticColorToken> = `--${T}`;

/** The CSS variable reference for a token, as used in Tailwind config. */
export type TailwindRefFor<T extends SemanticColorToken> =
  `hsl(var(--${T}) / <alpha-value>)`;


/* ═══════════════════════════════════════════════════════════════════════════
   TOKEN DEFINITION SCHEMA
   ═══════════════════════════════════════════════════════════════════════════ */

/** Full metadata for a single design token. Used in tooling and documentation. */
export interface TokenDefinition {
  /** Unique token identifier. Matches the SemanticColorToken literal. */
  readonly name: SemanticColorToken;

  /** The CSS custom property this token maps to. */
  readonly cssVariable: CSSVariableName;

  /** Tailwind utility class category this token belongs to. */
  readonly category: TokenCategory;

  /**
   * Human-readable description of when and why to use this token.
   * Written from an engineering perspective, not a design one.
   */
  readonly description: string;

  /**
   * Concrete examples of where this token appears in the UI.
   * Helps engineers choose the right token without guessing.
   */
  readonly usageExamples: readonly string[];

  /**
   * The primary Tailwind utility class for this token.
   * Not exhaustive — tokens work with all compatible Tailwind prefixes.
   */
  readonly primaryTailwindClass: string;

  /**
   * The token that this one is designed to sit on top of.
   * foreground tokens always pair with a surface token.
   * undefined = this token is itself a surface.
   */
  readonly pairedSurface?: SemanticColorToken;

  /**
   * The counterpart foreground token for this surface.
   * Only defined on surface tokens (not foreground tokens).
   */
  readonly pairedForeground?: SemanticColorToken;

  /**
   * Warns if this token is commonly misused.
   * undefined = no known misuse patterns.
   */
  readonly antiPatterns?: readonly string[];
}


/* ═══════════════════════════════════════════════════════════════════════════
   TOKEN REGISTRY
   The runtime source of truth. Import and iterate this for token tooling.
   ═══════════════════════════════════════════════════════════════════════════ */

export const TOKEN_REGISTRY = {
  background: {
    name:               'background',
    cssVariable:        '--background',
    category:           'surface',
    description:        'The root application background. Used only for the outermost canvas — never for cards, panels, or component interiors.',
    usageExamples:      ['<body> background', 'full-page layout wrappers', 'empty-state screens'],
    primaryTailwindClass: 'bg-background',
    pairedForeground:   'foreground',
    antiPatterns:       ['Do not use for card or dialog backgrounds — use bg-card instead.'],
  },

  foreground: {
    name:               'foreground',
    cssVariable:        '--foreground',
    category:           'typography',
    description:        'Default body copy colour. The highest-contrast text in the system, suitable for headings and paragraph text on background surfaces.',
    usageExamples:      ['body text', 'headings', 'labels', 'form values'],
    primaryTailwindClass: 'text-foreground',
    pairedSurface:      'background',
    antiPatterns:       ['Do not use on primary or destructive surfaces — use the *-foreground variant of that surface.'],
  },

  card: {
    name:               'card',
    cssVariable:        '--card',
    category:           'surface',
    description:        'Elevated surface for cards, dialogs, sheets, and sidebar panels. Visually distinct from the page background to create depth.',
    usageExamples:      ['Card component', 'Dialog content area', 'Sidebar panel', 'Data table'],
    primaryTailwindClass: 'bg-card',
    pairedForeground:   'card-foreground',
  },

  'card-foreground': {
    name:               'card-foreground',
    cssVariable:        '--card-foreground',
    category:           'typography',
    description:        'Text colour for content rendered inside card surfaces.',
    usageExamples:      ['Card title', 'Card body text', 'Dialog headings'],
    primaryTailwindClass: 'text-card-foreground',
    pairedSurface:      'card',
  },

  popover: {
    name:               'popover',
    cssVariable:        '--popover',
    category:           'surface',
    description:        'Floating surface for transient, ephemeral UI — dropdowns, tooltips, popovers, command palettes, and context menus. Appears above cards in the z-axis.',
    usageExamples:      ['Dropdown menu', 'Tooltip', 'DatePicker calendar', 'Combobox list'],
    primaryTailwindClass: 'bg-popover',
    pairedForeground:   'popover-foreground',
  },

  'popover-foreground': {
    name:               'popover-foreground',
    cssVariable:        '--popover-foreground',
    category:           'typography',
    description:        'Text colour inside floating surfaces.',
    usageExamples:      ['Dropdown item text', 'Tooltip copy'],
    primaryTailwindClass: 'text-popover-foreground',
    pairedSurface:      'popover',
  },

  primary: {
    name:               'primary',
    cssVariable:        '--primary',
    category:           'interactive',
    description:        'The single most important call-to-action colour. Reserved for the primary button, active navigation items, checked checkboxes, progress bars, and the currently selected tab. Use sparingly — one primary action per screen.',
    usageExamples:      ['Primary Button background', 'Active NavItem indicator', 'Checkbox:checked fill', 'Progress bar fill', 'Focus ring (via --ring)'],
    primaryTailwindClass: 'bg-primary',
    pairedForeground:   'primary-foreground',
    antiPatterns:       ['Do not use for decorative elements.', 'Do not use for more than one CTA per screen.'],
  },

  'primary-foreground': {
    name:               'primary-foreground',
    cssVariable:        '--primary-foreground',
    category:           'typography',
    description:        'Text and icon colour rendered directly on a primary-coloured surface. Always ensures WCAG AA contrast against --primary.',
    usageExamples:      ['Primary Button label', 'Badge text on primary background'],
    primaryTailwindClass: 'text-primary-foreground',
    pairedSurface:      'primary',
  },

  secondary: {
    name:               'secondary',
    cssVariable:        '--secondary',
    category:           'interactive',
    description:        'Lower-emphasis interactive surface. Used for secondary buttons, tag chips, filter badges, and optional feature toggles.',
    usageExamples:      ['Secondary Button', 'Tag/Badge background', 'Keyboard shortcut pill', 'Inactive tab'],
    primaryTailwindClass: 'bg-secondary',
    pairedForeground:   'secondary-foreground',
  },

  'secondary-foreground': {
    name:               'secondary-foreground',
    cssVariable:        '--secondary-foreground',
    category:           'typography',
    description:        'Text and icon colour on secondary surfaces.',
    usageExamples:      ['Secondary Button label', 'Tag text'],
    primaryTailwindClass: 'text-secondary-foreground',
    pairedSurface:      'secondary',
  },

  muted: {
    name:               'muted',
    cssVariable:        '--muted',
    category:           'surface',
    description:        'Subtle, low-attention background. Used for code blocks, disabled input fills, skeleton loaders, empty-state illustrations, and helper banners.',
    usageExamples:      ['Code block background', 'Disabled input', 'Skeleton loader', 'Empty-state container'],
    primaryTailwindClass: 'bg-muted',
    pairedForeground:   'muted-foreground',
  },

  'muted-foreground': {
    name:               'muted-foreground',
    cssVariable:        '--muted-foreground',
    category:           'typography',
    description:        'Low-contrast text for supporting, non-critical content. Must still meet WCAG AA 4.5:1 against its background.',
    usageExamples:      ['Placeholder text', 'Caption / helper text', 'Timestamp', 'Character count', 'Breadcrumb separators'],
    primaryTailwindClass: 'text-muted-foreground',
    pairedSurface:      'muted',
  },

  accent: {
    name:               'accent',
    cssVariable:        '--accent',
    category:           'interactive',
    description:        'Hover and keyboard-focus highlight background. Provides interactive feedback without the weight of --primary. Deliberately distinct from primary to avoid CTA confusion.',
    usageExamples:      ['MenuItem hover state', 'Dropdown item highlight', 'Selectable list item hover'],
    primaryTailwindClass: 'hover:bg-accent',
    pairedForeground:   'accent-foreground',
    antiPatterns:       ['Do not use as a standalone button colour — use primary or secondary.'],
  },

  'accent-foreground': {
    name:               'accent-foreground',
    cssVariable:        '--accent-foreground',
    category:           'typography',
    description:        'Text colour on accent-highlighted items.',
    usageExamples:      ['Hovered menu item text', 'Selected list item label'],
    primaryTailwindClass: 'text-accent-foreground',
    pairedSurface:      'accent',
  },

  destructive: {
    name:               'destructive',
    cssVariable:        '--destructive',
    category:           'interactive',
    description:        'Danger, error, and irreversible-action colour. Use for delete buttons, error states, form validation errors, and alerts indicating data loss.',
    usageExamples:      ['Delete Button', 'Form field error state', 'Alert: error variant', 'Toast: destructive variant'],
    primaryTailwindClass: 'bg-destructive',
    pairedForeground:   'destructive-foreground',
    antiPatterns:       ['Do not use for warnings — use --warning instead.', 'Do not use for required field indicators.'],
  },

  'destructive-foreground': {
    name:               'destructive-foreground',
    cssVariable:        '--destructive-foreground',
    category:           'typography',
    description:        'Text and icon colour on destructive surfaces.',
    usageExamples:      ['Delete Button label', 'Error toast text'],
    primaryTailwindClass: 'text-destructive-foreground',
    pairedSurface:      'destructive',
  },

  border: {
    name:               'border',
    cssVariable:        '--border',
    category:           'structural',
    description:        'Default stroke colour for dividers, card outlines, table cell borders, and section separators. Not for input fields — use --input for those.',
    usageExamples:      ['Card border', 'Table row divider', 'Separator component', 'Section rule'],
    primaryTailwindClass: 'border-border',
    antiPatterns:       ['Do not use for input field borders — use border-input.'],
  },

  input: {
    name:               'input',
    cssVariable:        '--input',
    category:           'structural',
    description:        'Border colour for form inputs (text fields, select boxes, textareas) in their default resting state. Distinct from --border to allow independent theming of form affordances.',
    usageExamples:      ['Input border', 'Select border', 'Textarea border'],
    primaryTailwindClass: 'border-input',
  },

  ring: {
    name:               'ring',
    cssVariable:        '--ring',
    category:           'structural',
    description:        'Focus ring colour for keyboard navigation. Appears via focus-visible: pseudo-class. Must achieve at least 3:1 contrast against the adjacent surface per WCAG 2.1 SC 1.4.11.',
    usageExamples:      ['All interactive elements on keyboard focus', 'focus-visible:ring-ring utility'],
    primaryTailwindClass: 'ring-ring',
    antiPatterns:       ['Never suppress focus rings — they are required for keyboard accessibility.'],
  },

  'brand-primary': {
    name:               'brand-primary',
    cssVariable:        '--brand-primary',
    category:           'brand',
    description:        'The primary brand colour. Unlike --primary, this token maintains exact brand fidelity across all themes. Use for logos, illustrations, loading screens, and marketing surfaces — not for general UI affordances.',
    usageExamples:      ['Logo fill', 'Brand illustration colour', 'Marketing banner accent', 'Onboarding screen background'],
    primaryTailwindClass: 'bg-brand-primary',
    antiPatterns:       ['Do not use as the primary interactive colour — use --primary which adjusts per theme.'],
  },

  'brand-secondary': {
    name:               'brand-secondary',
    cssVariable:        '--brand-secondary',
    category:           'brand',
    description:        'Secondary brand colour. Complements brand-primary in illustrations, gradient overlays, and brand-specific decorative UI.',
    usageExamples:      ['Gradient endpoints', 'Illustrations', 'Brand pattern fills'],
    primaryTailwindClass: 'bg-brand-secondary',
  },

  success: {
    name:               'success',
    cssVariable:        '--success',
    category:           'feedback',
    description:        'Positive-outcome colour for completed states, verified data, successful operations, and "connected" indicators.',
    usageExamples:      ['Alert: success variant', 'Toast: success variant', 'Status badge: active/connected', 'Form validation: valid'],
    primaryTailwindClass: 'bg-success',
    pairedForeground:   'success-foreground',
  },

  'success-foreground': {
    name:               'success-foreground',
    cssVariable:        '--success-foreground',
    category:           'typography',
    description:        'Text on success-coloured surfaces.',
    usageExamples:      ['Success toast text', 'Confirmed status label'],
    primaryTailwindClass: 'text-success-foreground',
    pairedSurface:      'success',
  },

  warning: {
    name:               'warning',
    cssVariable:        '--warning',
    category:           'feedback',
    description:        'Non-blocking advisory colour for limits approaching, optional actions required, or potential issues that do not prevent operation.',
    usageExamples:      ['Alert: warning variant', 'Storage quota indicator', 'Rate limit approaching banner', 'Deprecated feature notice'],
    primaryTailwindClass: 'bg-warning',
    pairedForeground:   'warning-foreground',
    antiPatterns:       ['Do not use for errors — use --destructive. Warning implies recoverable or non-critical.'],
  },

  'warning-foreground': {
    name:               'warning-foreground',
    cssVariable:        '--warning-foreground',
    category:           'typography',
    description:        'Text on warning-coloured surfaces.',
    usageExamples:      ['Warning alert text', 'Advisory notice copy'],
    primaryTailwindClass: 'text-warning-foreground',
    pairedSurface:      'warning',
  },

  info: {
    name:               'info',
    cssVariable:        '--info',
    category:           'feedback',
    description:        'Neutral-information colour for tips, system messages, in-progress states, and contextual help.',
    usageExamples:      ['Alert: info variant', 'Tooltip accent', 'In-progress status badge', 'Contextual help banner'],
    primaryTailwindClass: 'bg-info',
    pairedForeground:   'info-foreground',
  },

  'info-foreground': {
    name:               'info-foreground',
    cssVariable:        '--info-foreground',
    category:           'typography',
    description:        'Text on info-coloured surfaces.',
    usageExamples:      ['Info alert text', 'System message copy'],
    primaryTailwindClass: 'text-info-foreground',
    pairedSurface:      'info',
  },
} as const satisfies Record<SemanticColorToken, TokenDefinition>;

/** All token names as a runtime array. Useful for iterating in tests or docs generators. */
export const TOKEN_NAMES = Object.keys(TOKEN_REGISTRY) as SemanticColorToken[];

/** Subset of tokens grouped by category. */
export const TOKENS_BY_CATEGORY = TOKEN_NAMES.reduce<
  Partial<Record<TokenCategory, SemanticColorToken[]>>
>((acc, name) => {
  const { category } = TOKEN_REGISTRY[name];
  if (!acc[category]) acc[category] = [];
  acc[category]!.push(name);
  return acc;
}, {});

/** Returns the full definition for a token. Type-safe — only valid names compile. */
export function getToken(name: SemanticColorToken): TokenDefinition {
  return TOKEN_REGISTRY[name];
}

/** Returns the CSS custom property name for a token, e.g. "--primary". */
export function cssVar(name: SemanticColorToken): CSSVariableName {
  return TOKEN_REGISTRY[name].cssVariable;
}

/** Returns the inline CSS value reference for use in style props: `var(--primary)`. */
export function cssVarRef(name: SemanticColorToken): string {
  return `var(${TOKEN_REGISTRY[name].cssVariable})`;
}
