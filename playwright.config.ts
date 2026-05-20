import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright e2e config for the personal site.
 *
 * Uses the existing production build (`pnpm start`) so tests run against the
 * same output that ships. The webServer is reused if one is already running on
 * port 3000, so local iteration is fast.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "list" : [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      // Pixel 7 ≈ 390px-wide viewport — exercises the mobile layout / overflow.
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "pnpm start -p 3000",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
