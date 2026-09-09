import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test.describe("Blogs", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.getByTestId("nav-blogs").click();
    await expect(page).toHaveURL(/\/blogs/);
  });

  test("renders seeded blogs", async ({ page }) => {
    const table = page.getByTestId("blogs-table");
    await expect(table).toBeVisible();
    await expect(table.getByText("Five Pillars of a Resilient Growth Strategy")).toBeVisible();
  });

  test("creates, edits status, and deletes a blog post", async ({ page }) => {
    const title = `E2E Test Blog ${Date.now()}`;

    // Create
    await page.getByTestId("new-blog-btn").click();
    await page.getByTestId("form-title").fill(title);
    await page.getByTestId("form-category").selectOption({ index: 1 });
    await page.getByTestId("form-type").selectOption("NEWS");
    await page.getByTestId("form-excerpt").fill("An excerpt for the e2e test blog post.");
    await page.getByTestId("form-content").fill("Full content for the e2e test blog post.");
    await page.getByTestId("form-tags").fill("e2e, testing");
    await page.getByTestId("form-submit").click();
    await expect(page.getByTestId("blog-modal")).not.toBeVisible();

    const row = page.locator("tr", { hasText: title });
    await expect(row).toBeVisible();
    await expect(row.getByText("DRAFT")).toBeVisible();

    // Edit status
    const rowId = await row.getAttribute("data-testid");
    const id = rowId!.replace("row-", "");
    await page.getByTestId(`edit-${id}`).click();
    await page.getByTestId("form-status").selectOption("PUBLISHED");
    await page.getByTestId("form-submit").click();
    await expect(page.getByTestId("blog-modal")).not.toBeVisible();
    await expect(row.getByText("PUBLISHED")).toBeVisible();

    // Delete
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByTestId(`delete-${id}`).click();
    await expect(row).toHaveCount(0);
  });
});
