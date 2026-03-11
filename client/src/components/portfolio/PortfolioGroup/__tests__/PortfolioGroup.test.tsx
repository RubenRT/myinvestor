import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/test-utils';
import { PortfolioGroup } from '../PortfolioGroup';
import { makePortfolioItemEnriched } from '@/test/fixtures';
import type { PortfolioGroup as PortfolioGroupType } from '@/adapters/portfolio.adapter';

describe('PortfolioGroup', () => {
  const items = [
    makePortfolioItemEnriched({ id: '1', name: 'Fund A' }),
    makePortfolioItemEnriched({ id: '2', name: 'Fund B' }),
  ];

  const group: PortfolioGroupType = {
    category: 'GLOBAL',
    label: 'Global',
    items,
  };

  it('renders group label as heading', () => {
    renderWithProviders(
      <PortfolioGroup group={group} onSell={vi.fn()} onTransfer={vi.fn()} />,
    );

    expect(screen.getByRole('heading', { name: 'Global' })).toBeInTheDocument();
  });

  it('renders all portfolio items in the group', () => {
    renderWithProviders(
      <PortfolioGroup group={group} onSell={vi.fn()} onTransfer={vi.fn()} />,
    );

    expect(screen.getByText('Fund A')).toBeInTheDocument();
    expect(screen.getByText('Fund B')).toBeInTheDocument();
  });
});
