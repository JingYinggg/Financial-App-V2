import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  StockHolding,
  RealizedTrade,
  DividendRecord,
  CreditCard,
  CreditCardCategory,
  MonthlyCardSpend,
  CashflowIncomeItem,
  CashflowExpenseItem,
  PassiveIncomeAccount,
  AnnualReportEntry,
  BalanceSheetData,
  BalanceSheetItem,
  InvestmentReportEntry,
  AnnualStockValuation
} from '../types';
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
} from '../data/defaultData';

interface WealthContextType {
  // Balance Sheet
  balanceSheet: BalanceSheetData;
  updateBalanceSheetCell: (itemId: string, year: string, value: number) => Promise<void>;
  addBalanceSheetCategory: (name: string, type: 'asset' | 'liability', values?: { [year: string]: number }) => Promise<void>;
  updateBalanceSheetCategory: (id: string, name: string, type: 'asset' | 'liability') => Promise<void>;
  deleteBalanceSheetCategory: (id: string) => Promise<void>;
  addBalanceSheetYear: (year: number) => Promise<void>;
  deleteBalanceSheetYear: (year: number) => Promise<void>;
  cloneBalanceSheetYear: (sourceYear: number, targetYear: number) => Promise<void>;
  syncBalanceSheetFromTabs: (targetYear?: number) => Promise<void>;

  // Investment Yearly Reports
  investmentReports: InvestmentReportEntry[];
  updateInvestmentReport: (year: number, updated: Partial<InvestmentReportEntry>) => Promise<void>;
  addInvestmentReport: (entry: InvestmentReportEntry) => Promise<void>;

  // Annual Reports (Yield & Capital)
  annualReports: AnnualReportEntry[];
  updateAnnualReport: (year: number, updated: Partial<AnnualReportEntry>) => Promise<void>;
  addAnnualReport: (entry: AnnualReportEntry) => Promise<void>;

  // Annual Stock Valuations (Initial vs End of Year Value)
  stockValuations: AnnualStockValuation[];
  addStockValuation: (val: Omit<AnnualStockValuation, 'id'>) => void;
  updateStockValuation: (id: string, updated: Partial<AnnualStockValuation>) => void;
  deleteStockValuation: (id: string) => void;

  // Holdings & Trades
  holdings: StockHolding[];
  addHolding: (holding: Omit<StockHolding, 'id'>) => void;
  updateHolding: (id: string, updated: Partial<StockHolding>) => void;
  deleteHolding: (id: string) => void;
  sellHolding: (params: {
    holdingId?: string;
    code: string;
    name: string;
    unitsToSell: number;
    sellUnitPrice: number;
    buyUnitPrice: number;
    buyDate?: string;
    sellDate: string;
    currency: 'MYR' | 'USD';
    market: 'MY' | 'US' | 'Crypto' | 'Platform';
    fees?: number;
    notes?: string;
  }) => void;

  realizedTrades: RealizedTrade[];
  addTrade: (trade: Omit<RealizedTrade, 'id'>) => void;
  deleteTrade: (id: string) => void;

  // Dividends
  dividends: DividendRecord[];
  addDividendRecord: (record: Omit<DividendRecord, 'id'>) => void;
  updateDividendPayout: (id: string, monthKey: string, amount: number) => void;
  deleteDividendRecord: (id: string) => void;

  // Cards
  creditCards: CreditCard[];
  addCreditCard: (card: Omit<CreditCard, 'id'>) => void;
  updateCreditCard: (cardId: string, updated: Partial<CreditCard>) => void;
  deleteCreditCard: (cardId: string) => void;
  addCreditCardCategory: (cardId: string, category: Omit<CreditCardCategory, 'id'>) => void;
  deleteCreditCardCategory: (cardId: string, categoryId: string) => void;
  updateCreditCardCategory: (cardId: string, categoryId: string, updated: Partial<CreditCardCategory>) => void;
  overrideCardRulesForMonth: (cardId: string, year: number, month: string, newCategories: CreditCardCategory[]) => void;
  monthlyCardSpends: MonthlyCardSpend[];
  saveCardSpend: (
    cardId: string,
    year: number,
    month: string,
    spends: { [catId: string]: number },
    formulas?: { [catId: string]: string },
    actualCashback?: { [catId: string]: number },
    finalTotalCashback?: number
  ) => void;

  // Cashflow
  incomes: CashflowIncomeItem[];
  expenses: CashflowExpenseItem[];
  setIncomesList: (newIncomes: CashflowIncomeItem[]) => void;
  setExpensesList: (newExpenses: CashflowExpenseItem[]) => void;
  updateIncome: (id: string, monthKey: string, amount: number) => void;
  updateExpense: (id: string, monthKey: string, amount: number) => void;
  updateIncomeForYear: (id: string, year: number, monthKey: string, amount: number) => void;
  updateExpenseForYear: (id: string, year: number, monthKey: string, amount: number) => void;
  copyCashflowYear: (sourceYear: number, targetYear: number) => void;
  addIncomeCategory: (category: string) => void;
  updateIncomeCategoryName: (id: string, category: string) => void;
  moveIncome: (id: string, direction: 'up' | 'down') => void;
  deleteIncomeCategory: (id: string) => void;
  addExpenseCategory: (name: string) => void;
  updateExpenseCategoryName: (id: string, name: string) => void;
  moveExpense: (id: string, direction: 'up' | 'down') => void;
  deleteExpenseCategory: (id: string) => void;

  // Passive Accounts & FIRE Goal
  passiveAccounts: PassiveIncomeAccount[];
  setPassiveAccountsList: (accounts: PassiveIncomeAccount[]) => void;
  addPassiveAccount: (account: Omit<PassiveIncomeAccount, 'id'>) => void;
  updatePassiveAccount: (id: string, updated: Partial<PassiveIncomeAccount>) => void;
  updatePassiveAccountMonthData: (
    id: string,
    year: number,
    monthKey: string,
    field: 'principal' | 'rate' | 'returns',
    value: number
  ) => void;
  movePassiveAccount: (id: string, direction: 'up' | 'down') => void;
  deletePassiveAccount: (id: string) => void;
  fireTargetMonthly: number;
  setFireTargetMonthly: (val: number) => void;

  // Sync & Status
  backendStatus: 'synced' | 'syncing' | 'offline';
  lastSyncedAt: Date | null;
  resetToDefault: () => Promise<void>;
  exportBackupJSON: () => string;
  importBackupJSON: (jsonStr: string) => Promise<boolean>;
}

const WealthContext = createContext<WealthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'jy_peggy_wealth_manager_data_v2';

const sanitizeCreditCards = (cards: CreditCard[]): CreditCard[] => {
  return cards.map(c => {
    if (c.id === 'hsbc_5458' || c.cardName.includes('HSBC Live+') || c.cardName.includes('HSBC Advance')) {
      return { ...c, cardName: 'HSBC (5458)', bank: 'HSBC', accountNo: '5458' };
    }
    if (c.id === 'uob_visa_2052' || c.cardName.includes('UOB One Visa')) {
      return { ...c, cardName: 'UOB (2052)', bank: 'UOB', accountNo: '2052' };
    }
    if (c.id === 'uob_master_5565' || c.cardName.includes('UOB One Master')) {
      return { ...c, cardName: 'UOB (5565)', bank: 'UOB', accountNo: '5565' };
    }
    if (c.id === 'affin_5760' || c.cardName.includes('Affin Duo')) {
      return { ...c, cardName: 'Affin (5760)', bank: 'Affin', accountNo: '5760' };
    }
    if (c.id === 'rhb_shell_8881' || c.cardName.includes('RHB Shell')) {
      return { ...c, cardName: 'RHB (8881)', bank: 'RHB', accountNo: '8881' };
    }
    return c;
  });
};

export const WealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_balancesheet`);
    return saved ? JSON.parse(saved) : initialBalanceSheetData;
  });

  const [investmentReports, setInvestmentReports] = useState<InvestmentReportEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_investments`);
    return saved ? JSON.parse(saved) : initialInvestmentReports;
  });

  const [holdings, setHoldings] = useState<StockHolding[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_holdings`);
    return saved ? JSON.parse(saved) : initialHoldings;
  });

  const [realizedTrades, setRealizedTrades] = useState<RealizedTrade[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_trades`);
    return saved ? JSON.parse(saved) : initialRealizedTrades;
  });

  const [dividends, setDividends] = useState<DividendRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_dividends`);
    return saved ? JSON.parse(saved) : initialDividends;
  });

  const [creditCards, setCreditCards] = useState<CreditCard[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cards`);
    if (saved) {
      try {
        const parsed: CreditCard[] = JSON.parse(saved);
        return sanitizeCreditCards(parsed);
      } catch (e) {
        console.error('Failed to parse saved credit cards', e);
      }
    }
    return sanitizeCreditCards(initialCreditCards);
  });

  const [monthlyCardSpends, setMonthlyCardSpends] = useState<MonthlyCardSpend[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_spends`);
    return saved ? JSON.parse(saved) : initialMonthlyCardSpends;
  });

  const [incomes, setIncomes] = useState<CashflowIncomeItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_incomes`);
    return saved ? JSON.parse(saved) : initialIncomes;
  });

  const [expenses, setExpenses] = useState<CashflowExpenseItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [passiveAccounts, setPassiveAccounts] = useState<PassiveIncomeAccount[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_passive`);
    return saved ? JSON.parse(saved) : initialPassiveAccounts;
  });

  const [annualReports, setAnnualReports] = useState<AnnualReportEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_annual`);
    return saved ? JSON.parse(saved) : initialAnnualReports;
  });

  const [stockValuations, setStockValuations] = useState<AnnualStockValuation[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_stock_valuations`);
    return saved ? JSON.parse(saved) : initialStockValuations;
  });

  const [fireTargetMonthly, setFireTargetMonthlyState] = useState<number>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_fire_target`);
    return saved ? JSON.parse(saved) : 2000;
  });

  const setFireTargetMonthly = (val: number) => {
    setFireTargetMonthlyState(val);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_fire_target`, JSON.stringify(val));
  };

  const [backendStatus, setBackendStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());

  // Fetch initial data from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchBackendData = async () => {
      try {
        setBackendStatus('syncing');
        const res = await fetch('/api/wealth');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            if (json.data.balanceSheet) setBalanceSheet(json.data.balanceSheet);
            if (json.data.investmentReports) setInvestmentReports(json.data.investmentReports);
            if (json.data.annualReports) setAnnualReports(json.data.annualReports);
            if (json.data.stockValuations) setStockValuations(json.data.stockValuations);
            if (json.data.holdings) setHoldings(json.data.holdings);
            if (json.data.realizedTrades) setRealizedTrades(json.data.realizedTrades);
            if (json.data.dividends) setDividends(json.data.dividends);
            if (json.data.creditCards) setCreditCards(sanitizeCreditCards(json.data.creditCards));
            if (json.data.monthlyCardSpends) setMonthlyCardSpends(json.data.monthlyCardSpends);
            if (json.data.incomes) setIncomes(json.data.incomes);
            if (json.data.expenses) setExpenses(json.data.expenses);
            if (json.data.passiveAccounts) setPassiveAccounts(json.data.passiveAccounts);
            setBackendStatus('synced');
            setLastSyncedAt(new Date());
          }
        }
      } catch (err) {
        console.warn('Backend fetch error, continuing with local store:', err);
        if (isMounted) setBackendStatus('offline');
      }
    };
    fetchBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_balancesheet`, JSON.stringify(balanceSheet));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_investments`, JSON.stringify(investmentReports));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_holdings`, JSON.stringify(holdings));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_trades`, JSON.stringify(realizedTrades));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_dividends`, JSON.stringify(dividends));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cards`, JSON.stringify(creditCards));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_spends`, JSON.stringify(monthlyCardSpends));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_incomes`, JSON.stringify(incomes));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_passive`, JSON.stringify(passiveAccounts));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_annual`, JSON.stringify(annualReports));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_stock_valuations`, JSON.stringify(stockValuations));
  }, [balanceSheet, investmentReports, holdings, realizedTrades, dividends, creditCards, monthlyCardSpends, incomes, expenses, passiveAccounts, annualReports, stockValuations]);

  // Helper to sync changes to backend
  const syncToBackend = useCallback(async (payload: any) => {
    try {
      setBackendStatus('syncing');
      const res = await fetch('/api/wealth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setBackendStatus('synced');
        setLastSyncedAt(new Date());
      } else {
        setBackendStatus('offline');
      }
    } catch (e) {
      console.warn('Backend sync failed:', e);
      setBackendStatus('offline');
    }
  }, []);

  // Balance Sheet Handlers
  const updateBalanceSheetCell = async (itemId: string, year: string, value: number) => {
    const updatedItems = balanceSheet.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          values: {
            ...item.values,
            [year]: Number(value) || 0,
          },
        };
      }
      return item;
    });

    const newBS = { ...balanceSheet, items: updatedItems };
    setBalanceSheet(newBS);

    // Call backend endpoint
    try {
      await fetch('/api/wealth/balance-sheet/cell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, year, value }),
      });
      setLastSyncedAt(new Date());
    } catch {
      syncToBackend({ balanceSheet: newBS });
    }
  };

  const addBalanceSheetCategory = async (name: string, type: 'asset' | 'liability', values?: { [year: string]: number }) => {
    const initialVals: Record<string, number> = {};
    balanceSheet.years.forEach(yr => {
      initialVals[yr.toString()] = values && values[yr.toString()] !== undefined ? values[yr.toString()] : 0;
    });

    const newItem: BalanceSheetItem = {
      id: `bs_${Date.now()}`,
      name,
      type,
      values: initialVals,
    };

    const newBS = { ...balanceSheet, items: [...balanceSheet.items, newItem] };
    setBalanceSheet(newBS);

    try {
      await fetch('/api/wealth/balance-sheet/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, values }),
      });
      setLastSyncedAt(new Date());
    } catch {
      syncToBackend({ balanceSheet: newBS });
    }
  };

  const updateBalanceSheetCategory = async (id: string, name: string, type: 'asset' | 'liability') => {
    const newBS = {
      ...balanceSheet,
      items: balanceSheet.items.map(i => (i.id === id ? { ...i, name, type } : i)),
    };
    setBalanceSheet(newBS);

    try {
      await fetch(`/api/wealth/balance-sheet/category/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });
      setLastSyncedAt(new Date());
    } catch {
      syncToBackend({ balanceSheet: newBS });
    }
  };

  const deleteBalanceSheetCategory = async (id: string) => {
    const newBS = {
      ...balanceSheet,
      items: balanceSheet.items.filter(i => i.id !== id),
    };
    setBalanceSheet(newBS);

    try {
      await fetch(`/api/wealth/balance-sheet/category/${id}`, {
        method: 'DELETE',
      });
      setLastSyncedAt(new Date());
    } catch {
      syncToBackend({ balanceSheet: newBS });
    }
  };

  const addBalanceSheetYear = async (year: number) => {
    if (balanceSheet.years.includes(year)) return;
    const sortedYears = [...balanceSheet.years, year].sort((a, b) => a - b);
    const updatedItems = balanceSheet.items.map(item => ({
      ...item,
      values: {
        ...item.values,
        [year.toString()]: item.values[year.toString()] || 0,
      },
    }));

    const newBS = { years: sortedYears, items: updatedItems };
    setBalanceSheet(newBS);

    try {
      await fetch('/api/wealth/balance-sheet/year', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year }),
      });
      setLastSyncedAt(new Date());
    } catch {
      syncToBackend({ balanceSheet: newBS });
    }
  };

  const deleteBalanceSheetYear = async (year: number) => {
    const updatedYears = balanceSheet.years.filter(y => y !== year);
    const updatedItems = balanceSheet.items.map(item => {
      const copyVals = { ...item.values };
      delete copyVals[year.toString()];
      return { ...item, values: copyVals };
    });

    const newBS = { years: updatedYears, items: updatedItems };
    setBalanceSheet(newBS);

    try {
      await fetch(`/api/wealth/balance-sheet/year/${year}`, {
        method: 'DELETE',
      });
      setLastSyncedAt(new Date());
    } catch {
      syncToBackend({ balanceSheet: newBS });
    }
  };

  const cloneBalanceSheetYear = async (sourceYear: number, targetYear: number) => {
    const sYr = sourceYear.toString();
    const tYr = targetYear.toString();

    let nextYears = balanceSheet.years;
    if (!nextYears.includes(targetYear)) {
      nextYears = [...nextYears, targetYear].sort((a, b) => a - b);
    }

    const updatedItems = balanceSheet.items.map(item => {
      const sourceVal = item.values[sYr] !== undefined ? item.values[sYr] : 0;
      return {
        ...item,
        values: {
          ...item.values,
          [tYr]: sourceVal,
        },
      };
    });

    const newBS = { years: nextYears, items: updatedItems };
    setBalanceSheet(newBS);
    syncToBackend({ balanceSheet: newBS });
  };

  const syncBalanceSheetFromTabs = async (targetYear?: number) => {
    const yearsToSync = targetYear ? [targetYear] : balanceSheet.years;
    let updatedItems = [...balanceSheet.items];

    yearsToSync.forEach(yr => {
      const yrKey = yr.toString();

      // 1. Calculate MY Stock Value (Stock (Bursa))
      const myValuations = stockValuations.filter(v => v.year === yr && v.market === 'MY');
      let myStockTotal = 0;
      if (myValuations.length > 0) {
        myStockTotal = myValuations.reduce((sum, v) => sum + (v.endOfYearValue || v.startOfYearValue || 0), 0);
      } else if (yr === 2026 || yr === Math.max(...balanceSheet.years)) {
        myStockTotal = holdings.filter(h => h.market === 'MY').reduce((sum, h) => sum + h.units * (h.currentPrice || h.buyUnitPrice), 0);
      }

      // 2. Calculate US Stock Value (Stock (US))
      const usValuations = stockValuations.filter(v => v.year === yr && v.market === 'US');
      let usStockTotal = 0;
      if (usValuations.length > 0) {
        usStockTotal = usValuations.reduce((sum, v) => sum + (v.endOfYearValue || v.startOfYearValue || 0), 0);
      } else if (yr === 2026 || yr === Math.max(...balanceSheet.years)) {
        usStockTotal = holdings.filter(h => h.market === 'US').reduce((sum, h) => sum + h.units * (h.currentPrice || h.buyUnitPrice), 0);
      }

      // 3. Crypto Value
      const cryptoValuations = stockValuations.filter(v => v.year === yr && v.market === 'Crypto');
      let cryptoTotal = 0;
      if (cryptoValuations.length > 0) {
        cryptoTotal = cryptoValuations.reduce((sum, v) => sum + (v.endOfYearValue || v.startOfYearValue || 0), 0);
      } else if (yr === 2026 || yr === Math.max(...balanceSheet.years)) {
        cryptoTotal = holdings.filter(h => h.market === 'Crypto').reduce((sum, h) => sum + h.units * (h.currentPrice || h.buyUnitPrice), 0);
      }

      // 4. ASM / ASNB / MMF from Passive Accounts
      const asmTotal = passiveAccounts
        .filter(p => p.name.toUpperCase().includes('ASM') || p.category === 'ASNB')
        .reduce((sum, p) => sum + p.principalAmount, 0);

      // Apply to matching items if they exist
      const totalShareInvestment = myStockTotal + (usStockTotal * 4.45) + cryptoTotal;

      updatedItems = updatedItems.map(item => {
        const lowerName = item.name.toLowerCase();
        let newVal = item.values[yrKey];

        if (item.id === 'bs_share' || lowerName.includes('share investment') || lowerName.includes('share') || lowerName.includes('stock portfolio')) {
          if (totalShareInvestment > 0) newVal = totalShareInvestment;
        } else if (lowerName.includes('bursa') || (lowerName.includes('stock') && !lowerName.includes('us'))) {
          if (myStockTotal > 0) newVal = myStockTotal;
        } else if (lowerName.includes('us') || lowerName.includes('overseas')) {
          if (usStockTotal > 0) newVal = usStockTotal * 4.45;
        } else if (lowerName.includes('crypto') || lowerName.includes('luno')) {
          if (cryptoTotal > 0) newVal = cryptoTotal;
        } else if (lowerName.includes('asm') && !lowerName.includes('2')) {
          if (asmTotal > 0) newVal = asmTotal;
        }

        return {
          ...item,
          values: {
            ...item.values,
            [yrKey]: newVal !== undefined ? newVal : (item.values[yrKey] || 0)
          }
        };
      });

      // Also Sync Annual Yield report passive income (dividends + passive accounts)
      const yrDividends = dividends.filter(d => d.year === yr);
      const totalYrDividend = yrDividends.reduce((sum, d) => {
        return sum + (Object.values(d.monthlyPayouts) as number[]).reduce((a, b) => a + b, 0);
      }, 0);

      const passiveInterest = passiveAccounts.reduce((sum, p) => {
        const pSum = (Object.values(p.monthlyReturns) as number[]).reduce((a, b) => a + b, 0);
        return sum + (pSum > 0 ? pSum : (p.principalAmount * p.annualInterestRate) / 100);
      }, 0);

      const totalPassiveIncome = totalYrDividend + passiveInterest;

      setAnnualReports(prev => {
        const exist = prev.find(a => a.year === yr);
        if (exist) {
          return prev.map(a => a.year === yr ? { ...a, passiveIncome: totalPassiveIncome > 0 ? totalPassiveIncome : a.passiveIncome } : a);
        }
        return prev;
      });
    });

    const newBS = { ...balanceSheet, items: updatedItems };
    setBalanceSheet(newBS);
    syncToBackend({ balanceSheet: newBS });
  };

  // Investment Yearly Reports Handlers
  const updateInvestmentReport = async (year: number, updated: Partial<InvestmentReportEntry>) => {
    const nextReports = investmentReports.map(r => (r.year === year ? { ...r, ...updated } : r));
    setInvestmentReports(nextReports);
    syncToBackend({ investmentReports: nextReports });
  };

  const addInvestmentReport = async (entry: InvestmentReportEntry) => {
    const filtered = investmentReports.filter(r => r.year !== entry.year);
    const nextReports = [...filtered, entry].sort((a, b) => a.year - b.year);
    setInvestmentReports(nextReports);
    syncToBackend({ investmentReports: nextReports });
  };

  // Annual Reports Handlers
  const updateAnnualReport = async (year: number, updated: Partial<AnnualReportEntry>) => {
    const nextReports = annualReports.map(r => (r.year === year ? { ...r, ...updated } : r));
    setAnnualReports(nextReports);
    syncToBackend({ annualReports: nextReports });
  };

  const addAnnualReport = async (entry: AnnualReportEntry) => {
    const filtered = annualReports.filter(r => r.year !== entry.year);
    const nextReports = [...filtered, entry].sort((a, b) => a.year - b.year);
    setAnnualReports(nextReports);
    syncToBackend({ annualReports: nextReports });
  };

  // Holdings Handlers
  const addHolding = (item: Omit<StockHolding, 'id'>) => {
    const newItem: StockHolding = { ...item, id: `h_${Date.now()}` };
    const next = [...holdings, newItem];
    setHoldings(next);
    syncToBackend({ holdings: next });
  };

  const updateHolding = (id: string, updated: Partial<StockHolding>) => {
    const next = holdings.map(h => (h.id === id ? { ...h, ...updated } : h));
    setHoldings(next);
    syncToBackend({ holdings: next });
  };

  const deleteHolding = (id: string) => {
    const next = holdings.filter(h => h.id !== id);
    setHoldings(next);
    syncToBackend({ holdings: next });
  };

  // Realized Trades Handlers
  const addTrade = (trade: Omit<RealizedTrade, 'id'>) => {
    const newTrade: RealizedTrade = { ...trade, id: `t_${Date.now()}` };
    const next = [newTrade, ...realizedTrades];
    setRealizedTrades(next);
    syncToBackend({ realizedTrades: next });
  };

  const deleteTrade = (id: string) => {
    const next = realizedTrades.filter(t => t.id !== id);
    setRealizedTrades(next);
    syncToBackend({ realizedTrades: next });
  };

  // SELL Holding and auto-flow to Realized Trades
  const sellHolding = (params: {
    holdingId?: string;
    code: string;
    name: string;
    unitsToSell: number;
    sellUnitPrice: number;
    buyUnitPrice: number;
    buyDate?: string;
    sellDate: string;
    currency: 'MYR' | 'USD';
    market: 'MY' | 'US' | 'Crypto' | 'Platform';
    fees?: number;
    notes?: string;
  }) => {
    const grossSell = params.unitsToSell * params.sellUnitPrice;
    const grossCost = params.unitsToSell * params.buyUnitPrice;
    const netGain = grossSell - grossCost - (params.fees || 0);
    const symbol = params.currency === 'USD' ? '$' : 'RM ';

    const newTrade: RealizedTrade = {
      id: `t_${Date.now()}`,
      code: params.code,
      name: params.name,
      buyDate: params.buyDate || 'Multiple Purchases',
      sellDate: params.sellDate,
      units: params.unitsToSell,
      buyUnitPrice: params.buyUnitPrice,
      sellUnitPrice: params.sellUnitPrice,
      currency: params.currency,
      market: params.market,
      fees: params.fees || 0,
      notes: params.notes || `${netGain >= 0 ? 'Gain' : 'Loss'} ${symbol}${Math.abs(netGain).toFixed(2)} (${params.unitsToSell} units @ ${symbol}${params.sellUnitPrice.toFixed(2)}${params.fees ? `, Fees ${symbol}${params.fees.toFixed(2)}` : ''})`,
    };

    // Update holdings by deducting sold units
    let nextHoldings: StockHolding[] = [];
    if (params.holdingId) {
      nextHoldings = holdings
        .map(h => {
          if (h.id === params.holdingId) {
            const remUnits = h.units - params.unitsToSell;
            return remUnits > 0 ? { ...h, units: remUnits } : null;
          }
          return h;
        })
        .filter((h): h is StockHolding => h !== null);
    } else {
      // Deduct units FIFO across all holdings with matching code
      let unitsLeftToDeduct = params.unitsToSell;
      nextHoldings = holdings
        .map(h => {
          if (h.code.toUpperCase() === params.code.toUpperCase() && unitsLeftToDeduct > 0) {
            if (h.units <= unitsLeftToDeduct) {
              unitsLeftToDeduct -= h.units;
              return null; // completely sold
            } else {
              const rem = h.units - unitsLeftToDeduct;
              unitsLeftToDeduct = 0;
              return { ...h, units: rem };
            }
          }
          return h;
        })
        .filter((h): h is StockHolding => h !== null);
    }

    const nextTrades = [newTrade, ...realizedTrades];
    setHoldings(nextHoldings);
    setRealizedTrades(nextTrades);
    syncToBackend({ holdings: nextHoldings, realizedTrades: nextTrades });
  };

  // Annual Stock Valuation Handlers
  const addStockValuation = (val: Omit<AnnualStockValuation, 'id'>) => {
    const newVal: AnnualStockValuation = { ...val, id: `val_${Date.now()}` };
    const next = [...stockValuations, newVal];
    setStockValuations(next);
    syncToBackend({ stockValuations: next });
  };

  const updateStockValuation = (id: string, updated: Partial<AnnualStockValuation>) => {
    const next = stockValuations.map(v => (v.id === id ? { ...v, ...updated } : v));
    setStockValuations(next);
    syncToBackend({ stockValuations: next });
  };

  const deleteStockValuation = (id: string) => {
    const next = stockValuations.filter(v => v.id !== id);
    setStockValuations(next);
    syncToBackend({ stockValuations: next });
  };

  // Dividend Handlers
  const addDividendRecord = (record: Omit<DividendRecord, 'id'>) => {
    const newRecord: DividendRecord = { ...record, id: `d_${Date.now()}` };
    const next = [...dividends, newRecord];
    setDividends(next);
    syncToBackend({ dividends: next });
  };

  const updateDividendPayout = (id: string, monthKey: string, amount: number) => {
    const next = dividends.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          monthlyPayouts: {
            ...rec.monthlyPayouts,
            [monthKey]: amount,
          },
        };
      }
      return rec;
    });
    setDividends(next);
    syncToBackend({ dividends: next });
  };

  const deleteDividendRecord = (id: string) => {
    const next = dividends.filter(d => d.id !== id);
    setDividends(next);
    syncToBackend({ dividends: next });
  };

  // Credit Card Handlers
  const addCreditCard = (card: Omit<CreditCard, 'id'>) => {
    const newCard: CreditCard = { ...card, id: `card_${Date.now()}` };
    const next = [...creditCards, newCard];
    setCreditCards(next);
    syncToBackend({ creditCards: next });
  };

  const updateCreditCard = (cardId: string, updated: Partial<CreditCard>) => {
    const next = creditCards.map(c => (c.id === cardId ? { ...c, ...updated } : c));
    setCreditCards(next);
    syncToBackend({ creditCards: next });
  };

  const deleteCreditCard = (cardId: string) => {
    const next = creditCards.filter(c => c.id !== cardId);
    setCreditCards(next);
    syncToBackend({ creditCards: next });
  };

  const addCreditCardCategory = (cardId: string, category: Omit<CreditCardCategory, 'id'>) => {
    const newCat: CreditCardCategory = {
      ...category,
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const next = creditCards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          categories: [...card.categories, newCat],
        };
      }
      return card;
    });
    setCreditCards(next);
    syncToBackend({ creditCards: next });
  };

  const deleteCreditCardCategory = (cardId: string, categoryId: string) => {
    const next = creditCards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          categories: card.categories.filter(c => c.id !== categoryId),
        };
      }
      return card;
    });
    setCreditCards(next);
    syncToBackend({ creditCards: next });
  };

  const updateCreditCardCategory = (cardId: string, categoryId: string, updated: Partial<CreditCardCategory>) => {
    const next = creditCards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          categories: card.categories.map(cat => (cat.id === categoryId ? { ...cat, ...updated } : cat)),
        };
      }
      return card;
    });
    setCreditCards(next);
    syncToBackend({ creditCards: next });
  };

  const overrideCardRulesForMonth = (
    cardId: string,
    year: number,
    month: string,
    newCategories: CreditCardCategory[]
  ) => {
    const key = `${year}-${month}`;
    const next = creditCards.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          monthRuleOverrides: {
            ...(c.monthRuleOverrides || {}),
            [key]: newCategories,
          },
        };
      }
      return c;
    });
    setCreditCards(next);
    syncToBackend({ creditCards: next });
  };

  const saveCardSpend = (
    cardId: string,
    year: number,
    month: string,
    spends: { [catId: string]: number },
    formulas?: { [catId: string]: string },
    actualCashback?: { [catId: string]: number },
    finalTotalCashback?: number
  ) => {
    setMonthlyCardSpends(prev => {
      const existingIdx = prev.findIndex(s => s.cardId === cardId && s.year === year && s.month === month);
      let next: MonthlyCardSpend[];
      if (existingIdx >= 0) {
        next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          categorySpends: spends,
          spendFormulas: formulas !== undefined ? formulas : next[existingIdx].spendFormulas,
          actualCashback: actualCashback !== undefined ? actualCashback : next[existingIdx].actualCashback,
          finalTotalCashback: finalTotalCashback !== undefined ? finalTotalCashback : next[existingIdx].finalTotalCashback,
        };
      } else {
        next = [
          ...prev,
          {
            id: `spend_${Date.now()}`,
            year,
            month,
            cardId,
            categorySpends: spends,
            spendFormulas: formulas || {},
            actualCashback: actualCashback || {},
            finalTotalCashback,
          },
        ];
      }
      syncToBackend({ monthlyCardSpends: next });
      return next;
    });
  };

  // Cashflow Handlers
  const updateIncome = (id: string, monthKey: string, amount: number) => {
    const next = incomes.map(inc => (inc.id === id ? { ...inc, monthlyAmount: { ...inc.monthlyAmount, [monthKey]: amount } } : inc));
    setIncomes(next);
    syncToBackend({ incomes: next });
  };

  const updateExpense = (id: string, monthKey: string, amount: number) => {
    const next = expenses.map(exp => (exp.id === id ? { ...exp, monthlyAmount: { ...exp.monthlyAmount, [monthKey]: amount } } : exp));
    setExpenses(next);
    syncToBackend({ expenses: next });
  };

  const updateIncomeForYear = (id: string, year: number, monthKey: string, amount: number) => {
    const next = incomes.map(inc => {
      if (inc.id === id) {
        const yrKey = year.toString();
        const existingYr = inc.yearlyAmount?.[yrKey] || { ...inc.monthlyAmount };
        const updatedYr = { ...existingYr, [monthKey]: amount };
        return {
          ...inc,
          yearlyAmount: {
            ...(inc.yearlyAmount || {}),
            [yrKey]: updatedYr,
          },
          // Keep default monthlyAmount in sync if 2026/active
          monthlyAmount: year === 2026 ? updatedYr : inc.monthlyAmount,
        };
      }
      return inc;
    });
    setIncomes(next);
    syncToBackend({ incomes: next });
  };

  const updateExpenseForYear = (id: string, year: number, monthKey: string, amount: number) => {
    const next = expenses.map(exp => {
      if (exp.id === id) {
        const yrKey = year.toString();
        const existingYr = exp.yearlyAmount?.[yrKey] || { ...exp.monthlyAmount };
        const updatedYr = { ...existingYr, [monthKey]: amount };
        return {
          ...exp,
          yearlyAmount: {
            ...(exp.yearlyAmount || {}),
            [yrKey]: updatedYr,
          },
          monthlyAmount: year === 2026 ? updatedYr : exp.monthlyAmount,
        };
      }
      return exp;
    });
    setExpenses(next);
    syncToBackend({ expenses: next });
  };

  const copyCashflowYear = (sourceYear: number, targetYear: number) => {
    const sYr = sourceYear.toString();
    const tYr = targetYear.toString();

    const nextIncomes = incomes.map(inc => {
      const sourceVals = inc.yearlyAmount?.[sYr] || { ...inc.monthlyAmount };
      return {
        ...inc,
        yearlyAmount: {
          ...(inc.yearlyAmount || {}),
          [tYr]: { ...sourceVals },
        },
      };
    });

    const nextExpenses = expenses.map(exp => {
      const sourceVals = exp.yearlyAmount?.[sYr] || { ...exp.monthlyAmount };
      return {
        ...exp,
        yearlyAmount: {
          ...(exp.yearlyAmount || {}),
          [tYr]: { ...sourceVals },
        },
      };
    });

    setIncomes(nextIncomes);
    setExpenses(nextExpenses);
    syncToBackend({ incomes: nextIncomes, expenses: nextExpenses });
  };

  const addIncomeCategory = (category: string) => {
    const newItem: CashflowIncomeItem = {
      id: `inc_${Date.now()}`,
      category,
      monthlyAmount: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 },
    };
    const next = [...incomes, newItem];
    setIncomes(next);
    syncToBackend({ incomes: next });
  };

  const updateIncomeCategoryName = (id: string, category: string) => {
    const next = incomes.map(i => (i.id === id ? { ...i, category } : i));
    setIncomes(next);
    syncToBackend({ incomes: next });
  };

  const moveIncome = (id: string, direction: 'up' | 'down') => {
    const index = incomes.findIndex(i => i.id === id);
    if (index < 0) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === incomes.length - 1) return;

    const next = [...incomes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [removed] = next.splice(index, 1);
    next.splice(targetIndex, 0, removed);
    setIncomes(next);
    syncToBackend({ incomes: next });
  };

  const deleteIncomeCategory = (id: string) => {
    const next = incomes.filter(i => i.id !== id);
    setIncomes(next);
    syncToBackend({ incomes: next });
  };

  const addExpenseCategory = (name: string) => {
    const newItem: CashflowExpenseItem = {
      id: `exp_${Date.now()}`,
      name,
      monthlyAmount: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 },
    };
    const next = [...expenses, newItem];
    setExpenses(next);
    syncToBackend({ expenses: next });
  };

  const updateExpenseCategoryName = (id: string, name: string) => {
    const next = expenses.map(e => (e.id === id ? { ...e, name } : e));
    setExpenses(next);
    syncToBackend({ expenses: next });
  };

  const setIncomesList = (next: CashflowIncomeItem[]) => {
    setIncomes(next);
    syncToBackend({ incomes: next });
  };

  const setExpensesList = (next: CashflowExpenseItem[]) => {
    setExpenses(next);
    syncToBackend({ expenses: next });
  };

  const moveExpense = (id: string, direction: 'up' | 'down') => {
    const index = expenses.findIndex(e => e.id === id);
    if (index < 0) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === expenses.length - 1) return;

    const next = [...expenses];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [removed] = next.splice(index, 1);
    next.splice(targetIndex, 0, removed);
    setExpenses(next);
    syncToBackend({ expenses: next });
  };

  const deleteExpenseCategory = (id: string) => {
    const next = expenses.filter(e => e.id !== id);
    setExpenses(next);
    syncToBackend({ expenses: next });
  };

  // Passive Accounts Handlers
  const addPassiveAccount = (account: Omit<PassiveIncomeAccount, 'id'>) => {
    const newItem: PassiveIncomeAccount = {
      ...account,
      id: `p_${Date.now()}`
    };
    const next = [...passiveAccounts, newItem];
    setPassiveAccounts(next);
    syncToBackend({ passiveAccounts: next });
  };

  const updatePassiveAccount = (id: string, updated: Partial<PassiveIncomeAccount>) => {
    const next = passiveAccounts.map(p => (p.id === id ? { ...p, ...updated } : p));
    setPassiveAccounts(next);
    syncToBackend({ passiveAccounts: next });
  };

  const updatePassiveAccountMonthData = (
    id: string,
    year: number,
    monthKey: string,
    field: 'principal' | 'rate' | 'returns',
    value: number
  ) => {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const targetMonthIdx = MONTHS.indexOf(monthKey);
    if (targetMonthIdx < 0) return;

    const next = passiveAccounts.map(p => {
      if (p.id !== id) return p;

      const yKey = String(year);
      const currYearly = p.yearlyData || {};
      const currYear = currYearly[yKey] || {};

      // Build updated full-year dataset
      const newYearData: Record<string, { principal?: number; rate?: number; returns?: number }> = {};

      // Helper to retrieve current active value for a month before this edit
      const getExisting = (m: string) => {
        const mData = currYear[m];
        return {
          principal: mData?.principal !== undefined ? mData.principal : (p.principalAmount || 0),
          rate: mData?.rate !== undefined ? mData.rate : (p.annualInterestRate || 0),
          returns: mData?.returns !== undefined ? mData.returns : (p.yearlyReturns?.[yKey]?.[m] ?? (year === 2026 ? p.monthlyReturns?.[m] : 0) ?? 0),
        };
      };

      // 1. If editing principal: preserve previous months, forward propagate to target month and following months
      if (field === 'principal') {
        // Preserve previous months (0 to targetMonthIdx - 1)
        for (let i = 0; i < targetMonthIdx; i++) {
          const m = MONTHS[i];
          newYearData[m] = currYear[m] ? { ...currYear[m] } : getExisting(m);
        }
        // Forward propagate to target month and subsequent months
        for (let i = targetMonthIdx; i < MONTHS.length; i++) {
          const m = MONTHS[i];
          const existing = currYear[m] ? { ...currYear[m] } : getExisting(m);
          newYearData[m] = {
            ...existing,
            principal: value
          };
        }
      } else {
        // 'rate' and 'returns' are individual standing (only affects the target month)
        for (let i = 0; i < MONTHS.length; i++) {
          const m = MONTHS[i];
          const existing = currYear[m] ? { ...currYear[m] } : getExisting(m);
          if (i === targetMonthIdx) {
            newYearData[m] = {
              ...existing,
              [field]: value
            };
          } else {
            newYearData[m] = currYear[m] ? { ...currYear[m] } : existing;
          }
        }
      }

      const updatedYearlyReturns = { ...(p.yearlyReturns || {}) };
      if (!updatedYearlyReturns[yKey]) {
        updatedYearlyReturns[yKey] = { ...(p.monthlyReturns || {}) };
      }
      if (field === 'returns') {
        updatedYearlyReturns[yKey][monthKey] = value;
      }

      const updatedYearlyData = {
        ...currYearly,
        [yKey]: newYearData
      };

      return {
        ...p,
        monthlyReturns: field === 'returns' && year === 2026
          ? { ...p.monthlyReturns, [monthKey]: value }
          : p.monthlyReturns,
        yearlyReturns: updatedYearlyReturns,
        yearlyData: updatedYearlyData
      };
    });

    setPassiveAccounts(next);
    syncToBackend({ passiveAccounts: next });
  };

  const setPassiveAccountsList = (next: PassiveIncomeAccount[]) => {
    setPassiveAccounts(next);
    syncToBackend({ passiveAccounts: next });
  };

  const movePassiveAccount = (id: string, direction: 'up' | 'down') => {
    const index = passiveAccounts.findIndex(p => p.id === id);
    if (index < 0) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === passiveAccounts.length - 1) return;

    const next = [...passiveAccounts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [removed] = next.splice(index, 1);
    next.splice(targetIndex, 0, removed);
    setPassiveAccounts(next);
    syncToBackend({ passiveAccounts: next });
  };

  const deletePassiveAccount = (id: string) => {
    const next = passiveAccounts.filter(p => p.id !== id);
    setPassiveAccounts(next);
    syncToBackend({ passiveAccounts: next });
  };

  // Global Reset
  const resetToDefault = async () => {
    setBalanceSheet(initialBalanceSheetData);
    setInvestmentReports(initialInvestmentReports);
    setHoldings(initialHoldings);
    setRealizedTrades(initialRealizedTrades);
    setDividends(initialDividends);
    setCreditCards(initialCreditCards);
    setMonthlyCardSpends(initialMonthlyCardSpends);
    setIncomes(initialIncomes);
    setExpenses(initialExpenses);
    setPassiveAccounts(initialPassiveAccounts);
    setAnnualReports(initialAnnualReports);
    setStockValuations(initialStockValuations);
    localStorage.clear();

    try {
      await fetch('/api/wealth/reset', { method: 'POST' });
      setBackendStatus('synced');
      setLastSyncedAt(new Date());
    } catch {
      setBackendStatus('offline');
    }
  };

  // Backup & Restore
  const exportBackupJSON = () => {
    const data = {
      balanceSheet,
      investmentReports,
      holdings,
      realizedTrades,
      dividends,
      creditCards,
      monthlyCardSpends,
      incomes,
      expenses,
      passiveAccounts,
      annualReports,
      stockValuations,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importBackupJSON = async (jsonStr: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.balanceSheet) setBalanceSheet(parsed.balanceSheet);
      if (parsed.investmentReports) setInvestmentReports(parsed.investmentReports);
      if (parsed.holdings) setHoldings(parsed.holdings);
      if (parsed.realizedTrades) setRealizedTrades(parsed.realizedTrades);
      if (parsed.dividends) setDividends(parsed.dividends);
      if (parsed.creditCards) setCreditCards(sanitizeCreditCards(parsed.creditCards));
      if (parsed.monthlyCardSpends) setMonthlyCardSpends(parsed.monthlyCardSpends);
      if (parsed.incomes) setIncomes(parsed.incomes);
      if (parsed.expenses) setExpenses(parsed.expenses);
      if (parsed.passiveAccounts) setPassiveAccounts(parsed.passiveAccounts);
      if (parsed.annualReports) setAnnualReports(parsed.annualReports);
      if (parsed.stockValuations) setStockValuations(parsed.stockValuations);

      await syncToBackend(parsed);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  return (
    <WealthContext.Provider
      value={{
        balanceSheet,
        updateBalanceSheetCell,
        addBalanceSheetCategory,
        updateBalanceSheetCategory,
        deleteBalanceSheetCategory,
        addBalanceSheetYear,
        deleteBalanceSheetYear,
        cloneBalanceSheetYear,
        syncBalanceSheetFromTabs,

        investmentReports,
        updateInvestmentReport,
        addInvestmentReport,

        annualReports,
        updateAnnualReport,
        addAnnualReport,

        stockValuations,
        addStockValuation,
        updateStockValuation,
        deleteStockValuation,

        holdings,
        addHolding,
        updateHolding,
        deleteHolding,
        sellHolding,
        realizedTrades,
        addTrade,
        deleteTrade,
        dividends,
        addDividendRecord,
        updateDividendPayout,
        deleteDividendRecord,
        creditCards,
        addCreditCard,
        updateCreditCard,
        deleteCreditCard,
        addCreditCardCategory,
        deleteCreditCardCategory,
        updateCreditCardCategory,
        overrideCardRulesForMonth,
        monthlyCardSpends,
        saveCardSpend,
        incomes,
        expenses,
        setIncomesList,
        setExpensesList,
        updateIncome,
        updateExpense,
        updateIncomeForYear,
        updateExpenseForYear,
        copyCashflowYear,
        addIncomeCategory,
        updateIncomeCategoryName,
        moveIncome,
        addExpenseCategory,
        updateExpenseCategoryName,
        moveExpense,
        deleteIncomeCategory,
        deleteExpenseCategory,
        passiveAccounts,
        setPassiveAccountsList,
        addPassiveAccount,
        updatePassiveAccount,
        updatePassiveAccountMonthData,
        movePassiveAccount,
        deletePassiveAccount,
        fireTargetMonthly,
        setFireTargetMonthly,

        backendStatus,
        lastSyncedAt,
        resetToDefault,
        exportBackupJSON,
        importBackupJSON,
      }}
    >
      {children}
    </WealthContext.Provider>
  );
};

export const useWealth = () => {
  const context = useContext(WealthContext);
  if (!context) throw new Error('useWealth must be used within a WealthProvider');
  return context;
};

