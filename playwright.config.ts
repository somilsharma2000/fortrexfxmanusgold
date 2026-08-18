import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 20_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: true } },
  ],
});
