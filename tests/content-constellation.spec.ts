import { test, expect, type Page } from '@playwright/test';

const HOME = '/';

async function webglIsAvailable(page: Page) {
  return page.evaluate(() => {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'),
    );
  });
}

test.describe('content constellation background', () => {
  test('exposes a metadata-sized, capability-aware canvas on desktop', async ({ page }) => {
    await page.goto(HOME);

    const constellation = page.locator('canvas#content-constellation');
    await expect(constellation).toHaveAttribute('aria-hidden', 'true');

    const nodeCount = Number(await constellation.getAttribute('data-node-count'));
    expect(Number.isInteger(nodeCount)).toBe(true);
    // This is deliberately a lower bound: the collection grows over time and
    // scheduled/unpublished posts should not make the test brittle.
    expect(nodeCount).toBeGreaterThan(20);

    await expect(constellation).toHaveAttribute('data-constellation-state', /.+/);
    const webglAvailable = await webglIsAvailable(page);
    const state = await constellation.getAttribute('data-constellation-state');

    // Headless browsers may not expose a GPU. When they do, the desktop canvas
    // should be initialized; otherwise an explicit unsupported/disabled state
    // is the expected graceful fallback.
    if (webglAvailable) {
      expect(state).not.toMatch(/unsupported|unavailable/i);
    } else {
      expect(state).toMatch(/unsupported|unavailable|disabled|fallback/i);
    }
  });

  test('is disabled for a mobile-sized viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(HOME);

    const constellation = page.locator('canvas#content-constellation');
    await expect(constellation).toHaveAttribute('aria-hidden', 'true');
    await expect(constellation).toBeHidden();
    await expect(constellation).toHaveAttribute(
      'data-constellation-state',
      /disabled|mobile/i,
    );
    await expect(page.locator('h1')).toContainText('About Min');
  });

  test('is disabled when reduced motion is preferred', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(HOME);

    const constellation = page.locator('canvas#content-constellation');
    await expect(constellation).toHaveAttribute('aria-hidden', 'true');
    await expect(constellation).toBeHidden();
    await expect(constellation).toHaveAttribute(
      'data-constellation-state',
      /disabled|reduced-motion|reduced/i,
    );
    await expect(page.locator('h1')).toContainText('About Min');
  });

  test('theme changes preserve the canvas contract and readable page content', async ({ page }) => {
    await page.goto(HOME);

    const constellation = page.locator('canvas#content-constellation');
    const themeButton = page.locator('#theme-btn');
    const initialNodeCount = await constellation.getAttribute('data-node-count');
    const initialState = await constellation.getAttribute('data-constellation-state');
    await expect(page.locator('h1')).toContainText('About Min');

    await themeButton.click();
    await expect(page.locator('h1')).toContainText('About Min');
    await expect(constellation).toHaveAttribute('aria-hidden', 'true');
    await expect(constellation).toHaveAttribute('data-node-count', initialNodeCount!);
    await expect(constellation).toHaveAttribute('data-constellation-state', initialState!);
  });
});
