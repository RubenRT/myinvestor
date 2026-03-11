import type { Amount } from './fund';

export interface PortfolioItem {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly totalValue: Amount;
}

export interface PortfolioItemEnriched extends PortfolioItem {
  readonly category: string;
  readonly unitValue: Amount;
  readonly gainPercent: number;
}
