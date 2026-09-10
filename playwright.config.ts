import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      JWT_SECRET:
        process.env.JWT_SECRET ??
        "765c55317b9b939be0cbad6df30cd1080c9bef508b12af00d2f06dfc0fb02ff98356b1ad90eaf95bc01334e505a06007",
      BACKEND_URL: process.env.BACKEND_URL ?? "http://localhost:4000",
      PORT: String(PORT),
    },
  },
});
