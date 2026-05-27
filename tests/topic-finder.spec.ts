import { expect, test } from '@playwright/test';

test('spin, category, modal, keyboard, and viewport flows remain stable', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => consoleErrors.push(error.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Topic Finder' })).toBeVisible();

  await page.getByRole('button', { name: /spin/i }).click();
  await page.getByRole('button', { name: /spin/i }).click({ force: true }).catch(() => undefined);
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 7_000 });
  await expect(page.getByRole('button', { name: 'Close question' })).toBeFocused();

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();

  await page.getByRole('button', { name: 'Funny' }).click();
  await page.getByRole('button', { name: /spin/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 7_000 });
  await expect(page.locator('#question-category')).toContainText('Funny');
  await page.getByRole('button', { name: /next spin/i }).click();

  await page.setViewportSize({ width: 320, height: 607 });
  await expect(page.getByRole('button', { name: 'Would You Rather' })).toBeInViewport();

  const viewportMetrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    innerWidth,
    innerHeight,
    minButtonSize: Math.min(
      ...Array.from(document.querySelectorAll('button'), button => {
        const rect = button.getBoundingClientRect();
        return Math.min(rect.width, rect.height);
      }),
    ),
  }));

  expect(viewportMetrics.scrollWidth).toBe(viewportMetrics.innerWidth);
  expect(viewportMetrics.scrollHeight).toBe(viewportMetrics.innerHeight);
  expect(viewportMetrics.minButtonSize).toBeGreaterThanOrEqual(44);
  expect(consoleErrors).toEqual([]);
});
