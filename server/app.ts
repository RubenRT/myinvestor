import bodyParser from 'body-parser';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import FUNDS, { type Fund, type Amount } from './data/funds.ts';
import { isNumber, isString } from './utils.ts';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

declare global {
  namespace Express {
    interface Request {
      fund?: Fund;
    }
  }
}

interface PortfolioItem {
  id: string;
  quantity: number;
}

// In-memory portfolio
let portfolio: PortfolioItem[] = [];

const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];

const isSortDirection = (direction: any): direction is SortDirection =>
  [SORT_DIRECTION.ASC, SORT_DIRECTION.DESC].includes(direction);

const isProfitabilityField = (
  field: string
): field is `profitability.${keyof Fund['profitability']}` => field.startsWith('profitability.');

const sortFunds = ({ funds, sortQuery }: { funds: ReadonlyArray<Fund>; sortQuery: string }) => {
  const [field, sort = SORT_DIRECTION.ASC] = sortQuery.split(':');
  const validFieldsToSort = [
    'name',
    'currency',
    'value',
    'category',
    'profitability.YTD',
    'profitability.oneYear',
    'profitability.threeYears',
    'profitability.fiveYears',
  ];

  const sortString = (values: [string, string], sort: SortDirection) => {
    return sort === SORT_DIRECTION.ASC
      ? values[0].localeCompare(values[1])
      : values[1].localeCompare(values[0]);
  };
  const sortNumber = (values: [number, number], sort: SortDirection) => {
    return sort === SORT_DIRECTION.ASC ? values[0] - values[1] : values[1] - values[0];
  };

  return field && isSortDirection(sort) && validFieldsToSort.includes(field)
    ? funds.toSorted((fundA, fundB) => {
        if (isProfitabilityField(field)) {
          const subKey = field.split('.')[1] as keyof Fund['profitability'];
          const valueA = fundA.profitability[subKey];
          const valueB = fundB.profitability[subKey];

          return sortNumber([valueA, valueB], sort);
        } else if (field === 'value') {
          return sortNumber([fundA.value.amount, fundB.value.amount], sort);
        } else if (field === 'currency') {
          return sortString([fundA.value.currency, fundB.value.currency], sort);
        } else {
          const key = field as keyof Fund;
          const valueA = fundA[key];
          const valueB = fundB[key];

          if (isString(valueA) && isString(valueB)) {
            return sortString([valueA, valueB], sort);
          }

          if (isNumber(valueA) && isNumber(valueB)) {
            return sortNumber([valueA, valueB], sort);
          }

          return 0;
        }
      })
    : funds;
};

/**
 * @swagger
 * /funds:
 *   get:
 *     summary: Retrieve a list of funds
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of funds to retrieve per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - 'name:asc'
 *             - 'name:desc'
 *             - 'currency:asc'
 *             - 'currency:desc'
 *             - 'value:asc'
 *             - 'value:desc'
 *             - 'category:asc'
 *             - 'category:desc'
 *             - 'profitability.YTD:asc'
 *             - 'profitability.YTD:desc'
 *             - 'profitability.oneYear:asc'
 *             - 'profitability.oneYear:desc'
 *             - 'profitability.threeYears:asc'
 *             - 'profitability.threeYears:desc'
 *             - 'profitability.fiveYears:asc'
 *             - 'profitability.fiveYears:desc'
 *         description: Sort order for the funds (e.g., 'name:asc')
 *     responses:
 *       200:
 *         description: A list of funds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalFunds:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Fund'
 */
app.get('/funds', (req: Request, res: Response) => {
  const { page: pageQuery, limit: limitQuery, sort } = req.query;
  const page = isString(pageQuery) ? parseInt(pageQuery, 10) : 1;
  const limit = isString(limitQuery) ? parseInt(limitQuery, 10) : 10;

  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Invalid pagination parameters' });
  }

  const sortedFunds = isString(sort) ? sortFunds({ funds: FUNDS, sortQuery: sort }) : FUNDS;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedFunds = sortedFunds.slice(startIndex, endIndex);

  res.json({
    pagination: {
      page,
      limit,
      totalFunds: sortedFunds.length,
      totalPages: Math.ceil(sortedFunds.length / limit),
    },
    data: paginatedFunds,
  });
});

const getFundById = (id: string): Fund | undefined => FUNDS.find((f) => f.id === id);

const fundRoute = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id || !isString(req.params.id)) {
    return res.status(400).json({ error: 'Invalid fund ID' });
  }

  const id = req.params.id;
  const fund = getFundById(id);
  if (!fund) {
    return res.status(404).json({ error: 'Fund not found' });
  }

  req.fund = fund;
  next();
};

/**
 * @swagger
 * /funds/{id}:
 *   get:
 *     summary: Retrieve details of a specific fund
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the fund to retrieve
 *     responses:
 *       200:
 *         description: Details of the fund
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Fund'
 *       404:
 *         description: Fund not found
 */
app.get('/funds/:id', fundRoute, (req: Request, res: Response) => res.json({ data: req.fund }));

/**
 * @swagger
 * /funds/{id}/buy:
 *   post:
 *     summary: Buy a quantity of a specific fund
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the fund to buy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: The quantity of the fund to buy
 *     responses:
 *       200:
 *         description: Purchase successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     portfolio:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           quantity:
 *                             type: number
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Fund not found
 */
app.post('/funds/:id/buy', fundRoute, (req: Request, res: Response) => {
  const id = req.fund?.id;
  if (!id) return res.status(404).json({ error: 'Fund not found' });

  const { quantity } = req.body;
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const holding = portfolio.find((p) => p.id === id);
  if (holding) {
    holding.quantity += quantity;
  } else {
    portfolio.push({ id, quantity });
  }

  res.json({ message: 'Purchase successful', data: { portfolio } });
});

/**
 * @swagger
 * /funds/{id}/sell:
 *   post:
 *     summary: Sell a quantity of a specific fund
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the fund to sell
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: The quantity of the fund to sell
 *     responses:
 *       200:
 *         description: Sale successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     portfolio:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           quantity:
 *                             type: number
 *       400:
 *         description: Not enough units to sell
 *       404:
 *         description: Fund not found
 */
app.post('/funds/:id/sell', fundRoute, (req: Request, res: Response) => {
  const id = req.params.id;
  const { quantity } = req.body;

  const holding = portfolio.find((p) => p.id === id);
  if (!holding || holding.quantity < quantity) {
    return res.status(400).json({ error: 'Not enough units to sell' });
  }

  holding.quantity -= quantity;
  if (holding.quantity === 0) {
    portfolio = portfolio.filter((p) => p.id !== id);
  }

  res.json({ message: 'Sale successful', data: { portfolio } });
});

/**
 * @swagger
 * /funds/transfer:
 *   post:
 *     summary: Transfer a quantity from one fund to another
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromFundId:
 *                 type: string
 *                 description: The ID of the fund to transfer from
 *               toFundId:
 *                 type: string
 *                 description: The ID of the fund to transfer to
 *               quantity:
 *                 type: number
 *                 description: The quantity to transfer
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     portfolio:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           quantity:
 *                             type: number
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Fund not found
 */
app.post('/funds/transfer', (req: Request, res: Response) => {
  const { fromFundId, toFundId, quantity } = req.body;
  if (!fromFundId || !toFundId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  if (fromFundId === toFundId) {
    return res.status(400).json({ error: 'Cannot transfer to the same fund' });
  }

  const fromHolding = portfolio.find((p) => p.id === fromFundId);
  if (!fromHolding || fromHolding.quantity < quantity) {
    return res.status(400).json({ error: 'Not enough units to transfer' });
  }

  const toFund = getFundById(toFundId);
  if (!toFund) {
    return res.status(404).json({ error: 'Destination fund not found' });
  }

  fromHolding.quantity -= quantity;
  if (fromHolding.quantity === 0) {
    portfolio = portfolio.filter((p) => p.id !== fromFundId);
  }

  const toHolding = portfolio.find((p) => p.id === toFundId);
  if (toHolding) {
    toHolding.quantity += quantity;
  } else {
    portfolio.push({ id: toFundId, quantity });
  }

  res.json({ message: 'Transfer successful', data: { portfolio } });
});

/**
 * @swagger
 * /portfolio:
 *   get:
 *     summary: Retrieve the current portfolio
 *     responses:
 *       200:
 *         description: The current portfolio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       totalValue:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: number
 *                           currency:
 *                             type: string
 *                             enum: ['USD', 'EUR']
 */
app.get('/portfolio', (req: Request, res: Response) => {
  const detailedPortfolio = portfolio
    .map(({ id: fundId, quantity }) => {
      const fund = getFundById(fundId);
      if (!fund) return;
      const { value, name, id } = fund;
      return {
        id,
        name,
        quantity: quantity,
        totalValue: { amount: quantity * value.amount, currency: value.currency },
      };
    })
    .filter(Boolean);
  res.json({ data: detailedPortfolio });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Investor API',
      version: '1.0.0',
      description: 'API for managing funds and portfolios',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        Fund: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            symbol: {
              type: 'string',
            },
            value: {
              type: 'object',
              properties: {
                amount: {
                  type: 'number',
                },
                currency: {
                  type: 'string',
                  enum: ['USD', 'EUR'],
                },
              },
            },
            category: {
              type: 'string',
              enum: ['GLOBAL', 'TECH', 'HEALTH', 'MONEY_MARKET'],
            },
            profitability: {
              type: 'object',
              properties: {
                YTD: {
                  type: 'number',
                },
                oneYear: {
                  type: 'number',
                },
                threeYears: {
                  type: 'number',
                },
                fiveYears: {
                  type: 'number',
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./server/app.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerApp = express();
const swaggerPort = 3001;

swaggerApp.use(cors());
swaggerApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

swaggerApp.listen(swaggerPort, () => {
  console.log(`Swagger UI running at http://localhost:${swaggerPort}/api-docs`);
});
