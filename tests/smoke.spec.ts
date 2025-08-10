// @ts-nocheck
import { test, expect } from '@playwright/test';

const PROD_URL = 'https://cmwen.github.io';

test('Homepage loads and shows title', async ({ page }) => {
  await page.goto(PROD_URL);
  await expect(page).toHaveTitle(/Min Wen/);
  await expect(page.locator('h1')).toContainText('About Min');
});

test('Navigation links are present', async ({ page }) => {
  await page.goto(PROD_URL);
  const navLinks = ['Posts', 'Tags', 'About', 'Podcasts', 'search'];
  for (const link of navLinks) {
    await expect(page.locator(`nav >> text=${link}`)).toBeVisible();
  }
});

test('Featured and Recent Posts sections are visible', async ({ page }) => {
  await page.goto(PROD_URL);
  await expect(page.locator('h2')).toContainText(['Featured', 'Recent Posts']);
});

test('No major errors in console', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto(PROD_URL);
  expect(errors.length).toBe(0);
});
