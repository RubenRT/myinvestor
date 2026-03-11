import type { Fund, Category } from '@/types/fund';
import type { PortfolioItem, PortfolioItemEnriched } from '@/types/portfolio';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/utils/constants';

export function enrichPortfolioItem(
  item: PortfolioItem,
  fund: Fund | undefined,
): PortfolioItemEnriched {
  const category = fund?.category ?? 'GLOBAL';
  const unitValue = fund?.value ?? { amount: 0, currency: 'EUR' as const };
  const gainPercent = fund ? fund.profitability.YTD * 100 : 0;

  return {
    ...item,
    category: CATEGORY_LABELS[category] ?? category,
    unitValue,
    gainPercent,
  };
}

export interface PortfolioGroup {
  category: Category;
  label: string;
  items: PortfolioItemEnriched[];
}

export function groupPortfolioByCategory(
  items: PortfolioItemEnriched[],
  fundsMap: Map<string, Fund>,
): PortfolioGroup[] {
  const groups = new Map<Category, PortfolioItemEnriched[]>();

  for (const item of items) {
    const fund = fundsMap.get(item.id);
    const category = fund?.category ?? 'GLOBAL';
    const existing = groups.get(category) ?? [];
    existing.push(item);
    groups.set(category, existing);
  }

  return CATEGORY_ORDER
    .filter((cat) => groups.has(cat))
    .map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      items: (groups.get(cat) ?? []).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }));
}
