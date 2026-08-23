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

  test("renders readable directional mind map connectors", async ({ page }) => {
    await page.goto(
      "/toolbox/mindmaps/observability-opentelemetry-and-genai/"
    );

    await expect(
      page
        .getByRole("heading", {
          name: "Observability, OpenTelemetry & GenAI",
          exact: true,
        })
        .first()
    ).toBeVisible();

    const canvas = page.locator(".mindmap-canvas");
    await expect(canvas.locator("marker[id^='parent-arrow-']")).toHaveCount(8);
    await expect(
      canvas.locator("rect[fill='rgb(var(--color-fill))']")
    ).toHaveCount(9);

    await page.getByRole("button", { name: "Expand All" }).click();

    await expect(canvas.locator("path[marker-end]")).toHaveCount(99);
    await expect(
      canvas.locator("rect[fill='rgb(var(--color-fill))']")
    ).toHaveCount(89);
  });
});
