import { test, expect } from "@playwright/test";

test.describe("Toolbox page", () => {
  test("renders sections and expands a tool", async ({ page }) => {
    await page.goto("/toolbox/");

    await expect(page.getByRole("heading", { name: "Toolbox" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Browsers" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Mobile Browser" })).toBeVisible();

    // Expand the Zen tool card
    const zenSummary = page.getByRole("heading", { name: "Zen" });
    await zenSummary.click();

    await expect(page.getByRole("link", { name: "Website" })).toBeVisible();
  });
});
