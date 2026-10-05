import { test, expect } from "@playwright/test";

test("infographics render without JavaScript and preserve page styles", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/toolbox/");
  const background = await page.locator("body").evaluate(element => getComputedStyle(element).backgroundColor);
  await page.getByRole("link", { name: "Explore the Min Infograph example" }).click();
  await expect(page.locator("h1")).toHaveText("Infographics");
  await expect(page.getByRole("heading", { name: "Content first" })).toBeVisible();
  expect(await page.locator("body").evaluate(element => getComputedStyle(element).backgroundColor)).toBe(background);
  await page.getByText("Diagram source", { exact: true }).click();
  await expect(page.locator(".min-infograph pre")).toContainText("flowchart LR");
  await context.close();
});

test("diagrams load on mobile and after locale navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/toolbox/infographics/");
  const diagram = page.locator("[data-infograph-diagram]");
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram.locator("svg")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("link", { name: "中文", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("資訊圖表");
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram.locator("svg")).toBeVisible();
  await expect(page.getByText("圖表原始碼", { exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/zh-hant\/toolbox\/infographics\/$/);
});

test("the blog infographic follows the site font and light/dark palette", async ({ page }) => {
  await page.goto("/posts/a-small-esp32-board-and-opportunity-ai/");
  await expect(page.getByRole("heading", { name: "A Small ESP32 Board and the Opportunity AI Opens Up", exact: true })).toBeVisible();
  const infographic = page.getByRole("region", { name: "A small board opens a new field" });
  const anchor = infographic.locator("h2 .heading-link");
  await expect(anchor).toHaveAttribute("href", "#infographic-a-small-board-opens-a-new-field-heading-0");
  await expect(infographic.getByRole("heading", { name: "The board gets the final vote" })).toBeVisible();
  const palettes: string[] = [];
  for (const theme of ["light", "dark"]) {
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    const colors = await infographic.evaluate(element => {
      const article = element.querySelector("article")!;
      const card = element.querySelector(".infographic-block")!;
      const root = getComputedStyle(document.documentElement);
      return {
        background: getComputedStyle(article).backgroundColor,
        cardBackground: getComputedStyle(card).backgroundColor,
        text: getComputedStyle(card.querySelector("p")!).color,
        expectedBackground: `rgb(${root.getPropertyValue("--color-fill").trim()})`,
        expectedCard: `rgb(${root.getPropertyValue("--color-card").trim()})`,
        expectedText: `rgb(${root.getPropertyValue("--color-text-base").trim()})`,
        font: getComputedStyle(article).fontFamily,
        siteFont: getComputedStyle(document.body).fontFamily,
      };
    });
    expect(colors.background).toBe(colors.expectedBackground);
    expect(colors.cardBackground).toBe(colors.expectedCard);
    expect(colors.text).toBe(colors.expectedText);
    expect(colors.font).toBe(colors.siteFont);
    palettes.push(colors.background);
  }
  expect(palettes[0]).not.toBe(palettes[1]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
