import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4174";
const usesExternalServer = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chrome-desktop",
      use: { browserName: "chromium", channel: "chrome", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "firefox-desktop",
      use: { browserName: "firefox", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "chrome-mobile-375",
      use: {
        browserName: "chromium",
        channel: "chrome",
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "firefox-mobile-375",
      use: { browserName: "firefox", viewport: { width: 375, height: 812 }, hasTouch: true },
    },
  ],
  ...(usesExternalServer
    ? {}
    : {
        webServer: {
          command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4174 --strictPort",
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      }),
});
