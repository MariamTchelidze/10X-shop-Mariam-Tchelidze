import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "demo-recording.spec.ts",
  outputDir: "docs/video/",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    viewport: { width: 1280, height: 720 },
    video: {
      mode: "on",
      size: { width: 1280, height: 720 },
    },
    trace: "retain-on-failure",
  },
});
