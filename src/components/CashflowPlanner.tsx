import React, { useState, useMemo, useEffect } from 'react';
import { useWealth } from '../context/WealthContext';
import {
  Plus,
  Landmark,
  Trash2,
  X,
  Layers,
  Wallet,
  Target,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Info,
  Check,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { YearSelector } from './YearSelector';

export const CashflowPlanner: React.FC = () => {
  const {
    incomes,
    expenses,
    setIncomesList,
    setExpensesList,
    passiveAccounts,
    setPassiveAccountsList,
    holdings,
    stockValuations,
    dividends,
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
    updatePassiveAccount,
    updatePassiveAccountMonthData,
    movePassiveAccount,
    addPassiveAccount,
    deletePassiveAccount,
    fireTargetMonthly,
    setFireTargetMonthly
  } = useWealth();

  const [activeTab, setActiveTab] = useState<'cashflow' | 'passive' | 'comparison'>('cashflow');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [availableYears, setAvailableYears] = useState<number[]>([2023, 2024, 2025, 2026]);

  // Modals
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Drag-and-drop & sort states for Expenses
  const [draggedExpenseId, setDraggedExpenseId] = useState<string | null>(null);
  const [dragOverExpenseId, setDragOverExpenseId] = useState<string | null>(null);
  const [expenseSortOrder, setExpenseSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  // Drag-and-drop & sort states for Incomes
  const [draggedIncomeId, setDraggedIncomeId] = useState<string | null>(null);
  const [dragOverIncomeId, setDragOverIncomeId] = useState<string | null>(null);
  const [incomeSortOrder, setIncomeSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  // Drag-and-drop states for Passive Accounts
  const [draggedPassiveId, setDraggedPassiveId] = useState<string | null>(null);
  const [dragOverPassiveId, setDragOverPassiveId] = useState<string | null>(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Total Principal customization state
  const [showPrincipalSelectorModal, setShowPrincipalSelectorModal] = useState(false);
  const [includedPrincipalAccountIds, setIncludedPrincipalAccountIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wealth_included_principal_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return passiveAccounts.map(a => a.id);
  });

  // Keep included accounts in sync if new passive accounts are created
  useEffect(() => {
    try {
      localStorage.setItem('wealth_included_principal_accounts', JSON.stringify(includedPrincipalAccountIds));
    } catch {}
  }, [includedPrincipalAccountIds]);

  const toggleIncludeAccount = (id: string) => {
    setIncludedPrincipalAccountIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllPrincipalAccounts = () => {
    setIncludedPrincipalAccountIds(passiveAccounts.map(a => a.id));
  };

  const deselectAllPrincipalAccounts = () => {
    setIncludedPrincipalAccountIds([]);
  };

  // Active Stock Portfolio market totals from active holdings & valuation sync (Matching StockPortfolio component)
  const activeMyStockPrincipal = useMemo(() => {
    const map = new Map<string, { totalUnits: number; totalCost: number; currentPrice: number; avgBuyPrice: number; code: string; name: string }>();
    holdings.filter(h => h.market === 'MY').forEach(h => {
      const key = (h.code ? h.code.trim().toUpperCase() : h.name.trim().toUpperCase());
      if (!map.has(key)) {
        map.set(key, {
          code: h.code || '',
          name: h.name.replace(/\s*\(Lot\s*\d+\)/i, '').trim(),
          totalUnits: 0,
          totalCost: 0,
          currentPrice: h.currentPrice ?? h.buyUnitPrice,
          avgBuyPrice: 0,
        });
      }
      const agg = map.get(key)!;
      agg.totalUnits += h.units;
      agg.totalCost += h.units * h.buyUnitPrice;
    });

    let total = 0;
    map.forEach(agg => {
      agg.avgBuyPrice = agg.totalUnits > 0 ? agg.totalCost / agg.totalUnits : 0;
      const stockCode = (agg.code || '').trim().toUpperCase();
      const stockName = (agg.name || '').trim().toLowerCase();
      const matchingVals = stockValuations.filter(v =>
        (stockCode && v.code && v.code.trim().toUpperCase() === stockCode) ||
        (stockName && v.stockName && v.stockName.trim().toLowerCase() === stockName) ||
        (stockName && v.stockName && (v.stockName.toLowerCase().includes(stockName) || stockName.includes(v.stockName.toLowerCase())))
      ).sort((a, b) => b.year - a.year);

      if (matchingVals.length > 0) {
        const latestVal = matchingVals[0];
        const valAmt = latestVal.endOfYearValue > 0 ? latestVal.endOfYearValue : (latestVal.startOfYearValue > 0 ? latestVal.startOfYearValue : 0);
        if (valAmt > 0) {
          total += valAmt;
          return;
        }
      }
      total += agg.totalUnits * (agg.currentPrice || agg.avgBuyPrice);
    });

    return total;
  }, [holdings, stockValuations]);

  const activeUsStockPrincipal = useMemo(() => {
    const map = new Map<string, { totalUnits: number; totalCost: number; currentPrice: number; avgBuyPrice: number; code: string; name: string }>();
    holdings.filter(h => h.market === 'US').forEach(h => {
      const key = (h.code ? h.code.trim().toUpperCase() : h.name.trim().toUpperCase());
      if (!map.has(key)) {
        map.set(key, {
          code: h.code || '',
          name: h.name.replace(/\s*\(Lot\s*\d+\)/i, '').trim(),
          totalUnits: 0,
          totalCost: 0,
          currentPrice: h.currentPrice ?? h.buyUnitPrice,
          avgBuyPrice: 0,
        });
      }
      const agg = map.get(key)!;
      agg.totalUnits += h.units;
      agg.totalCost += h.units * h.buyUnitPrice;
    });

    let total = 0;
    map.forEach(agg => {
      agg.avgBuyPrice = agg.totalUnits > 0 ? agg.totalCost / agg.totalUnits : 0;
      const stockCode = (agg.code || '').trim().toUpperCase();
      const stockName = (agg.name || '').trim().toLowerCase();
      const matchingVals = stockValuations.filter(v =>
        (stockCode && v.code && v.code.trim().toUpperCase() === stockCode) ||
        (stockName && v.stockName && v.stockName.trim().toLowerCase() === stockName) ||
        (stockName && v.stockName && (v.stockName.toLowerCase().includes(stockName) || stockName.includes(v.stockName.toLowerCase())))
      ).sort((a, b) => b.year - a.year);

      if (matchingVals.length > 0) {
        const latestVal = matchingVals[0];
        const valAmt = latestVal.endOfYearValue > 0 ? latestVal.endOfYearValue : (latestVal.startOfYearValue > 0 ? latestVal.startOfYearValue : 0);
        if (valAmt > 0) {
          total += valAmt;
          return;
        }
      }
      total += agg.totalUnits * (agg.currentPrice || agg.avgBuyPrice);
    });

    return total;
  }, [holdings, stockValuations]);

  const getStockPrincipalForYear = (market: 'MY' | 'US', yr: number) => {
    // 1. Group active holdings for this market
    const map = new Map<string, { totalUnits: number; totalCost: number; currentPrice: number; avgBuyPrice: number; code: string; name: string }>();
    holdings.filter(h => h.market === market).forEach(h => {
      const key = (h.code ? h.code.trim().toUpperCase() : h.name.trim().toUpperCase());
      if (!map.has(key)) {
        map.set(key, {
          code: h.code || '',
          name: h.name.replace(/\s*\(Lot\s*\d+\)/i, '').trim(),
          totalUnits: 0,
          totalCost: 0,
          currentPrice: h.currentPrice ?? h.buyUnitPrice,
          avgBuyPrice: 0,
        });
      }
      const agg = map.get(key)!;
      agg.totalUnits += h.units;
      agg.totalCost += h.units * h.buyUnitPrice;
    });

    let total = 0;
    const handledValKeys = new Set<string>();

    map.forEach((agg) => {
      agg.avgBuyPrice = agg.totalUnits > 0 ? agg.totalCost / agg.totalUnits : 0;
      const stockCode = (agg.code || '').trim().toUpperCase();
      const stockName = (agg.name || '').trim().toLowerCase();

      // Check valuation specifically for target year yr
      const curYrVal = stockValuations.find(v =>
        v.year === yr &&
        ((stockCode && v.code && v.code.trim().toUpperCase() === stockCode) ||
         (stockName && v.stockName && v.stockName.trim().toLowerCase() === stockName) ||
         (stockName && v.stockName && (v.stockName.toLowerCase().includes(stockName) || stockName.includes(v.stockName.toLowerCase()))))
      );

      if (curYrVal) {
        handledValKeys.add(curYrVal.id);
        const valAmt = curYrVal.endOfYearValue > 0 ? curYrVal.endOfYearValue : (curYrVal.startOfYearValue > 0 ? curYrVal.startOfYearValue : 0);
        if (valAmt > 0) {
          total += valAmt;
          return;
        }
      }

      // If in current active year (2026 or selectedYear), use live holding market value
      if (yr >= 2026 || yr === selectedYear) {
        const val = agg.totalUnits * (agg.currentPrice || agg.avgBuyPrice);
        if (val > 0) {
          total += val;
          return;
        }
      }

      // Find latest valuation on or before yr
      const prevVals = stockValuations.filter(v =>
        v.year <= yr &&
        ((stockCode && v.code && v.code.trim().toUpperCase() === stockCode) ||
         (stockName && v.stockName && v.stockName.trim().toLowerCase() === stockName) ||
         (stockName && v.stockName && (v.stockName.toLowerCase().includes(stockName) || stockName.includes(v.stockName.toLowerCase()))))
      ).sort((a, b) => b.year - a.year);

      if (prevVals.length > 0) {
        const valAmt = prevVals[0].endOfYearValue > 0 ? prevVals[0].endOfYearValue : (prevVals[0].startOfYearValue > 0 ? prevVals[0].startOfYearValue : 0);
        if (valAmt > 0) {
          total += valAmt;
          return;
        }
      }

      // Fallback to active holding total cost or value
      total += agg.totalUnits * (agg.currentPrice || agg.avgBuyPrice);
    });

    // Also include any other stock valuations recorded for year yr that aren't in active holdings (e.g. historical stocks like SUNWAY PA)
    stockValuations
      .filter(v =>
        v.year === yr &&
        !handledValKeys.has(v.id) &&
        (v.market === market || (!v.market && ((market === 'MY' && v.currency !== 'USD') || (market === 'US' && v.currency === 'USD'))))
      )
      .forEach(v => {
        const valAmt = v.endOfYearValue > 0 ? v.endOfYearValue : (v.startOfYearValue > 0 ? v.startOfYearValue : 0);
        total += valAmt;
      });

    if (total > 0) return total;
    return market === 'MY' ? activeMyStockPrincipal : activeUsStockPrincipal;
  };

  // Calculate dividends from Dividend Tracker for a specific market (MY or US) for given year and month
  const getStockDividendsForMonth = (market: 'MY' | 'US', yr: number, month: string) => {
    const yrDividends = dividends.filter(d => d.year === yr);
    return yrDividends.reduce((sum, d) => {
      const stockNameLower = (d.stockName || '').trim().toLowerCase();
      // Find matching stock in holdings or stockValuations to identify market
      const holding = holdings.find(h =>
        (h.code && (h.code.trim().toLowerCase() === stockNameLower || stockNameLower.includes(h.code.trim().toLowerCase()))) ||
        (h.name && (h.name.trim().toLowerCase() === stockNameLower || stockNameLower.includes(h.name.trim().toLowerCase())))
      );
      const val = stockValuations.find(v =>
        v.year === yr &&
        (((v.code && (v.code.trim().toLowerCase() === stockNameLower || stockNameLower.includes(v.code.trim().toLowerCase())))) ||
          (v.stockName && (v.stockName.trim().toLowerCase() === stockNameLower || stockNameLower.includes(v.stockName.trim().toLowerCase()))))
      );
      
      let stockMarket: 'MY' | 'US' = 'MY';
      if (holding?.market) {
        stockMarket = holding.market === 'US' ? 'US' : 'MY';
      } else if (val?.market) {
        stockMarket = val.market === 'US' ? 'US' : 'MY';
      } else if (
        stockNameLower.includes('us') ||
        stockNameLower.includes('gld') ||
        stockNameLower.includes('spcx') ||
        stockNameLower.includes('aapl') ||
        stockNameLower.includes('nvda') ||
        stockNameLower.includes('gold') ||
        stockNameLower.includes('qqq') ||
        stockNameLower.includes('etf')
      ) {
        stockMarket = 'US';
      }

      if (stockMarket === market) {
        return sum + (d.monthlyPayouts?.[month] || 0);
      }
      return sum;
    }, 0);
  };

  // Identify whether a passive account is linked to MY stock or US stock
  const checkStockAccountType = (item: (typeof passiveAccounts)[0]) => {
    const lower = (item.name || '').toLowerCase().trim();
    const cat = (item.category || '').toLowerCase().trim();
    const id = (item.id || '').toLowerCase();

    // Check if US / Overseas / Global Stock
    const isUs =
      id === 'p_stock_us' ||
      cat === 'us stock' ||
      cat === 'us stocks' ||
      cat === 'overseas stock' ||
      cat === 'us' ||
      lower.includes('(us)') ||
      lower.includes(' us ') ||
      lower.endsWith(' us') ||
      lower.startsWith('us ') ||
      lower.includes('us stock') ||
      lower.includes('overseas') ||
      lower.includes('foreign') ||
      lower.includes('global stock') ||
      lower.includes('spdr') ||
      lower.includes('spacex') ||
      lower.includes('wall st') ||
      ((lower.includes('us') || lower.includes('oversea') || lower.includes('foreign') || lower.includes('global') || lower.includes('america')) &&
       (lower.includes('stock') || lower.includes('share') || lower.includes('portfolio') || lower.includes('yield') || lower.includes('equit')));

    // Check if MY / Malaysian Stock
    const isMy =
      !isUs &&
      (id === 'p_stock' ||
       cat === 'stock principal' ||
       cat === 'my stock' ||
       cat === 'my stocks' ||
       cat === 'malaysia stock' ||
       lower.includes('(my)') ||
       lower.includes('my stock') ||
       lower.includes('bursa') ||
       lower.includes('malaysia') ||
       (lower.includes('stock') && !isUs) ||
       (lower.includes('share') && !isUs));

    return { isMy, isUs };
  };

  // Helper to extract monthly amounts for selected year
  const getIncomeValuesForYear = (item: (typeof incomes)[0], year: number) => {
    const yrStr = year.toString();
    if (item.yearlyAmount && item.yearlyAmount[yrStr]) {
      return item.yearlyAmount[yrStr];
    }
    return item.monthlyAmount;
  };

  const getExpenseValuesForYear = (item: (typeof expenses)[0], year: number) => {
    const yrStr = year.toString();
    if (item.yearlyAmount && item.yearlyAmount[yrStr]) {
      return item.yearlyAmount[yrStr];
    }
    return item.monthlyAmount;
  };

  // Monthly Revenue Sum for active year
  const monthlyRevenue = useMemo(() => {
    return months.reduce((acc, m) => {
      acc[m] = incomes.reduce((sum, inc) => {
        const valObj = getIncomeValuesForYear(inc, selectedYear);
        return sum + (valObj[m] || 0);
      }, 0);
      return acc;
    }, {} as { [m: string]: number });
  }, [incomes, selectedYear]);

  // Monthly Expense Sum for active year
  const monthlyExpensesTotal = useMemo(() => {
    return months.reduce((acc, m) => {
      acc[m] = expenses.reduce((sum, exp) => {
        const valObj = getExpenseValuesForYear(exp, selectedYear);
        return sum + (valObj[m] || 0);
      }, 0);
      return acc;
    }, {} as { [m: string]: number });
  }, [expenses, selectedYear]);

  // Monthly Net Profit for active year
  const monthlyNetProfit = useMemo(() => {
    return months.reduce((acc, m) => {
      acc[m] = (monthlyRevenue[m] || 0) - (monthlyExpensesTotal[m] || 0);
      return acc;
    }, {} as { [m: string]: number });
  }, [monthlyRevenue, monthlyExpensesTotal]);

  const totalAnnualRevenue = useMemo(() => {
    return (Object.values(monthlyRevenue) as number[]).reduce((a, b) => a + b, 0);
  }, [monthlyRevenue]);

  const totalAnnualExpenses = useMemo(() => {
    return (Object.values(monthlyExpensesTotal) as number[]).reduce((a, b) => a + b, 0);
  }, [monthlyExpensesTotal]);

  const totalAnnualNetProfit = totalAnnualRevenue - totalAnnualExpenses;
  const annualSavingsRate = totalAnnualRevenue > 0 ? (totalAnnualNetProfit / totalAnnualRevenue) * 100 : 0;

  // Multi-Year History Summary Data
  const multiYearSummary = useMemo(() => {
    return availableYears.map(yr => {
      let rev = 0;
      let exp = 0;
      months.forEach(m => {
        incomes.forEach(i => (rev += getIncomeValuesForYear(i, yr)[m] || 0));
        expenses.forEach(e => (exp += getExpenseValuesForYear(e, yr)[m] || 0));
      });
      const net = rev - exp;
      const rate = rev > 0 ? (net / rev) * 100 : 0;
      return { year: yr, revenue: rev, expense: exp, netProfit: net, savingsRate: rate };
    });
  }, [availableYears, incomes, expenses]);

  // Helper to extract passive monthly data for selected year (with auto-flow for stock portfolios)
  const getPassiveMonthData = (item: (typeof passiveAccounts)[0], year: number, month: string) => {
    const { isMy, isUs } = checkStockAccountType(item);
    const flowPrincipal = isMy
      ? getStockPrincipalForYear('MY', year)
      : isUs
      ? getStockPrincipalForYear('US', year)
      : 0;

    const defaultPrincipal = flowPrincipal > 0 ? flowPrincipal : item.principalAmount || 0;
    const yrStr = year.toString();
    const yearly = item.yearlyData?.[yrStr]?.[month];
    const currentPrincipal = yearly?.principal !== undefined ? yearly.principal : defaultPrincipal;

    if (isMy || isUs) {
      // Prioritize live stock portfolio valuation if available, otherwise saved principal
      const currentPrincipal = flowPrincipal > 0
        ? flowPrincipal
        : (yearly?.principal !== undefined ? yearly.principal : defaultPrincipal);

      // Auto-fill dividend amount from Dividend Yield page for MY or US stock portfolio
      const autoDividend = isMy
        ? getStockDividendsForMonth('MY', year, month)
        : getStockDividendsForMonth('US', year, month);

      // Auto-calculate the particular month interest rate: (Dividend / Principal) * 100
      const autoRate = currentPrincipal > 0
        ? Number(((autoDividend / currentPrincipal) * 100).toFixed(2))
        : 0;

      return {
        principal: currentPrincipal,
        rate: autoRate,
        returns: autoDividend,
        isStockAutoLinked: isMy ? 'MY' : 'US'
      };
    }

    if (yearly) {
      return {
        principal: currentPrincipal,
        rate: yearly.rate ?? item.annualInterestRate ?? 0,
        returns: yearly.returns ?? (item.yearlyReturns?.[yrStr]?.[month] ?? (year === 2026 ? item.monthlyReturns?.[month] : 0) ?? 0),
        isStockAutoLinked: null
      };
    }
    const legacyYearlyRet = item.yearlyReturns?.[yrStr]?.[month];
    const ret = legacyYearlyRet !== undefined ? legacyYearlyRet : (year === 2026 ? item.monthlyReturns?.[month] || 0 : 0);
    return {
      principal: defaultPrincipal,
      rate: item.annualInterestRate || 0,
      returns: ret,
      isStockAutoLinked: null
    };
  };

  // Passive Income Calculations per account for active year
  const passiveAccountMetrics = useMemo(() => {
    return passiveAccounts.map(account => {
      const monthRecords = months.map(m => getPassiveMonthData(account, selectedYear, m));
      const actualReturnsSum = monthRecords.reduce((sum, r) => sum + r.returns, 0);

      // Latest active principal in this year (search backwards from Dec)
      let latestPrincipal = account.principalAmount || 0;
      for (let i = monthRecords.length - 1; i >= 0; i--) {
        if (monthRecords[i].principal > 0) {
          latestPrincipal = monthRecords[i].principal;
          break;
        }
      }

      // Latest active rate in this year (search backwards from Dec)
      let latestRate = account.annualInterestRate || 0;
      for (let i = monthRecords.length - 1; i >= 0; i--) {
        if (monthRecords[i].rate > 0) {
          latestRate = monthRecords[i].rate;
          break;
        }
      }

      const estAnnual = (latestPrincipal * latestRate) / 100;
      const effectiveAnnual = actualReturnsSum > 0 ? actualReturnsSum : estAnnual;
      const monthlyEst = effectiveAnnual / 12;

      return {
        account,
        monthRecords,
        actualReturnsSum,
        latestPrincipal,
        latestRate,
        effectiveAnnual,
        monthlyEst,
      };
    });
  }, [passiveAccounts, selectedYear, months]);

  const totalPassiveAnnualReturn = useMemo(() => {
    return passiveAccountMetrics.reduce((sum, m) => sum + m.effectiveAnnual, 0);
  }, [passiveAccountMetrics]);

  const monthlyPassiveAvg = totalPassiveAnnualReturn / 12;
  const currentFireGoal = fireTargetMonthly || 2000;
  const passiveMilestonePercent = currentFireGoal > 0 ? Math.min(100, (monthlyPassiveAvg / currentFireGoal) * 100) : 0;

  // Add Income
  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addIncomeCategory(newCatName);
    setNewCatName('');
    setShowAddIncomeModal(false);
  };

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addExpenseCategory(newCatName);
    setNewCatName('');
    setShowAddExpenseModal(false);
  };

  // Add Passive Account directly without modal
  const handleAddDirectPassiveAccount = () => {
    addPassiveAccount({
      name: 'New Yield Account',
      category: 'Digital Bank',
      principalAmount: 10000,
      annualInterestRate: 3.5,
      monthlyReturns: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 },
      yearlyData: {
        [String(selectedYear)]: {
          Jan: { principal: 10000, rate: 3.5, returns: 0 },
          Feb: { principal: 10000, rate: 3.5, returns: 0 },
          Mar: { principal: 10000, rate: 3.5, returns: 0 },
          Apr: { principal: 10000, rate: 3.5, returns: 0 },
          May: { principal: 10000, rate: 3.5, returns: 0 },
          Jun: { principal: 10000, rate: 3.5, returns: 0 },
          Jul: { principal: 10000, rate: 3.5, returns: 0 },
          Aug: { principal: 10000, rate: 3.5, returns: 0 },
          Sep: { principal: 10000, rate: 3.5, returns: 0 },
          Oct: { principal: 10000, rate: 3.5, returns: 0 },
          Nov: { principal: 10000, rate: 3.5, returns: 0 },
          Dec: { principal: 10000, rate: 3.5, returns: 0 },
        }
      }
    });
  };

  // Expenses Drag & Drop Handlers
  const handleExpenseDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedExpenseId(id);
  };

  const handleExpenseDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverExpenseId !== id) {
      setDragOverExpenseId(id);
    }
  };

  const handleExpenseDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedExpenseId;
    if (!sourceId || sourceId === targetId) {
      setDraggedExpenseId(null);
      setDragOverExpenseId(null);
      return;
    }

    const fromIndex = expenses.findIndex(exp => exp.id === sourceId);
    const toIndex = expenses.findIndex(exp => exp.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const next = [...expenses];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setExpensesList(next);
    setExpenseSortOrder('none');
    setDraggedExpenseId(null);
    setDragOverExpenseId(null);
  };

  // Expenses Sort Handler (toggle Ascending / Descending / Default)
  const handleToggleSortExpenses = () => {
    let nextOrder: 'none' | 'asc' | 'desc' = 'asc';
    if (expenseSortOrder === 'none') nextOrder = 'asc';
    else if (expenseSortOrder === 'asc') nextOrder = 'desc';
    else if (expenseSortOrder === 'desc') nextOrder = 'none';

    setExpenseSortOrder(nextOrder);

    if (nextOrder === 'asc') {
      const sorted = [...expenses].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      setExpensesList(sorted);
    } else if (nextOrder === 'desc') {
      const sorted = [...expenses].sort((a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: 'base' }));
      setExpensesList(sorted);
    }
  };

  // Income Drag & Drop Handlers
  const handleIncomeDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIncomeId(id);
  };

  const handleIncomeDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIncomeId !== id) {
      setDragOverIncomeId(id);
    }
  };

  const handleIncomeDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedIncomeId;
    if (!sourceId || sourceId === targetId) {
      setDraggedIncomeId(null);
      setDragOverIncomeId(null);
      return;
    }

    const fromIndex = incomes.findIndex(inc => inc.id === sourceId);
    const toIndex = incomes.findIndex(inc => inc.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const next = [...incomes];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setIncomesList(next);
    setIncomeSortOrder('none');
    setDraggedIncomeId(null);
    setDragOverIncomeId(null);
  };

  // Income Sort Handler
  const handleToggleSortIncomes = () => {
    let nextOrder: 'none' | 'asc' | 'desc' = 'asc';
    if (incomeSortOrder === 'none') nextOrder = 'asc';
    else if (incomeSortOrder === 'asc') nextOrder = 'desc';
    else if (incomeSortOrder === 'desc') nextOrder = 'none';

    setIncomeSortOrder(nextOrder);

    if (nextOrder === 'asc') {
      const sorted = [...incomes].sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }));
      setIncomesList(sorted);
    } else if (nextOrder === 'desc') {
      const sorted = [...incomes].sort((a, b) => b.category.localeCompare(a.category, undefined, { sensitivity: 'base' }));
      setIncomesList(sorted);
    }
  };

  // Passive Accounts Drag & Drop Handlers
  const handlePassiveDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPassiveId(id);
  };

  const handlePassiveDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverPassiveId !== id) {
      setDragOverPassiveId(id);
    }
  };

  const handlePassiveDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedPassiveId;
    if (!sourceId || sourceId === targetId) {
      setDraggedPassiveId(null);
      setDragOverPassiveId(null);
      return;
    }

    const fromIndex = passiveAccounts.findIndex(p => p.id === sourceId);
    const toIndex = passiveAccounts.findIndex(p => p.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const next = [...passiveAccounts];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setPassiveAccountsList(next);
    setDraggedPassiveId(null);
    setDragOverPassiveId(null);
  };

  // Add New Year (via YearSelector)
  const handleAddYear = (year: number, cloneFrom?: number) => {
    if (!availableYears.includes(year)) {
      const next = [...availableYears, year].sort((a, b) => a - b);
      setAvailableYears(next);
      if (cloneFrom) {
        copyCashflowYear(cloneFrom, year);
      }
      setSelectedYear(year);
    }
  };

  // Delete Year (via YearSelector Right-Click)
  const handleDeleteYear = (year: number) => {
    if (availableYears.length <= 1) return;
    const next = availableYears.filter(y => y !== year);
    setAvailableYears(next);
    if (selectedYear === year) {
      setSelectedYear(next[next.length - 1]);
    }
  };

  const formatRM = (num: number) => `RM ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatUSD = (num: number) => `$ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div id="cashflow-planner-section" className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Top Header & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EAE3D6] shadow-xs">
        <div className="flex items-center gap-1 bg-[#F2ECE2] p-1 rounded-xl border border-[#E2DAD0] self-start md:self-auto">
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cashflow'
                ? 'bg-white text-[#2D2823] shadow-xs'
                : 'text-[#6B635A] hover:text-[#2D2823]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#3D633C]" />
            <span>Monthly Cash Flow</span>
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-white text-[#2D2823] shadow-xs'
                : 'text-[#6B635A] hover:text-[#2D2823]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#B86B30]" />
            <span>Multi-Year Comparison</span>
          </button>
          <button
            onClick={() => setActiveTab('passive')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'passive'
                ? 'bg-white text-[#2D2823] shadow-xs'
                : 'text-[#6B635A] hover:text-[#2D2823]'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-[#8F4E1D]" />
            <span>Passive Yield Accounts</span>
          </button>
        </div>

        {(activeTab === 'cashflow' || activeTab === 'passive') && (
          <div className="flex flex-wrap items-center gap-2">
            <YearSelector
              years={availableYears}
              selectedYear={selectedYear}
              onSelectYear={yr => typeof yr === 'number' && setSelectedYear(yr)}
              onAddYear={handleAddYear}
              onDeleteYear={handleDeleteYear}
              label="Year"
            />
          </div>
        )}
      </div>

      {/* ================= TAB 1: MONTHLY CASH FLOW ================= */}
      {activeTab === 'cashflow' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs">
              <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                Annual Revenue ({selectedYear})
              </span>
              <p className="text-lg font-extrabold text-[#3D633C] font-mono">
                {formatRM(totalAnnualRevenue)}
              </p>
              <span className="text-[11px] text-[#8C8379] font-mono">
                Avg. {formatRM(totalAnnualRevenue / 12)} /mo
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs">
              <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                Annual Outflow ({selectedYear})
              </span>
              <p className="text-lg font-extrabold text-[#B54838] font-mono">
                {formatRM(totalAnnualExpenses)}
              </p>
              <span className="text-[11px] text-[#8C8379] font-mono">
                Avg. {formatRM(totalAnnualExpenses / 12)} /mo
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs">
              <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                Net Annual Savings
              </span>
              <p className={`text-lg font-extrabold font-mono ${totalAnnualNetProfit >= 0 ? 'text-[#8F4E1D]' : 'text-[#B54838]'}`}>
                {formatRM(totalAnnualNetProfit)}
              </p>
              <span className="text-[11px] text-[#8C8379] font-mono">
                Avg. {formatRM(totalAnnualNetProfit / 12)} /mo
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs">
              <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                Savings Rate
              </span>
              <p className="text-lg font-extrabold text-[#2D2823] font-mono">
                {annualSavingsRate.toFixed(1)}%
              </p>
              <div className="w-full bg-[#FAF7F2] rounded-full h-1.5 mt-2 overflow-hidden border border-[#EAE3D6]">
                <div
                  className="bg-[#3D633C] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, annualSavingsRate))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Revenue Ledger */}
          <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#F2ECE2] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3D633C]" />
                <h3 className="text-xs font-extrabold text-[#2D2823] tracking-tight uppercase">
                  Revenue ({selectedYear})
                </h3>
              </div>
              <button
                onClick={() => setShowAddIncomeModal(true)}
                className="flex items-center gap-1 px-3 py-1 bg-[#3D633C] hover:bg-[#315030] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Inflow Stream</span>
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[60vh] no-scrollbar touch-scroll relative">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-[#F8F5EE] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                  <tr className="border-b border-[#E6E0D3] text-[#5C544C] font-bold uppercase text-[10px] tracking-wider">
                    <th
                      onClick={handleToggleSortIncomes}
                      className="py-2.5 px-3 min-w-[190px] max-w-[250px] cursor-pointer select-none group sticky left-0 top-0 z-30 bg-[#F8F5EE] border-r border-[#E6E0D3] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]"
                      title={`Sort by Stream Category (${incomeSortOrder === 'asc' ? 'A→Z' : incomeSortOrder === 'desc' ? 'Z→A' : 'Default'})`}
                    >
                      <div className="flex items-center gap-1.5 hover:text-[#3D633C] transition-colors">
                        <span>Stream Category</span>
                        {incomeSortOrder === 'asc' ? (
                          <span className="text-[10px] text-[#3D633C] font-bold">▲</span>
                        ) : incomeSortOrder === 'desc' ? (
                          <span className="text-[10px] text-[#3D633C] font-bold">▼</span>
                        ) : (
                          <span className="text-[9px] text-[#C2B8AA] group-hover:text-[#8C8379] transition-colors opacity-50 group-hover:opacity-100">▲▼</span>
                        )}
                      </div>
                    </th>
                    {months.map(m => (
                      <th key={m} className="py-2.5 px-1.5 text-right min-w-[85px]">{m}</th>
                    ))}
                    <th className="py-2.5 px-3 text-right min-w-[110px] whitespace-nowrap bg-[#FAF7F2] font-bold text-[#2D2823]">Total</th>
                    <th className="py-2.5 px-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE2] font-medium text-[#2D2823]">
                  {incomes.map((inc) => {
                    const vals = getIncomeValuesForYear(inc, selectedYear);
                    const rowSum = (Object.values(vals) as number[]).reduce((a, b) => a + b, 0);
                    const isDragging = draggedIncomeId === inc.id;
                    const isDragOver = dragOverIncomeId === inc.id;

                    return (
                      <tr
                        key={inc.id}
                        draggable
                        onDragStart={e => handleIncomeDragStart(e, inc.id)}
                        onDragOver={e => handleIncomeDragOver(e, inc.id)}
                        onDrop={e => handleIncomeDrop(e, inc.id)}
                        onDragEnd={() => {
                          setDraggedIncomeId(null);
                          setDragOverIncomeId(null);
                        }}
                        className={`transition-all group ${
                          isDragging ? 'opacity-40 bg-[#FAF7F2]' : isDragOver ? 'bg-[#EEF4EE]/60 border-t-2 border-[#3D633C]' : 'hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <td className="py-1.5 px-3 font-bold text-[#2D2823] min-w-[190px] max-w-[250px] whitespace-normal break-words sticky left-0 z-10 bg-white group-hover:bg-[#FAF8F5] border-r border-[#EAE3D6] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                          <textarea
                            rows={inc.category.length > 22 ? 2 : 1}
                            value={inc.category}
                            onChange={e => updateIncomeCategoryName(inc.id, e.target.value)}
                            placeholder="Income stream name"
                            className="w-full font-bold text-xs text-[#2D2823] bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-[#E2DAD0] focus:border-[#3D633C] rounded-lg px-2 py-1 focus:outline-none transition-all cursor-text resize-none whitespace-normal break-words leading-snug"
                          />
                        </td>
                        {months.map(m => (
                          <td key={m} className="py-1 px-1 text-right font-mono min-w-[85px]">
                            <input
                              type="number"
                              step="any"
                              value={vals[m] !== undefined && vals[m] !== null ? vals[m] : 0}
                              onChange={e => updateIncomeForYear(inc.id, selectedYear, m, parseFloat(e.target.value) || 0)}
                              className="w-full text-right py-1 px-1.5 text-xs bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-[#E2DAD0] focus:border-[#3D633C] rounded-lg focus:outline-none transition-all font-mono tabular-nums text-[#2D2823]"
                            />
                          </td>
                        ))}
                        <td className="py-2 px-3 text-right font-mono font-extrabold text-[#3D633C] bg-[#EEF4EE]/50 whitespace-nowrap tabular-nums">
                          {formatRM(rowSum)}
                        </td>
                        <td className="py-2 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => deleteIncomeCategory(inc.id)}
                            className="p-1 text-[#8C8379] hover:text-[#B54838] rounded transition-colors cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#EEF4EE]/70 border-t-2 border-[#D5E3D5] font-extrabold text-[#2D2823]">
                    <td className="py-3 px-4 uppercase text-[10px] tracking-wider text-[#3D633C] sticky left-0 z-10 bg-[#EEF4EE] border-r border-[#D5E3D5] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[190px]">
                      Total Inflow
                    </td>
                    {months.map(m => (
                      <td key={m} className="py-3 px-1.5 text-right font-mono text-[#3D633C] whitespace-nowrap tabular-nums">
                        {monthlyRevenue[m] ? formatRM(monthlyRevenue[m]) : '-'}
                      </td>
                    ))}
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-[#3D633C] bg-[#E3EFE3] text-xs whitespace-nowrap tabular-nums">
                      {formatRM(totalAnnualRevenue)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Outflow Ledger */}
          <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#F2ECE2] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B54838]" />
                <h3 className="text-xs font-extrabold text-[#2D2823] tracking-tight uppercase">
                  Expenses ({selectedYear})
                </h3>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="flex items-center gap-1 px-3 py-1 bg-[#B54838] hover:bg-[#9E3E30] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Expense Item</span>
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[60vh] no-scrollbar touch-scroll relative">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-[#F8F5EE] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                  <tr className="border-b border-[#E6E0D3] text-[#5C544C] font-bold uppercase text-[10px] tracking-wider">
                    <th
                      onClick={handleToggleSortExpenses}
                      className="py-2.5 px-3 min-w-[190px] max-w-[250px] cursor-pointer select-none group sticky left-0 top-0 z-30 bg-[#F8F5EE] border-r border-[#E6E0D3] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]"
                      title={`Sort by Expense Name (${expenseSortOrder === 'asc' ? 'A→Z' : expenseSortOrder === 'desc' ? 'Z→A' : 'Default'})`}
                    >
                      <div className="flex items-center gap-1.5 hover:text-[#B54838] transition-colors">
                        <span>Expense Name</span>
                        {expenseSortOrder === 'asc' ? (
                          <span className="text-[10px] text-[#B54838] font-bold">▲</span>
                        ) : expenseSortOrder === 'desc' ? (
                          <span className="text-[10px] text-[#B54838] font-bold">▼</span>
                        ) : (
                          <span className="text-[9px] text-[#C2B8AA] group-hover:text-[#8C8379] transition-colors opacity-50 group-hover:opacity-100">▲▼</span>
                        )}
                      </div>
                    </th>
                    {months.map(m => (
                      <th key={m} className="py-2.5 px-1.5 text-right min-w-[85px]">{m}</th>
                    ))}
                    <th className="py-2.5 px-3 text-right min-w-[110px] whitespace-nowrap bg-[#FAF7F2] font-bold text-[#2D2823]">Total</th>
                    <th className="py-2.5 px-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE2] font-medium text-[#2D2823]">
                  {expenses.map((exp) => {
                    const vals = getExpenseValuesForYear(exp, selectedYear);
                    const rowSum = (Object.values(vals) as number[]).reduce((a, b) => a + b, 0);
                    const isDragging = draggedExpenseId === exp.id;
                    const isDragOver = dragOverExpenseId === exp.id;

                    return (
                      <tr
                        key={exp.id}
                        draggable
                        onDragStart={e => handleExpenseDragStart(e, exp.id)}
                        onDragOver={e => handleExpenseDragOver(e, exp.id)}
                        onDrop={e => handleExpenseDrop(e, exp.id)}
                        onDragEnd={() => {
                          setDraggedExpenseId(null);
                          setDragOverExpenseId(null);
                        }}
                        className={`transition-all group ${
                          isDragging ? 'opacity-40 bg-[#FAF7F2]' : isDragOver ? 'bg-[#FDF2F0]/60 border-t-2 border-[#B54838]' : 'hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <td className="py-1.5 px-3 font-bold text-[#2D2823] min-w-[190px] max-w-[250px] whitespace-normal break-words sticky left-0 z-10 bg-white group-hover:bg-[#FAF8F5] border-r border-[#EAE3D6] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                          <textarea
                            rows={exp.name.length > 22 ? 2 : 1}
                            value={exp.name}
                            onChange={e => updateExpenseCategoryName(exp.id, e.target.value)}
                            placeholder="Expense item name"
                            className="w-full font-bold text-xs text-[#2D2823] bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-[#E2DAD0] focus:border-[#B54838] rounded-lg px-2 py-1 focus:outline-none transition-all cursor-text resize-none whitespace-normal break-words leading-snug"
                          />
                        </td>
                        {months.map(m => (
                          <td key={m} className="py-1 px-1 text-right font-mono min-w-[85px]">
                            <input
                              type="number"
                              step="any"
                              value={vals[m] !== undefined && vals[m] !== null ? vals[m] : 0}
                              onChange={e => updateExpenseForYear(exp.id, selectedYear, m, parseFloat(e.target.value) || 0)}
                              className="w-full text-right py-1 px-1.5 text-xs bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-[#E2DAD0] focus:border-[#B54838] rounded-lg focus:outline-none transition-all font-mono tabular-nums text-[#2D2823]"
                            />
                          </td>
                        ))}
                        <td className="py-2 px-3 text-right font-mono font-extrabold text-[#B54838] bg-[#FDF2F0]/50 whitespace-nowrap tabular-nums">
                          {formatRM(rowSum)}
                        </td>
                        <td className="py-2 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => deleteExpenseCategory(exp.id)}
                            className="p-1 text-[#8C8379] hover:text-[#B54838] rounded transition-colors cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#FDF2F0]/70 border-t-2 border-[#F6D0C9] font-extrabold text-[#2D2823]">
                    <td className="py-3 px-4 uppercase text-[10px] tracking-wider text-[#B54838] sticky left-0 z-10 bg-[#FDF2F0] border-r border-[#F6D0C9] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[190px]">
                      Total Outflow
                    </td>
                    {months.map(m => (
                      <td key={m} className="py-3 px-1.5 text-right font-mono text-[#B54838] whitespace-nowrap tabular-nums">
                        {monthlyExpensesTotal[m] ? formatRM(monthlyExpensesTotal[m]) : '-'}
                      </td>
                    ))}
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-[#B54838] bg-[#FBE5E1] text-xs whitespace-nowrap tabular-nums">
                      {formatRM(totalAnnualExpenses)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Net Cash Flow Summary Banner */}
          <div className="bg-[#2D2823] text-[#FAF8F5] rounded-2xl p-4 shadow-md border border-[#4A423A]">
            <div className="overflow-x-auto no-scrollbar touch-scroll">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[#A3998D] font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-1 px-4 min-w-[160px] sticky left-0 top-0 z-20 bg-[#2D2823] border-r border-[#4A423A] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.4)]">Monthly Net Cash Flow</th>
                    {months.map(m => (
                      <th key={m} className="py-1 px-1.5 text-right min-w-[85px]">{m}</th>
                    ))}
                    <th className="py-1 px-3 text-right min-w-[110px] whitespace-nowrap font-bold text-[#E8A87C]">Total Net</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-mono font-extrabold text-sm">
                    <td className="py-2.5 px-4 text-[#D5CEBF] sticky left-0 z-10 bg-[#2D2823] border-r border-[#4A423A] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.4)] min-w-[160px]">Surplus / Deficit</td>
                    {months.map(m => {
                      const net = monthlyNetProfit[m] || 0;
                      return (
                        <td key={m} className={`py-2.5 px-1.5 text-right min-w-[85px] whitespace-nowrap tabular-nums ${net >= 0 ? 'text-[#7FD17B]' : 'text-[#F87171]'}`}>
                          {formatRM(net)}
                        </td>
                      );
                    })}
                    <td className={`py-2.5 px-3 text-right text-base whitespace-nowrap tabular-nums ${totalAnnualNetProfit >= 0 ? 'text-[#7FD17B]' : 'text-[#F87171]'}`}>
                      {formatRM(totalAnnualNetProfit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MULTI-YEAR COMPARISON ================= */}
      {activeTab === 'comparison' && (
        <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-xs overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2ECE2] pb-3">
            <h3 className="text-sm font-bold text-[#2D2823]">Historical Cash Flow Comparison</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5EE] border-b border-[#E6E0D3] text-[#5C544C] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4 text-right">Annual Revenue</th>
                  <th className="py-3 px-4 text-right">Annual Outflow</th>
                  <th className="py-3 px-4 text-right">Net Savings</th>
                  <th className="py-3 px-4 text-right">Savings Rate %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE2] font-medium text-[#2D2823]">
                {multiYearSummary.map(row => (
                  <tr key={row.year} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#2D2823] font-mono text-sm">{row.year}</td>
                    <td className="py-3 px-4 text-right font-mono text-[#3D633C] font-bold">{formatRM(row.revenue)}</td>
                    <td className="py-3 px-4 text-right font-mono text-[#B54838] font-bold">{formatRM(row.expense)}</td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${row.netProfit >= 0 ? 'text-[#8F4E1D]' : 'text-[#B54838]'}`}>
                      {formatRM(row.netProfit)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-[#2D2823]">
                      {row.savingsRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: PASSIVE YIELD ACCOUNTS ================= */}
      {activeTab === 'passive' && (
        <div className="space-y-6">
          {/* FIRE Target Goal Banner */}
          <div className="bg-[#2D2823] text-white p-5 rounded-2xl border border-[#4A423A] shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 rounded-xl text-[#E8A87C]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">FIRE Target</h3>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#C2B8AA]">Current Passive Yield:</span>
                  <strong className="text-white font-mono text-sm">{formatRM(monthlyPassiveAvg)}</strong>
                  <span className="text-[#8C8379] font-bold">/</span>
                  <span className="text-[#E8A87C] font-mono font-bold">RM</span>
                  <input
                    type="number"
                    step="50"
                    value={fireTargetMonthly || ''}
                    onChange={e => setFireTargetMonthly(parseFloat(e.target.value) || 0)}
                    className="w-20 px-1 py-0.5 bg-transparent border-b border-[#E8A87C]/60 hover:border-[#E8A87C] focus:border-[#E8A87C] text-[#E8A87C] font-mono text-xs font-bold focus:outline-none transition-colors text-center"
                    placeholder="2000"
                  />
                  <span className="text-[#C2B8AA]">per month</span>
                </div>
                <span className="font-bold text-[#E8A87C] font-mono">
                  {passiveMilestonePercent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-[#1F1B17] rounded-full h-3 overflow-hidden p-0.5 border border-[#4A423A]">
                <div
                  className="bg-linear-to-r from-[#3D633C] to-[#B86B30] h-full rounded-full transition-all duration-700"
                  style={{ width: `${passiveMilestonePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Passive Accounts Grid (Summary Cards linked directly to detailed ledger) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {passiveAccountMetrics.map(({ account, latestPrincipal, latestRate, monthlyEst }) => {
              const { isUs } = checkStockAccountType(account);
              return (
                <div key={account.id} className="bg-white rounded-2xl border border-[#EAE3D6] p-4 shadow-xs space-y-3 relative group hover:border-[#D5CEBF] transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-[#2D2823]">{account.name}</h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-[#3D633C] font-mono bg-[#EEF4EE] px-2 py-1 rounded-lg border border-[#D5E3D5]">
                        {latestRate.toFixed(2)}% p.a.
                      </span>
                      <button
                        onClick={() => deletePassiveAccount(account.id)}
                        className="p-1.5 text-[#8C8379] hover:text-[#B54838] hover:bg-[#FDF2F0] rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F2ECE2] text-xs">
                    <div>
                      <span className="text-[10px] text-[#7A7268] block uppercase font-bold">Principal ({isUs ? 'USD' : 'RM'})</span>
                      <span className="font-mono font-bold text-[#2D2823]">{isUs ? formatUSD(latestPrincipal) : formatRM(latestPrincipal)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7A7268] block uppercase font-bold">Est. Monthly Return</span>
                      <span className="font-mono font-bold text-[#3D633C]">{isUs ? formatUSD(monthlyEst) : formatRM(monthlyEst)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Passive Yield Detailed Matrix Ledger */}
          <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#F2ECE2] bg-[#FAF8F5] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8F4E1D]" />
                <h3 className="text-xs font-extrabold text-[#2D2823] tracking-tight uppercase">
                  Passive Income Ledger ({selectedYear})
                </h3>
              </div>

              <button
                type="button"
                onClick={handleAddDirectPassiveAccount}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8F4E1D] hover:bg-[#783F16] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Account</span>
              </button>
            </div>

            <div className="overflow-x-auto no-scrollbar touch-scroll">
              <div className="divide-y-2 divide-[#EAE3D6]">
                {passiveAccounts.map((account) => {
                  const rowSum = months.reduce((sum, m) => sum + getPassiveMonthData(account, selectedYear, m).returns, 0);
                  const { isMy, isUs } = checkStockAccountType(account);
                  const isDragging = draggedPassiveId === account.id;
                  const isDragOver = dragOverPassiveId === account.id;

                  return (
                    <div
                      key={account.id}
                      draggable
                      onDragStart={e => handlePassiveDragStart(e, account.id)}
                      onDragOver={e => handlePassiveDragOver(e, account.id)}
                      onDrop={e => handlePassiveDrop(e, account.id)}
                      onDragEnd={() => {
                        setDraggedPassiveId(null);
                        setDragOverPassiveId(null);
                      }}
                      className={`p-3 space-y-2 transition-all group ${
                        isDragging
                          ? 'opacity-40 bg-[#FAF7F2]'
                          : isDragOver
                          ? 'bg-[#FAF2EC] border-t-2 border-[#8F4E1D]'
                          : 'hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Hidden/Subtle Drag Handle */}
                          <div
                            className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-[#C2B8AA] hover:text-[#8F4E1D] opacity-40 group-hover:opacity-100 transition-opacity"
                            title="Click and drag to reorder"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={account.name}
                            onChange={e => updatePassiveAccount(account.id, { name: e.target.value })}
                            className="font-bold text-sm text-[#2D2823] bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-[#E2DAD0] focus:border-[#8F4E1D] rounded-md px-2 py-0.5 focus:outline-none transition-all"
                          />
                          {isMy && (
                            <span
                              className="text-[10px] font-bold text-[#8F4E1D] bg-[#FAF0E6] px-2 py-0.5 rounded border border-[#EAD7C5] tracking-tight"
                              title={`Principal auto-flows from Active MY Stock Portfolio (${formatRM(activeMyStockPrincipal)})`}
                            >
                              Auto: MY Stock Portfolio
                            </span>
                          )}
                          {isUs && (
                            <span
                              className="text-[10px] font-bold text-[#3D633C] bg-[#EEF4EE] px-2 py-0.5 rounded border border-[#D5E3D5] tracking-tight"
                              title={`Principal auto-flows from Active US / Overseas Stock Portfolio (${formatUSD(activeUsStockPrincipal)})`}
                            >
                              Auto: US Stock Portfolio
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#3D633C] font-mono">
                            Annual Yield: {isUs ? formatUSD(rowSum) : formatRM(rowSum)}
                          </span>
                          <button
                            type="button"
                            onClick={() => deletePassiveAccount(account.id)}
                            className="text-[#8C8379] hover:text-[#B54838] p-1.5 rounded-lg hover:bg-[#FDF2F0] transition-colors cursor-pointer"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto no-scrollbar touch-scroll relative">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="sticky top-0 z-20 bg-[#FAF8F5]">
                            <tr className="text-[#7A7268] font-bold uppercase text-[9px] border-b border-[#F2ECE2]">
                              <th className="py-1 px-2 w-32 min-w-[140px] sticky left-0 top-0 z-30 bg-[#FAF8F5] border-r border-[#F2ECE2] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">Metric</th>
                              {months.map(m => (
                                <th key={m} className="py-1 px-1.5 text-right min-w-[85px]">{m}</th>
                              ))}
                              <th className="py-1 px-2 text-right min-w-[110px] whitespace-nowrap bg-[#FAF8F5]">Total / Dec</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F2ECE2]">
                            {/* Row 1: Principal */}
                            <tr>
                              <td className="py-1 px-2 font-bold text-[#5C544C] whitespace-nowrap sticky left-0 z-10 bg-white border-r border-[#F2ECE2] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                                Principal ({isUs ? 'USD' : 'RM'})
                              </td>
                              {months.map(m => {
                                const val = getPassiveMonthData(account, selectedYear, m).principal;
                                return (
                                  <td key={m} className="py-0.5 px-1 text-right font-mono min-w-[85px]">
                                    <input
                                      type="number"
                                      step="any"
                                      value={val || 0}
                                      onChange={e => {
                                        const v = parseFloat(e.target.value) || 0;
                                        updatePassiveAccountMonthData(account.id, selectedYear, m, 'principal', v);
                                      }}
                                      className="w-full text-right py-1 px-1.5 text-xs bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-[#E2DAD0] focus:border-[#8F4E1D] rounded-lg focus:outline-none transition-all font-mono tabular-nums text-[#2D2823]"
                                    />
                                  </td>
                                );
                              })}
                              <td className="py-1 px-2 text-right font-mono font-bold text-[#2D2823] whitespace-nowrap tabular-nums">
                                {isUs
                                  ? formatUSD(getPassiveMonthData(account, selectedYear, 'Dec').principal)
                                  : formatRM(getPassiveMonthData(account, selectedYear, 'Dec').principal)}
                              </td>
                            </tr>
                            {/* Row 2: Rate */}
                            <tr>
                              <td className="py-1 px-2 font-bold text-[#5C544C] whitespace-nowrap sticky left-0 z-10 bg-white border-r border-[#F2ECE2] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                                Rate (% p.a.)
                                {(isMy || isUs) && (
                                  <span className="ml-1 text-[9px] text-[#3D633C] font-normal" title="Auto-calculated from Month Dividend ÷ Principal">
                                    (auto)
                                  </span>
                                )}
                              </td>
                              {months.map(m => {
                                const monthData = getPassiveMonthData(account, selectedYear, m);
                                const isAuto = Boolean(monthData.isStockAutoLinked);
                                return (
                                  <td key={m} className="py-0.5 px-1 text-right font-mono min-w-[85px]">
                                    <input
                                      type="number"
                                      step="any"
                                      value={monthData.rate || 0}
                                      readOnly={isAuto}
                                      onChange={e => {
                                        if (isAuto) return;
                                        const v = parseFloat(e.target.value) || 0;
                                        updatePassiveAccountMonthData(account.id, selectedYear, m, 'rate', v);
                                      }}
                                      title={
                                        isAuto
                                          ? `Auto-calculated: (${isUs ? formatUSD(monthData.returns) : formatRM(monthData.returns)} ÷ ${isUs ? formatUSD(monthData.principal) : formatRM(monthData.principal)}) × 100 = ${monthData.rate}%`
                                          : undefined
                                      }
                                      className={`w-full text-right py-1 px-1.5 text-xs rounded-lg focus:outline-none transition-all font-mono font-bold tabular-nums text-[#3D633C] ${
                                        isAuto
                                          ? 'bg-transparent cursor-default select-all'
                                          : 'bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-[#E2DAD0] focus:border-[#3D633C]'
                                      }`}
                                    />
                                  </td>
                                );
                              })}
                              <td className="py-1 px-2 text-right font-mono font-bold text-[#3D633C] whitespace-nowrap tabular-nums">
                                {(() => {
                                  const latestP = getPassiveMonthData(account, selectedYear, 'Dec').principal || account.principalAmount || 0;
                                  if ((isMy || isUs) && latestP > 0) {
                                    return `${((rowSum / latestP) * 100).toFixed(2)}%`;
                                  }
                                  return `${(months.reduce((sum, m) => sum + getPassiveMonthData(account, selectedYear, m).rate, 0) / 12).toFixed(2)}%`;
                                })()}
                              </td>
                            </tr>
                            {/* Row 3: Dividend */}
                            <tr className="bg-[#EEF4EE]/30">
                              <td className="py-1 px-2 font-bold text-[#3D633C] whitespace-nowrap sticky left-0 z-10 bg-[#FAFDF9] border-r border-[#F2ECE2] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                                Dividend ({isUs ? 'USD' : 'RM'})
                                {(isMy || isUs) && (
                                  <span className="ml-1 text-[9px] text-[#3D633C] font-normal" title="Auto-filled from Dividend Yield Tracker">
                                    (auto)
                                  </span>
                                )}
                              </td>
                              {months.map(m => {
                                const monthData = getPassiveMonthData(account, selectedYear, m);
                                const isAuto = Boolean(monthData.isStockAutoLinked);
                                return (
                                  <td key={m} className="py-0.5 px-1 text-right font-mono min-w-[85px]">
                                    <input
                                      type="number"
                                      step="any"
                                      value={monthData.returns || 0}
                                      readOnly={isAuto}
                                      onChange={e => {
                                        if (isAuto) return;
                                        const v = parseFloat(e.target.value) || 0;
                                        updatePassiveAccountMonthData(account.id, selectedYear, m, 'returns', v);
                                      }}
                                      title={
                                        isAuto
                                          ? `Auto-filled from Dividend Yield Tracker (${isUs ? formatUSD(monthData.returns) : formatRM(monthData.returns)})`
                                          : undefined
                                      }
                                      className={`w-full text-right py-1 px-1.5 text-xs rounded-lg focus:outline-none transition-all font-mono font-bold tabular-nums text-[#3D633C] ${
                                        isAuto
                                          ? 'bg-transparent cursor-default select-all'
                                          : 'bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-[#D5E3D5] focus:border-[#3D633C]'
                                      }`}
                                    />
                                  </td>
                                );
                              })}
                              <td className="py-1 px-2 text-right font-mono font-extrabold text-[#3D633C] whitespace-nowrap tabular-nums">
                                {isUs ? formatUSD(rowSum) : formatRM(rowSum)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Matrix Total Summary Footer */}
              <div className="bg-[#EEF4EE]/70 border-t-2 border-[#D5E3D5] p-3">
                <div className="overflow-x-auto no-scrollbar touch-scroll relative">
                  <table className="w-full text-left text-xs border-collapse font-bold">
                    <tbody>
                      {/* Total Portfolio Principal */}
                      <tr className="text-[#2D2823]">
                        <td className="py-2 px-2 w-36 min-w-[140px] uppercase text-[10px] text-[#8F4E1D] whitespace-nowrap sticky left-0 z-10 bg-[#EEF4EE] border-r border-[#D5E3D5] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                          <div className="flex items-center gap-1.5">
                            <span>Total Principal</span>
                            <button
                              type="button"
                              onClick={() => setShowPrincipalSelectorModal(true)}
                              className="p-1 text-[#8F4E1D] hover:text-[#783F16] hover:bg-[#FAF0E6] rounded-full transition-colors cursor-pointer"
                              title="Click to select which accounts are included in Total Principal"
                              aria-label="Customize Total Principal accounts"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                            {includedPrincipalAccountIds.length < passiveAccounts.length && (
                              <span
                                className="text-[9px] font-bold text-[#8F4E1D] bg-[#FAF0E6] px-1.5 py-0.5 rounded-full border border-[#EAD7C5] cursor-pointer"
                                onClick={() => setShowPrincipalSelectorModal(true)}
                                title="Custom account selection active"
                              >
                                {includedPrincipalAccountIds.length}/{passiveAccounts.length}
                              </span>
                            )}
                          </div>
                        </td>
                        {months.map(m => {
                          const mSum = passiveAccounts
                            .filter(a => includedPrincipalAccountIds.includes(a.id))
                            .reduce((sum, a) => sum + getPassiveMonthData(a, selectedYear, m).principal, 0);
                          return (
                            <td key={m} className="py-1.5 px-1.5 text-right font-mono text-[#2D2823] min-w-[85px] whitespace-nowrap tabular-nums">
                              {mSum > 0 ? formatRM(mSum) : '-'}
                            </td>
                          );
                        })}
                        <td className="py-1.5 px-2 text-right font-mono text-[#8F4E1D] font-extrabold min-w-[110px] whitespace-nowrap tabular-nums">
                          {formatRM(
                            passiveAccounts
                              .filter(a => includedPrincipalAccountIds.includes(a.id))
                              .reduce((sum, a) => sum + getPassiveMonthData(a, selectedYear, 'Dec').principal, 0)
                          )}
                        </td>
                      </tr>
                      {/* Total Monthly Dividend */}
                      <tr className="text-[#3D633C]">
                        <td className="py-1.5 px-2 w-32 min-w-[140px] uppercase text-[10px] text-[#3D633C] whitespace-nowrap sticky left-0 z-10 bg-[#EEF4EE] border-r border-[#D5E3D5] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">Total Dividend Payout</td>
                        {months.map(m => {
                          const mSum = passiveAccounts.reduce((sum, a) => sum + getPassiveMonthData(a, selectedYear, m).returns, 0);
                          return (
                            <td key={m} className="py-1.5 px-1.5 text-right font-mono text-[#3D633C] min-w-[85px] whitespace-nowrap tabular-nums">
                              {mSum > 0 ? formatRM(mSum) : '-'}
                            </td>
                          );
                        })}
                        <td className="py-1.5 px-2 text-right font-mono text-[#3D633C] font-extrabold text-sm min-w-[110px] whitespace-nowrap tabular-nums">
                          {formatRM(
                            passiveAccounts.reduce((sum, a) => {
                              const rSum = months.reduce((acc, m) => acc + getPassiveMonthData(a, selectedYear, m).returns, 0);
                              return sum + rSum;
                            }, 0)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD INFLOW MODAL */}
      {showAddIncomeModal && (
        <div className="fixed inset-0 bg-[#2D2823]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE3D6] p-5 max-w-xs w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D2823]">Add Inflow Stream</h3>
              <button onClick={() => setShowAddIncomeModal(false)} className="text-[#8C8379] hover:text-[#2D2823] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddIncome} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C544C] mb-1">Stream Name</label>
                <input
                  type="text"
                  placeholder="e.g. Freelance Consulting"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2DAD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3D633C] text-[#2D2823]"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddIncomeModal(false)}
                  className="px-3 py-1.5 text-xs font-bold text-[#6B635A] hover:bg-[#EFE8DD] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-[#3D633C] text-white hover:bg-[#315030] rounded-xl shadow-xs"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-[#2D2823]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE3D6] p-5 max-w-xs w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D2823]">Add Expense Item</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-[#8C8379] hover:text-[#2D2823] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C544C] mb-1">Expense Name</label>
                <input
                  type="text"
                  placeholder="e.g. Car Maintenance"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2DAD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B54838] text-[#2D2823]"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-3 py-1.5 text-xs font-bold text-[#6B635A] hover:bg-[#EFE8DD] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-[#B54838] text-white hover:bg-[#9E3E30] rounded-xl shadow-xs"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* TOTAL PRINCIPAL SELECTOR MODAL */}
      {showPrincipalSelectorModal && (
        <div className="fixed inset-0 bg-[#2D2823]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE3D6] p-5 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#EAE3D6] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FAF0E6] text-[#8F4E1D] rounded-xl border border-[#EAD7C5]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2D2823]">Total Principal Inclusion</h3>
                  <p className="text-[11px] text-[#7A7268]">
                    Select which accounts contribute to the Total Principal row for {selectedYear}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPrincipalSelectorModal(false)}
                className="text-[#8C8379] hover:text-[#2D2823] p-1.5 rounded-lg hover:bg-[#EFE8DD] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selection Quick Actions */}
            <div className="flex items-center justify-between gap-2 text-xs pt-1">
              <span className="text-[11px] font-bold text-[#7A7268]">
                {includedPrincipalAccountIds.length} of {passiveAccounts.length} accounts included
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={selectAllPrincipalAccounts}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#3D633C] bg-[#EEF4EE] hover:bg-[#D5E3D5] rounded-lg transition-colors cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={deselectAllPrincipalAccounts}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#8C8379] hover:text-[#2D2823] hover:bg-[#EFE8DD] rounded-lg transition-colors cursor-pointer"
                >
                  Deselect All
                </button>
                <button
                  type="button"
                  onClick={selectAllPrincipalAccounts}
                  className="p-1 text-[#8C8379] hover:text-[#2D2823] hover:bg-[#EFE8DD] rounded-lg transition-colors cursor-pointer"
                  title="Reset Default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Account List */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1 py-1 max-h-[340px]">
              {passiveAccounts.map(account => {
                const isIncluded = includedPrincipalAccountIds.includes(account.id);
                const { isMy, isUs } = checkStockAccountType(account);
                const decPrincipal = getPassiveMonthData(account, selectedYear, 'Dec').principal;

                return (
                  <div
                    key={account.id}
                    onClick={() => toggleIncludeAccount(account.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isIncluded
                        ? 'bg-white border-[#8F4E1D]/40 shadow-xs'
                        : 'bg-[#F5F1EB]/60 border-[#E5DFD5] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                          isIncluded
                            ? 'bg-[#8F4E1D] border-[#8F4E1D] text-white'
                            : 'bg-white border-[#C2B8AA]'
                        }`}
                      >
                        {isIncluded && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-[#2D2823] truncate">
                            {account.name}
                          </span>
                          {isMy && (
                            <span className="text-[9px] font-bold text-[#8F4E1D] bg-[#FAF0E6] px-1.5 py-0.2 rounded border border-[#EAD7C5]">
                              MY Stock
                            </span>
                          )}
                          {isUs && (
                            <span className="text-[9px] font-bold text-[#3D633C] bg-[#EEF4EE] px-1.5 py-0.2 rounded border border-[#D5E3D5]">
                              US Stock
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#8C8379] block">
                          {account.category || 'Passive Yield'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right whitespace-nowrap pl-2">
                      <span className="font-mono font-bold text-xs text-[#2D2823] block">
                        {isUs ? formatUSD(decPrincipal) : formatRM(decPrincipal)}
                      </span>
                      <span className="text-[9px] text-[#8C8379] font-mono">Dec {selectedYear}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Total Principal Footer */}
            <div className="bg-[#FAF0E6] border border-[#EAD7C5] p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F4E1D] font-bold uppercase text-[10px] tracking-wider">
                  Combined Total Principal ({selectedYear} Dec)
                </span>
                <span className="font-mono font-extrabold text-sm text-[#8F4E1D] tabular-nums">
                  {formatRM(
                    passiveAccounts
                      .filter(a => includedPrincipalAccountIds.includes(a.id))
                      .reduce((sum, a) => sum + getPassiveMonthData(a, selectedYear, 'Dec').principal, 0)
                  )}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#EAE3D6]">
              <button
                type="button"
                onClick={() => setShowPrincipalSelectorModal(false)}
                className="w-full py-2 text-xs font-bold bg-[#8F4E1D] hover:bg-[#783F16] text-white rounded-xl transition-all shadow-xs cursor-pointer text-center"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
