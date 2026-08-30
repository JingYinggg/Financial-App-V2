export interface BalanceSheetItem {
  id: string;
  name: string;
  type: 'asset' | 'liability';
  values: { [year: string]: number };
}

export interface BalanceSheetData {
  years: number[];
  items: BalanceSheetItem[];
}

export interface InvestmentReportEntry {
  year: number;
  investmentAmount: number; // RM
  plPercent: number; // %
}

export interface StockHolding {
  id: string;
  code: string;
  name: string;
  buyDate: string;
  units: number;
  buyUnitPrice: number; // in RM or USD
  market: 'MY' | 'US' | 'Crypto';
  currentPrice?: number;
}

export interface RealizedTrade {
  id: string;
  code: string;
  name: string;
  buyDate: string;
  sellDate: string;
  units: number;
  buyUnitPrice: number;
  sellUnitPrice: number;
  currency: 'MYR' | 'USD';
  market: 'MY' | 'US' | 'Crypto' | 'Platform';
  fees?: number; // Total administrative fees (brokerage fee, stamp duty, clearing fees)
  notes?: string;
}

export interface DividendRecord {
  id: string;
  year: number;
  stockName: string;
  monthlyPayouts: { [monthKey: string]: number }; // e.g. { "Jan": 0, "Feb": 0.5, ... }
  totalMarketValue?: number; // Used for calculating Dividend Yield %
}

export interface CreditCardCategory {
  id: string;
  name: string;
  ratePercent: number; // e.g. 7.8, 10, 3
  capRM?: number;
  eligibleItems?: string[]; // e.g. ["Shell", "Petronas", "Caltex"]
  conditions?: string; // e.g. "Min spend RM1,000 statement monthly cycle"
  excludedItems?: string[]; // e.g. ["Government payments", "JomPAY", "E-wallet reloads"]
}

export interface CreditCard {
  id: string;
  cardName: string; // e.g., "HSBC (5458)", "UOB One Visa (2052)"
  bank: string;
  accountNo: string;
  minMonthlySpend?: number;
  notes?: string;
  categories: CreditCardCategory[];
  monthRuleOverrides?: { [yearMonthKey: string]: CreditCardCategory[] }; // Key: "2026-Nov", effective from that month onwards
}

export interface MonthlyCardSpend {
  id: string;
  year: number;
  month: string; // "Jan", "Feb", etc.
  cardId: string;
  categorySpends: { [categoryId: string]: number }; // spend amount
  spendFormulas?: { [categoryId: string]: string }; // raw math formula e.g. "100 + 50 + 25"
  actualCashback?: { [categoryId: string]: number }; // optional manual final cashback amount override
  finalTotalCashback?: number; // manual final total claimed
}

export interface CashflowIncomeItem {
  id: string;
  category: string; // "Salary Income", "Part Time Income", "Rental Gain"
  monthlyAmount: { [monthKey: string]: number };
  yearlyAmount?: { [year: string]: { [monthKey: string]: number } };
}

export interface CashflowExpenseItem {
  id: string;
  name: string; // "Mortgage", "Versa Auto Debit", "PTPTN"
  monthlyAmount: { [monthKey: string]: number };
  yearlyAmount?: { [year: string]: { [monthKey: string]: number } };
  notes?: string;
}

export interface PassiveIncomeAccount {
  id: string;
  name: string; // "ASM", "ASM 2", "Digital Bank", "KDI", "Versa"
  principalAmount: number;
  annualInterestRate: number; // e.g. 4.75, 3.4
  monthlyReturns: { [monthKey: string]: number };
  yearlyReturns?: { [year: string]: { [monthKey: string]: number } };
  yearlyData?: {
    [year: string]: {
      [monthKey: string]: {
        principal?: number;
        rate?: number;
        returns?: number;
      };
    };
  };
  category: 'ASNB' | 'Digital Bank' | 'Money Market' | 'Stock Principal' | 'US Stock' | 'MY Stock' | string;
}

export interface AnnualReportEntry {
  year: number;
  principal: number;
  passiveIncome: number;
  growthPPercent: number;
  growthPIPercent: number;
  projectedP?: number;
  projectedPI?: number;
  stockInvestment?: number;
  stockPLPercent?: number;
}

export interface AnnualStockValuation {
  id: string;
  year: number;
  stockName: string;
  code?: string;
  market: 'MY' | 'US' | 'Crypto' | 'Platform';
  currency: 'MYR' | 'USD';
  startOfYearValue: number; // Initial value at start of year (RM / USD)
  endOfYearValue: number;   // Value at end of year (RM / USD)
  dividendReceived?: number; // Total dividend received in year (RM / USD)
  notes?: string;
}

export type PayoutFrequency = 'annual' | 'semi-annual' | 'quarterly' | 'monthly' | 'daily';

export interface ProductReturnItem {
  id: string;
  name: string; // e.g. "Product A - ASNB Fixed Price", "Product B - EPF"
  category?: 'Fixed Yield' | 'Equities / Stocks' | 'Retirement' | 'Cash / MMF' | 'Alternative / Crypto' | 'Custom';
  capitalAmount: number; // in RM
  weightPercent: number; // in %
  returnRatePercent: number; // expected % p.a.
  payoutFrequency: PayoutFrequency;
  monthlyContribution?: number; // regular monthly DCA additions (RM)
  notes?: string;
  color?: string;
}

export interface CalculatorScenario {
  id: string;
  name: string;
  totalBudget: number;
  allocationMode: 'amount' | 'percentage';
  timeHorizonYears: number;
  inflationRate: number; // % p.a.
  reinvestReturns: boolean;
  products: ProductReturnItem[];
}

