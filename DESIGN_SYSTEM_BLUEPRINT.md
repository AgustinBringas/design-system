# DESIGN_SYSTEM_BLUEPRINT.md

> **Single Source of Truth** — Architecture and Specification Blueprint for an enterprise-grade React Design System.
> Version: 1.0.0 | Last Updated: 2026-05-26

---

## Table of Contents

1. [Executive Summary & Design Philosophy](#1-executive-summary--design-philosophy)
2. [Workspace & Folder Architecture](#2-workspace--folder-architecture)
3. [Design Tokens & Theming Strategy](#3-design-tokens--theming-strategy)
4. [Component Development Workflow](#4-component-development-workflow)
5. [Storybook Configuration & Testing](#5-storybook-configuration--testing)
6. [Build, Package & Release Pipeline](#6-build-package--release-pipeline)

---

## 1. Executive Summary & Design Philosophy

### 1.1 Mission Statement

This design system is a **living, versioned infrastructure product** — not a UI kit. It encodes product decisions into reusable, accessible, and composable primitives that accelerate feature delivery while enforcing brand and quality standards across every surface.

### 1.2 Core Principles

#### Accessibility-First
Accessibility is a zero-compromise constraint, not a post-hoc audit. Every component is built on Radix UI headless primitives, which handle ARIA roles, keyboard navigation, and focus management by specification. Accessibility requirements are enforced at three layers: implementation (Radix), automation (`@storybook/addon-a11y`, `axe-core`), and CI (Chromatic + axe pipeline).

#### Composability Over Configuration
Components expose their internals through a **compound component pattern**. A `<Dialog>` is not a monolith that accepts a `content` prop — it exposes `<Dialog.Trigger>`, `<Dialog.Content>`, `<Dialog.Title>`, `<Dialog.Footer>`. This gives consuming engineers full layout and semantic control without forking the component.

#### Predictability & Explicit Contracts
All public APIs are strictly typed. No `any`. No implicit prop drilling. Component variants are enumerated and exhaustive — if a variant doesn't exist in the type, it does not exist in the system. CVA enforces this at the variant definition layer; TypeScript propagates it to the consumer.

#### Style Encapsulation via Tokens, Not Magic Numbers
No raw hex values, no arbitrary pixel values, and no inline styles in component source. All visual decisions flow through the design token layer, which maps directly to Tailwind's theme configuration. This creates a single update point for brand changes.

#### Performant by Default
The library is built to be fully tree-shakeable. Each component is an independent module. Side-effect-free builds (`"sideEffects": false` in `package.json`) ensure bundlers can eliminate unused components from consumer bundles without configuration.

### 1.3 Browser Support Matrix

| Browser              | Minimum Version | Notes                                  |
|----------------------|-----------------|----------------------------------------|
| Chrome / Chromium    | 109+            | Full support                           |
| Firefox              | 109+            | Full support                           |
| Safari               | 15.4+           | Container queries require 16+          |
| Edge (Chromium)      | 109+            | Identical to Chrome                    |
| iOS Safari           | 15.4+           | Touch target sizes enforced (44×44px)  |
| Samsung Internet     | 20+             | Tested on physical device in CI        |
| Opera                | 95+             | Chromium-based, treated as Chrome      |
| IE 11                | **Not supported** | No polyfills will be maintained       |

### 1.4 WCAG Compliance Targets

| Criterion              | Level  | Enforcement                               |
|------------------------|--------|-------------------------------------------|
| Color Contrast (text)  | AA     | 4.5:1 normal text, 3:1 large text         |
| Color Contrast (UI)    | AA     | 3:1 for all interactive elements          |
| Keyboard Navigation    | AA     | Full keyboard operability via Radix       |
| Focus Indicators       | AA     | 2px offset ring, visible in all themes    |
| Screen Reader Support  | AA     | Tested with NVDA/Firefox, VoiceOver/Safari|
| Motion & Animation     | AA     | `prefers-reduced-motion` respected on all transitions |
| Touch Targets          | AA     | Minimum 44×44px on all interactive elements |
| AAA Color Contrast     | Target | 7:1 for body text where feasible          |

---

## 2. Workspace & Folder Architecture

### 2.1 Repository Strategy

The repository is structured as a **pnpm monorepo** using workspaces. This isolates the core library from documentation, tooling packages, and internal applications while sharing a single `node_modules` resolution. The monorepo boundary is enforced by pnpm workspace protocols — internal packages reference each other with `workspace:*` rather than published versions during development.

### 2.2 Complete Folder Structure

```
design-system/
├── .changeset/
│   └── config.json                    # Changesets release config
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Lint, test, build on PR
│       ├── release.yml                # Publish to npm on merge to main
│       └── chromatic.yml              # Visual regression on PR
├── .husky/
│   ├── pre-commit                     # lint-staged
│   └── commit-msg                     # commitlint
├── packages/
│   ├── tokens/                        # @ds/tokens — design tokens package
│   │   ├── src/
│   │   │   ├── tokens/
│   │   │   │   ├── color.ts           # Primitive color palette
│   │   │   │   ├── semantic.ts        # Semantic aliases (surface, text, border)
│   │   │   │   ├── typography.ts      # Font families, sizes, weights, line-heights
│   │   │   │   ├── spacing.ts         # Spacing scale
│   │   │   │   ├── radius.ts          # Border radius scale
│   │   │   │   ├── shadow.ts          # Elevation / shadow scale
│   │   │   │   ├── motion.ts          # Duration, easing functions
│   │   │   │   └── breakpoints.ts     # Responsive breakpoints
│   │   │   ├── themes/
│   │   │   │   ├── light.ts           # Light theme semantic mapping
│   │   │   │   ├── dark.ts            # Dark theme semantic mapping
│   │   │   │   └── high-contrast.ts   # High-contrast theme for a11y
│   │   │   ├── tailwind/
│   │   │   │   └── preset.ts          # Tailwind config preset (exported)
│   │   │   ├── types.ts               # Token TypeScript interfaces
│   │   │   └── index.ts               # Public API
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/                         # @ds/utils — shared internal utilities
│   │   ├── src/
│   │   │   ├── cn.ts                  # clsx + tailwind-merge helper
│   │   │   ├── compose-refs.ts        # ref merging utility
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── hooks/                         # @ds/hooks — shared React hooks
│   │   ├── src/
│   │   │   ├── use-controllable-state.ts
│   │   │   ├── use-media-query.ts
│   │   │   ├── use-focus-trap.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/                            # @ds/ui — main component library
│       ├── src/
│       │   ├── components/
│       │   │   ├── button/
│       │   │   │   ├── button.tsx
│       │   │   │   ├── button.variants.ts
│       │   │   │   ├── button.stories.tsx
│       │   │   │   ├── button.test.tsx
│       │   │   │   └── index.ts
│       │   │   ├── dialog/
│       │   │   │   ├── dialog.tsx
│       │   │   │   ├── dialog.variants.ts
│       │   │   │   ├── dialog.stories.tsx
│       │   │   │   ├── dialog.test.tsx
│       │   │   │   └── index.ts
│       │   │   ├── input/
│       │   │   ├── select/
│       │   │   ├── checkbox/
│       │   │   ├── radio-group/
│       │   │   ├── switch/
│       │   │   ├── tooltip/
│       │   │   ├── popover/
│       │   │   ├── dropdown-menu/
│       │   │   ├── avatar/
│       │   │   ├── badge/
│       │   │   ├── card/
│       │   │   ├── separator/
│       │   │   ├── skeleton/
│       │   │   ├── tabs/
│       │   │   ├── toast/
│       │   │   └── typography/
│       │   ├── providers/
│       │   │   └── theme-provider.tsx  # ThemeProvider, useTheme hook
│       │   └── index.ts                # Barrel — all public exports
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts             # Library build config
│
├── apps/
│   └── docs/                          # Storybook documentation app
│       ├── .storybook/
│       │   ├── main.ts                # Storybook main config
│       │   ├── preview.ts             # Global decorators, parameters
│       │   └── theme.ts               # Storybook UI theme
│       ├── stories/
│       │   └── welcome.mdx            # Landing page story
│       ├── package.json
│       └── tsconfig.json
│
├── package.json                       # Root pnpm workspace
├── pnpm-workspace.yaml
├── tsconfig.base.json                 # Shared TypeScript config
├── biome.json                         # Biome linter + formatter config
├── commitlint.config.js               # Conventional commits enforcement
└── DESIGN_SYSTEM_BLUEPRINT.md
```

### 2.3 Root Configuration Files

**`pnpm-workspace.yaml`**
```yaml
packages:
  - "packages/*"
  - "apps/*"
```

**Root `package.json`**
```json
{
  "name": "design-system-root",
  "private": true,
  "scripts": {
    "build": "pnpm -r --filter='./packages/*' build",
    "lint": "biome check --apply .",
    "test": "pnpm -r test",
    "storybook": "pnpm --filter=docs storybook",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm build && changeset publish"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "@changesets/cli": "^2.27.0",
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "typescript": "^5.5.0"
  }
}
```

**`tsconfig.base.json`**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true
  }
}
```

---

## 3. Design Tokens & Theming Strategy

### 3.1 Token Architecture: Three-Tier Model

Tokens are organized in three tiers. This prevents semantic coupling to primitive values and enables theme swapping without changing component code.

```
Tier 1: Primitives   →  color.slate[900]     (raw values, never used directly in components)
         ↓
Tier 2: Semantic     →  color.text.primary   (role-based aliases, map to primitives per theme)
         ↓
Tier 3: Component    →  button.bg.default    (component-scoped overrides — used sparingly)
```

Components reference **Tier 2 (Semantic)** tokens exclusively. Tier 3 is reserved for complex components where semantic tokens are insufficient without ambiguity.

### 3.2 TypeScript Token Schema

**`packages/tokens/src/types.ts`**
```typescript
export interface ColorScale {
  readonly 50: string;
  readonly 100: string;
  readonly 200: string;
  readonly 300: string;
  readonly 400: string;
  readonly 500: string;
  readonly 600: string;
  readonly 700: string;
  readonly 800: string;
  readonly 900: string;
  readonly 950: string;
}

export interface PrimitiveColors {
  readonly slate: ColorScale;
  readonly gray: ColorScale;
  readonly zinc: ColorScale;
  readonly neutral: ColorScale;
  readonly stone: ColorScale;
  readonly red: ColorScale;
  readonly orange: ColorScale;
  readonly amber: ColorScale;
  readonly yellow: ColorScale;
  readonly lime: ColorScale;
  readonly green: ColorScale;
  readonly emerald: ColorScale;
  readonly teal: ColorScale;
  readonly cyan: ColorScale;
  readonly sky: ColorScale;
  readonly blue: ColorScale;
  readonly indigo: ColorScale;
  readonly violet: ColorScale;
  readonly purple: ColorScale;
  readonly fuchsia: ColorScale;
  readonly pink: ColorScale;
  readonly rose: ColorScale;
  readonly white: string;
  readonly black: string;
  readonly transparent: string;
}

export interface SemanticColors {
  background: {
    default: string;
    subtle: string;
    muted: string;
    inverse: string;
  };
  surface: {
    default: string;
    raised: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    onAccent: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
    focus: string;
  };
  accent: {
    default: string;
    hover: string;
    active: string;
    subtle: string;
    foreground: string;
  };
  destructive: {
    default: string;
    hover: string;
    subtle: string;
    foreground: string;
  };
  success: {
    default: string;
    subtle: string;
    foreground: string;
  };
  warning: {
    default: string;
    subtle: string;
    foreground: string;
  };
  info: {
    default: string;
    subtle: string;
    foreground: string;
  };
}

export interface TypographyTokens {
  fontFamily: {
    sans: string;
    mono: string;
    display: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
}

export interface SpacingTokens {
  readonly 0: string;
  readonly px: string;
  readonly 0.5: string;
  readonly 1: string;
  readonly 1.5: string;
  readonly 2: string;
  readonly 2.5: string;
  readonly 3: string;
  readonly 3.5: string;
  readonly 4: string;
  readonly 5: string;
  readonly 6: string;
  readonly 7: string;
  readonly 8: string;
  readonly 9: string;
  readonly 10: string;
  readonly 11: string;
  readonly 12: string;
  readonly 14: string;
  readonly 16: string;
  readonly 20: string;
  readonly 24: string;
  readonly 28: string;
  readonly 32: string;
  readonly 36: string;
  readonly 40: string;
  readonly 44: string;
  readonly 48: string;
  readonly 56: string;
  readonly 64: string;
  readonly 72: string;
  readonly 80: string;
  readonly 96: string;
}

export interface RadiusTokens {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ShadowTokens {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

export interface MotionTokens {
  duration: {
    instant: string;
    fast: string;
    normal: string;
    slow: string;
    slower: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;
  };
}

export interface BreakpointTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface DesignTokens {
  colors: {
    primitive: PrimitiveColors;
    semantic: SemanticColors;
  };
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadow: ShadowTokens;
  motion: MotionTokens;
  breakpoints: BreakpointTokens;
}
```

### 3.3 Semantic Token Definitions (Light Theme)

**`packages/tokens/src/themes/light.ts`**
```typescript
import type { SemanticColors } from '../types';
import { primitiveColors } from '../tokens/color';

export const lightSemanticColors: SemanticColors = {
  background: {
    default: primitiveColors.white,
    subtle:   primitiveColors.slate[50],
    muted:    primitiveColors.slate[100],
    inverse:  primitiveColors.slate[900],
  },
  surface: {
    default: primitiveColors.white,
    raised:  primitiveColors.white,
    overlay: primitiveColors.white,
  },
  text: {
    primary:   primitiveColors.slate[900],
    secondary: primitiveColors.slate[600],
    tertiary:  primitiveColors.slate[400],
    disabled:  primitiveColors.slate[300],
    inverse:   primitiveColors.white,
    onAccent:  primitiveColors.white,
  },
  border: {
    default: primitiveColors.slate[200],
    subtle:  primitiveColors.slate[100],
    strong:  primitiveColors.slate[400],
    focus:   primitiveColors.blue[500],
  },
  accent: {
    default:    primitiveColors.blue[600],
    hover:      primitiveColors.blue[700],
    active:     primitiveColors.blue[800],
    subtle:     primitiveColors.blue[50],
    foreground: primitiveColors.white,
  },
  destructive: {
    default:    primitiveColors.red[600],
    hover:      primitiveColors.red[700],
    subtle:     primitiveColors.red[50],
    foreground: primitiveColors.white,
  },
  success: {
    default:    primitiveColors.green[600],
    subtle:     primitiveColors.green[50],
    foreground: primitiveColors.white,
  },
  warning: {
    default:    primitiveColors.amber[500],
    subtle:     primitiveColors.amber[50],
    foreground: primitiveColors.white,
  },
  info: {
    default:    primitiveColors.sky[600],
    subtle:     primitiveColors.sky[50],
    foreground: primitiveColors.white,
  },
};
```

### 3.4 Tailwind Preset

**`packages/tokens/src/tailwind/preset.ts`**
```typescript
import type { Config } from 'tailwindcss';
import { lightSemanticColors } from '../themes/light';
import { primitiveColors } from '../tokens/color';
import { typographyTokens } from '../tokens/typography';
import { radiusTokens } from '../tokens/radius';
import { shadowTokens } from '../tokens/shadow';
import { motionTokens } from '../tokens/motion';

const preset: Config = {
  content: [],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    colors: {
      ...primitiveColors,
      background:  'hsl(var(--color-background) / <alpha-value>)',
      surface:     'hsl(var(--color-surface) / <alpha-value>)',
      foreground:  'hsl(var(--color-foreground) / <alpha-value>)',
      accent: {
        DEFAULT:    'hsl(var(--color-accent) / <alpha-value>)',
        foreground: 'hsl(var(--color-accent-foreground) / <alpha-value>)',
      },
      destructive: {
        DEFAULT:    'hsl(var(--color-destructive) / <alpha-value>)',
        foreground: 'hsl(var(--color-destructive-foreground) / <alpha-value>)',
      },
      border:  'hsl(var(--color-border) / <alpha-value>)',
      ring:    'hsl(var(--color-ring) / <alpha-value>)',
      input:   'hsl(var(--color-input) / <alpha-value>)',
      muted: {
        DEFAULT:    'hsl(var(--color-muted) / <alpha-value>)',
        foreground: 'hsl(var(--color-muted-foreground) / <alpha-value>)',
      },
      card: {
        DEFAULT:    'hsl(var(--color-card) / <alpha-value>)',
        foreground: 'hsl(var(--color-card-foreground) / <alpha-value>)',
      },
      popover: {
        DEFAULT:    'hsl(var(--color-popover) / <alpha-value>)',
        foreground: 'hsl(var(--color-popover-foreground) / <alpha-value>)',
      },
    },
    extend: {
      fontFamily:    typographyTokens.fontFamily,
      fontSize:      typographyTokens.fontSize,
      fontWeight:    typographyTokens.fontWeight,
      lineHeight:    typographyTokens.lineHeight,
      letterSpacing: typographyTokens.letterSpacing,
      borderRadius:  radiusTokens,
      boxShadow:     shadowTokens,
      transitionDuration: motionTokens.duration,
      transitionTimingFunction: motionTokens.easing,
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-8px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to:   { transform: 'translateY(0)',   opacity: '1' },
        },
      },
      animation: {
        'fade-in':             'fade-in 150ms ease-out',
        'slide-in-from-top':   'slide-in-from-top 200ms ease-out',
        'slide-in-from-bottom':'slide-in-from-bottom 200ms ease-out',
      },
    },
  },
  plugins: [],
};

export default preset;
```

### 3.5 Dark Mode & Multi-Theme Strategy

Themes are applied by injecting **CSS custom properties** (HSL channels, not full HSL values — this enables Tailwind's opacity modifier syntax) onto the `:root` or a `[data-theme]` attribute. The `ThemeProvider` manages the active theme via React context and synchronizes it with the DOM attribute.

**CSS Variables Structure (`globals.css` in the consuming app)**
```css
:root,
[data-theme="light"] {
  --color-background:           0 0% 100%;
  --color-foreground:           222.2 47.4% 11.2%;
  --color-surface:              0 0% 100%;
  --color-muted:                210 40% 96.1%;
  --color-muted-foreground:     215.4 16.3% 46.9%;
  --color-accent:               217.2 91.2% 59.8%;
  --color-accent-foreground:    0 0% 100%;
  --color-destructive:          0 84.2% 60.2%;
  --color-destructive-foreground: 0 0% 98%;
  --color-border:               214.3 31.8% 91.4%;
  --color-input:                214.3 31.8% 91.4%;
  --color-ring:                 217.2 91.2% 59.8%;
  --color-card:                 0 0% 100%;
  --color-card-foreground:      222.2 47.4% 11.2%;
  --color-popover:              0 0% 100%;
  --color-popover-foreground:   222.2 47.4% 11.2%;
}

[data-theme="dark"] {
  --color-background:           222.2 84% 4.9%;
  --color-foreground:           210 40% 98%;
  --color-surface:              222.2 84% 4.9%;
  --color-muted:                217.2 32.6% 17.5%;
  --color-muted-foreground:     215 20.2% 65.1%;
  --color-accent:               217.2 91.2% 59.8%;
  --color-accent-foreground:    0 0% 100%;
  --color-destructive:          0 62.8% 30.6%;
  --color-destructive-foreground: 0 0% 98%;
  --color-border:               217.2 32.6% 17.5%;
  --color-input:                217.2 32.6% 17.5%;
  --color-ring:                 224.3 76.3% 48%;
  --color-card:                 222.2 84% 4.9%;
  --color-card-foreground:      210 40% 98%;
  --color-popover:              222.2 84% 4.9%;
  --color-popover-foreground:   210 40% 98%;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**`packages/ui/src/providers/theme-provider.tsx`**
```typescript
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ds-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme,
  );

  const resolvedTheme = useResolvedTheme(theme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (next: Theme) => {
      localStorage.setItem(storageKey, next);
      setThemeState(next);
    },
    [storageKey],
  );

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useResolvedTheme(theme: Theme): 'light' | 'dark' {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) =>
      setSystemTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return theme === 'system' ? systemTheme : theme;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

### 3.6 Figma → Token Mapping Workflow

Figma tokens are exported via the **Figma Tokens** plugin (or `@figma/rest-api-client` in a sync script) as JSON. A build script in `packages/tokens/scripts/sync.ts` transforms the JSON output into the TypeScript token files. The transform rules:

| Figma Token Type | Figma Variable Name        | TypeScript Path                      |
|------------------|----------------------------|--------------------------------------|
| Color/Primitive  | `color/blue/600`           | `primitiveColors.blue[600]`          |
| Color/Semantic   | `color/text/primary`       | `semanticColors.text.primary`        |
| Typography       | `typography/size/lg`       | `typographyTokens.fontSize.lg`       |
| Spacing          | `spacing/4`                | `spacingTokens[4]`                   |
| Border Radius    | `radius/md`                | `radiusTokens.md`                    |

The sync script writes the output and immediately runs `tsc --noEmit` to validate the shape against the TypeScript interfaces. CI fails if token sync produces a type error, ensuring Figma is always the source of truth.

---

## 4. Component Development Workflow

### 4.1 File Naming Convention

All component files follow this exact structure. No exceptions. Deviations are caught by a custom Biome rule.

```
{component-name}/
├── {component-name}.tsx          # React component implementation
├── {component-name}.variants.ts  # CVA variant definitions (if complex)
├── {component-name}.stories.tsx  # Storybook stories (CSF 3)
├── {component-name}.test.tsx     # Vitest + Testing Library unit tests
└── index.ts                      # Public API barrel
```

Rules:
- File names are **kebab-case** without exception.
- Component function names are **PascalCase**.
- `index.ts` is the only file that may `export *` — all other cross-component imports must use the direct file path.
- No `default` exports for components — named exports only. This prevents anonymous components in stack traces and enables refactoring tools.

### 4.2 The `cn` Utility

The foundation of all component styling. It merges `clsx` (conditional class logic) with `tailwind-merge` (conflict resolution — e.g., `p-4` overrides `p-2` rather than both applying).

**`packages/utils/src/cn.ts`**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### 4.3 Button Component — Full Implementation

The `Button` is the canonical reference implementation. It demonstrates: Radix Slot for polymorphic rendering, CVA for exhaustive variant typing, strict prop typing extending native HTML, and the loading state pattern.

---

#### `button.variants.ts`

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  // Base classes — always applied
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-md text-sm font-medium',
    'ring-offset-background transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-accent-foreground',
          'hover:bg-accent/90 active:bg-accent/80',
        ],
        secondary: [
          'bg-muted text-foreground border border-border',
          'hover:bg-muted/80 active:bg-muted/60',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90 active:bg-destructive/80',
        ],
        outline: [
          'border border-border bg-background text-foreground',
          'hover:bg-muted active:bg-muted/80',
        ],
        ghost: [
          'text-foreground',
          'hover:bg-muted active:bg-muted/80',
        ],
        link: [
          'text-accent underline-offset-4',
          'hover:underline active:opacity-70',
          'h-auto p-0',
        ],
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded',
        sm: 'h-8 px-3 text-sm',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-7 w-7 p-0',
        'icon-lg': 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
```

---

#### `button.tsx`

```typescript
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@ds/utils';
import { buttonVariants, type ButtonVariants } from './button.variants';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  /**
   * Merges the button's props onto its immediate child, removing the wrapping
   * DOM element. Use to render a button-styled `<Link>` component or anchor.
   * @example <Button asChild><a href="/home">Home</a></Button>
   */
  asChild?: boolean;
  /**
   * Renders a spinner and sets aria-disabled. The button remains in the
   * tab order and announces its loading state to screen readers.
   */
  loading?: boolean;
  /**
   * Accessible label for the loading state. Announced to screen readers
   * when `loading` is true.
   * @default "Loading..."
   */
  loadingText?: string;
  /**
   * Icon rendered before the button label.
   */
  leadingIcon?: ReactNode;
  /**
   * Icon rendered after the button label.
   */
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText = 'Loading...',
      leadingIcon,
      trailingIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-loading={loading ? 'true' : undefined}
        {...props}
      >
        {loading ? (
          <>
            <Spinner aria-hidden="true" className="animate-spin" />
            <span className="sr-only">{loadingText}</span>
            <span aria-hidden="true">{children}</span>
          </>
        ) : (
          <>
            {leadingIcon}
            {children}
            {trailingIcon}
          </>
        )}
      </Comp>
    );
  },
);

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('size-4', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
```

---

#### `button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { ArrowRight, Download, Trash2 } from 'lucide-react';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
      description: 'Visual style of the button',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    asChild: {
      table: { disable: true },
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An interactive element that triggers an action. Supports polymorphic rendering via `asChild`, icon slots, and a managed loading state.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button leadingIcon={<Download />}>Download</Button>
      <Button trailingIcon={<ArrowRight />}>Continue</Button>
      <Button variant="destructive" leadingIcon={<Trash2 />}>
        Delete
      </Button>
      <Button size="icon" aria-label="Download file">
        <Download />
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    loadingText: 'Saving changes...',
    children: 'Save Changes',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(button).toHaveAttribute('data-loading', 'true');
    await expect(canvas.getByText('Saving changes...')).toBeInTheDocument();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
  },
};

export const AsChild: Story = {
  render: () => (
    <Button asChild variant="outline">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        External Link
        <ArrowRight className="ml-1" />
      </a>
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Renders a button-styled anchor by merging props onto the child element via Radix Slot. No wrapper `<button>` is rendered in the DOM.',
      },
    },
  },
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    button.focus();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
  },
};
```

---

#### `button.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('applies variant classes', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive');
    });

    it('applies size classes', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('merges custom className without conflict', () => {
      render(<Button className="w-full">Full width</Button>);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('renders a leading icon', () => {
      render(
        <Button leadingIcon={<span data-testid="icon" />}>With icon</Button>,
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('sets aria-disabled and data-loading when loading', () => {
      render(<Button loading>Save</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('data-loading', 'true');
    });

    it('renders sr-only loading text', () => {
      render(<Button loading loadingText="Uploading file...">Upload</Button>);
      expect(screen.getByText('Uploading file...')).toHaveClass('sr-only');
    });

    it('does not call onClick when loading', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Submit
        </Button>,
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('sets disabled attribute', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not fire onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>,
      );
      await user.click(screen.getByRole('button'), { pointerEventsCheck: 0 });
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('asChild', () => {
    it('renders child element instead of button', () => {
      render(
        <Button asChild>
          <a href="/home">Home</a>
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Home' });
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
    });

    it('does not render a button element when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/home">Home</a>
        </Button>,
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('is focusable by default', () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('triggers onClick on Enter keypress', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Press Enter</Button>);
      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('triggers onClick on Space keypress', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Press Space</Button>);
      screen.getByRole('button').focus();
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
```

---

#### `index.ts`

```typescript
export { Button, type ButtonProps } from './button';
export { buttonVariants, type ButtonVariants } from './button.variants';
```

### 4.4 Dialog Component — Compound Pattern with Radix UI

The Dialog demonstrates the compound component pattern. Internal sub-components are namespaced onto the root export to enforce co-location at the call site.

**`dialog.tsx`**
```typescript
'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';
import { cn } from '@ds/utils';
import { dialogVariants } from './dialog.variants';

const Dialog = RadixDialog.Root;
const DialogTrigger = RadixDialog.Trigger;
const DialogPortal = RadixDialog.Portal;
const DialogClose = RadixDialog.Close;

const DialogOverlay = forwardRef<
  ElementRef<typeof RadixDialog.Overlay>,
  ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <RadixDialog.Overlay
      ref={ref}
      className={cn(dialogVariants.overlay(), className)}
      {...props}
    />
  );
});

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  /**
   * Hides the default close button (X). Use when the dialog has explicit
   * Cancel/Close actions in DialogFooter.
   */
  hideCloseButton?: boolean;
}

const DialogContent = forwardRef<
  ElementRef<typeof RadixDialog.Content>,
  DialogContentProps
>(function DialogContent({ className, hideCloseButton, children, ...props }, ref) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <RadixDialog.Content
        ref={ref}
        className={cn(dialogVariants.content(), className)}
        {...props}
      >
        {!hideCloseButton && (
          <RadixDialog.Close className={cn(dialogVariants.closeButton())}>
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Close dialog</span>
          </RadixDialog.Close>
        )}
        {children}
      </RadixDialog.Content>
    </DialogPortal>
  );
});

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-left', className)}
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    {...props}
  />
);

const DialogTitle = forwardRef<
  ElementRef<typeof RadixDialog.Title>,
  ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <RadixDialog.Title
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
});

const DialogDescription = forwardRef<
  ElementRef<typeof RadixDialog.Description>,
  ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <RadixDialog.Description
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
```

**`dialog.variants.ts`**
```typescript
import { cva } from 'class-variance-authority';

export const dialogVariants = {
  overlay: cva([
    'fixed inset-0 z-50',
    'bg-black/60 backdrop-blur-sm',
    'data-[state=open]:animate-fade-in',
    'data-[state=closed]:animate-fade-out',
  ]),
  content: cva([
    'fixed left-1/2 top-1/2 z-50',
    '-translate-x-1/2 -translate-y-1/2',
    'w-full max-w-lg',
    'bg-background border border-border rounded-lg shadow-lg',
    'p-6',
    'duration-200',
    'data-[state=open]:animate-slide-in-from-top',
    'data-[state=closed]:animate-slide-out-to-top',
    'focus:outline-none',
  ]),
  closeButton: cva([
    'absolute right-4 top-4',
    'rounded-sm opacity-70 ring-offset-background',
    'hover:opacity-100',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    'disabled:pointer-events-none',
    'transition-opacity',
  ]),
};
```

### 4.5 Component Checklist

Every component must satisfy this checklist before merging to `main`:

- [ ] Props interface extends native HTML attributes (`HTMLButtonElement`, `HTMLDivElement`, etc.)
- [ ] `forwardRef` implemented (all DOM-rendering components)
- [ ] Named export only — no default export
- [ ] `asChild` pattern implemented via Radix Slot where polymorphism is needed
- [ ] All visual states have corresponding CVA variant entries
- [ ] `data-*` attributes used for state-driven styling (loading, selected, open)
- [ ] `aria-*` attributes set for all non-obvious semantic cases
- [ ] `@storybook/addon-a11y` passes with zero violations in Default story
- [ ] Keyboard navigation tested in `play` function
- [ ] Unit tests cover: render, variants, disabled, keyboard, a11y roles
- [ ] `displayName` set on the component (automatically set by using named function declaration in `forwardRef`)
- [ ] `index.ts` exports both component and its props type

---

## 5. Storybook Configuration & Testing

### 5.1 Storybook Main Configuration

**`apps/docs/.storybook/main.ts`**
```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../../../packages/ui/src/**/*.stories.@(ts|tsx)', '../stories/**/*.mdx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
    {
      name: '@storybook/addon-coverage',
      options: {
        istanbul: {
          include: ['**/src/**'],
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  viteFinal: (config) => {
    return {
      ...config,
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [...(config.optimizeDeps?.include ?? []), '@ds/tokens', '@ds/utils'],
      },
    };
  },
};

export default config;
```

### 5.2 Storybook Preview Configuration

**`apps/docs/.storybook/preview.ts`**
```typescript
import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../../../packages/ui/src/globals.css';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        Light: 'light',
        Dark: 'dark',
        'High Contrast': 'high-contrast',
      },
      defaultTheme: 'Light',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
    layout: 'padded',
    backgrounds: { disable: true },
  },
};

export default preview;
```

### 5.3 Vitest Configuration

**`packages/ui/vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        '**/*.stories.tsx',
        '**/*.variants.ts',
        '**/index.ts',
        '**/test-setup.ts',
      ],
      thresholds: {
        lines: 85,
        branches: 80,
        functions: 85,
        statements: 85,
      },
    },
  },
});
```

**`packages/ui/src/test-setup.ts`**
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Silence Radix UI pointer capture warnings in jsdom
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: vi.fn(),
});
Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
  value: vi.fn(),
});
Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
  value: vi.fn(),
});

// Mock matchMedia for theme tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### 5.4 Accessibility Testing Pipeline

Accessibility is validated at three levels:

#### Level 1 — Automated (Per Story)
`@storybook/addon-a11y` runs `axe-core` against every rendered story in the browser. Any WCAG 2.1 AA violation blocks the story from passing in CI.

#### Level 2 — Interaction Tests (`play` functions)
Storybook interaction tests (`@storybook/addon-interactions`) verify keyboard navigation, focus management, and ARIA attribute correctness by simulating real user flows. These run headlessly in CI via `test-storybook`.

```json
{
  "scripts": {
    "test:storybook": "test-storybook --url http://localhost:6006 --coverage"
  }
}
```

#### Level 3 — Visual Regression (Chromatic)
Chromatic captures pixel-level screenshots of every story on every commit and flags visual diffs for human review. It also serves as the accessibility regression gate — if a refactor inadvertently breaks focus styling, Chromatic catches it visually.

Chromatic integration in CI:
```yaml
- name: Run Chromatic
  uses: chromaui/action@latest
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    buildScriptName: build-storybook
    onlyChanged: true        # Snapshot only changed stories
    exitZeroOnChanges: false # Fail CI on unreviewed visual changes
```

### 5.5 Storybook Coverage Reporting

Component coverage from Storybook interaction tests is merged with Vitest unit test coverage into a single `lcov.info` file, then uploaded to Codecov:

```yaml
- name: Merge coverage reports
  run: |
    npx lcov-result-merger 'coverage/*/lcov.info' combined-lcov.info

- name: Upload to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./combined-lcov.info
```

---

## 6. Build, Package & Release Pipeline

### 6.1 Vite Library Build Configuration

**`packages/ui/vite.config.ts`**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import { readdirSync } from 'fs';

function getComponentEntries(): Record<string, string> {
  const componentsDir = resolve(__dirname, 'src/components');
  return readdirSync(componentsDir).reduce(
    (entries, dir) => ({
      ...entries,
      [`components/${dir}/index`]: resolve(componentsDir, dir, 'index.ts'),
    }),
    {},
  );
}

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx', 'src/test-setup.ts'],
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...getComponentEntries(),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        format === 'es' ? `${entryName}.js` : `${entryName}.cjs`,
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        /^@radix-ui\/.*/,
        /^@ds\/.*/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css';
          return assetInfo.name ?? 'asset';
        },
      },
    },
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
  },
});
```

### 6.2 Package Manifest (`packages/ui/package.json`)

```json
{
  "name": "@ds/ui",
  "version": "0.0.1",
  "description": "Enterprise design system component library",
  "keywords": ["design-system", "react", "typescript", "tailwindcss"],
  "license": "MIT",
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./components/*": {
      "import": "./dist/components/*/index.js",
      "require": "./dist/components/*/index.cjs",
      "types": "./dist/components/*/index.d.ts"
    },
    "./styles": "./dist/index.css"
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "src"],
  "scripts": {
    "build": "vite build",
    "test": "vitest run --coverage",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "clean": "rimraf dist"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "tailwindcss": "^3.4.0 || ^4.0.0"
  },
  "dependencies": {
    "@ds/tokens": "workspace:*",
    "@ds/utils": "workspace:*",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.400.0",
    "tailwind-merge": "^2.4.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^24.0.0",
    "rimraf": "^5.0.0",
    "vite": "^5.4.0",
    "vite-plugin-dts": "^4.0.0",
    "vite-tsconfig-paths": "^5.0.0",
    "vitest": "^2.0.0"
  }
}
```

### 6.3 Changesets Configuration

**`.changeset/config.json`**
```json
{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": "@changesets/changelog-github",
  "commit": false,
  "fixed": [],
  "linked": [["@ds/ui", "@ds/tokens", "@ds/hooks", "@ds/utils"]],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

**Release Workflow:**
1. Developer runs `pnpm changeset` on a feature branch → selects affected packages, bump type (major/minor/patch), and writes a human-readable changelog entry.
2. The `.changeset/*.md` file is committed with the PR.
3. On merge to `main`, the **Version Packages** job runs `changeset version` → bumps `package.json` versions and aggregates `CHANGELOG.md` entries across all affected packages.
4. The **Publish** job runs `changeset publish` → builds and publishes to npm under the `@ds` scope.

### 6.4 Biome Configuration

**`biome.json`**
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["dist", "node_modules", "coverage", "storybook-static"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 90
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "error",
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "error"
      },
      "suspicious": {
        "noExplicitAny": "error",
        "noArrayIndexKey": "warn"
      },
      "style": {
        "useImportType": "error",
        "noNonNullAssertion": "warn",
        "useNamingConvention": {
          "level": "error",
          "options": {
            "strictCase": false,
            "conventions": [
              {
                "selector": { "kind": "function" },
                "formats": ["camelCase", "PascalCase"]
              },
              {
                "selector": { "kind": "typeLike" },
                "formats": ["PascalCase"]
              }
            ]
          }
        }
      },
      "a11y": {
        "useAltText": "error",
        "useAriaLabels": "error",
        "useButtonType": "error",
        "useKeyWithClickEvents": "error",
        "noAutofocus": "warn",
        "useFocusableInteractive": "error",
        "noRedundantAlt": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "always"
    }
  }
}
```

### 6.5 CI/CD GitHub Actions Workflows

#### `.github/workflows/ci.yml` — Pull Request Validation

```yaml
name: CI

on:
  pull_request:
    branches: [main, next]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint (Biome)
        run: pnpm biome check .

      - name: Type check
        run: pnpm -r typecheck

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Run tests with coverage
        run: pnpm test --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./packages/ui/coverage/lcov.info
          fail_ci_if_error: true

  build:
    name: Build Library
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build

      - name: Verify ESM output
        run: node --input-type=module < packages/ui/dist/index.js

      - name: Verify CJS output
        run: node packages/ui/dist/index.cjs

      - name: Check bundle size
        uses: preactjs/compressed-size-action@v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          pattern: './packages/ui/dist/**/*.{js,cjs}'

  storybook-tests:
    name: Storybook Interaction Tests
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Build Storybook
        run: pnpm --filter=docs build-storybook

      - name: Run Storybook tests
        run: |
          npx concurrently -k -s first -n "SB,TEST" \
            "npx http-server apps/docs/storybook-static --port 6006 --silent" \
            "npx wait-on tcp:6006 && pnpm --filter=docs test:storybook"
```

#### `.github/workflows/release.yml` — Publish to npm

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency:
  group: release
  cancel-in-progress: false

jobs:
  release:
    name: Version & Publish
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install --frozen-lockfile

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version-packages
          title: 'chore: version packages'
          commit: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          NPM_CONFIG_PROVENANCE: true
```

#### `.github/workflows/chromatic.yml` — Visual Regression

```yaml
name: Chromatic

on:
  pull_request:
    branches: [main]

jobs:
  chromatic:
    name: Visual Regression
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Run Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          workingDir: apps/docs
          buildScriptName: build-storybook
          onlyChanged: true
          exitZeroOnChanges: false
          autoAcceptChanges: 'main'
          exitOnceUploaded: false
```

### 6.6 Husky & Lint-Staged

**`.husky/pre-commit`**
```sh
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"
pnpm lint-staged
```

**`.husky/commit-msg`**
```sh
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"
pnpm commitlint --edit "$1"
```

**Root `package.json` (lint-staged config)**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "biome check --apply --no-errors-on-unmatched"
    ],
    "*.{json,md,yaml,yml}": [
      "biome format --write --no-errors-on-unmatched"
    ]
  }
}
```

**`commitlint.config.js`**
```javascript
/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['ui', 'tokens', 'hooks', 'utils', 'docs', 'ci', 'deps', 'release'],
    ],
    'body-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 72],
  },
};

export default config;
```

---

## Appendix A: Component Inventory & Priority Roadmap

| Tier | Component        | Radix Primitive             | Status      |
|------|------------------|-----------------------------|-------------|
| 1    | Button           | `@radix-ui/react-slot`      | Reference   |
| 1    | Input            | Native `<input>`            | Priority    |
| 1    | Dialog           | `@radix-ui/react-dialog`    | Reference   |
| 1    | Select           | `@radix-ui/react-select`    | Priority    |
| 1    | Checkbox         | `@radix-ui/react-checkbox`  | Priority    |
| 1    | Switch           | `@radix-ui/react-switch`    | Priority    |
| 1    | Toast            | `@radix-ui/react-toast`     | Priority    |
| 2    | Tooltip          | `@radix-ui/react-tooltip`   | Next        |
| 2    | Popover          | `@radix-ui/react-popover`   | Next        |
| 2    | Dropdown Menu    | `@radix-ui/react-dropdown-menu` | Next    |
| 2    | Tabs             | `@radix-ui/react-tabs`      | Next        |
| 2    | Avatar           | `@radix-ui/react-avatar`    | Next        |
| 2    | Badge            | None (styled div)           | Next        |
| 2    | Card             | None (composed)             | Next        |
| 3    | Radio Group      | `@radix-ui/react-radio-group` | Planned   |
| 3    | Accordion        | `@radix-ui/react-accordion` | Planned     |
| 3    | Slider           | `@radix-ui/react-slider`    | Planned     |
| 3    | Progress         | `@radix-ui/react-progress`  | Planned     |
| 3    | Skeleton         | None (animation)            | Planned     |
| 3    | Separator        | `@radix-ui/react-separator` | Planned     |
| 3    | Typography       | None (composed)             | Planned     |

---

## Appendix B: Consumer Integration Guide

### Installation

```bash
pnpm add @ds/ui @ds/tokens
pnpm add -D tailwindcss
```

### Tailwind Config in Consumer App

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import dsPreset from '@ds/tokens/tailwind/preset';

export default {
  presets: [dsPreset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@ds/ui/dist/**/*.js',   // scan library classes
  ],
} satisfies Config;
```

### App Entry Point

```typescript
// main.tsx
import '@ds/ui/styles';   // design system CSS variables
import './globals.css';   // app-level overrides (if any)
import { ThemeProvider } from '@ds/ui';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
```

### Tree-Shaking Verification

After integrating, verify that unused components are eliminated:

```bash
npx vite-bundle-visualizer
# or
npx source-map-explorer dist/assets/*.js
```

A consumer importing only `Button` should not include `Dialog` or any other component's code in their production bundle.

---

*This document is a living specification. All architectural decisions recorded here represent the baseline. Deviations require an ADR (Architecture Decision Record) filed in `.github/adr/`.*
