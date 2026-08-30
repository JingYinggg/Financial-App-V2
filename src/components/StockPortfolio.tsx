import React, { useState, useMemo, useEffect } from 'react';
import { useWealth } from '../context/WealthContext';
import { StockHolding, RealizedTrade, AnnualStockValuation } from '../types';
import {
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  TrendingUp,
  Layers,
  Calendar,
  X,
  PieChart,
  Edit2,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Check
} from 'lucide-react';
import { YearSelector } from './YearSelector';

interface AggregatedHolding {
  code: string;
  name: string;
  market: 'MY' | 'US' | 'Crypto' | 'Platform';
  currency: 'MYR' | 'USD';
  totalUnits: number;
  totalCost: number;
  avgBuyPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPL: number;
  gainPercent: number;
  lots: StockHolding[];
}

export const StockPortfolio: React.FC = () => {
  const {
    holdings,
    addHolding,
    updateHolding,
    deleteHolding,
    sellHolding,
    realizedTrades,
    addTrade,
    deleteTrade,
    stockValuations,
    addStockValuation,
    updateStockValuation,
    deleteStockValuation,
    dividends
  } = useWealth();

  // Sub-tabs: holdings | realized | valuation
  const [activeSubTab, setActiveSubTab] = useState<'holdings' | 'realized' | 'valuation'>('holdings');
  const [searchQuery, setSearchQuery] = useState('');

  // Holdings Market Filter
  const [holdingMarketFilter, setHoldingMarketFilter] = useState<'ALL' | 'MY' | 'US' | 'Crypto'>('ALL');

  // Realized Trades Filters
  const [realizedMarketFilter, setRealizedMarketFilter] = useState<'ALL' | 'MY' | 'US' | 'Crypto' | 'Platform'>('ALL');
  const [realizedYearFilter, setRealizedYearFilter] = useState<number | 'ALL'>('ALL');

  // Valuation Year Filter
  const [valuationYear, setValuationYear] = useState<number | 'ALL'>(2026);
  const [selectedStockYears, setSelectedStockYears] = useState<Record<string, number>>({});

  // Expanded purchase lots state (by stock code)
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set());

  const toggleExpand = (code: string) => {
    setExpandedCodes(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const expandAllLots = () => {
    const allCodes = new Set(aggregatedHoldings.map(h => h.code));
    setExpandedCodes(allCodes);
  };

  const collapseAllLots = () => {
    setExpandedCodes(new Set());
  };

  // Pre-fill modal for adding lot to an existing holding
  const openAddLotForStock = (code: string, name: string, market: 'MY' | 'US' | 'Crypto' | 'Platform', currPrice: number) => {
    setNewHolding({
      code,
      name,
      buyDate: new Date().toISOString().split('T')[0],
      units: 1000,
      buyUnitPrice: currPrice || 1.0,
      market: market as 'MY' | 'US' | 'Crypto',
      currentPrice: currPrice || 1.0,
    });
    setShowHoldingModal(true);
  };

  // Holding Modal State (Add New Stock / Lot)
  const [showHoldingModal, setShowHoldingModal] = useState(false);
  const [newHolding, setNewHolding] = useState<Omit<StockHolding, 'id'>>({
    code: '',
    name: '',
    buyDate: new Date().toISOString().split('T')[0],
    units: 1000,
    buyUnitPrice: 1.00,
    market: 'MY',
    currentPrice: 1.00,
  });

  // Sell Modal State
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellTarget, setSellTarget] = useState<{
    holdingId?: string;
    code: string;
    name: string;
    availableUnits: number;
    avgBuyPrice: number;
    currentPrice: number;
    market: 'MY' | 'US' | 'Crypto' | 'Platform';
    currency: 'MYR' | 'USD';
    buyDate?: string;
  } | null>(null);

  const [sellForm, setSellForm] = useState({
    unitsToSell: 0,
    sellUnitPrice: 0,
    sellDate: new Date().toISOString().split('T')[0],
    fees: 0,
    notes: '',
  });

  // Add Valuation Modal State
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [newValuation, setNewValuation] = useState<Omit<AnnualStockValuation, 'id'>>({
    year: typeof valuationYear === 'number' ? valuationYear : 2026,
    stockName: '',
    code: '',
    market: 'MY',
    currency: 'MYR',
    startOfYearValue: 0,
    endOfYearValue: 0,
    dividendReceived: 0,
    notes: ''
  });

  // Inline editing for valuations
  const [editingValCell, setEditingValCell] = useState<{ id: string; field: 'start' | 'end' } | null>(null);
  const [valInputNumber, setValInputNumber] = useState<string>('');

  // Formatters
  const formatRM = (num: number) => `RM ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatUSD = (num: number) => `$ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatMoney = (num: number, curr: 'MYR' | 'USD' = 'MYR') => (curr === 'USD' ? formatUSD(num) : formatRM(num));

  // Available Years for Realized Trades
  const realizedYears = useMemo(() => {
    const yearsSet = new Set<number>([2024, 2025, 2026]);
    realizedTrades.forEach(t => {
      const parts = t.sellDate.split('-');
      if (parts.length === 3) {
        const yr = parseInt(parts[0].length === 4 ? parts[0] : parts[2], 10);
        if (!isNaN(yr)) yearsSet.add(yr < 100 ? yr + 2000 : yr);
      }
    });
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [realizedTrades]);

  // Available Years for Valuations
  const valuationYears = useMemo(() => {
    const yearsSet = new Set<number>([2022, 2023, 2024, 2025, 2026]);
    stockValuations.forEach(v => yearsSet.add(v.year));
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [stockValuations]);

  // Aggregate Holdings
  const aggregatedHoldings: AggregatedHolding[] = useMemo(() => {
    const map = new Map<string, AggregatedHolding>();

    holdings.forEach(h => {
      const codeKey = h.code.trim().toUpperCase();
      const currPrice = h.currentPrice ?? h.buyUnitPrice;
      const currency = h.market === 'US' ? 'USD' : 'MYR';

      if (!map.has(codeKey)) {
        map.set(codeKey, {
          code: h.code,
          name: h.name,
          market: h.market,
          currency,
          totalUnits: 0,
          totalCost: 0,
          avgBuyPrice: 0,
          currentPrice: currPrice,
          marketValue: 0,
          unrealizedPL: 0,
          gainPercent: 0,
          lots: [],
        });
      }

      const agg = map.get(codeKey)!;
      agg.lots.push(h);
      agg.totalUnits += h.units;
      agg.totalCost += h.units * h.buyUnitPrice;
    });

    return Array.from(map.values()).map(agg => {
      agg.avgBuyPrice = agg.totalUnits > 0 ? agg.totalCost / agg.totalUnits : 0;
      
      // Sync latest valuation from Annual Valuation Ledger for this stock
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
          agg.marketValue = valAmt;
        } else {
          agg.marketValue = agg.totalUnits * (agg.currentPrice || agg.avgBuyPrice);
        }
      } else {
        agg.marketValue = agg.totalUnits * (agg.currentPrice || agg.avgBuyPrice);
      }

      agg.unrealizedPL = agg.marketValue - agg.totalCost;
      agg.gainPercent = agg.totalCost > 0 ? (agg.unrealizedPL / agg.totalCost) * 100 : 0;
      
      agg.lots.sort((a, b) => {
        const dateA = a.buyDate || '1970-01-01';
        const dateB = b.buyDate || '1970-01-01';
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

      return agg;
    });
  }, [holdings, stockValuations]);

  // Filtered Holdings
  const filteredAggregated = useMemo(() => {
    return aggregatedHoldings.filter(h => {
      const matchMarket = holdingMarketFilter === 'ALL' || h.market === holdingMarketFilter;
      const matchQuery =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMarket && matchQuery;
    });
  }, [aggregatedHoldings, holdingMarketFilter, searchQuery]);

  // Market Totals (Holdings) - Gross Investment (Exact sum from active holdings)
  const totalCostMYR = useMemo(() => {
    return aggregatedHoldings
      .filter(h => h.market === 'MY')
      .reduce((sum, h) => sum + h.totalCost, 0);
  }, [aggregatedHoldings]);

  const totalCostUSD = useMemo(() => {
    return aggregatedHoldings
      .filter(h => h.market === 'US')
      .reduce((sum, h) => sum + h.totalCost, 0);
  }, [aggregatedHoldings]);

  // Latest Valuation Year
  const latestYear = useMemo(() => {
    if (valuationYears.length > 0) return Math.max(...valuationYears);
    return new Date().getFullYear();
  }, [valuationYears]);

  // Total Portfolio Value (MYR & USD) strictly synced from active holdings (which sync from Annual Valuation Ledger latest values)
  const portfolioValueMYR = useMemo(() => {
    return aggregatedHoldings
      .filter(h => h.market === 'MY')
      .reduce((sum, h) => sum + h.marketValue, 0);
  }, [aggregatedHoldings]);

  const portfolioValueUSD = useMemo(() => {
    return aggregatedHoldings
      .filter(h => h.market === 'US')
      .reduce((sum, h) => sum + h.marketValue, 0);
  }, [aggregatedHoldings]);

  const unrealizedMYR = portfolioValueMYR - totalCostMYR;
  const unrealizedMYRPct = totalCostMYR > 0 ? (unrealizedMYR / totalCostMYR) * 100 : 0;

  const unrealizedUSD = portfolioValueUSD - totalCostUSD;
  const unrealizedUSDPct = totalCostUSD > 0 ? (unrealizedUSD / totalCostUSD) * 100 : 0;

  // Filtered Realized Trades
  const filteredTrades = useMemo(() => {
    return realizedTrades
      .filter(t => {
        const matchMarket = realizedMarketFilter === 'ALL' || t.market === realizedMarketFilter;
        const matchQuery =
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.code.toLowerCase().includes(searchQuery.toLowerCase());
        let matchYear = true;
        if (realizedYearFilter !== 'ALL') {
          const yrStr = realizedYearFilter.toString();
          matchYear = t.sellDate.includes(yrStr) || t.sellDate.endsWith(yrStr.slice(-2));
        }
        return matchMarket && matchQuery && matchYear;
      })
      .sort((a, b) => new Date(b.sellDate).getTime() - new Date(a.sellDate).getTime());
  }, [realizedTrades, realizedMarketFilter, searchQuery, realizedYearFilter]);

  // Realized P/L Summary KPIs
  const realizedSummary = useMemo(() => {
    let winMYR = 0;
    let lossMYR = 0;
    let feesMYR = 0;
    let winUSD = 0;
    let lossUSD = 0;
    let feesUSD = 0;

    filteredTrades.forEach(t => {
      const fee = t.fees || 0;
      const net = (t.units * t.sellUnitPrice) - (t.units * t.buyUnitPrice) - fee;
      if (t.currency === 'MYR') {
        feesMYR += fee;
        if (net >= 0) winMYR += net;
        else lossMYR += net;
      } else if (t.currency === 'USD') {
        feesUSD += fee;
        if (net >= 0) winUSD += net;
        else lossUSD += net;
      }
    });

    return {
      winMYR,
      lossMYR,
      feesMYR,
      netMYR: winMYR + lossMYR,
      winUSD,
      lossUSD,
      feesUSD,
      netUSD: winUSD + lossUSD
    };
  }, [filteredTrades]);

  // Helper to get auto-flowed dividend from Dividend Tracker for a stock & year
  const getAutoDividend = (code: string | undefined, name: string, yr: number) => {
    const matchingDiv = dividends.find(
      d =>
        d.year === yr &&
        ((code && d.code && d.code.toUpperCase() === code.toUpperCase()) ||
          (d.stockName && name && (
            d.stockName.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(d.stockName.toLowerCase())
          )))
    );
    if (!matchingDiv) return 0;
    return (Object.values(matchingDiv.monthlyPayouts) as number[]).reduce((sum, p) => sum + (p || 0), 0);
  };

  // Group valuations by stock
  const groupedValuations = useMemo(() => {
    const groups: Record<string, typeof stockValuations> = {};
    stockValuations.forEach(v => {
      const key = v.code || v.stockName;
      if (!groups[key]) groups[key] = [];
      groups[key].push(v);
    });
    Object.values(groups).forEach(arr => arr.sort((a, b) => b.year - a.year));
    return Object.values(groups).sort((a, b) => a[0].stockName.localeCompare(b[0].stockName));
  }, [stockValuations]);

  // Sync global valuationYear to per-stock defaults when it changes
  useEffect(() => {
    if (typeof valuationYear === 'number') {
      const newSelections: Record<string, number> = {};
      groupedValuations.forEach(group => {
        const key = group[0].code || group[0].stockName;
        if (group.some(v => v.year === valuationYear)) {
          newSelections[key] = valuationYear;
        } else {
          newSelections[key] = group[0].year;
        }
      });
      setSelectedStockYears(newSelections);
    }
  }, [valuationYear, groupedValuations]);

  // Filtered Valuations with Live Auto-Flowed Dividends
  const displayedValuations = useMemo(() => {
    return groupedValuations.map(group => {
      const key = group[0].code || group[0].stockName;
      const selectedYear = selectedStockYears[key] || group[0].year;
      const v = group.find(x => x.year === selectedYear) || group[0];
      
      const autoDiv = getAutoDividend(v.code, v.stockName, v.year);
      const div = autoDiv > 0 ? autoDiv : (v.dividendReceived || 0);
      return { ...v, dividendReceived: div };
    });
  }, [groupedValuations, selectedStockYears, dividends]);

  // Summary Metrics for Valuations
  const valuationSummary = useMemo(() => {
    const items = displayedValuations;
    const totalStartMYR = items.filter(i => i.currency === 'MYR').reduce((sum, i) => sum + i.startOfYearValue, 0);
    const totalEndMYR = items.filter(i => i.currency === 'MYR').reduce((sum, i) => sum + i.endOfYearValue, 0);
    const totalDivMYR = items.filter(i => i.currency === 'MYR').reduce((sum, i) => sum + (i.dividendReceived || 0), 0);
    const capitalGainMYR = totalEndMYR - totalStartMYR;
    const capGainPct = totalStartMYR > 0 ? (capitalGainMYR / totalStartMYR) * 100 : 0;
    const divYieldInitialPct = totalStartMYR > 0 ? (totalDivMYR / totalStartMYR) * 100 : 0;
    const divYieldEndPct = totalEndMYR > 0 ? (totalDivMYR / totalEndMYR) * 100 : 0;
    const tsrPct = capGainPct + divYieldInitialPct;

    return {
      totalStartMYR,
      totalEndMYR,
      totalDivMYR,
      capitalGainMYR,
      capGainPct,
      divYieldInitialPct,
      divYieldEndPct,
      tsrPct
    };
  }, [displayedValuations]);

  // Auto-populate active stocks for valuation year
  const handleAutoPopulateValuations = () => {
    const yr = typeof valuationYear === 'number' ? valuationYear : 2026;
    aggregatedHoldings.forEach(agg => {
      const existing = stockValuations.find(
        v => v.year === yr && (v.code === agg.code || v.stockName.toLowerCase() === agg.name.toLowerCase())
      );

      const divTotal = getAutoDividend(agg.code, agg.name, yr);

      if (!existing) {
        addStockValuation({
          year: yr,
          stockName: agg.name,
          code: agg.code,
          market: agg.market,
          currency: agg.currency,
          startOfYearValue: agg.totalCost,
          endOfYearValue: agg.marketValue,
          dividendReceived: divTotal,
          notes: 'Auto-populated from active holdings'
        });
      } else {
        if (divTotal > 0 && existing.dividendReceived !== divTotal) {
          updateStockValuation(existing.id, { dividendReceived: divTotal });
        }
      }
    });
  };

  // Sync all dividends for selected year
  const handleSyncDividendsToValuations = () => {
    const yr = typeof valuationYear === 'number' ? valuationYear : 2026;
    stockValuations
      .filter(v => v.year === yr)
      .forEach(val => {
        const divTotal = getAutoDividend(val.code, val.stockName, yr);
        if (divTotal > 0) {
          updateStockValuation(val.id, { dividendReceived: divTotal });
        }
      });
  };

  // Open Sell Modal
  const openSellDialog = (agg: AggregatedHolding) => {
    setSellTarget({
      code: agg.code,
      name: agg.name,
      availableUnits: agg.totalUnits,
      avgBuyPrice: agg.avgBuyPrice,
      currentPrice: agg.currentPrice,
      market: agg.market,
      currency: agg.currency,
    });
    setSellForm({
      unitsToSell: agg.totalUnits,
      sellUnitPrice: agg.currentPrice,
      sellDate: new Date().toISOString().split('T')[0],
      fees: 0,
      notes: '',
    });
    setShowSellModal(true);
  };

  // Submit Sell
  const handleExecuteSell = () => {
    if (!sellTarget || sellForm.unitsToSell <= 0 || sellForm.unitsToSell > sellTarget.availableUnits) return;

    sellHolding({
      code: sellTarget.code,
      name: sellTarget.name,
      unitsToSell: sellForm.unitsToSell,
      sellUnitPrice: sellForm.sellUnitPrice,
      buyUnitPrice: sellTarget.avgBuyPrice,
      sellDate: sellForm.sellDate,
      currency: sellTarget.currency,
      market: sellTarget.market,
      fees: sellForm.fees,
      notes: sellForm.notes,
    });

    setShowSellModal(false);
    setSellTarget(null);
  };

  // Save Valuation Modal
  const handleSaveNewValuation = () => {
    if (!newValuation.stockName.trim()) return;
    const div = getAutoDividend(newValuation.code, newValuation.stockName, newValuation.year);
    addStockValuation({
      ...newValuation,
      dividendReceived: div > 0 ? div : newValuation.dividendReceived
    });
    setShowValuationModal(false);
    setNewValuation({
      year: typeof valuationYear === 'number' ? valuationYear : 2026,
      stockName: '',
      code: '',
      market: 'MY',
      currency: 'MYR',
      startOfYearValue: 0,
      endOfYearValue: 0,
      dividendReceived: 0,
      notes: ''
    });
  };

  // Save inline valuation
  const handleSaveInlineValuation = (id: string, updatedVal: Partial<AnnualStockValuation>, currentVal: AnnualStockValuation, stockCode: string, name: string) => {
    updateStockValuation(id, updatedVal);

    // If endOfYearValue changed, also update subsequent year's startOfYearValue if it exists to maintain continuous flow
    if (typeof updatedVal.endOfYearValue === 'number') {
      const nextYearVal = stockValuations.find(
        v => ((stockCode && v.code === stockCode) || v.stockName.toLowerCase() === name.toLowerCase()) && v.year === currentVal.year + 1
      );
      if (nextYearVal) {
        updateStockValuation(nextYearVal.id, {
          startOfYearValue: updatedVal.endOfYearValue
        });
      }
    }

    setEditingValCell(null);
  };

  const renderValuationLedger = (code: string | undefined, name: string, market: any, currency: any) => {
    const stockCode = code || '';
    const vals = stockValuations
      .filter(v => (stockCode ? v.code === stockCode : false) || v.stockName.toLowerCase() === name.toLowerCase())
      .sort((a, b) => b.year - a.year);

    const handleAddValuation = () => {
      const currentYear = new Date().getFullYear();
      const existingYears = vals.map(v => v.year);
      let targetYear = currentYear;
      if (existingYears.includes(targetYear)) {
        targetYear = existingYears.length > 0 ? Math.max(...existingYears) + 1 : currentYear;
      }
      
      // Auto-flow: find the latest preceding year to get its end value as initial value
      const preceding = vals.filter(v => v.year < targetYear).sort((a, b) => b.year - a.year)[0];
      const initialVal = preceding ? preceding.endOfYearValue : 0;

      addStockValuation({
        year: targetYear,
        stockName: name,
        code: stockCode,
        market,
        currency,
        startOfYearValue: initialVal,
        endOfYearValue: initialVal,
        dividendReceived: getAutoDividend(stockCode, name, targetYear)
      });
    };

    return (
      <div className="bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] p-4 shadow-xs space-y-3 mt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-[#2D2823] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#B86B30]" />
              <span>Annual Valuation Ledger</span>
            </h4>
          </div>
          <button
            onClick={handleAddValuation}
            className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-[#FAF7F2] text-[#8F4E1D] border border-[#E2DAD0] rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Year</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#EAE3D6] bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5EE] border-b border-[#E6E0D3] text-[#5C544C] font-semibold text-[11px]">
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3 text-right">Initial Value</th>
                <th className="py-2.5 px-3 text-right">End Value</th>
                <th className="py-2.5 px-3 text-right">Div Received</th>
                <th className="py-2.5 px-3 text-center w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE2]">
              {vals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#8C8379]">
                    No annual valuation records logged for this stock yet. Click <strong className="text-[#8F4E1D]">Add Year</strong> to record.
                  </td>
                </tr>
              ) : (
                vals.map(val => {
                  const div = getAutoDividend(val.code, val.stockName, val.year);
                  
                  // Preceding year valuation
                  const prevVal = vals.filter(v => v.year < val.year).sort((a, b) => b.year - a.year)[0];
                  const hasPrev = Boolean(prevVal);
                  // Effective initial value flows from preceding year end of year value
                  const initialVal = hasPrev ? prevVal.endOfYearValue : val.startOfYearValue;

                  const isEditingStart = editingValCell?.id === val.id && editingValCell?.field === 'start';
                  const isEditingEnd = editingValCell?.id === val.id && editingValCell?.field === 'end';

                  return (
                    <tr key={val.id} className="hover:bg-[#FAF8F5] transition-colors">
                      {/* Year without box */}
                      <td className="py-2.5 px-3 font-bold text-[#2D2823] font-mono text-xs align-middle">
                        {val.year}
                      </td>
                      
                      {/* Initial Value Column */}
                      <td className="py-2.5 px-3 text-right font-mono align-middle">
                        {!hasPrev ? (
                          isEditingStart ? (
                            <input
                              type="number"
                              step="0.01"
                              value={valInputNumber}
                              onChange={e => setValInputNumber(e.target.value)}
                              onBlur={() => {
                                const num = parseFloat(valInputNumber) || 0;
                                handleSaveInlineValuation(val.id, { startOfYearValue: num }, val, stockCode, name);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  const num = parseFloat(valInputNumber) || 0;
                                  handleSaveInlineValuation(val.id, { startOfYearValue: num }, val, stockCode, name);
                                }
                                if (e.key === 'Escape') setEditingValCell(null);
                              }}
                              className="w-24 px-1.5 py-0.5 text-right font-mono font-semibold text-xs border border-[#B86B30] rounded bg-white text-[#2D2823] focus:outline-none focus:ring-1 focus:ring-[#B86B30] shadow-xs"
                              autoFocus
                              onFocus={e => e.target.select()}
                            />
                          ) : (
                            <span
                              onClick={() => {
                                setEditingValCell({ id: val.id, field: 'start' });
                                setValInputNumber(val.startOfYearValue === 0 ? '' : String(val.startOfYearValue));
                              }}
                              className="cursor-pointer font-semibold text-[#5C544C] hover:text-[#8F4E1D] hover:bg-[#FAF7F2] rounded px-1.5 py-0.5 transition-colors inline-block"
                              title="Click to edit"
                            >
                              {formatMoney(initialVal, val.currency as any)}
                            </span>
                          )
                        ) : (
                          <span className="font-semibold text-[#7E22CE] font-mono px-1.5 py-0.5 inline-block" title="Auto-flows from preceding year End Value">
                            {formatMoney(initialVal, val.currency as any)}
                          </span>
                        )}
                      </td>

                      {/* End Value Column: Direct click to edit number */}
                      <td className="py-2.5 px-3 text-right font-mono align-middle">
                        {isEditingEnd ? (
                          <input
                            type="number"
                            step="0.01"
                            value={valInputNumber}
                            onChange={e => setValInputNumber(e.target.value)}
                            onBlur={() => {
                              const num = parseFloat(valInputNumber) || 0;
                              handleSaveInlineValuation(val.id, { endOfYearValue: num }, val, stockCode, name);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                const num = parseFloat(valInputNumber) || 0;
                                handleSaveInlineValuation(val.id, { endOfYearValue: num }, val, stockCode, name);
                              }
                              if (e.key === 'Escape') setEditingValCell(null);
                            }}
                            className="w-24 px-1.5 py-0.5 text-right font-mono font-bold text-xs border border-[#B86B30] rounded bg-white text-[#2D2823] focus:outline-none focus:ring-1 focus:ring-[#B86B30] shadow-xs"
                            autoFocus
                            onFocus={e => e.target.select()}
                          />
                        ) : (
                          <span
                            onClick={() => {
                              setEditingValCell({ id: val.id, field: 'end' });
                              setValInputNumber(val.endOfYearValue === 0 ? '' : String(val.endOfYearValue));
                            }}
                            className="cursor-pointer font-bold text-[#2D2823] hover:text-[#8F4E1D] hover:bg-[#FAF7F2] rounded px-1.5 py-0.5 transition-colors inline-block"
                            title="Click to edit"
                          >
                            {formatMoney(val.endOfYearValue, val.currency as any)}
                          </span>
                        )}
                      </td>

                      {/* Div Received Column */}
                      <td className="py-2.5 px-3 text-right font-mono text-[#7E22CE] font-bold align-middle" title="Auto-flows from Dividend Tracker">
                        {formatMoney(div, val.currency as any)}
                      </td>

                      {/* Actions Column */}
                      <td className="py-2.5 px-3 text-center align-middle">
                        <button
                          onClick={() => deleteStockValuation(val.id)}
                          className="p-1 text-[#8C8379] hover:text-[#B54838] hover:bg-[#FDF0EE] rounded transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: SubTab Navigation & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5] p-3 rounded-2xl border border-[#EAE3D6] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('holdings')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeSubTab === 'holdings'
                ? 'bg-[#3D3731] text-[#FAF8F5] shadow-xs'
                : 'text-[#6B635A] hover:text-[#2D2823] hover:bg-[#EFE8DD]'
            }`}
          >
            Active Holdings
          </button>

          <button
            onClick={() => setActiveSubTab('realized')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeSubTab === 'realized'
                ? 'bg-[#3D3731] text-[#FAF8F5] shadow-xs'
                : 'text-[#6B635A] hover:text-[#2D2823] hover:bg-[#EFE8DD]'
            }`}
          >
            Realized P/L
          </button>
        </div>

        {activeSubTab === 'holdings' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setNewHolding({
                  code: '',
                  name: '',
                  buyDate: new Date().toISOString().split('T')[0],
                  units: 1000,
                  buyUnitPrice: 1.00,
                  market: 'MY',
                  currentPrice: 1.00,
                });
                setShowHoldingModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8F4E1D] text-white rounded-xl text-xs font-bold hover:bg-[#733E16] transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stock Holding</span>
            </button>
          </div>
        )}
      </div>

      {/* ----------------- SUB-TAB 1: ACTIVE HOLDINGS ----------------- */}
      {activeSubTab === 'holdings' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider">
                    Total Portfolio Value (MYR)
                  </span>
                  <span className="text-[10px] font-semibold text-[#8C8379]">
                    {latestYear}
                  </span>
                </div>
                <p className="text-xl font-extrabold text-[#7E22CE] font-mono" title="Auto-flowing portfolio value">
                  {formatRM(portfolioValueMYR)}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#F2ECE2] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#8C8379] text-[10px] block">Total Gross Investment</span>
                  <span className="font-bold text-[#5C544C] font-mono text-xs">{formatRM(totalCostMYR)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#8C8379] text-[10px] block">Unrealized P/L</span>
                  <span className={`font-bold font-mono text-xs ${unrealizedMYR >= 0 ? 'text-[#3D633C]' : 'text-[#B54838]'}`}>
                    {unrealizedMYR >= 0 ? '+' : '-'}{formatRM(Math.abs(unrealizedMYR))}
                    <span className="text-[10px] ml-1 font-medium">
                      ({unrealizedMYR >= 0 ? '+' : ''}{unrealizedMYRPct.toFixed(2)}%)
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider">
                    Total Portfolio Value (USD)
                  </span>
                  <span className="text-[10px] font-semibold text-[#8C8379]">
                    {latestYear}
                  </span>
                </div>
                <p className="text-xl font-extrabold text-[#7E22CE] font-mono" title="Auto-flowing portfolio value">
                  {formatUSD(portfolioValueUSD)}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#F2ECE2] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#8C8379] text-[10px] block">Total Gross Investment</span>
                  <span className="font-bold text-[#5C544C] font-mono text-xs">{formatUSD(totalCostUSD)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#8C8379] text-[10px] block">Unrealized P/L</span>
                  <span className={`font-bold font-mono text-xs ${unrealizedUSD >= 0 ? 'text-[#3D633C]' : 'text-[#B54838]'}`}>
                    {unrealizedUSD >= 0 ? '+' : '-'}{formatUSD(Math.abs(unrealizedUSD))}
                    <span className="text-[10px] ml-1 font-medium">
                      ({unrealizedUSD >= 0 ? '+' : ''}{unrealizedUSDPct.toFixed(2)}%)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar & Dropdown Expand Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF8F5] p-3 rounded-2xl border border-[#EAE3D6] shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {(['ALL', 'MY', 'US', 'Crypto'] as const).map(mkt => (
                <button
                  key={mkt}
                  onClick={() => setHoldingMarketFilter(mkt)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    holdingMarketFilter === mkt
                      ? 'bg-[#3D3731] text-[#FAF8F5]'
                      : 'text-[#6B635A] hover:bg-[#EFE8DD]'
                  }`}
                >
                  {mkt === 'ALL' ? 'All Markets' : mkt === 'MY' ? 'Malaysia (MYR)' : mkt === 'US' ? 'Overseas (USD)' : 'Crypto'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-[#EFE8DD] p-1 rounded-xl">
                <button
                  onClick={expandAllLots}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#5C544C] hover:text-[#2D2823] hover:bg-white rounded-lg transition-all"
                  title="Expand all purchase lots dropdowns"
                >
                  Expand All Lots
                </button>
                <button
                  onClick={collapseAllLots}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#5C544C] hover:text-[#2D2823] hover:bg-white rounded-lg transition-all"
                  title="Collapse all purchase lots dropdowns"
                >
                  Collapse
                </button>
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8C8379]" />
                <input
                  type="text"
                  placeholder="Search stock..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E2DAD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B86B30] text-[#2D2823]"
                />
              </div>
            </div>
          </div>

          {/* Holdings Table with Dropdown Purchase Lots */}
          <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-xs overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[65vh] no-scrollbar touch-scroll relative">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-[#F8F5EE] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                  <tr className="border-b border-[#E6E0D3] text-[#5C544C] font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 min-w-[160px] sticky left-0 top-0 z-30 bg-[#F8F5EE] border-r border-[#E6E0D3] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">Stock</th>
                    <th className="py-3 px-4">Market</th>
                    <th className="py-3 px-4 text-right">Units</th>
                    <th className="py-3 px-4 text-right">Avg Cost</th>
                    <th className="py-3 px-4 text-right">Total Cost</th>
                    <th className="py-3 px-4 text-right">Market Value</th>
                    <th className="py-3 px-4 text-right">P/L %</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE2] font-medium text-[#2D2823]">
                  {filteredAggregated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#8C8379]">
                        No stock holdings matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAggregated.map(agg => {
                      const isExpanded = expandedCodes.has(agg.code);
                      return (
                        <React.Fragment key={agg.code}>
                          <tr className="hover:bg-[#FAF8F5] transition-colors">
                            <td className="py-3 px-4 sticky left-0 z-10 bg-white group-hover:bg-[#FAF8F5] border-r border-[#EAE3D6] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(agg.code)}
                                  className="p-1 rounded-md hover:bg-[#EFE8DD] text-[#8C8379] hover:text-[#2D2823] transition-colors"
                                  title={isExpanded ? 'Collapse Purchase Lots' : 'Drop Down All Purchase Lots'}
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-[#8F4E1D]" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                                <div>
                                  <div className="font-bold text-[#2D2823] flex items-center gap-2">
                                    <span>{agg.name}</span>
                                  </div>
                                  <span className="font-mono text-[10px] text-[#8C8379]">{agg.code}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                agg.market === 'MY' ? 'bg-[#EEF4EE] text-[#3D633C]' : 'bg-[#F5EEFD] text-[#7E22CE]'
                              }`}>
                                {agg.market}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-semibold">
                              {agg.totalUnits.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right font-mono">
                              {formatMoney(agg.avgBuyPrice, agg.currency)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-[#2D2823]">
                              {formatMoney(agg.totalCost, agg.currency)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-[#2D2823]">
                              {formatMoney(agg.marketValue, agg.currency)}
                            </td>
                            <td className={`py-3 px-4 text-right font-mono font-bold ${
                              agg.gainPercent >= 0 ? 'text-[#3D633C]' : 'text-[#B54838]'
                            }`}>
                              {agg.gainPercent >= 0 ? '+' : ''}{agg.gainPercent.toFixed(2)}%
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => openAddLotForStock(agg.code, agg.name, agg.market, agg.currentPrice)}
                                  className="p-1 text-[#8F4E1D] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                                  title="Add Purchase Lot for this stock"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => openSellDialog(agg)}
                                  className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#FDF0EE] hover:text-[#B54838] text-[#5C544C] border border-[#E2DAD0] font-bold rounded-lg transition-all text-[11px]"
                                >
                                  Sell
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Inline Dropdown for All Purchase Lots */}
                          {isExpanded && (
                            <tr className="bg-[#FAF8F5] border-y border-[#EAE3D6]">
                              <td colSpan={8} className="p-4">
                                <div className="bg-white rounded-xl border border-[#EAE3D6] p-3.5 shadow-xs space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Layers className="w-4 h-4 text-[#8F4E1D]" />
                                      <h4 className="text-xs font-bold text-[#2D2823]">
                                        All Purchase Lots for {agg.name} ({agg.code})
                                      </h4>
                                      <span className="text-[11px] text-[#8C8379]">
                                        ({agg.lots.length} logged purchase transactions)
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => openAddLotForStock(agg.code, agg.name, agg.market, agg.currentPrice)}
                                      className="flex items-center gap-1 px-2.5 py-1 bg-[#FAF7F2] text-[#8F4E1D] border border-[#E2DAD0] rounded-lg text-xs font-bold hover:bg-[#F5EFE6] transition-all"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>Add Purchase Lot</span>
                                    </button>
                                  </div>

                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-[#F8F5EE] border-b border-[#E6E0D3] text-[#5C544C] font-semibold text-[10px] uppercase">
                                          <th className="py-2 px-3">Lot Buy Date</th>
                                          <th className="py-2 px-3 text-right">Units</th>
                                          <th className="py-2 px-3 text-right">Buy Price</th>
                                          <th className="py-2 px-3 text-right">Total Cost</th>
                                          <th className="py-2 px-3 text-right">Current Value</th>
                                          <th className="py-2 px-3 text-right">P/L</th>
                                          <th className="py-2 px-3 text-center w-20">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-[#F2ECE2]">
                                        {agg.lots.map((lot, idx) => {
                                          const cost = lot.units * lot.buyUnitPrice;
                                          const val = lot.units * (lot.currentPrice || agg.currentPrice);
                                          const pl = val - cost;
                                          const plPct = cost > 0 ? (pl / cost) * 100 : 0;
                                          return (
                                            <tr key={lot.id} className="hover:bg-[#FAF8F5]">
                                              <td className="py-2 px-3 font-mono text-[#5C544C] font-medium">
                                                {lot.buyDate || `Lot #${idx + 1}`}
                                              </td>
                                              <td className="py-2 px-3 text-right font-mono font-semibold text-[#2D2823]">
                                                {lot.units.toLocaleString()}
                                              </td>
                                              <td className="py-2 px-3 text-right font-mono text-[#5C544C]">
                                                {formatMoney(lot.buyUnitPrice, agg.currency)}
                                              </td>
                                              <td className="py-2 px-3 text-right font-mono font-bold text-[#2D2823]">
                                                {formatMoney(cost, agg.currency)}
                                              </td>
                                              <td className="py-2 px-3 text-right font-mono font-bold text-[#2D2823]">
                                                {formatMoney(val, agg.currency)}
                                              </td>
                                              <td className={`py-2 px-3 text-right font-mono font-bold ${
                                                pl >= 0 ? 'text-[#3D633C]' : 'text-[#B54838]'
                                              }`}>
                                                {pl >= 0 ? '+' : ''}{formatMoney(pl, agg.currency)} ({plPct.toFixed(1)}%)
                                              </td>
                                              <td className="py-2 px-3 text-center">
                                                <button
                                                  onClick={() => deleteHolding(lot.id)}
                                                  className="p-1 text-[#8C8379] hover:text-[#B54838] hover:bg-[#FDF0EE] rounded transition-colors"
                                                  title="Delete this purchase lot"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                  {renderValuationLedger(agg.code, agg.name, agg.market, agg.currency)}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: REALIZED P/L ----------------- */}
      {activeSubTab === 'realized' && (
        <div className="space-y-6">
          {/* Filter Bar with Standard YearSelector & Right-Click to Delete */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF8F5] p-3 rounded-2xl border border-[#EAE3D6] shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <YearSelector
                years={realizedYears}
                selectedYear={realizedYearFilter}
                onSelectYear={setRealizedYearFilter}
                showAllOption={true}
                allLabel="All Years"
                label="Year"
                onAddYear={(yr) => setRealizedYearFilter(yr)}
                onDeleteYear={(yr) => {
                  const toDelete = realizedTrades.filter(t => t.sellDate.includes(yr.toString()));
                  toDelete.forEach(t => deleteTrade(t.id));
                  setRealizedYearFilter('ALL');
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {(['ALL', 'MY', 'US', 'Crypto'] as const).map(mkt => (
                  <button
                    key={mkt}
                    onClick={() => setRealizedMarketFilter(mkt)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      realizedMarketFilter === mkt
                        ? 'bg-[#3D3731] text-[#FAF8F5]'
                        : 'text-[#6B635A] hover:bg-[#EFE8DD]'
                    }`}
                  >
                    {mkt}
                  </button>
                ))}
              </div>

              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8C8379]" />
                <input
                  type="text"
                  placeholder="Search trades..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E2DAD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B86B30] text-[#2D2823]"
                />
              </div>
            </div>
          </div>

          {/* Realized P/L KPIs */}
          <div className="space-y-3">
            {/* MYR Row */}
            {(realizedMarketFilter === 'ALL' || realizedMarketFilter === 'MY') && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                    Realized Trades (MYR)
                  </span>
                  <p className="text-lg font-extrabold text-[#8F4E1D] font-mono">
                    {filteredTrades.filter(t => t.currency === 'MYR').length} Trades
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                    Total Gain (MYR)
                  </span>
                  <p className="text-lg font-extrabold text-[#3D633C] font-mono">
                    +{formatRM(realizedSummary.winMYR)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                    Total Loss (MYR)
                  </span>
                  <p className="text-lg font-extrabold text-[#B54838] font-mono">
                    {realizedSummary.lossMYR !== 0
                      ? formatRM(Math.abs(realizedSummary.lossMYR)).replace('RM ', '-RM ')
                      : 'RM 0.00'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                    Admin Fees (MYR)
                  </span>
                  <p className="text-lg font-extrabold text-[#7A7268] font-mono">
                    {formatRM(realizedSummary.feesMYR)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                    Net P/L (MYR)
                  </span>
                  <p className={`text-lg font-extrabold font-mono ${realizedSummary.netMYR >= 0 ? 'text-[#3D633C]' : 'text-[#B54838]'}`}>
                    {realizedSummary.netMYR >= 0 ? '+' : ''}
                    {realizedSummary.netMYR < 0
                      ? formatRM(Math.abs(realizedSummary.netMYR)).replace('RM ', '-RM ')
                      : formatRM(realizedSummary.netMYR)}
                  </p>
                </div>
              </div>
            )}

            {/* USD Row */}
            {(realizedMarketFilter === 'ALL' || realizedMarketFilter === 'US' || realizedMarketFilter === 'Crypto') && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                    Realized Trades (USD)
                  </span>
                  <p className="text-lg font-extrabold text-[#8F4E1D] font-mono">
                    {filteredTrades.filter(t => t.currency === 'USD').length} Trades
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                    Total Gain (USD)
                  </span>
                  <p className="text-lg font-extrabold text-[#3D633C] font-mono">
                    +{formatUSD(realizedSummary.winUSD)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                    Total Loss (USD)
                  </span>
                  <p className="text-lg font-extrabold text-[#B54838] font-mono">
                    {realizedSummary.lossUSD !== 0
                      ? formatUSD(Math.abs(realizedSummary.lossUSD)).replace('$ ', '-$ ')
                      : '$ 0.00'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                    Admin Fees (USD)
                  </span>
                  <p className="text-lg font-extrabold text-[#7A7268] font-mono">
                    {formatUSD(realizedSummary.feesUSD)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                    Net P/L (USD)
                  </span>
                  <p className={`text-lg font-extrabold font-mono ${realizedSummary.netUSD >= 0 ? 'text-[#3D633C]' : 'text-[#B54838]'}`}>
                    {realizedSummary.netUSD >= 0 ? '+' : ''}
                    {realizedSummary.netUSD < 0
                      ? formatUSD(Math.abs(realizedSummary.netUSD)).replace('$ ', '-$ ')
                      : formatUSD(realizedSummary.netUSD)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Realized Trades Table */}
          <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-xs overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[65vh] no-scrollbar touch-scroll relative">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-[#F8F5EE] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                  <tr className="border-b border-[#E6E0D3] text-[#5C544C] font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 min-w-[160px] sticky left-0 top-0 z-30 bg-[#F8F5EE] border-r border-[#E6E0D3] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">Asset</th>
                    <th className="py-3 px-4">Market</th>
                    <th className="py-3 px-4">Buy Date</th>
                    <th className="py-3 px-4">Sell Date</th>
                    <th className="py-3 px-4 text-right">Units</th>
                    <th className="py-3 px-4 text-right">Buy Price</th>
                    <th className="py-3 px-4 text-right">Sell Price</th>
                    <th className="py-3 px-4 text-right">Admin Fee</th>
                    <th className="py-3 px-4 text-right">Net Gain / Loss</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE2] font-medium text-[#2D2823]">
                  {filteredTrades.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-[#8C8379]">
                        No realized trades matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTrades.map(trade => {
                      const totalBuy = trade.units * trade.buyUnitPrice;
                      const totalSell = trade.units * trade.sellUnitPrice;
                      const fee = trade.fees || 0;
                      const netGain = totalSell - totalBuy - fee;
                      const roi = totalBuy > 0 ? (netGain / totalBuy) * 100 : 0;
                      const isExpanded = expandedCodes.has(trade.id);

                      return (
                        <React.Fragment key={trade.id}>
                          <tr className="hover:bg-[#FAF8F5] transition-colors group">
                            <td className="py-2.5 px-4 sticky left-0 z-10 bg-white group-hover:bg-[#FAF8F5] border-r border-[#EAE3D6] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(trade.id)}
                                  className="p-1 rounded-md hover:bg-[#EFE8DD] text-[#8C8379] hover:text-[#2D2823] transition-colors"
                                  title={isExpanded ? 'Collapse' : 'Expand'}
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-[#8F4E1D]" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                                <div>
                                  <div className="font-bold text-[#2D2823]">{trade.name}</div>
                                  <span className="font-mono text-[10px] text-[#8C8379]">{trade.code}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-4">
                              <span className="px-2 py-0.5 bg-[#EFE8DD] text-[#5C544C] rounded text-[10px] font-bold">
                                {trade.market}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-[#5C544C] font-mono text-[11px]">{trade.buyDate}</td>
                            <td className="py-2.5 px-4 text-[#2D2823] font-mono text-[11px] font-semibold">{trade.sellDate}</td>
                            <td className="py-2.5 px-4 text-right font-mono">{trade.units.toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-right font-mono">{formatMoney(trade.buyUnitPrice, trade.currency)}</td>
                            <td className="py-2.5 px-4 text-right font-mono">{formatMoney(trade.sellUnitPrice, trade.currency)}</td>
                            <td className="py-2.5 px-4 text-right font-mono text-[#7A7268]">
                              {formatMoney(fee, trade.currency)}
                            </td>
                            <td className={`py-2.5 px-4 text-right font-mono font-bold ${
                              netGain >= 0 ? 'text-[#3D633C]' : 'text-[#B54838]'
                            }`}>
                              <div>{formatMoney(netGain, trade.currency)}</div>
                              <span className="text-[10px] font-normal">({roi >= 0 ? '+' : ''}{roi.toFixed(2)}%)</span>
                            </td>
                            <td className="py-2.5 px-4 text-[11px] text-[#7A7268] max-w-xs truncate">{trade.notes || '-'}</td>
                            <td className="py-2.5 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => deleteTrade(trade.id)}
                                className="text-[#8C8379] hover:text-[#B54838] p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-[#FAF8F5] border-y border-[#EAE3D6]">
                              <td colSpan={11} className="p-4">
                                {renderValuationLedger(trade.code, trade.name, trade.market, trade.currency)}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Holding Modal */}
      {showHoldingModal && (
        <div className="fixed inset-0 bg-[#2D2823]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE3D6] max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D2823]">Add Stock Holding / Lot</h3>
              <button
                onClick={() => setShowHoldingModal(false)}
                className="text-[#8C8379] hover:text-[#2D2823]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newHolding.name || newHolding.units <= 0) return;
                addHolding(newHolding);
                setShowHoldingModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#5C544C] block mb-1">Stock Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MAYBANK, APPLE"
                    value={newHolding.name}
                    onChange={e => setNewHolding({ ...newHolding, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#5C544C] block mb-1">Code / Ticker</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1155, AAPL"
                    value={newHolding.code}
                    onChange={e => setNewHolding({ ...newHolding, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#5C544C] block mb-1">Market</label>
                  <select
                    value={newHolding.market}
                    onChange={e => setNewHolding({ ...newHolding, market: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none"
                  >
                    <option value="MY">Malaysia (MYR)</option>
                    <option value="US">US / Global (USD)</option>
                    <option value="Crypto">Crypto (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#5C544C] block mb-1">Buy Date</label>
                  <input
                    type="date"
                    required
                    value={newHolding.buyDate}
                    onChange={e => setNewHolding({ ...newHolding, buyDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#5C544C] block mb-1">Units (Quantity)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newHolding.units}
                    onChange={e => setNewHolding({ ...newHolding, units: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#5C544C] block mb-1">Buy Price Per Unit</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={newHolding.buyUnitPrice}
                    onChange={e => setNewHolding({ ...newHolding, buyUnitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#5C544C] block mb-1">Current Unit Price (Market)</label>
                <input
                  type="number"
                  step="0.001"
                  value={newHolding.currentPrice}
                  onChange={e => setNewHolding({ ...newHolding, currentPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHoldingModal(false)}
                  className="px-4 py-2 rounded-xl text-[#6B635A] hover:bg-[#EFE8DD] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8F4E1D] text-white font-bold shadow-xs hover:bg-[#733E16]"
                >
                  Save Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && sellTarget && (
        <div className="fixed inset-0 bg-[#2D2823]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE3D6] max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D2823]">
                Sell Holding: {sellTarget.name} ({sellTarget.code})
              </h3>
              <button
                onClick={() => setShowSellModal(false)}
                className="text-[#8C8379] hover:text-[#2D2823]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE3D6] text-xs text-[#5C544C] space-y-1">
              <div className="flex justify-between">
                <span>Available Units:</span>
                <span className="font-bold font-mono text-[#2D2823]">{sellTarget.availableUnits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Buy Price:</span>
                <span className="font-bold font-mono text-[#2D2823]">{formatMoney(sellTarget.avgBuyPrice, sellTarget.currency)}</span>
              </div>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleExecuteSell();
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#5C544C] block mb-1">Units to Sell</label>
                  <input
                    type="number"
                    max={sellTarget.availableUnits}
                    min={1}
                    required
                    value={sellForm.unitsToSell}
                    onChange={e => setSellForm({ ...sellForm, unitsToSell: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#5C544C] block mb-1">Sell Price Per Unit</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={sellForm.sellUnitPrice}
                    onChange={e => setSellForm({ ...sellForm, sellUnitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#5C544C] block mb-1">Sell Date</label>
                  <input
                    type="date"
                    required
                    value={sellForm.sellDate}
                    onChange={e => setSellForm({ ...sellForm, sellDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#5C544C] block mb-1">Brokerage / Fees</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sellForm.fees}
                    onChange={e => setSellForm({ ...sellForm, fees: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#5C544C] block mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Taking profit, rebalancing"
                  value={sellForm.notes}
                  onChange={e => setSellForm({ ...sellForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E2DAD0] rounded-xl text-[#2D2823] focus:ring-2 focus:ring-[#B86B30] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSellModal(false)}
                  className="px-4 py-2 rounded-xl text-[#6B635A] hover:bg-[#EFE8DD] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B54838] text-white font-bold shadow-xs hover:bg-[#9E3E30]"
                >
                  Confirm Sell
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

