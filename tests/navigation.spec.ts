import { test, expect } from '@playwright/test';

for (const path of ['/', '/zh-hant/']) {
  test(`Mobile navigation starts collapsed and toggles on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 488, height: 900 });
    await page.goto(path);

    const toggle = page.getByRole('button', { name: 'Open Menu', exact: true });
    const menu = page.locator('#menu-items');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();

    await toggle.click();
    const close = page.getByRole('button', { name: 'Close Menu', exact: true });
    await expect(close).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await expect(menu.locator('a').first()).toBeVisible();

    await close.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();

    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(menu).toBeVisible();
    await expect(toggle).toBeHidden();

    await page.setViewportSize({ width: 375, height: 812 });
    await expect(menu).toBeHidden();
    await toggle.click();
    await menu.locator('a').first().click();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();
  });
}
