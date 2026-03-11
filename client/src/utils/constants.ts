import type { Category } from '@/types/fund';

export const API_BASE_URL = '/api';

export const CATEGORY_LABELS: Record<Category, string> = {
  GLOBAL: 'Global',
  TECH: 'Tecnologia',
  HEALTH: 'Salud',
  MONEY_MARKET: 'Mercado monetario',
};

export const CATEGORY_ORDER: Category[] = [
  'MONEY_MARKET',
  'GLOBAL',
  'TECH',
  'HEALTH',
];

export const MAX_BUY_AMOUNT_EUR = 10_000;

export const DEFAULT_PAGE_SIZE = 10;
