import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: [
    {
      command: 'node --watch server/app.ts',
      port: 3000,
      reuseExistingServer: true,
      timeout: 10_000,
    },
    {
      command: 'cd client && npx vite --port 5173',
      port: 5173,
      reuseExistingServer: true,
      timeout: 15_000,
    },
  ],
});
