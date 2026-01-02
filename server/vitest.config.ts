import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    test: {
      // This allows you to use 'describe', 'it', 'expect' without importing them
      globals: true,
      environment: 'node',

      projects: [
        {
          extends: true,
          test: {
            name: 'integration-tools',
            include: ['test/integration/tools/**/*.{test,spec}.ts'],

            // Important! Runs once total before the entire tool suite. Runs in the Node.js process before the environment is created. Used: Starting/Stopping a database or a Docker container. Eg, Now my migrations for test db will happen here.
            globalSetup: ['./test/integration/tools/globalSetup.ts'],

            //Important! Runs once per test file. Environment Runs inside the same environment as your tests (e.g., jsdom). Use Case  Setting env vars, mocking APIs, initializing UI frameworks. Give Path to setup file
            setupFiles: ['./test/integration/tools/tools.setup.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'integration-infrastructure',
            include: ['test/integration/infrastructure/**/*.{test,spec}.ts'],

            env: env,
          },
        },
        {
          extends: true,
          test: {
            name: 'integration-llm',
            include: ['test/integration/llm/**/*.{test,spec}.ts'],

            env: env, // TODO: research on better way of injecting partial set into the tests.

            globalSetup: ['./test/integration/llm/globalSetup.ts'],
            setupFiles: ['./test/integration/llm/agent.setup.ts'],
          },
        },

      ],
    },
  };
});