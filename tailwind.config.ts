import type { Config } from 'tailwindcss';
import preset from './src/tailwind/preset';

export default {
  presets: [preset],
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
  plugins: [],
} satisfies Config;
