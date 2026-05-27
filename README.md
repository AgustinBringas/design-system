# @bringas/ui

Enterprise-grade React design system — accessible, composable, token-driven.

Built on [Radix UI](https://www.radix-ui.com/) primitives with [Tailwind CSS](https://tailwindcss.com/) for styling and full TypeScript support.

## Installation

```sh
npm install @bringas/ui
```

Peer dependencies — install these in your project if not already present:

```sh
npm install react react-dom tailwindcss
```

## Setup

### 1. Tailwind config

Add the design system preset to your `tailwind.config.ts`. The preset injects all tokens, animations, and utility extensions. Point `content` at the compiled library so Tailwind picks up every class name used in components.

```ts
import type { Config } from 'tailwindcss';
import dsPreset from '@bringas/ui/tailwind/preset';

export default {
  presets: [dsPreset],
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@bringas/ui/dist/**/*.js',
  ],
} satisfies Config;
```

### 2. Import styles

Import the compiled CSS once at your app root (e.g. `main.tsx` or `_app.tsx`). This loads the CSS custom property tokens for both light and dark themes.

```ts
import '@bringas/ui/styles';
```

### 3. Dark mode

Dark mode is controlled by adding the `dark` class to `<html>`. Toggle it however fits your app — a state variable, `localStorage`, or a library like `next-themes`.

```ts
document.documentElement.classList.toggle('dark');
```

## Usage

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from '@bringas/ui';

export function LoginCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Password" type="password" />
        <Button className="w-full">Continue</Button>
      </CardContent>
    </Card>
  );
}
```

## Components

| Component | Description |
|---|---|
| `Button` | Primary action element with `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` variants and `sm`, `md`, `lg`, `icon` sizes |
| `Input` | Text field with optional leading/trailing icons, label, and error state |
| `Textarea` | Multi-line text field, same API as Input |
| `Text` | Typography primitive with `heading`, `body`, `label`, `code`, `caption` variants |
| `Card` | Surface container — `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| `Modal` | Accessible dialog — `Modal`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalFooter`, `ModalTitle`, `ModalDescription` |
| `Drawer` | Slide-in panel from any side — same sub-component API as Modal plus `DrawerBody` |
| `DropdownMenu` | Triggered floating menu with items, checkboxes, radio groups, and sub-menus |
| `ContextMenu` | Right-click menu — same API as DropdownMenu |
| `Toaster` | Toast notification system with `useToast` hook |
| `Tooltip` | Hover/focus tooltip — wrap with `TooltipProvider` at the app root |
| `Separator` | Horizontal or vertical divider |

## Theming

All colors are CSS custom properties defined in the imported stylesheet. Override any token in your own CSS to customise the theme without touching Tailwind config:

```css
:root {
  --primary: #your-brand-color;
  --radius: 0.25rem; /* sharper corners globally */
}
```

Available tokens: `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--card`, `--card-foreground`, `--border`, `--input`, `--ring`, `--destructive`, `--destructive-foreground`, `--success`, `--warning`, `--info`, `--radius`.

> **Note:** Tailwind opacity modifiers (`bg-primary/50`) are not supported with hex token values. To use opacity modifiers, override the tokens using HSL channel syntax: `--primary: 239 84% 67%;`

## Local development

To use a local build of the design system in another project on your machine before publishing:

```sh
# In this repo — builds the library and registers the global npm link
npm run link

# In your consumer project
npm link @bringas/ui
```

To unlink when you're done:

```sh
# In your consumer project
npm unlink @bringas/ui
```

## Publishing

```sh
# Bump the version
npm run changeset

# Build and publish to npm
npm run release
```

## Development

```sh
npm run dev          # Storybook on http://localhost:6006
npm run test         # Run all tests
npm run test:watch   # Watch mode
npm run typecheck    # TypeScript check only
npm run lint         # Lint and format with Biome
npm run build        # Production library build
```
