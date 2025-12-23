import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // This allows you to use 'describe', 'it', 'expect' without importing them
    environment: 'node',
    globalSetup: './test/db/globalSetup.ts', // Migrations from here
    include: ['**/*.{test,spec}.ts'],
  },
});