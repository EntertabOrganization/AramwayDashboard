import { test, expect } from "@playwright/test";
import { ADMIN_EMAIL, login } from "./helpers";

test.describe("Login", () => {
  test("invalid credentials shows an error and stays on /login", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("login-email").fill("wrong@example.com");
    await page.getByTestId("login-password").fill("wrongpassword");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("login-error")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("valid credentials redirects to the dashboard", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  });

  test("visiting a protected page while logged out redirects to /login", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/subscribers");
    await expect(page).toHaveURL(/\/login/);
  });

  test("valid credentials with correct email but wrong password fails", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("login-email").fill(ADMIN_EMAIL);
    await page.getByTestId("login-password").fill("not-the-password");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("login-error")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
