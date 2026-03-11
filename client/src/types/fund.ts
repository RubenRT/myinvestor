export type Currency = 'EUR' | 'USD';

export type Category = 'GLOBAL' | 'TECH' | 'HEALTH' | 'MONEY_MARKET';

export interface Amount {
  readonly currency: Currency;
  readonly amount: number;
}

export interface Profitability {
  readonly YTD: number;
  readonly oneYear: number;
  readonly threeYears: number;
  readonly fiveYears: number;
}

export interface Fund {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly value: Amount;
  readonly category: Category;
  readonly profitability: Profitability;
}
