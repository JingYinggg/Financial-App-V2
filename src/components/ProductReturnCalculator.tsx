import React, { useState, useMemo, useEffect } from 'react';
import { useWealth } from '../context/WealthContext';
import { ProductReturnItem, PayoutFrequency, CalculatorScenario } from '../types';
import {
  Calculator,
  Plus,
  Trash2,
  TrendingUp,
  Percent,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Sliders,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  Info,
  ShieldCheck,
  Flame,
  Scale,
  RefreshCw,
  Coins,
  Wallet,
  ArrowUpRight,
  Split,
  Eye,
  SlidersHorizontal,
  Bookmark,
  GitCompare,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

// Preset Strategies based on Malaysian & Global Market Standards
const PRESET_STRATEGIES: { [key: string]: { name: string; description: string; products: ProductReturnItem[] } } = {
  malaysian_core: {
    name: '🇲🇾 Malaysian High-Yield & EPF Mix',
    description: 'Balanced low-risk core focusing on ASNB, EPF, Versa Money Market, and Dividend REITs.',
    products: [
      {
        id: 'p_1',
        name: 'Product A - ASNB (ASM / ASB Fixed Price)',
        category: 'Fixed Yield',
        capitalAmount: 40000,
        weightPercent: 40,
        returnRatePercent: 5.25,
        payoutFrequency: 'annual',
        monthlyContribution: 500,
        color: '#4f46e5',
        notes: 'Capital protected fixed-price unit trust with historical 4.5% - 5.5% annual dividend payout.',
      },
      {
        id: 'p_2',
        name: 'Product B - EPF (Account 1 & 2 / i-Saraan)',
        category: 'Retirement',
        capitalAmount: 30000,
        weightPercent: 30,
        returnRatePercent: 5.50,
        payoutFrequency: 'annual',
        monthlyContribution: 800,
        color: '#059669',
        notes: 'Statutory retirement fund with guaranteed minimum 2.5% dividend, averaging 5.3% - 6.0% p.a.',
      },
      {
        id: 'p_3',
        name: 'Product C - High Dividend REITs & Bluechips',
        category: 'Equities / Stocks',
        capitalAmount: 20000,
        weightPercent: 20,
        returnRatePercent: 6.50,
        payoutFrequency: 'quarterly',
        monthlyContribution: 300,
        color: '#d97706',
        notes: 'Commercial/Retail REITs (KLCC, Sunway, Pavilion) distributing 90%+ taxable income as dividends.',
      },
      {
        id: 'p_4',
        name: 'Product D - Versa Cash / GXBank Reserve',
        category: 'Cash / MMF',
        capitalAmount: 10000,
        weightPercent: 10,
        returnRatePercent: 3.80,
        payoutFrequency: 'monthly',
        monthlyContribution: 200,
        color: '#0284c7',
        notes: 'Money market fund with daily liquidity and monthly compounding payout.',
      },
    ],
  },
  balanced_growth: {
    name: '📈 Balanced 60/40 Growth & Income',
    description: '60% Global Growth equities combined with 40% reliable fixed-income cash flow.',
    products: [
      {
        id: 'p_1',
        name: 'Product A - S&P 500 / Global Index ETF',
        category: 'Equities / Stocks',
        capitalAmount: 40000,
        weightPercent: 40,
        returnRatePercent: 10.0,
        payoutFrequency: 'annual',
        monthlyContribution: 1000,
        color: '#6366f1',
        notes: 'Broad market US & Global ETF targeting 8% - 10% long-term compounded total return.',
      },
      {
        id: 'p_2',
        name: 'Product B - Malaysian Dividend Stocks & REITs',
        category: 'Equities / Stocks',
        capitalAmount: 20000,
        weightPercent: 20,
        returnRatePercent: 6.20,
        payoutFrequency: 'quarterly',
        monthlyContribution: 300,
        color: '#10b981',
        notes: 'High dividend cash flow yield from bluechips (Maybank, Public Bank, IGB REIT).',
      },
      {
        id: 'p_3',
        name: 'Product C - ASNB / PRS Retirement Scheme',
        category: 'Fixed Yield',
        capitalAmount: 25000,
        weightPercent: 25,
        returnRatePercent: 5.30,
        payoutFrequency: 'annual',
        monthlyContribution: 500,
        color: '#f59e0b',
        notes: 'Stable fixed unit price with tax relief and defensive compounding.',
      },
      {
        id: 'p_4',
        name: 'Product D - Digital Bank & Liquid Cash',
        category: 'Cash / MMF',
        capitalAmount: 15000,
        weightPercent: 15,
        returnRatePercent: 3.60,
        payoutFrequency: 'monthly',
        monthlyContribution: 200,
        color: '#06b6d4',
        notes: 'Daily interest digital bank savings account & emergency buffer.',
      },
    ],
  },
  passive_cashflow: {
    name: '💰 Pure Passive Income & Cash Flow Generator',
    description: 'Maximized for regular passive cash payouts to fund living expenses.',
    products: [
      {
        id: 'p_1',
        name: 'Product A - Top Tier Malaysian REITs',
        category: 'Equities / Stocks',
        capitalAmount: 45000,
        weightPercent: 45,
        returnRatePercent: 6.80,
        payoutFrequency: 'quarterly',
        monthlyContribution: 500,
        color: '#8b5cf6',
        notes: 'Prime retail and industrial REITs with steady tenant rent distributions.',
      },
      {
        id: 'p_2',
        name: 'Product B - Banking & Utilities High Dividend',
        category: 'Equities / Stocks',
        capitalAmount: 30000,
        weightPercent: 30,
        returnRatePercent: 6.20,
        payoutFrequency: 'semi-annual',
        monthlyContribution: 400,
        color: '#ec4899',
        notes: 'Resilient high cash dividend payers with steady earnings.',
      },
      {
        id: 'p_3',
        name: 'Product C - ASNB ASM 2 / ASM 3',
        category: 'Fixed Yield',
        capitalAmount: 15000,
        weightPercent: 15,
        returnRatePercent: 5.00,
        payoutFrequency: 'annual',
        monthlyContribution: 200,
        color: '#3b82f6',
        notes: 'Zero capital volatility fixed unit trust.',
      },
      {
        id: 'p_4',
        name: 'Product D - Versa Cash+ / StashAway Simple',
        category: 'Cash / MMF',
        capitalAmount: 10000,
        weightPercent: 10,
        returnRatePercent: 4.10,
        payoutFrequency: 'monthly',
        monthlyContribution: 100,
        color: '#14b8a6',
        notes: 'Enhanced money market liquidity with higher yield.',
      },
    ],
  },
  aggressive_compounder: {
    name: '🚀 Aggressive Wealth Compounder',
    description: 'High-growth technology and global equities for aggressive compounding.',
    products: [
      {
        id: 'p_1',
        name: 'Product A - US Tech Leaders & Semiconductor ETF',
        category: 'Equities / Stocks',
        capitalAmount: 50000,
        weightPercent: 50,
        returnRatePercent: 12.50,
        payoutFrequency: 'annual',
        monthlyContribution: 1200,
        color: '#ef4444',
        notes: 'High beta technology innovators driving exponential revenue growth.',
      },
      {
        id: 'p_2',
        name: 'Product B - S&P 500 Core Index',
        category: 'Equities / Stocks',
        capitalAmount: 30000,
        weightPercent: 30,
        returnRatePercent: 9.50,
        payoutFrequency: 'annual',
        monthlyContribution: 600,
        color: '#f97316',
        notes: 'Large-cap baseline equity exposure.',
      },
      {
        id: 'p_3',
        name: 'Product C - Asian Growth & Emerging Markets',
        category: 'Equities / Stocks',
        capitalAmount: 10000,
        weightPercent: 10,
        returnRatePercent: 8.50,
        payoutFrequency: 'annual',
        monthlyContribution: 200,
        color: '#eab308',
        notes: 'High GDP growth economies and consumer markets.',
      },
      {
        id: 'p_4',
        name: 'Product D - Alternative / High-Alpha Assets',
        category: 'Alternative / Crypto',
        capitalAmount: 10000,
        weightPercent: 10,
        returnRatePercent: 15.00,
        payoutFrequency: 'annual',
        monthlyContribution: 200,
        color: '#a855f7',
        notes: 'High-volatility growth assets with asymmetric upside.',
      },
    ],
  },
};

const PALETTE = ['#B86B30', '#3D633C', '#8F4E1D', '#5C544C', '#A8622D', '#2E4F2D', '#7E22CE', '#D97706', '#4A423A', '#6B584C'];

export const ProductReturnCalculator: React.FC = () => {
  const { holdings, passiveAccounts, balanceSheet } = useWealth();

  // Mode: allocate by fixed RM amounts or percentage weights with a total budget
  const [allocationMode, setAllocationMode] = useState<'amount' | 'percentage'>('amount');
  const [totalBudget, setTotalBudget] = useState<number>(100000);
  const [timeHorizonYears, setTimeHorizonYears] = useState<number>(10);
  const [reinvestReturns, setReinvestReturns] = useState<boolean>(true); // Compound vs Cash Payout
  const [inflationRate, setInflationRate] = useState<number>(2.5); // % p.a.
  const [adjustForInflation, setAdjustForInflation] = useState<boolean>(false);
  const [activeViewTab, setActiveViewTab] = useState<'overview' | 'projections' | 'comparison' | 'breakdown'>('overview');

  // Product List
  const [products, setProducts] = useState<ProductReturnItem[]>(PRESET_STRATEGIES.malaysian_core.products);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Saved Scenarios
  const [savedScenarios, setSavedScenarios] = useState<CalculatorScenario[]>([
    {
      id: 'sc_1',
      name: 'Malaysian Core (5.25% p.a.)',
      totalBudget: 100000,
      allocationMode: 'amount',
      timeHorizonYears: 10,
      inflationRate: 2.5,
      reinvestReturns: true,
      products: PRESET_STRATEGIES.malaysian_core.products,
    },
    {
      id: 'sc_2',
      name: 'Balanced 60/40 (7.45% p.a.)',
      totalBudget: 100000,
      allocationMode: 'amount',
      timeHorizonYears: 10,
      inflationRate: 2.5,
      reinvestReturns: true,
      products: PRESET_STRATEGIES.balanced_growth.products,
    },
  ]);
  const [compareScenarioId, setCompareScenarioId] = useState<string>('sc_2');

  // Sync weights or amounts depending on mode
  const totalInvestedCapital = useMemo(() => {
    if (allocationMode === 'amount') {
      return products.reduce((sum, p) => sum + (Number(p.capitalAmount) || 0), 0);
    }
    return totalBudget;
  }, [products, allocationMode, totalBudget]);

  // If in percentage mode, compute effective capital for each product; if amount mode, compute weight
  const processedProducts = useMemo(() => {
    const totalCap = totalInvestedCapital > 0 ? totalInvestedCapital : 1;
    return products.map((p, idx) => {
      let cap = Number(p.capitalAmount) || 0;
      let weight = Number(p.weightPercent) || 0;

      if (allocationMode === 'percentage') {
        cap = (totalBudget * (weight / 100));
      } else {
        weight = totalInvestedCapital > 0 ? (cap / totalInvestedCapital) * 100 : 0;
      }

      const rate = Number(p.returnRatePercent) || 0;
      const annualReturn = (cap * rate) / 100;
      const monthlyReturn = annualReturn / 12;
      const dailyReturn = annualReturn / 365;

      return {
        ...p,
        effectiveCapital: cap,
        effectiveWeight: weight,
        annualReturn,
        monthlyReturn,
        dailyReturn,
        color: p.color || PALETTE[idx % PALETTE.length],
      };
    });
  }, [products, allocationMode, totalBudget, totalInvestedCapital]);

  // Total Portfolio Sums ("Add Up")
  const totalAnnualReturn = useMemo(() => {
    return processedProducts.reduce((sum, p) => sum + p.annualReturn, 0);
  }, [processedProducts]);

  const totalMonthlyReturn = totalAnnualReturn / 12;
  const totalDailyReturn = totalAnnualReturn / 365;
  const totalMonthlyDCA = useMemo(() => {
    return processedProducts.reduce((sum, p) => sum + (Number(p.monthlyContribution) || 0), 0);
  }, [processedProducts]);

  const blendedWeightedYield = useMemo(() => {
    if (totalInvestedCapital <= 0) return 0;
    return (totalAnnualReturn / totalInvestedCapital) * 100;
  }, [totalAnnualReturn, totalInvestedCapital]);

  const realBlendedYield = blendedWeightedYield - (adjustForInflation ? inflationRate : 0);

  // Auto-rebalance weights to sum 100%
  const handleNormalizeWeights = () => {
    const currentSum = products.reduce((sum, p) => sum + (Number(p.weightPercent) || 0), 0);
    if (currentSum === 0) return;
    const normalized = products.map(p => ({
      ...p,
      weightPercent: parseFloat(((Number(p.weightPercent) / currentSum) * 100).toFixed(2)),
    }));
    setProducts(normalized);
  };

  // Equal weight distribution
  const handleEqualWeight = () => {
    if (products.length === 0) return;
    const equalShare = parseFloat((100 / products.length).toFixed(2));
    const updated = products.map((p, idx) => ({
      ...p,
      weightPercent: idx === products.length - 1 ? 100 - equalShare * (products.length - 1) : equalShare,
      capitalAmount: allocationMode === 'amount' ? totalInvestedCapital / products.length : p.capitalAmount,
    }));
    setProducts(updated);
  };

  // Add Product
  const handleAddProduct = () => {
    const char = String.fromCharCode(65 + products.length);
    const newProd: ProductReturnItem = {
      id: `p_${Date.now()}`,
      name: `Product ${char} - New Investment`,
      category: 'Fixed Yield',
      capitalAmount: 10000,
      weightPercent: 10,
      returnRatePercent: 5.0,
      payoutFrequency: 'annual',
      monthlyContribution: 0,
      color: PALETTE[products.length % PALETTE.length],
      notes: 'Custom product parameters',
    };
    setProducts([...products, newProd]);
  };

  // Remove Product
  const handleRemoveProduct = (id: string) => {
    if (products.length <= 1) return;
    setProducts(products.filter(p => p.id !== id));
  };

  // Update single product field
  const handleUpdateProduct = (id: string, field: keyof ProductReturnItem, val: any) => {
    setProducts(
      products.map(p => {
        if (p.id === id) {
          return { ...p, [field]: val };
        }
        return p;
      })
    );
  };

  // Import directly from user's live portfolio
  const handleImportFromLivePortfolio = () => {
    const imported: ProductReturnItem[] = [];

    // 1. Passive accounts (ASNB, Versa, Digital Bank)
    passiveAccounts.forEach((acc, idx) => {
      imported.push({
        id: `imp_pass_${acc.id}`,
        name: `Product ${String.fromCharCode(65 + imported.length)} - ${acc.name} (${acc.category})`,
        category: acc.category === 'ASNB' ? 'Fixed Yield' : acc.category === 'Money Market' ? 'Cash / MMF' : 'Fixed Yield',
        capitalAmount: acc.principalAmount,
        weightPercent: 0,
        returnRatePercent: acc.annualInterestRate,
        payoutFrequency: 'annual',
        monthlyContribution: 300,
        color: PALETTE[imported.length % PALETTE.length],
        notes: `Imported from Live Wealth Passive Accounts`,
      });
    });

    // 2. Stock Portfolio total
    const totalStockVal = holdings.reduce(
      (sum, h) => sum + h.units * (h.currentPrice || h.buyUnitPrice),
      0
    );
    if (totalStockVal > 0) {
      imported.push({
        id: `imp_stock_${Date.now()}`,
        name: `Product ${String.fromCharCode(65 + imported.length)} - Equities & Stock Portfolio`,
        category: 'Equities / Stocks',
        capitalAmount: totalStockVal,
        weightPercent: 0,
        returnRatePercent: 7.5,
        payoutFrequency: 'quarterly',
        monthlyContribution: 500,
        color: '#6366f1',
        notes: `Imported from ${holdings.length} live stock holdings`,
      });
    }

    if (imported.length > 0) {
      const sumCap = imported.reduce((s, i) => s + i.capitalAmount, 0);
      const withWeights = imported.map(i => ({
        ...i,
        weightPercent: parseFloat(((i.capitalAmount / sumCap) * 100).toFixed(2)),
      }));
      setProducts(withWeights);
      setTotalBudget(sumCap);
      setAllocationMode('amount');
    }
  };

  // Multi-Year Compounding Projection Generator
  const projectionTimeline = useMemo(() => {
    const timeline = [];
    let currentBalance = totalInvestedCapital;
    let totalInvestedPrincipal = totalInvestedCapital;
    const effectiveAnnualRate = (adjustForInflation ? realBlendedYield : blendedWeightedYield) / 100;
    const annualDCA = totalMonthlyDCA * 12;

    for (let yr = 0; yr <= timeHorizonYears; yr++) {
      if (yr === 0) {
        timeline.push({
          year: `Yr 0 (Now)`,
          yearNum: 0,
          principal: Math.round(totalInvestedPrincipal),
          returns: 0,
          totalValue: Math.round(currentBalance),
          annualPassive: Math.round((currentBalance * (blendedWeightedYield / 100))),
          monthlyPassive: Math.round((currentBalance * (blendedWeightedYield / 100)) / 12),
        });
      } else {
        totalInvestedPrincipal += annualDCA;
        if (reinvestReturns) {
          // Compound: previous balance * (1 + rate) + DCA * (1 + rate/2)
          currentBalance = currentBalance * (1 + effectiveAnnualRate) + annualDCA * (1 + effectiveAnnualRate / 2);
        } else {
          // Cash Payout: Balance only grows by DCA additions; gains are paid out
          currentBalance = currentBalance + annualDCA;
        }

        const cumulativeReturns = Math.max(0, currentBalance - totalInvestedPrincipal);

        timeline.push({
          year: `Yr ${yr}`,
          yearNum: yr,
          principal: Math.round(totalInvestedPrincipal),
          returns: Math.round(cumulativeReturns),
          totalValue: Math.round(currentBalance),
          annualPassive: Math.round((currentBalance * (blendedWeightedYield / 100))),
          monthlyPassive: Math.round((currentBalance * (blendedWeightedYield / 100)) / 12),
        });
      }
    }
    return timeline;
  }, [
    totalInvestedCapital,
    blendedWeightedYield,
    realBlendedYield,
    adjustForInflation,
    totalMonthlyDCA,
    timeHorizonYears,
    reinvestReturns,
  ]);

  // Comparison Scenario computation
  const comparisonScenario = savedScenarios.find(s => s.id === compareScenarioId) || savedScenarios[1];
  const comparisonStats = useMemo(() => {
    if (!comparisonScenario) return null;
    const compCap = comparisonScenario.products.reduce((s, p) => s + (Number(p.capitalAmount) || 0), 0) || totalInvestedCapital;
    const compAnnualReturn = comparisonScenario.products.reduce((s, p) => s + (p.capitalAmount * p.returnRatePercent) / 100, 0);
    const compYield = compCap > 0 ? (compAnnualReturn / compCap) * 100 : 0;
    
    // 10-year projected value
    let futureVal = compCap;
    for (let i = 0; i < timeHorizonYears; i++) {
      futureVal = futureVal * (1 + compYield / 100);
    }

    const currentFutureVal = projectionTimeline[projectionTimeline.length - 1]?.totalValue || totalInvestedCapital;
    const diffFutureVal = currentFutureVal - futureVal;
    const diffAnnualReturn = totalAnnualReturn - compAnnualReturn;

    return {
      name: comparisonScenario.name,
      yield: compYield,
      annualReturn: compAnnualReturn,
      monthlyReturn: compAnnualReturn / 12,
      futureValue: futureVal,
      diffFutureVal,
      diffAnnualReturn,
    };
  }, [comparisonScenario, totalInvestedCapital, timeHorizonYears, projectionTimeline, totalAnnualReturn]);

  // Save current scenario
  const handleSaveCurrentScenario = () => {
    const name = prompt('Enter a name for this allocation strategy:', `Custom Strategy (${blendedWeightedYield.toFixed(2)}%)`);
    if (!name) return;
    const newSc: CalculatorScenario = {
      id: `sc_${Date.now()}`,
      name,
      totalBudget: totalInvestedCapital,
      allocationMode,
      timeHorizonYears,
      inflationRate,
      reinvestReturns,
      products: [...products],
    };
    setSavedScenarios([...savedScenarios, newSc]);
  };

  // Copy summary to clipboard
  const handleCopySummary = () => {
    const text = `
📊 Multi-Product Return & Portfolio Yield Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Total Invested Capital: RM ${totalInvestedCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}
📈 Overall Blended Return Rate: ${blendedWeightedYield.toFixed(2)}% p.a.
💵 Total Annual Cash Yield: RM ${totalAnnualReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
📅 Total Monthly Passive Cash Flow: RM ${totalMonthlyReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
⏱️ Daily Passive Income: RM ${totalDailyReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
🚀 Projected Value in ${timeHorizonYears} Years: RM ${projectionTimeline[projectionTimeline.length - 1]?.totalValue.toLocaleString('en-US')}

📦 Product Allocations:
${processedProducts.map(p => `• ${p.name}: RM ${p.effectiveCapital.toLocaleString()} (${p.effectiveWeight.toFixed(1)}%) @ ${p.returnRatePercent}% p.a. ➔ RM ${p.annualReturn.toLocaleString()}/yr (RM ${p.monthlyReturn.toFixed(2)}/mo)`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated via MY Fortune Wealth Manager
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h1 className="text-base sm:text-lg font-bold text-[#2D2823] flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#8F4E1D]" />
          <span>Product Return Calculator</span>
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleImportFromLivePortfolio}
            className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE2] text-[#8F4E1D] font-bold text-xs border border-[#E2DAD0] transition flex items-center gap-1.5 shadow-2xs"
            title="Import balances and interest rates from your actual accounts"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B86B30]" />
            <span>Import Live Portfolio</span>
          </button>

          <button
            onClick={handleSaveCurrentScenario}
            className="px-3 py-1.5 rounded-xl bg-[#F8F5EE] hover:bg-[#EAE3D6] text-[#5C544C] font-bold text-xs border border-[#E2DAD0] transition flex items-center gap-1.5"
            title="Save scenario for comparison"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#7A7268]" />
            <span>Save Scenario</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-[#2D2823] hover:bg-[#433B34] text-[#FAF8F5] font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            {copiedNotification ? <Check className="w-3.5 h-3.5 text-[#3D633C]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotification ? 'Copied Summary!' : 'Export / Copy'}</span>
          </button>
        </div>
      </div>

      {/* Preset Strategy Selector Pill Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#7A7268] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#B86B30]" />
            <span>Quick Market Benchmark Portfolios:</span>
          </span>
          <span className="text-xs text-[#8C8379]">Click to instantly load portfolio asset allocation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(PRESET_STRATEGIES).map(([key, preset]) => {
            const presetAnnualReturn = preset.products.reduce((s, p) => s + (p.capitalAmount * p.returnRatePercent) / 100, 0);
            const presetCap = preset.products.reduce((s, p) => s + p.capitalAmount, 0);
            const presetYield = (presetAnnualReturn / presetCap) * 100;

            return (
              <button
                key={key}
                onClick={() => {
                  setProducts(preset.products);
                  setTotalBudget(presetCap);
                }}
                className="p-3.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] hover:bg-[#F2ECE2] hover:border-[#DFCFC0] text-left transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2D2823] group-hover:text-[#8F4E1D] truncate">
                    {preset.name}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#2E4F2D] bg-[#EEF4EE] px-2 py-0.5 rounded-md border border-[#D5E4D4]">
                    {presetYield.toFixed(2)}%
                  </span>
                </div>
                <p className="text-[11px] text-[#5C544C] mt-1 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
                <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-[#8C8379] font-semibold">
                  <span>{preset.products.length} Products</span>
                  <span>&bull;</span>
                  <span>RM {presetCap.toLocaleString()} Capital</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Level Summary Cards ("Add Up" Totals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Invested Capital */}
        <div className="bg-white border border-[#EAE3D6] rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7A7268] uppercase tracking-wider">
              Total Invested Capital
            </span>
            <div className="p-2 rounded-xl bg-[#FAF7F2] text-[#8F4E1D] border border-[#E2DAD0]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#2D2823] mt-1.5 font-mono">
            RM {totalInvestedCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#7A7268] mt-2 flex items-center justify-between">
            <span>{products.length} Active Products</span>
            {totalMonthlyDCA > 0 && (
              <span className="text-[#8F4E1D] font-semibold">+RM {totalMonthlyDCA.toLocaleString()}/mo DCA</span>
            )}
          </div>
        </div>

        {/* 2. Blended Portfolio Return Rate */}
        <div className="bg-white border border-[#EAE3D6] rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7A7268] uppercase tracking-wider">
              Blended Portfolio Yield
            </span>
            <div className="p-2 rounded-xl bg-[#EEF4EE] text-[#2E4F2D] border border-[#D5E4D4]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#2E4F2D] mt-1.5 flex items-baseline gap-2 font-mono">
            <span>{blendedWeightedYield.toFixed(2)}%</span>
            <span className="text-xs font-semibold text-[#8C8379]">p.a.</span>
          </div>
          <div className="text-xs text-[#7A7268] mt-2 flex items-center gap-1.5">
            {adjustForInflation ? (
              <span className="text-[#8F4E1D] font-semibold">
                Real Return: {realBlendedYield.toFixed(2)}% (after {inflationRate}% inflation)
              </span>
            ) : (
              <span className="text-[#7A7268]">
                vs FD 3.50% (+{(blendedWeightedYield - 3.5).toFixed(2)}% alpha)
              </span>
            )}
          </div>
        </div>

        {/* 3. Total Annual Cash Return */}
        <div className="bg-white border border-[#EAE3D6] rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7A7268] uppercase tracking-wider">
              Total Annual Return
            </span>
            <div className="p-2 rounded-xl bg-[#FAF7F2] text-[#B86B30] border border-[#E2DAD0]">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#7E22CE] mt-1.5 font-mono">
            RM {totalAnnualReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#7A7268] mt-2 flex items-center justify-between">
            <span>Monthly: <strong className="text-[#2D2823]">RM {totalMonthlyReturn.toFixed(2)}</strong></span>
            <span>Daily: <strong className="text-[#2D2823]">RM {totalDailyReturn.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* 4. Projected Future Value */}
        <div className="bg-[#2D2823] text-[#FAF8F5] rounded-2xl p-5 shadow-xs border border-[#433B34] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#B86B30] uppercase tracking-wider">
              {timeHorizonYears}-Year Projected Wealth
            </span>
            <div className="p-2 rounded-xl bg-white/10 text-[#B86B30]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#74C06A] mt-1.5 font-mono">
            RM {(projectionTimeline[projectionTimeline.length - 1]?.totalValue || 0).toLocaleString('en-US')}
          </div>
          <div className="text-xs text-[#C8C0B5] mt-2">
            Includes <strong className="text-white">RM {(projectionTimeline[projectionTimeline.length - 1]?.returns || 0).toLocaleString()}</strong> in accumulated yields
          </div>
        </div>
      </div>

      {/* Global Config & Mode Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Allocation Mode Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-[#5C544C] uppercase tracking-wider">
            Allocation Mode:
          </span>
          <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#E2DAD0]">
            <button
              onClick={() => setAllocationMode('amount')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                allocationMode === 'amount'
                  ? 'bg-[#B86B30] text-white shadow-xs'
                  : 'text-[#5C544C] hover:text-[#2D2823]'
              }`}
            >
              By Capital Amount (RM)
            </button>
            <button
              onClick={() => setAllocationMode('percentage')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                allocationMode === 'percentage'
                  ? 'bg-[#B86B30] text-white shadow-xs'
                  : 'text-[#5C544C] hover:text-[#2D2823]'
              }`}
            >
              By Target Weight (%)
            </button>
          </div>

          {allocationMode === 'percentage' && (
            <div className="flex items-center gap-2 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E2DAD0]">
              <span className="text-xs font-bold text-[#7A7268]">Total Budget:</span>
              <span className="text-xs font-bold text-[#2D2823] font-mono">RM</span>
              <input
                type="number"
                step="1000"
                value={totalBudget}
                onChange={e => setTotalBudget(parseFloat(e.target.value) || 0)}
                className="w-28 px-2 py-0.5 text-xs font-bold bg-white border border-[#E2DAD0] rounded-lg text-[#2D2823] focus:outline-none focus:ring-1 focus:ring-[#B86B30] font-mono"
              />
            </div>
          )}
        </div>

        {/* Quick Normalizer & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {allocationMode === 'percentage' && (
            <button
              onClick={handleNormalizeWeights}
              className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE2] text-[#5C544C] text-xs font-bold rounded-xl border border-[#E2DAD0] transition flex items-center gap-1"
              title="Normalize all product weights to exactly 100%"
            >
              <Scale className="w-3.5 h-3.5 text-[#B86B30]" />
              <span>Normalize 100%</span>
            </button>
          )}

          <button
            onClick={handleEqualWeight}
            className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE2] text-[#5C544C] text-xs font-bold rounded-xl border border-[#E2DAD0] transition flex items-center gap-1"
            title="Distribute allocation equally across all products"
          >
            <Split className="w-3.5 h-3.5 text-[#7A7268]" />
            <span>Equal Weight</span>
          </button>

          <button
            onClick={handleAddProduct}
            className="px-3.5 py-1.5 bg-[#B86B30] hover:bg-[#9E5720] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-scroll border-b border-[#EAE3D6] pb-2">
        <button
          onClick={() => setActiveViewTab('overview')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeViewTab === 'overview'
              ? 'bg-[#2D2823] text-white shadow-xs'
              : 'text-[#5C544C] hover:text-[#2D2823] hover:bg-[#FAF8F5]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Product Yield Editor & Table</span>
        </button>

        <button
          onClick={() => setActiveViewTab('projections')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeViewTab === 'projections'
              ? 'bg-[#2D2823] text-white shadow-xs'
              : 'text-[#5C544C] hover:text-[#2D2823] hover:bg-[#FAF8F5]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Compounding Growth</span>
        </button>

        <button
          onClick={() => setActiveViewTab('comparison')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeViewTab === 'comparison'
              ? 'bg-[#2D2823] text-white shadow-xs'
              : 'text-[#5C544C] hover:text-[#2D2823] hover:bg-[#FAF8F5]'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>Scenario Comparison</span>
        </button>

        <button
          onClick={() => setActiveViewTab('breakdown')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeViewTab === 'breakdown'
              ? 'bg-[#2D2823] text-white shadow-xs'
              : 'text-[#5C544C] hover:text-[#2D2823] hover:bg-[#FAF8F5]'
          }`}
        >
          <PieIcon className="w-4 h-4" />
          <span>Visual Distribution</span>
        </button>
      </div>

      {/* VIEW 1: PRODUCT YIELD EDITOR & LIVE TABLE */}
      {activeViewTab === 'overview' && (
        <div className="space-y-6">
          {/* Mobile Card List (Visible on Phone/Tablet < lg) */}
          <div className="block lg:hidden space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#7A7268] uppercase tracking-wider">
                Active Products ({products.length})
              </span>
              {allocationMode === 'percentage' && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
                    Math.abs(products.reduce((s, p) => s + (Number(p.weightPercent) || 0), 0) - 100) < 0.1
                      ? 'bg-[#EEF4EE] text-[#2E4F2D] border-[#D5E4D4]'
                      : 'bg-[#FAF7F2] text-[#8F4E1D] border-[#E2DAD0]'
                  }`}
                >
                  Weight: {products.reduce((s, p) => s + (Number(p.weightPercent) || 0), 0).toFixed(1)}% / 100%
                </span>
              )}
            </div>

            {processedProducts.map((prod, idx) => (
              <div
                key={prod.id}
                className="bg-white border border-[#EAE3D6] rounded-2xl p-4 shadow-xs space-y-3.5 relative"
              >
                {/* Header: Name, color, category, delete */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5"
                      style={{ backgroundColor: prod.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={prod.name}
                        onChange={e => handleUpdateProduct(prod.id, 'name', e.target.value)}
                        className="font-bold text-sm text-[#2D2823] bg-transparent border-b border-transparent focus:border-[#B86B30] focus:bg-[#FAF8F5] focus:outline-none w-full px-1 py-0.5 rounded"
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <select
                          value={prod.category || 'Fixed Yield'}
                          onChange={e => handleUpdateProduct(prod.id, 'category', e.target.value)}
                          className="text-[11px] text-[#5C544C] bg-[#FAF8F5] border border-[#E2DAD0] rounded-md px-2 py-0.5 font-medium"
                        >
                          <option value="Fixed Yield">Fixed Yield</option>
                          <option value="Equities / Stocks">Equities / Stocks</option>
                          <option value="Retirement">Retirement</option>
                          <option value="Cash / MMF">Cash / MMF</option>
                          <option value="Alternative / Crypto">Alternative / Crypto</option>
                          <option value="Custom">Custom</option>
                        </select>
                        <span className="text-[11px] text-[#8C8379] font-semibold font-mono">
                          {prod.effectiveWeight.toFixed(1)}% weight
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveProduct(prod.id)}
                    disabled={products.length <= 1}
                    className={`p-2 rounded-xl text-[#8C8379] hover:text-[#B86B30] hover:bg-[#FAF7F2] transition min-w-[36px] min-h-[36px] flex items-center justify-center ${
                      products.length <= 1 ? 'opacity-20 cursor-not-allowed' : ''
                    }`}
                    title="Remove product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Capital & Return Rate Controls Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#EAE3D6]">
                  {/* Capital / Weight Input */}
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2DAD0]">
                    <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block">
                      {allocationMode === 'amount' ? 'Capital (RM)' : 'Weight (%)'}
                    </span>
                    {allocationMode === 'amount' ? (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[#8C8379] font-bold text-xs font-mono">RM</span>
                        <input
                          type="number"
                          step="500"
                          value={prod.capitalAmount === 0 ? '' : prod.capitalAmount}
                          placeholder="0"
                          onChange={e =>
                            handleUpdateProduct(prod.id, 'capitalAmount', parseFloat(e.target.value) || 0)
                          }
                          className="w-full font-bold text-[#2D2823] bg-white border border-[#E2DAD0] focus:ring-2 focus:ring-[#B86B30]/20 focus:border-[#B86B30] rounded-lg px-2 py-1 text-xs font-mono"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          step="1"
                          value={prod.weightPercent === 0 ? '' : prod.weightPercent}
                          placeholder="0"
                          onChange={e =>
                            handleUpdateProduct(prod.id, 'weightPercent', parseFloat(e.target.value) || 0)
                          }
                          className="w-full font-bold text-[#8F4E1D] bg-white border border-[#E2DAD0] focus:ring-2 focus:ring-[#B86B30]/20 focus:border-[#B86B30] rounded-lg px-2 py-1 text-xs text-center font-mono"
                        />
                        <span className="text-[#5C544C] font-bold text-xs">%</span>
                      </div>
                    )}
                    <span className="text-[10px] text-[#8C8379] mt-1 block font-mono">
                      {allocationMode === 'amount'
                        ? `${prod.effectiveWeight.toFixed(1)}% of total`
                        : `RM ${prod.effectiveCapital.toLocaleString()}`}
                    </span>
                  </div>

                  {/* Return Rate (% p.a.) */}
                  <div className="bg-[#EEF4EE] p-2.5 rounded-xl border border-[#D5E4D4]">
                    <span className="text-[10px] font-bold text-[#2E4F2D] uppercase tracking-wider block">
                      Yield Rate (% p.a.)
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        value={prod.returnRatePercent === 0 ? '' : prod.returnRatePercent}
                        placeholder="0.0"
                        onChange={e =>
                          handleUpdateProduct(prod.id, 'returnRatePercent', parseFloat(e.target.value) || 0)
                        }
                        className="w-full font-extrabold text-[#2E4F2D] bg-white border border-[#D5E4D4] focus:ring-2 focus:ring-[#3D633C]/20 focus:border-[#3D633C] rounded-lg px-2 py-1 text-xs text-center font-mono"
                      />
                      <span className="text-[#2E4F2D] font-bold text-xs">%</span>
                    </div>
                    <span className="text-[10px] text-[#3D633C] mt-1 block font-medium font-mono">
                      {(prod.returnRatePercent / 12).toFixed(2)}% / month
                    </span>
                  </div>
                </div>

                {/* Additional Settings: Payout Frequency & Monthly DCA */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2DAD0]">
                    <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                      Payout Schedule
                    </span>
                    <select
                      value={prod.payoutFrequency}
                      onChange={e =>
                        handleUpdateProduct(prod.id, 'payoutFrequency', e.target.value as PayoutFrequency)
                      }
                      className="w-full bg-white border border-[#E2DAD0] text-[#2D2823] text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#B86B30] font-medium capitalize"
                    >
                      <option value="annual">Annual</option>
                      <option value="semi-annual">Semi-Annual</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="monthly">Monthly</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>

                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2DAD0]">
                    <span className="text-[10px] font-bold text-[#7A7268] uppercase tracking-wider block mb-1">
                      Monthly DCA (RM)
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[#8C8379] font-mono text-[10px]">RM</span>
                      <input
                        type="number"
                        step="100"
                        value={prod.monthlyContribution || ''}
                        placeholder="0"
                        onChange={e =>
                          handleUpdateProduct(prod.id, 'monthlyContribution', parseFloat(e.target.value) || 0)
                        }
                        className="w-full text-[#2D2823] bg-white border border-[#E2DAD0] focus:ring-1 focus:ring-[#B86B30] rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Results Output Footer */}
                <div className="bg-[#2D2823] text-[#FAF8F5] rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#C8C0B5] uppercase tracking-wider block">
                      Monthly Cash Return
                    </span>
                    <strong className="text-sm font-mono text-[#74C06A]">
                      RM {prod.monthlyReturn.toFixed(2)}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#C8C0B5] uppercase tracking-wider block">
                      Annual Cash Return
                    </span>
                    <strong className="text-sm font-mono text-[#C084FC]">
                      RM {prod.annualReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile Portfolio Totals Card */}
            <div className="bg-[#2D2823] text-[#FAF8F5] border border-[#433B34] rounded-2xl p-4.5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#433B34] pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D8CFBF]">
                  Total Added Up Portfolio
                </span>
                <span className="text-xs font-extrabold text-[#74C06A] bg-black/40 border border-[#74C06A]/40 px-2.5 py-0.5 rounded-full font-mono">
                  {blendedWeightedYield.toFixed(2)}% p.a.
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#A89F91] block">Total Invested Capital</span>
                  <strong className="text-sm font-mono text-white">
                    RM {totalInvestedCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#A89F91] block">Total Annual Cash Yield</span>
                  <strong className="text-sm font-mono text-[#C084FC]">
                    RM {totalAnnualReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#A89F91] block">Monthly Passive Cash Flow</span>
                  <strong className="text-sm font-mono text-[#74C06A]">
                    RM {totalMonthlyReturn.toFixed(2)} / mo
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#A89F91] block">Daily Passive Income</span>
                  <strong className="text-sm font-mono text-[#74C06A]">
                    RM {totalDailyReturn.toFixed(2)} / day
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table View (Hidden on mobile < lg) */}
          <div className="hidden lg:block bg-white border border-[#EAE3D6] rounded-2xl overflow-hidden shadow-xs">
            <div className="px-6 py-4.5 border-b border-[#EAE3D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5]">
              <div>
                <h3 className="font-bold text-[#2D2823] text-base flex items-center gap-2">
                  <span>Product Breakdown & Expected Returns</span>
                  <span className="text-xs text-[#8F4E1D] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E2DAD0]">
                    {products.length} Products
                  </span>
                </h3>
                <p className="text-xs text-[#5C544C] mt-0.5">
                  Adjust capital amounts, allocation percentages, or return rates to instantly recalculate cash flow.
                </p>
              </div>

              {allocationMode === 'percentage' && (
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-[#7A7268]">Weight Sum:</span>
                  <span
                    className={`px-2.5 py-1 rounded-lg border ${
                      Math.abs(products.reduce((s, p) => s + (Number(p.weightPercent) || 0), 0) - 100) < 0.1
                        ? 'bg-[#EEF4EE] text-[#2E4F2D] border-[#D5E4D4]'
                        : 'bg-[#FAF7F2] text-[#8F4E1D] border-[#E2DAD0]'
                    }`}
                  >
                    {products.reduce((s, p) => s + (Number(p.weightPercent) || 0), 0).toFixed(1)}% / 100%
                  </span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto touch-scroll">
              <table className="w-full text-left text-xs text-[#2D2823] border-collapse">
                <thead className="bg-[#FAF7F2] text-[#5C544C] uppercase text-[10px] font-bold border-b border-[#EAE3D6]">
                  <tr>
                    <th className="py-3.5 px-5 min-w-[240px]">Product / Asset Name</th>
                    <th className="py-3.5 px-4 min-w-[130px]">
                      {allocationMode === 'amount' ? 'Capital Amount (RM)' : 'Target Weight (%)'}
                    </th>
                    <th className="py-3.5 px-4 min-w-[120px] text-center">Return Rate (% p.a.)</th>
                    <th className="py-3.5 px-4 min-w-[110px]">Payout Frequency</th>
                    <th className="py-3.5 px-4 min-w-[110px]">Monthly DCA (RM)</th>
                    <th className="py-3.5 px-4 text-right min-w-[110px]">Monthly Yield</th>
                    <th className="py-3.5 px-5 text-right min-w-[130px]">Annual Yield</th>
                    <th className="py-3.5 px-3 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D6]">
                  {processedProducts.map((prod, idx) => (
                    <tr key={prod.id} className="hover:bg-[#FAF8F5] transition group">
                      {/* Product Name & Category */}
                      <td className="py-3 px-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: prod.color }}
                            />
                            <input
                              type="text"
                              value={prod.name}
                              onChange={e => handleUpdateProduct(prod.id, 'name', e.target.value)}
                              className="font-bold text-[#2D2823] bg-transparent border-b border-transparent hover:border-[#DFCFC0] focus:border-[#B86B30] focus:bg-white focus:outline-none px-1 py-0.5 rounded text-xs w-full max-w-[220px]"
                            />
                          </div>
                          <div className="flex items-center gap-2 pl-5">
                            <select
                              value={prod.category || 'Fixed Yield'}
                              onChange={e => handleUpdateProduct(prod.id, 'category', e.target.value)}
                              className="text-[10px] text-[#5C544C] bg-[#FAF8F5] border border-[#E2DAD0] rounded-md px-1.5 py-0.5"
                            >
                              <option value="Fixed Yield">Fixed Yield</option>
                              <option value="Equities / Stocks">Equities / Stocks</option>
                              <option value="Retirement">Retirement</option>
                              <option value="Cash / MMF">Cash / MMF</option>
                              <option value="Alternative / Crypto">Alternative / Crypto</option>
                              <option value="Custom">Custom</option>
                            </select>
                            <span className="text-[10px] text-[#8C8379] font-mono">
                              {prod.effectiveWeight.toFixed(1)}% of portfolio
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Capital or Weight input */}
                      <td className="py-3 px-4">
                        {allocationMode === 'amount' ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 max-w-[130px]">
                              <span className="text-[#8C8379] font-mono">RM</span>
                              <input
                                type="number"
                                step="500"
                                value={prod.capitalAmount === 0 ? '' : prod.capitalAmount}
                                placeholder="0"
                                onChange={e =>
                                  handleUpdateProduct(prod.id, 'capitalAmount', parseFloat(e.target.value) || 0)
                                }
                                className="w-full font-bold text-[#2D2823] bg-[#FAF8F5] border border-[#E2DAD0] focus:bg-white focus:ring-1 focus:ring-[#B86B30] rounded-lg px-2 py-1 text-xs font-mono"
                              />
                            </div>
                            <span className="text-[10px] text-[#8C8379] block pl-6 font-mono">
                              {prod.effectiveWeight.toFixed(1)}% weight
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 max-w-[110px]">
                              <input
                                type="number"
                                step="1"
                                value={prod.weightPercent === 0 ? '' : prod.weightPercent}
                                placeholder="0"
                                onChange={e =>
                                  handleUpdateProduct(prod.id, 'weightPercent', parseFloat(e.target.value) || 0)
                                }
                                className="w-full font-bold text-[#8F4E1D] bg-[#FAF8F5] border border-[#E2DAD0] focus:bg-white focus:ring-1 focus:ring-[#B86B30] rounded-lg px-2 py-1 text-xs text-center font-mono"
                              />
                              <span className="text-[#5C544C] font-bold">%</span>
                            </div>
                            <span className="text-[10px] text-[#8C8379] block font-mono">
                              RM {prod.effectiveCapital.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Return Rate Input */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-[#EEF4EE] px-2 py-1 rounded-xl border border-[#D5E4D4]">
                          <input
                            type="number"
                            step="0.1"
                            value={prod.returnRatePercent === 0 ? '' : prod.returnRatePercent}
                            placeholder="0.0"
                            onChange={e =>
                              handleUpdateProduct(prod.id, 'returnRatePercent', parseFloat(e.target.value) || 0)
                            }
                            className="w-14 font-extrabold text-[#2E4F2D] bg-transparent text-center focus:bg-white focus:outline-none rounded text-xs font-mono"
                          />
                          <span className="text-[#2E4F2D] font-bold text-xs">%</span>
                        </div>
                      </td>

                      {/* Payout Frequency */}
                      <td className="py-3 px-4">
                        <select
                          value={prod.payoutFrequency}
                          onChange={e =>
                            handleUpdateProduct(prod.id, 'payoutFrequency', e.target.value as PayoutFrequency)
                          }
                          className="bg-[#FAF8F5] border border-[#E2DAD0] text-[#2D2823] text-xs rounded-xl px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#B86B30] font-medium capitalize"
                        >
                          <option value="annual">Annual</option>
                          <option value="semi-annual">Semi-Annual</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="monthly">Monthly</option>
                          <option value="daily">Daily</option>
                        </select>
                      </td>

                      {/* Monthly DCA Input */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 max-w-[100px]">
                          <span className="text-[#8C8379] font-mono text-[11px]">RM</span>
                          <input
                            type="number"
                            step="100"
                            value={prod.monthlyContribution || ''}
                            placeholder="0"
                            onChange={e =>
                              handleUpdateProduct(prod.id, 'monthlyContribution', parseFloat(e.target.value) || 0)
                            }
                            className="w-full text-[#2D2823] bg-[#FAF8F5] border border-[#E2DAD0] focus:bg-white focus:ring-1 focus:ring-[#B86B30] rounded-lg px-2 py-1 text-xs font-mono"
                          />
                        </div>
                      </td>

                      {/* Calculated Monthly Return (Standardized Highlight) */}
                      <td className="py-3 px-4 text-right font-bold font-mono text-[#2E4F2D] text-xs">
                        RM {prod.monthlyReturn.toFixed(2)}
                      </td>

                      {/* Calculated Annual Return (Standardized Autoflow #7E22CE Highlight) */}
                      <td className="py-3 px-5 text-right font-extrabold font-mono text-[#7E22CE] text-sm">
                        RM {prod.annualReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Delete Product */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleRemoveProduct(prod.id)}
                          disabled={products.length <= 1}
                          className={`p-1.5 rounded-lg text-[#8C8379] hover:text-[#B86B30] hover:bg-[#FAF7F2] transition ${
                            products.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                          title="Remove product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* TOTALS SUM ROW */}
                  <tr className="bg-[#2D2823] text-[#FAF8F5] font-bold border-t-2 border-[#433B34]">
                    <td className="py-3.5 px-5 uppercase text-[10px] tracking-wider text-[#D8CFBF]">
                      Total Added Up Portfolio
                    </td>
                    <td className="py-3.5 px-4 font-mono text-sm text-white">
                      RM {totalInvestedCapital.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-[#74C06A] text-sm font-mono">
                      {blendedWeightedYield.toFixed(2)}% p.a.
                    </td>
                    <td className="py-3.5 px-4 text-[#A89F91] text-[11px]">
                      Blended Average
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[#E3B873]">
                      +RM {totalMonthlyDCA.toLocaleString()}/mo
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#74C06A] font-bold text-xs">
                      RM {totalMonthlyReturn.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono text-[#C084FC] font-extrabold text-base">
                      RM {totalAnnualReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Insights & Rules Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D6] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D2823] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#B86B30]" />
                <span>Weighted Yield Formula</span>
              </div>
              <p className="text-xs text-[#5C544C] leading-relaxed">
                Your portfolio blended rate is calculated as:
                <code className="block bg-[#FAF8F5] p-2 rounded-lg text-[11px] font-mono text-[#2D2823] my-1.5 border border-[#E2DAD0]">
                  Blended % = &Sigma;(Capital &times; Rate%) &divide; Total Capital
                </code>
                Every RM10,000 added into higher-yield assets raises your overall cash flow.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D6] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D2823] uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#B86B30]" />
                <span>Cash Flow Milestone</span>
              </div>
              <p className="text-xs text-[#5C544C] leading-relaxed">
                At your current blended yield of <strong className="text-[#2D2823] font-mono">{blendedWeightedYield.toFixed(2)}%</strong>:
              </p>
              <div className="space-y-1 text-xs text-[#5C544C] pt-1">
                <div className="flex justify-between border-b border-[#EAE3D6] pb-1">
                  <span>To earn RM 1,000 / month:</span>
                  <strong className="font-mono text-[#8F4E1D]">
                    RM {((12000 / (blendedWeightedYield / 100)) || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </strong>
                </div>
                <div className="flex justify-between pt-1">
                  <span>To earn RM 3,000 / month:</span>
                  <strong className="font-mono text-[#8F4E1D]">
                    RM {((36000 / (blendedWeightedYield / 100)) || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </strong>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D6] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D2823] uppercase tracking-wider">
                <Percent className="w-4 h-4 text-[#2E4F2D]" />
                <span>Inflation & Real Yield</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#5C544C]">Adjust for Inflation:</span>
                  <button
                    onClick={() => setAdjustForInflation(!adjustForInflation)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                      adjustForInflation
                        ? 'bg-[#2E4F2D] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-[#5C544C] hover:bg-[#F2ECE2] border border-[#E2DAD0]'
                    }`}
                  >
                    {adjustForInflation ? 'Active (2.5%)' : 'Nominal (Off)'}
                  </button>
                </div>
                <p className="text-[#7A7268] text-[11px] leading-relaxed font-mono">
                  Real Return = {blendedWeightedYield.toFixed(2)}% - 2.50% = <strong className="text-[#2E4F2D] font-bold">{realBlendedYield.toFixed(2)}% p.a.</strong> true growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COMPOUNDING GROWTH PROJECTIONS & HORIZON */}
      {activeViewTab === 'projections' && (
        <div className="space-y-6">
          {/* Projection Controls Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Calendar className="w-4 h-4 text-[#B86B30]" />
              <span className="text-xs font-bold text-[#5C544C] uppercase tracking-wider">
                Time Horizon:
              </span>
              <div className="flex flex-wrap items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E2DAD0]">
                {[1, 3, 5, 10, 15, 20, 25, 30].map(yr => (
                  <button
                    key={yr}
                    onClick={() => setTimeHorizonYears(yr)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition font-mono ${
                      timeHorizonYears === yr
                        ? 'bg-[#2D2823] text-white shadow-xs'
                        : 'text-[#5C544C] hover:text-[#2D2823]'
                    }`}
                  >
                    {yr}Y
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#5C544C] uppercase tracking-wider">
                Growth Mode:
              </span>
              <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#E2DAD0]">
                <button
                  onClick={() => setReinvestReturns(true)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                    reinvestReturns
                      ? 'bg-[#2E4F2D] text-white shadow-xs'
                      : 'text-[#5C544C] hover:text-[#2D2823]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reinvest & Compound</span>
                </button>
                <button
                  onClick={() => setReinvestReturns(false)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                    !reinvestReturns
                      ? 'bg-[#B86B30] text-white shadow-xs'
                      : 'text-[#5C544C] hover:text-[#2D2823]'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Withdraw Cash Payout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Area Chart: Principal vs Accumulated Returns */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EAE3D6] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-[#2D2823] text-base">
                  Portfolio Compounding Trajectory ({timeHorizonYears} Years)
                </h3>
                <p className="text-xs text-[#5C544C] mt-0.5">
                  Visual breakdown of your principal investments vs compound interest generated over time.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#8F4E1D]" />
                  <span className="text-[#5C544C] font-medium">Principal Capital</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#2E4F2D]" />
                  <span className="text-[#5C544C] font-medium">Compound Yield Gains</span>
                </div>
              </div>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionTimeline} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8F4E1D" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#8F4E1D" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E4F2D" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#2E4F2D" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE3D6" />
                  <XAxis dataKey="year" stroke="#8C8379" fontSize={11} />
                  <YAxis
                    stroke="#8C8379"
                    fontSize={11}
                    tickFormatter={v => `RM ${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `RM ${Number(val).toLocaleString()}`,
                      name === 'principal' ? 'Invested Principal' : name === 'returns' ? 'Accumulated Returns' : 'Total Portfolio Value',
                    ]}
                    contentStyle={{
                      backgroundColor: '#2D2823',
                      borderRadius: '12px',
                      color: '#FAF8F5',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="principal"
                    stackId="1"
                    stroke="#8F4E1D"
                    fill="url(#colorPrincipal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="returns"
                    stackId="1"
                    stroke="#2E4F2D"
                    fill="url(#colorReturns)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Timeline Milestone Breakdown Table */}
          <div className="bg-white border border-[#EAE3D6] rounded-2xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-[#EAE3D6] bg-[#FAF8F5]">
              <h3 className="font-bold text-[#2D2823] text-sm">
                Year-by-Year Financial Milestone Projection Table
              </h3>
              <p className="text-xs text-[#5C544C]">
                Detailed portfolio valuation, cumulative returns, and monthly passive income generated at each milestone year.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2D2823]">
                <thead className="bg-[#FAF7F2] text-[#5C544C] uppercase text-[10px] font-bold border-b border-[#EAE3D6]">
                  <tr>
                    <th className="py-3 px-5">Year Horizon</th>
                    <th className="py-3 px-4 text-right">Invested Principal</th>
                    <th className="py-3 px-4 text-right">Accumulated Yield Gains</th>
                    <th className="py-3 px-4 text-right">Total Portfolio Balance</th>
                    <th className="py-3 px-4 text-right">Annual Passive Cashflow</th>
                    <th className="py-3 px-5 text-right">Monthly Passive Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D6]">
                  {projectionTimeline.map(item => (
                    <tr key={item.year} className="hover:bg-[#FAF8F5] transition">
                      <td className="py-3.5 px-5 font-bold text-[#2D2823] text-xs">
                        Year {item.year}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#5C544C]">
                        RM {item.principal.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#2E4F2D]">
                        +RM {item.returns.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-[#7E22CE] text-sm">
                        RM {item.totalValue.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#2D2823]">
                        RM {item.annualPassive.toLocaleString()} / yr
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-[#2E4F2D]">
                        RM {item.monthlyPassive.toLocaleString()} / mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SCENARIO COMPARISON (SCENARIO A vs SCENARIO B) */}
      {activeViewTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EAE3D6] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D6]">
              <div>
                <h3 className="text-base font-bold text-[#2D2823]">
                  Side-by-Side Strategy Comparison
                </h3>
                <p className="text-xs text-[#5C544C] mt-0.5">
                  Compare your current allocation against saved benchmark portfolios to see differences in cash flow and {timeHorizonYears}-year wealth.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#5C544C]">Compare Against:</span>
                <select
                  value={compareScenarioId}
                  onChange={e => setCompareScenarioId(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl font-bold text-[#2D2823] focus:outline-none focus:ring-1 focus:ring-[#B86B30]"
                >
                  {savedScenarios.map(sc => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {comparisonStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Left Card: Current Strategy */}
                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E2DAD0] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8F4E1D] bg-[#F2ECE2] px-2.5 py-0.5 rounded-full border border-[#E2DAD0]">
                      Strategy A (Current Active)
                    </span>
                    <span className="text-xs font-extrabold text-[#2E4F2D] font-mono">
                      {blendedWeightedYield.toFixed(2)}% p.a.
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-xs border-b border-[#EAE3D6] pb-2">
                      <span className="text-[#5C544C]">Total Invested:</span>
                      <strong className="font-mono text-[#2D2823]">RM {totalInvestedCapital.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-xs border-b border-[#EAE3D6] pb-2">
                      <span className="text-[#5C544C]">Annual Return:</span>
                      <strong className="font-mono text-[#7E22CE]">RM {totalAnnualReturn.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-xs border-b border-[#EAE3D6] pb-2">
                      <span className="text-[#5C544C]">Monthly Cashflow:</span>
                      <strong className="font-mono text-[#2E4F2D]">RM {totalMonthlyReturn.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-[#5C544C]">{timeHorizonYears}-Year Portfolio Value:</span>
                      <strong className="font-mono text-[#2D2823] text-sm font-extrabold">
                        RM {(projectionTimeline[projectionTimeline.length - 1]?.totalValue || 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Right Card: Comparison Strategy */}
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE3D6] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C544C] bg-[#EAE3D6] px-2.5 py-0.5 rounded-full">
                      Strategy B: {comparisonStats.name}
                    </span>
                    <span className="text-xs font-extrabold text-[#2D2823] font-mono">
                      {comparisonStats.yield.toFixed(2)}% p.a.
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-xs border-b border-[#EAE3D6] pb-2">
                      <span className="text-[#5C544C]">Total Invested:</span>
                      <strong className="font-mono text-[#2D2823]">RM {totalInvestedCapital.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-xs border-b border-[#EAE3D6] pb-2">
                      <span className="text-[#5C544C]">Annual Return:</span>
                      <strong className="font-mono text-[#5C544C]">RM {comparisonStats.annualReturn.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-xs border-b border-[#EAE3D6] pb-2">
                      <span className="text-[#5C544C]">Monthly Cashflow:</span>
                      <strong className="font-mono text-[#5C544C]">RM {comparisonStats.monthlyReturn.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-[#5C544C]">{timeHorizonYears}-Year Portfolio Value:</span>
                      <strong className="font-mono text-[#2D2823] text-sm font-extrabold">
                        RM {Math.round(comparisonStats.futureValue).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Difference Callout Banner */}
            {comparisonStats && (
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                comparisonStats.diffFutureVal >= 0
                  ? 'bg-[#EEF4EE] border-[#D5E4D4] text-[#2E4F2D]'
                  : 'bg-[#FAF7F2] border-[#E2DAD0] text-[#8F4E1D]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${comparisonStats.diffFutureVal >= 0 ? 'bg-[#D5E4D4] text-[#2E4F2D]' : 'bg-[#F2ECE2] text-[#8F4E1D]'}`}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      {comparisonStats.diffFutureVal >= 0 ? 'Strategy A Advantage' : 'Strategy B Advantage'}
                    </span>
                    <p className="text-xs mt-0.5">
                      Strategy A delivers{' '}
                      <strong>{comparisonStats.diffAnnualReturn >= 0 ? '+' : ''}RM {comparisonStats.diffAnnualReturn.toFixed(2)} / year</strong>{' '}
                      more cash return, yielding{' '}
                      <strong className="font-mono">{comparisonStats.diffFutureVal >= 0 ? '+' : ''}RM {Math.round(comparisonStats.diffFutureVal).toLocaleString()}</strong>{' '}
                      over {timeHorizonYears} years.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: VISUAL ASSET & RETURN DISTRIBUTION */}
      {activeViewTab === 'breakdown' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart: Allocation Distribution */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EAE3D6] shadow-xs space-y-4">
            <h3 className="font-bold text-[#2D2823] text-base">
              Capital Allocation by Product
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedProducts}
                    dataKey="effectiveCapital"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {processedProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`RM ${Number(val).toLocaleString()}`, 'Allocated Capital']}
                    contentStyle={{ backgroundColor: '#2D2823', borderRadius: '8px', color: '#FAF8F5', fontSize: '11px', border: 'none' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Annual Return Yield Comparison */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EAE3D6] shadow-xs space-y-4">
            <h3 className="font-bold text-[#2D2823] text-base">
              Annual Cash Return Generated per Product (RM)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedProducts} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE3D6" />
                  <XAxis
                    dataKey="name"
                    tickFormatter={v => v.split('-')[0] || v}
                    stroke="#8C8379"
                    fontSize={10}
                  />
                  <YAxis stroke="#8C8379" fontSize={10} tickFormatter={v => `RM ${v}`} />
                  <Tooltip
                    formatter={(val: any) => [`RM ${Number(val).toFixed(2)}`, 'Annual Cash Return']}
                    contentStyle={{ backgroundColor: '#2D2823', borderRadius: '8px', color: '#FAF8F5', fontSize: '11px', border: 'none' }}
                  />
                  <Bar dataKey="annualReturn" radius={[6, 6, 0, 0]}>
                    {processedProducts.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
