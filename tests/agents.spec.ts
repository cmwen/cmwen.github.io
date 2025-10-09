// @ts-nocheck
import { test, expect } from '@playwright/test';

// Using baseURL from Playwright config (local preview)

test.describe('Agents page', () => {
  test('Toolbox link visible in nav, Agents in subnav', async ({ page }) => {
  await page.goto('/toolbox/');
  // Toolbox should be in main nav (use #nav-menu to be specific)
  await expect(page.locator('#nav-menu')).toContainText('Toolbox');
  // Agents should be in the subnav when on toolbox pages
  await expect(page.locator('.toolbox-subnav')).toContainText('Agents');
  });

  test('Loads and shows heading', async ({ page }) => {
  await page.goto('/toolbox/agents/');
  // Ensure main heading is correct on the Agents page
  await expect(page.locator('#main-content h1')).toContainText('AI Agents & Prompts');
  });

  test('No errors in console on Agents page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/toolbox/agents/');
    expect(errors).toEqual([]);
  });

  test.fixme('Provider selection persists across reload', async ({ page }) => {
    // TODO: Enable after stabilizing client-hydrated UI in headless tests
  });

  test.fixme('Launching ChatGPT opens a popup (deep link)', async ({ page }) => {
    // TODO: Enable after stabilizing client-hydrated UI in headless tests
  });
});
