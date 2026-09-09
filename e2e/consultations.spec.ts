import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test.describe("Consultations", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.getByTestId("nav-consultations").click();
    await expect(page).toHaveURL(/\/consultations/);
  });

  test("renders seeded consultations", async ({ page }) => {
    const table = page.getByTestId("consultations-table");
    await expect(table).toBeVisible();
    await expect(table.getByText("Robert Kim")).toBeVisible();
  });

  test("creates, edits status, and deletes a consultation", async ({ page }) => {
    const name = `E2E Consultation ${Date.now()}`;

    // Create
    await page.getByTestId("new-consultation-btn").click();
    await page.getByTestId("form-name").fill(name);
    await page.getByTestId("form-email").fill("e2e.consultation@example.com");
    await page.getByTestId("form-phone").fill("+1-555-222-3333");
    await page.getByTestId("form-country").fill("Testland");
    await page.getByTestId("form-date").fill("2026-04-01");
    await page.getByTestId("form-time").fill("11:00");
    await page.getByTestId("form-submit").click();
    await expect(page.getByTestId("consultation-create-modal")).not.toBeVisible();

    const row = page.locator("tr", { hasText: name });
    await expect(row).toBeVisible();
    await expect(row.getByText("PENDING")).toBeVisible();

    // Edit status via detail view
    const rowId = await row.getAttribute("data-testid");
    const id = rowId!.replace("row-", "");
    await page.getByTestId(`view-${id}`).click();
    await expect(page.getByTestId("consultation-detail-modal")).toBeVisible();
    await page.getByTestId("detail-status-select").selectOption("CONFIRMED");
    await expect(page.getByTestId("detail-status-select")).toHaveValue("CONFIRMED");
    await page.getByTestId("modal-close").click();
    await expect(row.getByText("CONFIRMED")).toBeVisible();

    // Delete
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByTestId(`delete-${id}`).click();
    await expect(row).toHaveCount(0);
  });
});
