import { Page, expect } from "@playwright/test";

export const ADMIN_EMAIL = "admin@example.com";
export const ADMIN_PASSWORD = "Admin@1234";

/**
 * Logs in through the real login form and waits for the dashboard to load.
 */
export async function login(page: Page) {
  await page.goto("/login");
  await page.getByTestId("login-email").fill(ADMIN_EMAIL);
  await page.getByTestId("login-password").fill(ADMIN_PASSWORD);
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("sidebar-nav")).toBeVisible();
}
