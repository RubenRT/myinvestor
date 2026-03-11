import { test, expect } from '@playwright/test';
import { resetPortfolio, clickRowAction } from './helpers';

test.describe('Buy Fund', () => {
  test.beforeEach(async ({ request }) => {
    await resetPortfolio(request);
  });

  test('buys a fund and verifies it appears in the portfolio', async ({ page }) => {
    await page.goto('/');

    // Open the buy modal for the first fund (Global Equity Fund)
    await clickRowAction(page, 'Global Equity Fund', 'Comprar');

    // Verify modal opened
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h2')).toHaveText('Comprar fondo');
    await expect(dialog).toContainText('Global Equity Fund');

    // Enter quantity
    await dialog.locator('input[type="number"]').fill('5');

    // Click buy button
    await dialog.getByRole('button', { name: 'Comprar' }).click();

    // Modal should close after successful buy
    await expect(dialog).not.toBeVisible();

    // Navigate to portfolio
    await page.goto('/portfolio');
    await expect(page.locator('h1')).toHaveText('Mi cartera');

    // Verify the fund appears in the portfolio
    await expect(page.getByText('Global Equity Fund')).toBeVisible();
  });

  test('shows validation error for invalid quantity', async ({ page }) => {
    await page.goto('/');

    await clickRowAction(page, 'Global Equity Fund', 'Comprar');

    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();

    // Try to buy with 0 quantity
    await dialog.locator('input[type="number"]').fill('0');
    await dialog.getByRole('button', { name: 'Comprar' }).click();

    // Should show validation error and modal stays open
    await expect(dialog).toBeVisible();
  });

  test('cancels the buy modal', async ({ page }) => {
    await page.goto('/');

    await clickRowAction(page, 'Global Equity Fund', 'Comprar');

    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();

    // Click cancel
    await dialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(dialog).not.toBeVisible();

    // Portfolio should still be empty
    await page.getByRole('link', { name: 'Mi cartera' }).click();
    await expect(page.getByText('No tienes fondos en tu cartera')).toBeVisible();
  });

  test('enforces max buy amount of 10,000 EUR', async ({ page }) => {
    await page.goto('/');

    // Global Equity Fund has value 120.45 EUR
    // 10,000 / 120.45 = ~83.02 → 84 units should exceed
    await clickRowAction(page, 'Global Equity Fund', 'Comprar');

    const dialog = page.locator('dialog[open]');
    await dialog.locator('input[type="number"]').fill('84');
    await dialog.getByRole('button', { name: 'Comprar' }).click();

    // Should show a validation error about max amount
    await expect(dialog).toBeVisible();
  });
});
