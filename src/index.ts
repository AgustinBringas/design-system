// CSS custom properties — must be imported before any component renders.
// Consumers who prefer an explicit import should use @ds/ui/styles instead
// of relying on this side-effect. Both point to the same compiled CSS.
import './index.css';

// ─── Providers ────────────────────────────────────────────────────────────
// export { ThemeProvider, useTheme } from './providers/theme-provider';

// ─── Components ───────────────────────────────────────────────────────────
export * from './components/button';
export * from './components/card';
export * from './components/context-menu';
export * from './components/drawer';
export * from './components/dropdown-menu';
export * from './components/input';
export * from './components/modal';
export * from './components/separator';
export * from './components/textarea';
export * from './components/toaster';
export * from './components/text';
export * from './components/tooltip';

// ─── Hooks ────────────────────────────────────────────────────────────────
// export * from './hooks/use-controllable-state';
// export * from './hooks/use-media-query';

// ─── Utilities ────────────────────────────────────────────────────────────
export { cn } from './utils/cn';

// ─── Token types (public API) ─────────────────────────────────────────────
export type {
  SemanticColorToken,
  TokenCategory,
  TokenDefinition,
  CSSVariableName,
  TailwindColorValue,
} from './types/tokens';

export {
  TOKEN_REGISTRY,
  TOKEN_NAMES,
  TOKENS_BY_CATEGORY,
  getToken,
  cssVar,
  cssVarRef,
} from './types/tokens';