// @ts-nocheck
import { test, expect } from '@playwright/test';

// Using baseURL from Playwright config (local preview)

test.describe('Agents page', () => {
  test('Agents link visible in nav', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav')).toContainText('Agents');
  });

  test('Loads and shows heading', async ({ page }) => {
  await page.goto('/agents/');
  // Ensure main heading is correct on the Agents page
  await expect(page.locator('#main-content h1')).toContainText('AI Agents & Prompts');
  });

  test.fixme('Provider selection persists across reload', async ({ page }) => {
    // TODO: Enable after stabilizing client-hydrated UI in headless tests
  });

  test.fixme('Launching ChatGPT opens a popup (deep link)', async ({ page }) => {
    // TODO: Enable after stabilizing client-hydrated UI in headless tests
  });
});
