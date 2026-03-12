import { test, expect } from '@playwright/test';
import { resetPortfolio } from './helpers';

test.describe('Navigation & Fund List', () => {
  test.beforeEach(async ({ request }) => {
    await resetPortfolio(request);
  });

  test('loads the fund list on the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Fondos de inversion');
    // First page should show 10 fund rows
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(10);
  });

  test('navigates between funds and portfolio', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Fondos de inversion');

    await page.getByRole('link', { name: 'Mi cartera' }).click();
    await expect(page.locator('h1')).toHaveText('Mi cartera');

    await page.getByRole('link', { name: 'Fondos', exact: true }).click();
    await expect(page.locator('h1')).toHaveText('Fondos de inversion');
  });

  test('shows empty portfolio state with link back to funds', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.locator('h1')).toHaveText('Mi cartera');
    await expect(page.getByText('No tienes fondos en tu cartera')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explorar fondos' })).toBeVisible();
  });

  test('paginates the fund list', async ({ page }) => {
    await page.goto('/');
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(10);

    // Go to next page
    await page.getByRole('button', { name: 'Pagina siguiente' }).click();
    // Wait for page 2 content to load
    await page.waitForResponse((resp) => resp.url().includes('/funds') && resp.status() === 200);
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(10);
  });

  test('sorts funds by name', async ({ page }) => {
    await page.goto('/');

    // Click "Nombre" header to sort ascending
    const nameHeader = page.getByRole('columnheader', { name: /Nombre/ });
    await nameHeader.click();

    const firstRow = page.locator('tbody tr').first();
    // After ascending sort, first fund alphabetically should be "Advanced Materials"
    await expect(firstRow).toContainText('Advanced Materials');

    // Click again for descending
    await nameHeader.click();
    const firstRowDesc = page.locator('tbody tr').first();
    await expect(firstRowDesc).toContainText('Youth Innovation Fund');
  });
});
