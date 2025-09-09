import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    globals: true,
  },
  esbuild: {
    jsx: 'automatic', // <-- use React 17+ automatic JSX transform
    jsxImportSource: 'react', // (default is 'react', but explicit is fine)
  },
});
