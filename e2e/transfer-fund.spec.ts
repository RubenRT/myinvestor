import { test, expect } from '@playwright/test';
import { resetPortfolio, buyFundViaApi, clickPortfolioItemAction } from './helpers';

test.describe('Transfer Fund', () => {
  test.beforeEach(async ({ request }) => {
    await resetPortfolio(request);
    // Buy 10 units of Global Equity Fund (id: 1) and 5 of Tech Growth Fund (id: 2)
    await buyFundViaApi(request, '1', 10);
    await buyFundViaApi(request, '2', 5);
  });

  test('transfers units between two funds', async ({ page }) => {
    await page.goto('/portfolio');

    // Verify both funds are in portfolio
    await expect(page.getByText('Global Equity Fund')).toBeVisible();
    await expect(page.getByText('Tech Growth Fund')).toBeVisible();

    // Open transfer modal for Global Equity Fund
    await clickPortfolioItemAction(page, 'Global Equity Fund', 'Traspasar');

    // Verify transfer modal
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h2')).toHaveText('Traspasar fondo');
    await expect(dialog).toContainText('Global Equity Fund');

    // Select destination fund
    await dialog.locator('select').selectOption({ label: 'Tech Growth Fund' });

    // Enter quantity to transfer
    await dialog.locator('input[type="number"]').fill('3');

    // Submit transfer
    await dialog.getByRole('button', { name: 'Traspasar' }).click();

    // Modal should close
    await expect(dialog).not.toBeVisible();

    // Both funds should still be visible in portfolio
    await expect(page.getByText('Global Equity Fund')).toBeVisible();
    await expect(page.getByText('Tech Growth Fund')).toBeVisible();
  });

  test('transfers all units — source fund disappears', async ({ page }) => {
    await page.goto('/portfolio');

    await clickPortfolioItemAction(page, 'Global Equity Fund', 'Traspasar');

    const dialog = page.locator('dialog[open]');
    await dialog.locator('select').selectOption({ label: 'Tech Growth Fund' });
    await dialog.locator('input[type="number"]').fill('10');
    await dialog.getByRole('button', { name: 'Traspasar' }).click();

    await expect(dialog).not.toBeVisible();

    // Global Equity Fund should be gone, only Tech Growth Fund remains
    await expect(page.getByText('Global Equity Fund')).not.toBeVisible();
    await expect(page.getByText('Tech Growth Fund')).toBeVisible();
  });

  test('requires selecting a destination fund', async ({ page }) => {
    await page.goto('/portfolio');

    await clickPortfolioItemAction(page, 'Global Equity Fund', 'Traspasar');

    const dialog = page.locator('dialog[open]');

    // Enter quantity without selecting destination
    await dialog.locator('input[type="number"]').fill('3');
    await dialog.getByRole('button', { name: 'Traspasar' }).click();

    // Should stay open with validation error
    await expect(dialog).toBeVisible();
  });
});
