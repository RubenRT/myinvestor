import type { Fund } from '@/types/fund';
import { CATEGORY_LABELS } from '@/utils/constants';

export interface FundDisplay extends Fund {
  categoryLabel: string;
  formattedYTD: number;
  formattedOneYear: number;
  formattedThreeYears: number;
  formattedFiveYears: number;
}

export function adaptFund(fund: Fund): FundDisplay {
  return {
    ...fund,
    categoryLabel: CATEGORY_LABELS[fund.category] ?? fund.category,
    formattedYTD: fund.profitability.YTD * 100,
    formattedOneYear: fund.profitability.oneYear * 100,
    formattedThreeYears: fund.profitability.threeYears * 100,
    formattedFiveYears: fund.profitability.fiveYears * 100,
  };
}

export function adaptFunds(funds: Fund[]): FundDisplay[] {
  return funds.map(adaptFund);
}
