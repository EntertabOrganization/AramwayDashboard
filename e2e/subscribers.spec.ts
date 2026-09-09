import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test.describe("Subscribers", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.getByTestId("nav-subscribers").click();
    await expect(page).toHaveURL(/\/subscribers/);
  });

  test("renders seeded subscribers", async ({ page }) => {
    const table = page.getByTestId("subscribers-table");
    await expect(table).toBeVisible();
    await expect(table.getByText("sarah.johnson@northbridge.co")).toBeVisible();
  });

  test("creates, edits status, and deletes a subscriber", async ({ page }) => {
    const email = `e2e.subscriber.${Date.now()}@example.com`;

    // Create
    await page.getByTestId("new-subscriber-btn").click();
    await page.getByTestId("form-email").fill(email);
    await page.getByTestId("form-name").fill("E2E Test Subscriber");
    await page.getByTestId("form-submit").click();
    await expect(page.getByTestId("subscriber-modal")).not.toBeVisible();

    const row = page.locator("tr", { hasText: email });
    await expect(row).toBeVisible();
    await expect(row.getByTestId("badge")).toHaveText("ACTIVE");

    // Edit status
    const rowId = await row.getAttribute("data-testid");
    const id = rowId!.replace("row-", "");
    await page.getByTestId(`edit-${id}`).click();
    await page.getByTestId("form-status").selectOption("UNSUBSCRIBED");
    await page.getByTestId("form-submit").click();
    await expect(page.getByTestId("subscriber-modal")).not.toBeVisible();
    await expect(row.getByTestId("badge")).toHaveText("UNSUBSCRIBED");

    // Delete
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByTestId(`delete-${id}`).click();
    await expect(row).toHaveCount(0);
  });
});
