import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test.describe("Career Applications", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.getByTestId("nav-careers").click();
    await expect(page).toHaveURL(/\/careers/);
  });

  test("renders seeded applications", async ({ page }) => {
    const table = page.getByTestId("careers-table");
    await expect(table).toBeVisible();
    await expect(table.getByText("Grace Kimani")).toBeVisible();
  });

  test("creates, edits status, and deletes an application", async ({ page }) => {
    const email = `e2e.applicant.${Date.now()}@example.com`;

    // Create
    await page.getByTestId("new-career-btn").click();
    await page.getByTestId("form-firstName").fill("E2E");
    await page.getByTestId("form-lastName").fill("Applicant");
    await page.getByTestId("form-email").fill(email);
    await page.getByTestId("form-phone").fill("+1-555-000-1111");
    await page.getByTestId("form-position").fill("QA Engineer");
    await page.getByTestId("form-city").fill("Remote");
    await page.getByTestId("form-country").fill("Testland");
    await page.getByTestId("form-submit").click();
    await expect(page.getByTestId("career-create-modal")).not.toBeVisible();

    const row = page.locator("tr", { hasText: email });
    await expect(row).toBeVisible();
    await expect(row.getByText("PENDING")).toBeVisible();

    // Edit status via detail view
    const rowId = await row.getAttribute("data-testid");
    const id = rowId!.replace("row-", "");
    await page.getByTestId(`view-${id}`).click();
    await expect(page.getByTestId("career-detail-modal")).toBeVisible();
    await page.getByTestId("detail-status-select").selectOption("REVIEWED");
    await expect(page.getByTestId("detail-status-select")).toHaveValue("REVIEWED");
    await page.getByTestId("modal-close").click();
    await expect(row.getByText("REVIEWED")).toBeVisible();

    // Delete
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByTestId(`delete-${id}`).click();
    await expect(row).toHaveCount(0);
  });
});
