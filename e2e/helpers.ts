import { type Page, type APIRequestContext, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';

/**
 * Clears the in-memory portfolio by selling all holdings via the API.
 */
export async function resetPortfolio(request: APIRequestContext): Promise<void> {
  const res = await request.get(`${API_URL}/portfolio`);
  const { data } = (await res.json()) as {
    data: Array<{ id: string; quantity: number }>;
  };

  for (const item of data) {
    await request.post(`${API_URL}/funds/${item.id}/sell`, {
      data: { quantity: item.quantity },
    });
  }
}

/**
 * Buys the given quantity of a fund via the API (bypasses UI).
 */
export async function buyFundViaApi(
  request: APIRequestContext,
  fundId: string,
  quantity: number
): Promise<void> {
  await request.post(`${API_URL}/funds/${fundId}/buy`, {
    data: { quantity },
  });
}

/**
 * Opens the action menu for a fund list table row and clicks the specified action.
 */
export async function clickRowAction(
  page: Page,
  rowText: string,
  actionLabel: string
): Promise<void> {
  const row = page.locator('tr', { hasText: rowText });
  await row.locator('button[aria-label="Acciones"]').click();
  await page.locator('button[role="menuitem"]', { hasText: actionLabel }).click();
}

/**
 * Opens the action menu for a portfolio item and clicks the specified action.
 * Portfolio items are <div> containers with the fund name and an Acciones button.
 */
export async function clickPortfolioItemAction(
  page: Page,
  fundName: string,
  actionLabel: string
): Promise<void> {
  const nameEl = page.getByText(fundName, { exact: true });
  await expect(nameEl).toBeVisible();
  // Navigate up from .name → .info → .item (the portfolio item container)
  const itemContainer = nameEl.locator('xpath=ancestor::div[.//button[@aria-label="Acciones"]][1]');
  await itemContainer.locator('button[aria-label="Acciones"]').click();
  await page.locator('button[role="menuitem"]', { hasText: actionLabel }).click();
}
