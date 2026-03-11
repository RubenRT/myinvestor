import { test, expect } from '@playwright/test';
import { resetPortfolio, buyFundViaApi, clickPortfolioItemAction } from './helpers';

test.describe('Sell Fund', () => {
  test.beforeEach(async ({ request }) => {
    await resetPortfolio(request);
    // Buy 10 units of Global Equity Fund (id: 1) to set up portfolio
    await buyFundViaApi(request, '1', 10);
  });

  test('sells a fund from the portfolio', async ({ page }) => {
    await page.goto('/portfolio');

    // Verify the fund is in the portfolio
    await expect(page.getByText('Global Equity Fund')).toBeVisible();

    // Open sell modal via action menu on the portfolio item
    await clickPortfolioItemAction(page, 'Global Equity Fund', 'Vender');

    // Verify sell modal opened
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h2')).toHaveText('Vender fondo');
    await expect(dialog).toContainText('Global Equity Fund');
    await expect(dialog).toContainText('10');

    // Sell 5 units
    await dialog.locator('input[type="number"]').fill('5');
    await dialog.getByRole('button', { name: 'Vender' }).click();

    // Modal should close
    await expect(dialog).not.toBeVisible();

    // Fund should still be in portfolio (5 remaining)
    await expect(page.getByText('Global Equity Fund')).toBeVisible();
  });

  test('sells all units and fund disappears from portfolio', async ({ page }) => {
    await page.goto('/portfolio');

    await clickPortfolioItemAction(page, 'Global Equity Fund', 'Vender');

    const dialog = page.locator('dialog[open]');
    await dialog.locator('input[type="number"]').fill('10');
    await dialog.getByRole('button', { name: 'Vender' }).click();
    await expect(dialog).not.toBeVisible();

    // Portfolio should now be empty
    await expect(page.getByText('No tienes fondos en tu cartera')).toBeVisible();
  });

  test('shows error when selling more than holdings', async ({ page }) => {
    await page.goto('/portfolio');

    await clickPortfolioItemAction(page, 'Global Equity Fund', 'Vender');

    const dialog = page.locator('dialog[open]');
    // Try to sell more than we have
    await dialog.locator('input[type="number"]').fill('11');
    await dialog.getByRole('button', { name: 'Vender' }).click();

    // Should show validation error - modal stays open
    await expect(dialog).toBeVisible();
  });
});
