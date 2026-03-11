type Profitability = Readonly<{
  YTD: number;
  oneYear: number;
  threeYears: number;
  fiveYears: number;
}>;

type Category = 'GLOBAL' | 'TECH' | 'HEALTH' | 'MONEY_MARKET';

type Currency = 'EUR' | 'USD';

export type Amount = Readonly<{
  currency: Currency;
  amount: number;
}>;

export type Fund = Readonly<{
  id: string;
  name: string;
  symbol: string;
  value: Amount;
  category: Category;
  profitability: Profitability;
}>;

export default [
  {
    id: '1',
    name: 'Global Equity Fund',
    symbol: 'GEF',
    value: {
      amount: 120.45,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.05,
      oneYear: 0.12,
      threeYears: 0.35,
      fiveYears: 0.5,
    },
  },
  {
    id: '2',
    name: 'Tech Growth Fund',
    symbol: 'TGF',
    value: {
      amount: 210.32,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.08,
      oneYear: 0.18,
      threeYears: 0.42,
      fiveYears: 0.65,
    },
  },
  {
    id: '3',
    name: 'Healthcare Opportunities',
    symbol: 'HCO',
    value: {
      amount: 145.9,
      currency: 'EUR',
    },
    category: 'HEALTH',
    profitability: {
      YTD: 0.03,
      oneYear: 0.09,
      threeYears: 0.28,
      fiveYears: 0.41,
    },
  },
  {
    id: '4',
    name: 'Energy Sector Fund',
    symbol: 'ESF',
    value: {
      amount: 98.67,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: -0.02,
      oneYear: 0.15,
      threeYears: 0.22,
      fiveYears: 0.33,
    },
  },
  {
    id: '5',
    name: 'Emerging Markets Equity',
    symbol: 'EME',
    value: {
      amount: 130.21,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.06,
      oneYear: 0.14,
      threeYears: 0.31,
      fiveYears: 0.47,
    },
  },
  {
    id: '6',
    name: 'US Small Cap Fund',
    symbol: 'USC',
    value: {
      amount: 110.12,
      currency: 'EUR',
    },
    category: 'MONEY_MARKET',
    profitability: {
      YTD: 0.04,
      oneYear: 0.11,
      threeYears: 0.29,
      fiveYears: 0.38,
    },
  },
  {
    id: '7',
    name: 'Real Estate Income',
    symbol: 'REI',
    value: {
      amount: 88.45,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.07,
      oneYear: 0.16,
      threeYears: 0.35,
      fiveYears: 0.52,
    },
  },
  {
    id: '8',
    name: 'International Value',
    symbol: 'IVF',
    value: {
      amount: 132.77,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.02,
      oneYear: 0.13,
      threeYears: 0.26,
      fiveYears: 0.44,
    },
  },
  {
    id: '9',
    name: 'Dividend Leaders Fund',
    symbol: 'DLF',
    value: {
      amount: 102.54,
      currency: 'EUR',
    },
    category: 'MONEY_MARKET',
    profitability: {
      YTD: 0.09,
      oneYear: 0.17,
      threeYears: 0.32,
      fiveYears: 0.48,
    },
  },
  {
    id: '10',
    name: 'Bond Index Fund',
    symbol: 'BIF',
    value: {
      amount: 50.12,
      currency: 'EUR',
    },
    category: 'MONEY_MARKET',
    profitability: {
      YTD: 0.01,
      oneYear: 0.04,
      threeYears: 0.08,
      fiveYears: 0.12,
    },
  },
  {
    id: '11',
    name: 'Global Infrastructure',
    symbol: 'GIF',
    value: {
      amount: 93.65,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.05,
      oneYear: 0.13,
      threeYears: 0.27,
      fiveYears: 0.39,
    },
  },
  {
    id: '12',
    name: 'Financial Sector Fund',
    symbol: 'FSF',
    value: {
      amount: 127.43,
      currency: 'EUR',
    },
    category: 'MONEY_MARKET',
    profitability: {
      YTD: 0.04,
      oneYear: 0.12,
      threeYears: 0.25,
      fiveYears: 0.42,
    },
  },
  {
    id: '13',
    name: 'Clean Energy Fund',
    symbol: 'CEF',
    value: {
      amount: 151.89,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.11,
      oneYear: 0.22,
      threeYears: 0.45,
      fiveYears: 0.68,
    },
  },
  {
    id: '14',
    name: 'AI & Robotics Fund',
    symbol: 'AIR',
    value: {
      amount: 212.3,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.15,
      oneYear: 0.28,
      threeYears: 0.58,
      fiveYears: 0.82,
    },
  },
  {
    id: '15',
    name: 'Global Balanced Fund',
    symbol: 'GBF',
    value: {
      amount: 100.01,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.06,
      oneYear: 0.12,
      threeYears: 0.24,
      fiveYears: 0.35,
    },
  },
  {
    id: '16',
    name: 'Luxury Goods Equity',
    symbol: 'LGE',
    value: {
      amount: 175.42,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.08,
      oneYear: 0.19,
      threeYears: 0.41,
      fiveYears: 0.59,
    },
  },
  {
    id: '17',
    name: 'US Blue Chip Fund',
    symbol: 'UBC',
    value: {
      amount: 144.9,
      currency: 'EUR',
    },
    category: 'MONEY_MARKET',
    profitability: {
      YTD: 0.07,
      oneYear: 0.14,
      threeYears: 0.31,
      fiveYears: 0.46,
    },
  },
  {
    id: '18',
    name: 'Asia Pacific Equity',
    symbol: 'APE',
    value: {
      amount: 122.33,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.03,
      oneYear: 0.11,
      threeYears: 0.29,
      fiveYears: 0.43,
    },
  },
  {
    id: '19',
    name: 'Consumer Staples Fund',
    symbol: 'CSF',
    value: {
      amount: 88.9,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.04,
      oneYear: 0.07,
      threeYears: 0.19,
      fiveYears: 0.31,
    },
  },
  {
    id: '20',
    name: 'Water Resources Fund',
    symbol: 'WRF',
    value: {
      amount: 136.12,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.05,
      oneYear: 0.12,
      threeYears: 0.28,
      fiveYears: 0.41,
    },
  },
  {
    id: '21',
    name: 'Defense & Aerospace',
    symbol: 'DAF',
    value: {
      amount: 198.77,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.09,
      oneYear: 0.21,
      threeYears: 0.44,
      fiveYears: 0.62,
    },
  },
  {
    id: '22',
    name: 'Cybersecurity Fund',
    symbol: 'CSY',
    value: {
      amount: 189.23,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.12,
      oneYear: 0.25,
      threeYears: 0.48,
      fiveYears: 0.71,
    },
  },
  {
    id: '23',
    name: 'Luxury Real Estate',
    symbol: 'LRE',
    value: {
      amount: 155.5,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.06,
      oneYear: 0.15,
      threeYears: 0.33,
      fiveYears: 0.49,
    },
  },
  {
    id: '24',
    name: 'Space Technology',
    symbol: 'STC',
    value: {
      amount: 134.89,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.18,
      oneYear: 0.35,
      threeYears: 0.67,
      fiveYears: 0.98,
    },
  },
  {
    id: '25',
    name: 'US Treasury Bond Fund',
    symbol: 'UTB',
    value: {
      amount: 99.99,
      currency: 'EUR',
    },
    category: 'MONEY_MARKET',
    profitability: {
      YTD: 0.02,
      oneYear: 0.03,
      threeYears: 0.06,
      fiveYears: 0.09,
    },
  },
  {
    id: '26',
    name: 'Agriculture Index Fund',
    symbol: 'AIF',
    value: {
      amount: 112.48,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.07,
      oneYear: 0.16,
      threeYears: 0.29,
      fiveYears: 0.42,
    },
  },
  {
    id: '27',
    name: 'European Growth Fund',
    symbol: 'EGF',
    value: {
      amount: 145.78,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.05,
      oneYear: 0.13,
      threeYears: 0.28,
      fiveYears: 0.41,
    },
  },
  {
    id: '28',
    name: 'Emerging Tech Fund',
    symbol: 'ETF',
    value: {
      amount: 213.67,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.14,
      oneYear: 0.27,
      threeYears: 0.56,
      fiveYears: 0.78,
    },
  },
  {
    id: '29',
    name: 'Global Consumer Fund',
    symbol: 'GCF',
    value: {
      amount: 108.56,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.04,
      oneYear: 0.1,
      threeYears: 0.23,
      fiveYears: 0.36,
    },
  },
  {
    id: '30',
    name: 'Mining & Metals Fund',
    symbol: 'MMF',
    value: {
      amount: 94.32,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.01,
      oneYear: 0.08,
      threeYears: 0.18,
      fiveYears: 0.29,
    },
  },
  {
    id: '31',
    name: 'Renewable Power Fund',
    symbol: 'RPF',
    value: {
      amount: 142.18,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.09,
      oneYear: 0.19,
      threeYears: 0.38,
      fiveYears: 0.54,
    },
  },
  {
    id: '32',
    name: 'Blockchain Innovators',
    symbol: 'BCI',
    value: {
      amount: 230.11,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.22,
      oneYear: 0.45,
      threeYears: 0.89,
      fiveYears: 1.34,
    },
  },
  {
    id: '33',
    name: 'Fintech Opportunities',
    symbol: 'FTO',
    value: {
      amount: 186.77,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.16,
      oneYear: 0.31,
      threeYears: 0.64,
      fiveYears: 0.87,
    },
  },
  {
    id: '34',
    name: 'Global Dividend Fund',
    symbol: 'GDF',
    value: {
      amount: 104.99,
      currency: 'EUR',
    },
    category: 'MONEY_MARKET',
    profitability: {
      YTD: 0.06,
      oneYear: 0.12,
      threeYears: 0.24,
      fiveYears: 0.38,
    },
  },
  {
    id: '35',
    name: 'US Mid Cap Growth',
    symbol: 'UMG',
    value: {
      amount: 123.45,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.08,
      oneYear: 0.15,
      threeYears: 0.32,
      fiveYears: 0.48,
    },
  },
  {
    id: '36',
    name: 'ESG Leaders Fund',
    symbol: 'ESG',
    value: {
      amount: 117.65,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.07,
      oneYear: 0.14,
      threeYears: 0.3,
      fiveYears: 0.45,
    },
  },
  {
    id: '37',
    name: 'Luxury Lifestyle Fund',
    symbol: 'LLF',
    value: {
      amount: 176.34,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.1,
      oneYear: 0.2,
      threeYears: 0.43,
      fiveYears: 0.61,
    },
  },
  {
    id: '38',
    name: 'Latin America Fund',
    symbol: 'LAF',
    value: {
      amount: 109.23,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.02,
      oneYear: 0.09,
      threeYears: 0.21,
      fiveYears: 0.33,
    },
  },
  {
    id: '39',
    name: 'Private Equity Access',
    symbol: 'PEA',
    value: {
      amount: 212.87,
      currency: 'EUR',
    },
    category: 'MONEY_MARKET',
    profitability: {
      YTD: 0.13,
      oneYear: 0.26,
      threeYears: 0.52,
      fiveYears: 0.74,
    },
  },
  {
    id: '40',
    name: 'Global Tech Titans',
    symbol: 'GTT',
    value: {
      amount: 224.9,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.17,
      oneYear: 0.33,
      threeYears: 0.67,
      fiveYears: 0.94,
    },
  },
  {
    id: '41',
    name: 'Natural Resources Fund',
    symbol: 'NRF',
    value: {
      amount: 90.11,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.03,
      oneYear: 0.11,
      threeYears: 0.22,
      fiveYears: 0.34,
    },
  },
  {
    id: '42',
    name: 'Insurance Equity Fund',
    symbol: 'IEF',
    value: {
      amount: 128.76,
      currency: 'EUR',
    },
    category: 'MONEY_MARKET',
    profitability: {
      YTD: 0.05,
      oneYear: 0.12,
      threeYears: 0.26,
      fiveYears: 0.39,
    },
  },
  {
    id: '43',
    name: 'Transportation Growth',
    symbol: 'TGF',
    value: {
      amount: 119.85,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.06,
      oneYear: 0.14,
      threeYears: 0.28,
      fiveYears: 0.43,
    },
  },
  {
    id: '44',
    name: 'Digital Commerce Fund',
    symbol: 'DCF',
    value: {
      amount: 147.99,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.11,
      oneYear: 0.23,
      threeYears: 0.47,
      fiveYears: 0.69,
    },
  },
  {
    id: '45',
    name: 'US Infrastructure Fund',
    symbol: 'UIF',
    value: {
      amount: 105.88,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.04,
      oneYear: 0.11,
      threeYears: 0.24,
      fiveYears: 0.37,
    },
  },
  {
    id: '46',
    name: 'Global High Yield',
    symbol: 'GHY',
    value: {
      amount: 112.1,
      currency: 'EUR',
    },
    category: 'MONEY_MARKET',
    profitability: {
      YTD: 0.03,
      oneYear: 0.08,
      threeYears: 0.18,
      fiveYears: 0.28,
    },
  },
  {
    id: '47',
    name: 'Food Innovation Fund',
    symbol: 'FIF',
    value: {
      amount: 133.56,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.08,
      oneYear: 0.17,
      threeYears: 0.34,
      fiveYears: 0.51,
    },
  },
  {
    id: '48',
    name: 'eSports & Gaming Fund',
    symbol: 'EGF',
    value: {
      amount: 198.24,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.16,
      oneYear: 0.32,
      threeYears: 0.64,
      fiveYears: 0.89,
    },
  },
  {
    id: '49',
    name: 'High Tech Materials',
    symbol: 'HTM',
    value: {
      amount: 157.43,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.09,
      oneYear: 0.19,
      threeYears: 0.39,
      fiveYears: 0.58,
    },
  },
  {
    id: '50',
    name: 'Cloud Computing Fund',
    symbol: 'CCF',
    value: {
      amount: 202.77,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.15,
      oneYear: 0.29,
      threeYears: 0.61,
      fiveYears: 0.86,
    },
  },
  {
    id: '51',
    name: 'Pet Care Equity',
    symbol: 'PCE',
    value: {
      amount: 123.12,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.07,
      oneYear: 0.15,
      threeYears: 0.31,
      fiveYears: 0.46,
    },
  },
  {
    id: '52',
    name: 'Green Transport Fund',
    symbol: 'GTF',
    value: {
      amount: 166.89,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.12,
      oneYear: 0.24,
      threeYears: 0.49,
      fiveYears: 0.72,
    },
  },
  {
    id: '53',
    name: 'Middle East Equity',
    symbol: 'MEE',
    value: {
      amount: 115.23,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.04,
      oneYear: 0.1,
      threeYears: 0.22,
      fiveYears: 0.35,
    },
  },
  {
    id: '54',
    name: 'Luxury Travel Fund',
    symbol: 'LTF',
    value: {
      amount: 172.1,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.09,
      oneYear: 0.18,
      threeYears: 0.38,
      fiveYears: 0.56,
    },
  },
  {
    id: '55',
    name: 'Smart Cities Fund',
    symbol: 'SCF',
    value: {
      amount: 141.77,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.08,
      oneYear: 0.16,
      threeYears: 0.33,
      fiveYears: 0.49,
    },
  },
  {
    id: '56',
    name: 'AI Revolution Fund',
    symbol: 'AIR',
    value: {
      amount: 245.67,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.2,
      oneYear: 0.41,
      threeYears: 0.84,
      fiveYears: 1.25,
    },
  },
  {
    id: '57',
    name: 'Ocean Economy Fund',
    symbol: 'OEF',
    value: {
      amount: 137.89,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.06,
      oneYear: 0.13,
      threeYears: 0.27,
      fiveYears: 0.41,
    },
  },
  {
    id: '58',
    name: 'Advanced Materials',
    symbol: 'ADM',
    value: {
      amount: 118.55,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.05,
      oneYear: 0.11,
      threeYears: 0.24,
      fiveYears: 0.38,
    },
  },
  {
    id: '59',
    name: 'China Consumer Fund',
    symbol: 'CCF',
    value: {
      amount: 125.45,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.02,
      oneYear: 0.08,
      threeYears: 0.19,
      fiveYears: 0.32,
    },
  },
  {
    id: '60',
    name: 'Genomics Innovation',
    symbol: 'GIN',
    value: {
      amount: 230.76,
      currency: 'EUR',
    },
    category: 'HEALTH',
    profitability: {
      YTD: 0.18,
      oneYear: 0.36,
      threeYears: 0.73,
      fiveYears: 1.08,
    },
  },
  {
    id: '61',
    name: 'Electric Vehicle Fund',
    symbol: 'EVF',
    value: {
      amount: 198.55,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.13,
      oneYear: 0.28,
      threeYears: 0.58,
      fiveYears: 0.84,
    },
  },
  {
    id: '62',
    name: 'Satellite Tech Fund',
    symbol: 'STF',
    value: {
      amount: 214.34,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.16,
      oneYear: 0.32,
      threeYears: 0.65,
      fiveYears: 0.92,
    },
  },
  {
    id: '63',
    name: 'Space Exploration Fund',
    symbol: 'SEF',
    value: {
      amount: 233.22,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.21,
      oneYear: 0.43,
      threeYears: 0.88,
      fiveYears: 1.31,
    },
  },
  {
    id: '64',
    name: 'Digital Payments Fund',
    symbol: 'DPF',
    value: {
      amount: 165.12,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.1,
      oneYear: 0.21,
      threeYears: 0.44,
      fiveYears: 0.66,
    },
  },
  {
    id: '65',
    name: 'Global Internet Fund',
    symbol: 'GIF',
    value: {
      amount: 176.43,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.11,
      oneYear: 0.23,
      threeYears: 0.47,
      fiveYears: 0.69,
    },
  },
  {
    id: '66',
    name: 'Mobile Economy Fund',
    symbol: 'MEF',
    value: {
      amount: 129,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.08,
      oneYear: 0.16,
      threeYears: 0.33,
      fiveYears: 0.49,
    },
  },
  {
    id: '67',
    name: 'Women in Leadership',
    symbol: 'WIL',
    value: {
      amount: 139.99,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.09,
      oneYear: 0.18,
      threeYears: 0.37,
      fiveYears: 0.55,
    },
  },
  {
    id: '68',
    name: 'Youth Innovation Fund',
    symbol: 'YIF',
    value: {
      amount: 124.89,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.12,
      oneYear: 0.25,
      threeYears: 0.51,
      fiveYears: 0.76,
    },
  },
  {
    id: '69',
    name: 'Circular Economy Fund',
    symbol: 'CEF',
    value: {
      amount: 158.22,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.1,
      oneYear: 0.2,
      threeYears: 0.42,
      fiveYears: 0.63,
    },
  },
  {
    id: '70',
    name: 'Digital Infrastructure',
    symbol: 'DIF',
    value: {
      amount: 190.31,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.14,
      oneYear: 0.27,
      threeYears: 0.56,
      fiveYears: 0.81,
    },
  },
  {
    id: '71',
    name: 'Africa Growth Fund',
    symbol: 'AGF',
    value: {
      amount: 112.76,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.03,
      oneYear: 0.09,
      threeYears: 0.21,
      fiveYears: 0.34,
    },
  },
  {
    id: '72',
    name: 'Global Healthcare Fund',
    symbol: 'GHF',
    value: {
      amount: 145.67,
      currency: 'EUR',
    },
    category: 'HEALTH',
    profitability: {
      YTD: 0.07,
      oneYear: 0.15,
      threeYears: 0.32,
      fiveYears: 0.48,
    },
  },
  {
    id: '73',
    name: 'Smart Agriculture Fund',
    symbol: 'SAF',
    value: {
      amount: 134.45,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.06,
      oneYear: 0.14,
      threeYears: 0.29,
      fiveYears: 0.44,
    },
  },
  {
    id: '74',
    name: 'Urban Development Fund',
    symbol: 'UDF',
    value: {
      amount: 121.89,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.05,
      oneYear: 0.12,
      threeYears: 0.26,
      fiveYears: 0.4,
    },
  },
  {
    id: '75',
    name: 'Global Luxury Brands',
    symbol: 'GLB',
    value: {
      amount: 198.99,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.11,
      oneYear: 0.22,
      threeYears: 0.46,
      fiveYears: 0.68,
    },
  },
  {
    id: '76',
    name: 'Digital Media Fund',
    symbol: 'DMF',
    value: {
      amount: 167.45,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.09,
      oneYear: 0.18,
      threeYears: 0.38,
      fiveYears: 0.57,
    },
  },
  {
    id: '77',
    name: 'Global Water Fund',
    symbol: 'GWF',
    value: {
      amount: 142.34,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.04,
      oneYear: 0.11,
      threeYears: 0.24,
      fiveYears: 0.37,
    },
  },
  {
    id: '78',
    name: 'Cyber Defense Fund',
    symbol: 'CDF',
    value: {
      amount: 189.99,
      currency: 'EUR',
    },
    category: 'TECH',
    profitability: {
      YTD: 0.13,
      oneYear: 0.26,
      threeYears: 0.53,
      fiveYears: 0.77,
    },
  },
  {
    id: '79',
    name: 'Global Supply Chain',
    symbol: 'GSC',
    value: {
      amount: 155.67,
      currency: 'EUR',
    },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.08,
      oneYear: 0.16,
      threeYears: 0.34,
      fiveYears: 0.51,
    },
  },
  {
    id: '80',
    name: 'Digital Health Fund',
    symbol: 'DHF',
    value: {
      amount: 175.89,
      currency: 'EUR',
    },
    category: 'HEALTH',
    profitability: {
      YTD: 0.12,
      oneYear: 0.24,
      threeYears: 0.49,
      fiveYears: 0.73,
    },
  },
] satisfies ReadonlyArray<Fund>;
