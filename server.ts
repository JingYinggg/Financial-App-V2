import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  initialBalanceSheetData,
  initialInvestmentReports,
  initialHoldings,
  initialRealizedTrades,
  initialDividends,
  initialCreditCards,
  initialMonthlyCardSpends,
  initialIncomes,
  initialExpenses,
  initialPassiveAccounts,
  initialAnnualReports,
  initialStockValuations
} from './src/data/defaultData';

dotenv.config();

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'wealth_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Data State Helper
function getInitialData() {
  return {
    balanceSheet: initialBalanceSheetData,
    investmentReports: initialInvestmentReports,
    annualReports: initialAnnualReports,
    stockValuations: initialStockValuations,
    holdings: initialHoldings,
    realizedTrades: initialRealizedTrades,
    dividends: initialDividends,
    creditCards: initialCreditCards,
    monthlyCardSpends: initialMonthlyCardSpends,
    incomes: initialIncomes,
    expenses: initialExpenses,
    passiveAccounts: initialPassiveAccounts,
  };
}

// In-Memory & File Storage
let store = getInitialData();

// Load store from disk if exists
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    store = { ...store, ...parsed };
    if (store.creditCards) {
      store.creditCards = store.creditCards.map((c: any) => {
        if (c.id === 'hsbc_5458' || (c.cardName && (c.cardName.includes('HSBC Live+') || c.cardName.includes('HSBC Advance')))) {
          return { ...c, cardName: 'HSBC (5458)', bank: 'HSBC', accountNo: '5458' };
        }
        if (c.id === 'uob_visa_2052' || (c.cardName && c.cardName.includes('UOB One Visa'))) {
          return { ...c, cardName: 'UOB (2052)', bank: 'UOB', accountNo: '2052' };
        }
        if (c.id === 'uob_master_5565' || (c.cardName && c.cardName.includes('UOB One Master'))) {
          return { ...c, cardName: 'UOB (5565)', bank: 'UOB', accountNo: '5565' };
        }
        if (c.id === 'affin_5760' || (c.cardName && c.cardName.includes('Affin Duo'))) {
          return { ...c, cardName: 'Affin (5760)', bank: 'Affin', accountNo: '5760' };
        }
        if (c.id === 'rhb_shell_8881' || (c.cardName && c.cardName.includes('RHB Shell'))) {
          return { ...c, cardName: 'RHB (8881)', bank: 'RHB', accountNo: '8881' };
        }
        return c;
      });
    }
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  }
} catch (e) {
  console.error('Error loading wealth_store.json, using defaults:', e);
}

function persistStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to persist store:', e);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  const PORT = 3000;

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. GET Full Wealth Data
  app.get('/api/wealth', (_req, res) => {
    res.json({ success: true, data: store });
  });

  // 2. PUT / POST Full Wealth Data Sync
  app.post('/api/wealth', (req, res) => {
    const incoming = req.body;
    store = { ...store, ...incoming };
    persistStore();
    res.json({ success: true, message: 'Data synced successfully', data: store });
  });

  // 3. Balance Sheet API Endpoints
  // 3a. Update a single balance sheet cell
  app.post('/api/wealth/balance-sheet/cell', (req, res) => {
    const { itemId, year, value } = req.body;
    if (!itemId || !year) {
      return res.status(400).json({ error: 'itemId and year are required' });
    }

    const item = store.balanceSheet.items.find(i => i.id === itemId);
    if (!item) {
      return res.status(404).json({ error: 'Balance sheet item not found' });
    }

    item.values[year] = Number(value) || 0;
    persistStore();
    res.json({ success: true, balanceSheet: store.balanceSheet });
  });

  // 3b. Add a new Asset or Liability Category/Field
  app.post('/api/wealth/balance-sheet/category', (req, res) => {
    const { name, type, values } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'name and type (asset|liability) are required' });
    }

    const initialValues: Record<string, number> = {};
    store.balanceSheet.years.forEach(yr => {
      initialValues[yr.toString()] = values && values[yr.toString()] !== undefined ? Number(values[yr.toString()]) : 0;
    });

    const newItem = {
      id: `bs_custom_${Date.now()}`,
      name,
      type: type as 'asset' | 'liability',
      values: initialValues,
    };

    store.balanceSheet.items.push(newItem);
    persistStore();
    res.status(201).json({ success: true, item: newItem, balanceSheet: store.balanceSheet });
  });

  // 3c. Edit Category metadata
  app.patch('/api/wealth/balance-sheet/category/:id', (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;

    const item = store.balanceSheet.items.find(i => i.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (name) item.name = name;
    if (type) item.type = type;
    persistStore();
    res.json({ success: true, item, balanceSheet: store.balanceSheet });
  });

  // 3d. Delete Category field
  app.delete('/api/wealth/balance-sheet/category/:id', (req, res) => {
    const { id } = req.params;
    store.balanceSheet.items = store.balanceSheet.items.filter(i => i.id !== id);
    persistStore();
    res.json({ success: true, balanceSheet: store.balanceSheet });
  });

  // 3e. Add a new Year column
  app.post('/api/wealth/balance-sheet/year', (req, res) => {
    const { year } = req.body;
    const yearNum = Number(year);
    if (!yearNum || isNaN(yearNum)) {
      return res.status(400).json({ error: 'Valid year is required' });
    }

    if (!store.balanceSheet.years.includes(yearNum)) {
      store.balanceSheet.years.push(yearNum);
      store.balanceSheet.years.sort((a, b) => a - b);

      store.balanceSheet.items.forEach(item => {
        if (item.values[yearNum.toString()] === undefined) {
          item.values[yearNum.toString()] = 0;
        }
      });
    }

    persistStore();
    res.json({ success: true, balanceSheet: store.balanceSheet });
  });

  // 3f. Remove a Year column
  app.delete('/api/wealth/balance-sheet/year/:year', (req, res) => {
    const yearNum = Number(req.params.year);
    store.balanceSheet.years = store.balanceSheet.years.filter(y => y !== yearNum);
    store.balanceSheet.items.forEach(item => {
      delete item.values[yearNum.toString()];
    });
    persistStore();
    res.json({ success: true, balanceSheet: store.balanceSheet });
  });

  // 4. Stock Portfolio & Holdings Endpoints
  app.post('/api/wealth/holdings', (req, res) => {
    const holding = req.body;
    if (!holding.stockCode || !holding.units) {
      return res.status(400).json({ error: 'stockCode and units required' });
    }
    const idx = store.holdings.findIndex(h => h.id === holding.id);
    if (idx >= 0) {
      store.holdings[idx] = { ...store.holdings[idx], ...holding };
    } else {
      store.holdings.push({
        id: holding.id || `h_${Date.now()}`,
        ...holding,
      });
    }
    persistStore();
    res.json({ success: true, holdings: store.holdings });
  });

  app.delete('/api/wealth/holdings/:id', (req, res) => {
    const { id } = req.params;
    store.holdings = store.holdings.filter(h => h.id !== id);
    persistStore();
    res.json({ success: true, holdings: store.holdings });
  });

  // 5. Realized Trades Endpoints
  app.post('/api/wealth/realized-trades', (req, res) => {
    const trade = req.body;
    if (!trade.stockCode || !trade.units) {
      return res.status(400).json({ error: 'stockCode and units required' });
    }
    const idx = store.realizedTrades.findIndex(t => t.id === trade.id);
    if (idx >= 0) {
      store.realizedTrades[idx] = { ...store.realizedTrades[idx], ...trade };
    } else {
      store.realizedTrades.push({
        id: trade.id || `rt_${Date.now()}`,
        ...trade,
      });
    }
    persistStore();
    res.json({ success: true, realizedTrades: store.realizedTrades });
  });

  app.delete('/api/wealth/realized-trades/:id', (req, res) => {
    const { id } = req.params;
    store.realizedTrades = store.realizedTrades.filter(t => t.id !== id);
    persistStore();
    res.json({ success: true, realizedTrades: store.realizedTrades });
  });

  // 6. Dividends Endpoints
  app.post('/api/wealth/dividends', (req, res) => {
    const div = req.body;
    const idx = store.dividends.findIndex(d => d.id === div.id);
    if (idx >= 0) {
      store.dividends[idx] = { ...store.dividends[idx], ...div };
    } else {
      store.dividends.push({
        id: div.id || `div_${Date.now()}`,
        ...div,
      });
    }
    persistStore();
    res.json({ success: true, dividends: store.dividends });
  });

  // 7. Credit Cards Endpoints
  app.post('/api/wealth/credit-cards', (req, res) => {
    const card = req.body;
    const idx = store.creditCards.findIndex(c => c.id === card.id);
    if (idx >= 0) {
      store.creditCards[idx] = { ...store.creditCards[idx], ...card };
    } else {
      store.creditCards.push({
        id: card.id || `card_${Date.now()}`,
        ...card,
      });
    }
    persistStore();
    res.json({ success: true, creditCards: store.creditCards });
  });

  app.delete('/api/wealth/credit-cards/:id', (req, res) => {
    store.creditCards = store.creditCards.filter(c => c.id !== req.params.id);
    persistStore();
    res.json({ success: true, creditCards: store.creditCards });
  });

  app.post('/api/wealth/card-spend', (req, res) => {
    const { cardId, year, month, categorySpends } = req.body;
    const idx = store.monthlyCardSpends.findIndex(
      s => s.cardId === cardId && s.year === year && s.month === month
    );
    if (idx >= 0) {
      store.monthlyCardSpends[idx].categorySpends = categorySpends;
    } else {
      store.monthlyCardSpends.push({
        id: `spend_${cardId}_${year}_${month}`,
        cardId,
        year,
        month,
        categorySpends,
      });
    }
    persistStore();
    res.json({ success: true, monthlyCardSpends: store.monthlyCardSpends });
  });

  // 8. Annual Reports / Yield API
  app.post('/api/wealth/annual-report', (req, res) => {
    const entry = req.body;
    if (!entry.year) {
      return res.status(400).json({ error: 'Year is required' });
    }

    const idx = store.annualReports.findIndex(r => r.year === Number(entry.year));
    if (idx >= 0) {
      store.annualReports[idx] = { ...store.annualReports[idx], ...entry };
    } else {
      store.annualReports.push(entry);
      store.annualReports.sort((a, b) => a.year - b.year);
    }
    persistStore();
    res.json({ success: true, annualReports: store.annualReports });
  });

  // 9. Investment Yearly Reports API
  app.post('/api/wealth/investment-report', (req, res) => {
    const entry = req.body;
    if (!entry.year) {
      return res.status(400).json({ error: 'Year is required' });
    }

    const idx = store.investmentReports.findIndex(r => r.year === Number(entry.year));
    if (idx >= 0) {
      store.investmentReports[idx] = { ...store.investmentReports[idx], ...entry };
    } else {
      store.investmentReports.push(entry);
      store.investmentReports.sort((a, b) => a.year - b.year);
    }
    persistStore();
    res.json({ success: true, investmentReports: store.investmentReports });
  });

  // 10. Reset Database to Defaults
  app.post('/api/wealth/reset', (_req, res) => {
    store = getInitialData();
    persistStore();
    res.json({ success: true, message: 'All records reset to initial Excel files', data: store });
  });

  // AI Advisor Endpoint using Gemini 2.5 Flash
  app.post('/api/ai-advisor', async (req, res) => {
    try {
      const { prompt, contextData } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error: 'Gemini API key is missing or not configured. Please set GEMINI_API_KEY in environment secrets.'
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are JY Peggy's Personal Wealth & Financial Advisor AI.
You have access to the user's complete financial studio data including:
1. Personal Balance Sheet (Assets: ASNB, EPF, PRS, Versa, Share Investment, High Interest Portfolio; Liabilities: CC debt, Student Loan, Mortgage; Net Worth & Debt Ratio across 2023-2026+)
2. Annual Yield & Passive Income Generator Growth (Principal, Passive, Yield %, YoY growth rates)
3. Investment Yearly Reports (Capital & Annual P/L %)
4. Stock Holdings & Realized Trades (MY Market and US / Global Oversea Markets with DCA average-up purchase lot calculations)
5. Dividend breakdown & yield metrics
6. Credit Card Cashback optimization (Eligible merchant lists, MCC codes, monthly caps, multi-year history)
7. Multi-Year Cashflow Budget Planner (2023-2026+)

Analyze the provided financial context and answer the user's prompt with precision, clear recommendations, structured markdown tables or bullet points, and actionable tips. Be encouraging, professional, and practical.`;

      const contentPrompt = `Current Portfolio & Wealth Context:\n\`\`\`json\n${JSON.stringify(contextData || store, null, 2)}\n\`\`\`\n\nUser Question / Instructions: ${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contentPrompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      res.json({ result: response.text });
    } catch (err: any) {
      console.error('AI Advisor error:', err);
      res.status(500).json({ error: err.message || 'Error processing AI request' });
    }
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
