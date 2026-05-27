import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';

/**
 * Discovers component sub-packages at build time so each component gets its
 * own Rollup entry point. Consumers can import from the component path directly
 * (`@ds/ui/components/button`) and bundlers will tree-shake everything else.
 *
 * Guards against an empty or absent components directory — safe to run before
 * any components are scaffolded.
 */
function getComponentEntries(): Record<string, string> {
  const componentsDir = resolve(__dirname, 'src/components');
  if (!existsSync(componentsDir)) return {};

  return readdirSync(componentsDir)
    .filter((name) => {
      const entry = resolve(componentsDir, name, 'index.ts');
      return (
        statSync(resolve(componentsDir, name)).isDirectory() &&
        existsSync(entry)
      );
    })
    .reduce<Record<string, string>>(
      (acc, dir) => ({
        ...acc,
        [`components/${dir}/index`]: resolve(componentsDir, dir, 'index.ts'),
      }),
      {},
    );
}

export default defineConfig({
  plugins: [
    react(),

    // Resolve tsconfig path aliases (@/*) during the Vite/Rollup build.
    tsconfigPaths(),

    // Generate .d.ts files that mirror the preserveModules output structure.
    // rollupTypes: false emits one .d.ts per source file (correct for
    // preserveModules). rollupTypes: true would collapse everything into a
    // single declaration file, breaking per-component imports.
    dts({
      include: ['src'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.tsx',
        'src/test-setup.ts',
      ],
      // Point at the build-specific tsconfig so dts respects rootDir and
      // excludes test/story files, without disturbing the IDE tsconfig.
      tsconfigPath: './tsconfig.build.json',
      rollupTypes: false,
    }),
  ],

  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'tailwind/preset': resolve(__dirname, 'src/tailwind/preset.ts'),
        ...getComponentEntries(),
      },
      // Both formats share the same Rollup run. preserveModules is applied
      // once and Vite emits two output trees: one ESM (.js) and one CJS (.cjs).
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        format === 'es' ? `${entryName}.js` : `${entryName}.cjs`,
    },

    rollupOptions: {
      // Everything that a consumer's bundler should resolve from their own
      // node_modules — never bundle peer dependencies.
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        /^@radix-ui\/.*/,
        'tailwindcss',
      ],

      output: {
        // Keep the source module structure intact in dist/. Without this,
        // Rollup bundles all imports into the entry chunk and defeats
        // per-component tree-shaking.
        preserveModules: true,
        preserveModulesRoot: 'src',

        exports: 'named',

        // Rename the single CSS asset to globals.css so the package.json
        // `"./styles"` export resolves correctly.
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css';
          return assetInfo.name ?? 'asset';
        },
      },
    },

    // Do not minify the library output. Consumers run their own minification;
    // minifying here obfuscates stack traces and makes debugging harder.
    minify: false,

    // Emit source maps so consumers see original TypeScript in DevTools.
    sourcemap: true,

    // Collect all component CSS into a single globals.css rather than
    // splitting it per chunk. The consumer imports it once at the app root.
    cssCodeSplit: false,

    emptyOutDir: true,
  },
});
