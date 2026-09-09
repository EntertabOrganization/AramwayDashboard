import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test.describe("Contact Messages", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.getByTestId("nav-contact").click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("renders seeded messages", async ({ page }) => {
    const table = page.getByTestId("contact-table");
    await expect(table).toBeVisible();
    await expect(table.getByText("Henry Osei")).toBeVisible();
  });

  test("creates, edits status, and deletes a message", async ({ page }) => {
    const email = `e2e.contact.${Date.now()}@example.com`;

    // Create
    await page.getByTestId("new-contact-btn").click();
    await page.getByTestId("form-name").fill("E2E Contact");
    await page.getByTestId("form-email").fill(email);
    await page.getByTestId("form-message").fill("This is an e2e test message.");
    await page.getByTestId("form-submit").click();
    await expect(page.getByTestId("contact-create-modal")).not.toBeVisible();

    const row = page.locator("tr", { hasText: email });
    await expect(row).toBeVisible();
    await expect(row.getByText("NEW")).toBeVisible();

    // Edit status via detail view
    const rowId = await row.getAttribute("data-testid");
    const id = rowId!.replace("row-", "");
    await page.getByTestId(`view-${id}`).click();
    await expect(page.getByTestId("contact-detail-modal")).toBeVisible();
    await page.getByTestId("detail-status-select").selectOption("READ");
    await expect(page.getByTestId("detail-status-select")).toHaveValue("READ");
    await page.getByTestId("modal-close").click();
    await expect(row.getByText("READ")).toBeVisible();

    // Delete
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByTestId(`delete-${id}`).click();
    await expect(row).toHaveCount(0);
  });
});
