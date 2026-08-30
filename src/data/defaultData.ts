import {
  StockHolding,
  RealizedTrade,
  DividendRecord,
  CreditCard,
  MonthlyCardSpend,
  CashflowIncomeItem,
  CashflowExpenseItem,
  PassiveIncomeAccount,
  AnnualReportEntry,
  BalanceSheetData,
  InvestmentReportEntry,
  AnnualStockValuation
} from '../types';

export const initialBalanceSheetData: BalanceSheetData = {
  years: [2023, 2024, 2025, 2026],
  items: [
    // Assets (Exclude PPE)
    {
      id: 'bs_asnb',
      name: 'ASNB',
      type: 'asset',
      values: { '2023': 102768, '2024': 120551.52, '2025': 127296.60, '2026': 133565.92 }
    },
    {
      id: 'bs_epf',
      name: 'EPF',
      type: 'asset',
      values: { '2023': 149467, '2024': 171654.73, '2025': 199092.41, '2026': 301000.00 }
    },
    {
      id: 'bs_prs',
      name: 'PRS (Inc Versa)',
      type: 'asset',
      values: { '2023': 8300, '2024': 11939.03, '2025': 15737.29, '2026': 20143.00 }
    },
    {
      id: 'bs_versa',
      name: 'Versa',
      type: 'asset',
      values: { '2023': 18858, '2024': 20124.14, '2025': 27659.16, '2026': 43223.22 }
    },
    {
      id: 'bs_share',
      name: 'Share Investment',
      type: 'asset',
      values: { '2023': 6096, '2024': 34347.70, '2025': 22856.68, '2026': 24236.50 }
    },
    {
      id: 'bs_high_interest',
      name: 'High Interest Portfolio',
      type: 'asset',
      values: { '2023': 1638, '2024': 0, '2025': 0, '2026': 30000.00 }
    },

    // Liabilities
    {
      id: 'bs_cc_debt',
      name: 'Credit Card Debt',
      type: 'liability',
      values: { '2023': 3200, '2024': 31288, '2025': 11664, '2026': 15300 }
    },
    {
      id: 'bs_student_loan',
      name: 'Student Loan',
      type: 'liability',
      values: { '2023': 24348, '2024': 22561, '2025': 20042, '2026': 18855 }
    },
    {
      id: 'bs_vehicle_loan',
      name: 'Vehicle Loan',
      type: 'liability',
      values: { '2023': 0, '2024': 0, '2025': 0, '2026': 0 }
    },
    {
      id: 'bs_home_mortgage',
      name: 'Home Mortgage',
      type: 'liability',
      values: { '2023': 327000, '2024': 316500, '2025': 304796, '2026': 294000 }
    }
  ]
};

export const initialInvestmentReports: InvestmentReportEntry[] = [
  { year: 2022, investmentAmount: 20220.06, plPercent: 0.00 },
  { year: 2023, investmentAmount: 18320.00, plPercent: -9.40 },
  { year: 2024, investmentAmount: 26603.70, plPercent: 45.22 },
  { year: 2025, investmentAmount: 22856.68, plPercent: -14.08 },
  { year: 2026, investmentAmount: 23601.50, plPercent: 3.26 }
];

export const initialHoldings: StockHolding[] = [
  // Malaysia Market (MY) - Attachment 3
  { id: 'h1', code: '5211PA', name: 'SUNWAY PA', buyDate: '18 Nov 2020', units: 120, buyUnitPrice: 1.00, market: 'MY', currentPrice: 1.00 },
  { id: 'h2', code: '5211', name: 'SUNWAY', buyDate: '18 Nov 2020', units: 60, buyUnitPrice: 1.00, market: 'MY', currentPrice: 1.00 },
  { id: 'h3', code: '9172', name: 'FPI', buyDate: '13 Mar 2023', units: 2000, buyUnitPrice: 2.98, market: 'MY', currentPrice: 3.10 },
  { id: 'h4', code: '9172', name: 'FPI (Lot 2)', buyDate: '02 Dec 2024', units: 2000, buyUnitPrice: 2.73, market: 'MY', currentPrice: 3.10 },
  { id: 'h5', code: '5248', name: 'BAUTO', buyDate: '28 May 2024', units: 2000, buyUnitPrice: 2.41, market: 'MY', currentPrice: 2.38 },
  { id: 'h6', code: '5133', name: 'PENERGY', buyDate: '30 Dec 2024', units: 3000, buyUnitPrice: 1.31, market: 'MY', currentPrice: 1.25 },
  { id: 'h7', code: '5133', name: 'PENERGY (Lot 2)', buyDate: '11 Mar 2025', units: 3000, buyUnitPrice: 1.16, market: 'MY', currentPrice: 1.25 },
  { id: 'h8', code: '5318', name: 'DXN', buyDate: '11 Dec 2025', units: 6300, buyUnitPrice: 0.505, market: 'MY', currentPrice: 0.535 },
  
  // Overseas Market (US & Global) - Attachment 3
  { id: 'h9', code: 'GLD', name: 'SPDR Gold ETF', buyDate: '05 Jun 2026', units: 2, buyUnitPrice: 380.00, market: 'US', currentPrice: 416.50 },
  { id: 'h10', code: 'GLD', name: 'SPDR Gold ETF (Lot 2)', buyDate: '01 Jun 2026', units: 2, buyUnitPrice: 399.00, market: 'US', currentPrice: 416.50 },
  { id: 'h11', code: 'SPCX', name: 'SpaceX', buyDate: '07 Jul 2026', units: 2, buyUnitPrice: 140.00, market: 'US', currentPrice: 155.00 },
  { id: 'h12', code: 'SPCX', name: 'SpaceX (Lot 2)', buyDate: '15 Jul 2026', units: 5, buyUnitPrice: 130.00, market: 'US', currentPrice: 155.00 },
];

export const initialRealizedTrades: RealizedTrade[] = [
  // Realized Profit / Lost (MY) - Attachment 3
  { id: 't1', code: '0200', name: 'Revenue', buyDate: '09-Jan-2020', sellDate: '20-Apr-2020', units: 1700, buyUnitPrice: 1.15, sellUnitPrice: 1.23, currency: 'MYR', market: 'MY', fees: 13.61, notes: 'Gain RM 122.39 (ROI 22.36% / 6.25% p.a.)' },
  { id: 't2', code: '5210', name: 'Armada', buyDate: '10-Mar-2020', sellDate: '06-Apr-2020', units: 6000, buyUnitPrice: 0.17, sellUnitPrice: 0.175, currency: 'MYR', market: 'MY', fees: 23.71, notes: 'Gain RM 6.29 (ROI 8.24%)' },
  { id: 't3', code: '0213', name: 'MTAG', buyDate: '30-Sep-2019', sellDate: '11-Oct-2019', units: 2200, buyUnitPrice: 0.44, sellUnitPrice: 0.45, currency: 'MYR', market: 'MY', fees: 17.44, notes: 'Gain RM 4.56 (ROI 15.49%)' },
  { id: 't4', code: '7247', name: 'SCGM', buyDate: '28-Jul-2020', sellDate: '29-Jul-2020', units: 1200, buyUnitPrice: 3.00, sellUnitPrice: 3.10, currency: 'MYR', market: 'MY', fees: 21.28, notes: 'Gain RM 98.72 (ROI 2.73%)' },
  { id: 't5', code: '5878', name: 'KPJ', buyDate: '14-Sep-2018', sellDate: '04-Jul-2020', units: 1300, buyUnitPrice: 0.81, sellUnitPrice: 0.835, currency: 'MYR', market: 'MY', fees: 17.61, notes: 'Gain RM 14.89 (ROI 0.78%)' },
  { id: 't6', code: '0111', name: 'K1', buyDate: '06-Aug-2020', sellDate: '06-Aug-2020', units: 3300, buyUnitPrice: 0.605, sellUnitPrice: 0.62, currency: 'MYR', market: 'MY', fees: 25.30, notes: 'Gain RM 24.20 (ROI 1.20%)' },
  { id: 't7', code: '5176', name: 'SUNREIT', buyDate: '29-Jul-2020', sellDate: '12-Aug-2020', units: 1200, buyUnitPrice: 1.535, sellUnitPrice: 1.58, currency: 'MYR', market: 'MY', fees: 29.51, notes: 'Gain RM 24.49 (ROI 34.34%)' },
  { id: 't8', code: '7247', name: 'SCGM', buyDate: '05-Aug-2020', sellDate: '24-Aug-2020', units: 1000, buyUnitPrice: 3.55, sellUnitPrice: 3.48, currency: 'MYR', market: 'MY', fees: 21.20, notes: 'Loss RM -91.20 (-2.56%)' },
  { id: 't9', code: '5606', name: 'IGB REIT', buyDate: '16-Oct-2019', sellDate: '14-Aug-2020', units: 1700, buyUnitPrice: 1.83, sellUnitPrice: 1.85, currency: 'MYR', market: 'MY', fees: 24.39, notes: 'Gain RM 9.61 (ROI 0.31%)' },
  { id: 't10', code: '5162', name: 'VSTECS', buyDate: '09-Sep-2020', sellDate: '29-Sep-2020', units: 500, buyUnitPrice: 1.98, sellUnitPrice: 2.02, currency: 'MYR', market: 'MY', fees: 17.57, notes: 'Gain RM 2.43 (ROI 0.24%)' },
  { id: 't11', code: '5211', name: 'SUNWAY', buyDate: '27-May-2020', sellDate: '30-Nov-2020', units: 1600, buyUnitPrice: 1.34, sellUnitPrice: 1.38, currency: 'MYR', market: 'MY', fees: 17.82, notes: 'Gain RM 46.18 (ROI 2.15%)' },
  { id: 't12', code: '5292', name: 'UWC', buyDate: '20-May-2021', sellDate: '02-Nov-2021', units: 1000, buyUnitPrice: 4.97, sellUnitPrice: 6.33, currency: 'MYR', market: 'MY', fees: 34.48, notes: 'Gain RM 1,325.52 (ROI 58.45% / 26.58% p.a.)' },
  { id: 't13', code: '3182', name: 'GENTING', buyDate: '01-Oct-2018', sellDate: '01-Jun-2022', units: 1400, buyUnitPrice: 5.01, sellUnitPrice: 5.04, currency: 'MYR', market: 'MY', fees: 36.24, notes: 'Gain RM 5.76 (ROI 0.02%)' },
  { id: 't14', code: '7245', name: 'WZSATU', buyDate: '27-Jan-2022', sellDate: '09-Sep-2022', units: 10000, buyUnitPrice: 0.20, sellUnitPrice: 0.21, currency: 'MYR', market: 'MY', fees: 26.73, notes: 'Gain RM 73.27 (ROI 5.91%)' },
  { id: 't15', code: '5176', name: 'SUNREIT', buyDate: '18-Oct-2020', sellDate: '19-Jan-2023', units: 1000, buyUnitPrice: 1.44, sellUnitPrice: 1.57, currency: 'MYR', market: 'MY', fees: 24.46, notes: 'Gain RM 105.54 (ROI 3.22%)' },
  { id: 't16', code: '5347', name: 'TENAGA', buyDate: '14-Nov-2021', sellDate: '16-May-2023', units: 1000, buyUnitPrice: 9.58, sellUnitPrice: 9.70, currency: 'MYR', market: 'MY', fees: 49.33, notes: 'Gain RM 70.67 (ROI 0.49%)' },
  { id: 't17', code: '5318', name: 'DXN', buyDate: '08-Jan-2025', sellDate: '29-Oct-2025', units: 5700, buyUnitPrice: 0.53, sellUnitPrice: 0.535, currency: 'MYR', market: 'MY', fees: 19.83, notes: 'Gain RM 8.67 (ROI 0.29%)' },

  // Realized Profit / Lost (Cryptocurrency & Platforms) - Attachment 3
  { id: 'c1', code: 'XRP', name: 'Ripple XRP', buyDate: '03-Dec-2024', sellDate: '04-Dec-2024', units: 88, buyUnitPrice: 11.25, sellUnitPrice: 11.80, currency: 'MYR', market: 'Crypto', fees: 11.30, notes: 'Gain RM 37.10 (3.71%)' },
  { id: 'c2', code: 'XRP', name: 'Ripple XRP (Lot 2)', buyDate: '05-Dec-2024', sellDate: '05-Dec-2024', units: 102, buyUnitPrice: 10.10, sellUnitPrice: 10.50, currency: 'MYR', market: 'Crypto', fees: 3.90, notes: 'Gain RM 36.90 (3.56%)' },
  { id: 'c3', code: 'XRP', name: 'Ripple XRP (Lot 3)', buyDate: '05-Dec-2024', sellDate: '05-Dec-2024', units: 108, buyUnitPrice: 9.80, sellUnitPrice: 10.49, currency: 'MYR', market: 'Crypto', fees: 6.52, notes: 'Gain RM 68.00 (6.33%)' },
  { id: 'c4', code: 'XRP', name: 'Ripple XRP (Lot 4)', buyDate: '25-Feb-2025', sellDate: '02-Mar-2025', units: 211, buyUnitPrice: 9.15, sellUnitPrice: 11.50, currency: 'MYR', market: 'Crypto', fees: 86.85, notes: 'Gain RM 409.50 (40.95%)' },
  { id: 'c5', code: 'XRP', name: 'Ripple XRP (Lot 5)', buyDate: '11-Mar-2025', sellDate: '04-Apr-2025', units: 171, buyUnitPrice: 8.77, sellUnitPrice: 9.30, currency: 'MYR', market: 'Crypto', fees: 9.63, notes: 'Gain RM 81.00 (5.40%)' },
  { id: 'c6', code: 'XRP', name: 'Ripple XRP (Lot 6)', buyDate: '07-Apr-2025', sellDate: '10-Apr-2025', units: 237, buyUnitPrice: 8.76, sellUnitPrice: 8.90, currency: 'MYR', market: 'Crypto', fees: 17.32, notes: 'Gain RM 15.86 (0.76%)' },
  { id: 'p1', code: 'ETORO', name: 'Etoro', buyDate: '13-Sep-2018', sellDate: '15-Aug-2022', units: 1, buyUnitPrice: 2968.00, sellUnitPrice: 3980.47, currency: 'MYR', market: 'Platform', fees: 0, notes: 'Gain RM 1,012.47 (8.69%)' },
  { id: 'p2', code: 'STASH', name: 'Stashaway', buyDate: '28-May-2019', sellDate: '30-Apr-2020', units: 1, buyUnitPrice: 1200.00, sellUnitPrice: 1194.54, currency: 'MYR', market: 'Platform', fees: 0, notes: 'Loss RM -5.46 (-0.46%)' },

  // Realized Profit / Lost (US) - Attachment 3
  { id: 'u1', code: 'AAPL', name: 'APPLE', buyDate: '06-May-2024', sellDate: '29-May-2024', units: 1, buyUnitPrice: 181.71, sellUnitPrice: 190.15, currency: 'USD', market: 'US', fees: 1.22, notes: 'Gain $7.22 (3.97%)' },
  { id: 'u2', code: 'NVDA', name: 'NVIDIA', buyDate: '24-May-2024', sellDate: '03-Jun-2024', units: 2, buyUnitPrice: 1086.00, sellUnitPrice: 1130.00, currency: 'USD', market: 'US', fees: 7.73, notes: 'Gain $80.27 (3.69%)' },
  { id: 'u3', code: 'NVDA', name: 'NVIDIA (Split)', buyDate: '06-Jun-2024', sellDate: '21-Jun-2024', units: 20, buyUnitPrice: 119.00, sellUnitPrice: 127.00, currency: 'USD', market: 'US', fees: 7.23, notes: 'Gain $152.77 (6.41%)' },
  { id: 'u4', code: 'AVGO', name: 'Boardcom', buyDate: '17-Jun-2024', sellDate: '26-Jul-2024', units: 0.569, buyUnitPrice: 178.83, sellUnitPrice: 148.47, currency: 'USD', market: 'US', fees: 0, notes: 'Loss -$17.25 (-16.76%)' },
  { id: 'u5', code: 'QQQM', name: 'Invesco Nasdaq 1', buyDate: '11-Jul-2024', sellDate: '26-Jul-2024', units: 12, buyUnitPrice: 206.00, sellUnitPrice: 188.92, currency: 'USD', market: 'US', fees: 0.12, notes: 'Loss -$205.08 (-8.28%)' },
  { id: 'u6', code: 'GOLD', name: 'Gold', buyDate: '23-Mar-2026', sellDate: '30-Mar-2026', units: 1, buyUnitPrice: 400.00, sellUnitPrice: 416.50, currency: 'USD', market: 'US', fees: 3.24, notes: 'Gain $13.26 (3.30%)' },
];

export const initialStockValuations: AnnualStockValuation[] = [
  // 2026
  { id: 'v2026_1', year: 2026, stockName: 'FPI', code: '9172', market: 'MY', currency: 'MYR', startOfYearValue: 11448.43, endOfYearValue: 12400.00, dividendReceived: 3600.00 },
  { id: 'v2026_2', year: 2026, stockName: 'BAUTO', code: '5248', market: 'MY', currency: 'MYR', startOfYearValue: 4831.45, endOfYearValue: 4760.00, dividendReceived: 130.00 },
  { id: 'v2026_3', year: 2026, stockName: 'PENERGY', code: '5133', market: 'MY', currency: 'MYR', startOfYearValue: 7430.23, endOfYearValue: 7500.00, dividendReceived: 60.00 },
  { id: 'v2026_4', year: 2026, stockName: 'DXN', code: '5318', market: 'MY', currency: 'MYR', startOfYearValue: 3191.46, endOfYearValue: 3370.50, dividendReceived: 132.00 },
  { id: 'v2026_5', year: 2026, stockName: 'SUNWAY PA', code: '5211PA', market: 'MY', currency: 'MYR', startOfYearValue: 120.00, endOfYearValue: 120.00, dividendReceived: 0 },
  { id: 'v2026_6', year: 2026, stockName: 'SPDR Gold ETF', code: 'GLD', market: 'US', currency: 'USD', startOfYearValue: 1558.00, endOfYearValue: 1666.00, dividendReceived: 0 },
  { id: 'v2026_7', year: 2026, stockName: 'SpaceX', code: 'SPCX', market: 'US', currency: 'USD', startOfYearValue: 930.00, endOfYearValue: 1085.00, dividendReceived: 0 },
  
  // 2025
  { id: 'v2025_1', year: 2025, stockName: 'FPI', code: '9172', market: 'MY', currency: 'MYR', startOfYearValue: 11448.43, endOfYearValue: 11448.43, dividendReceived: 720.00 },
  { id: 'v2025_2', year: 2025, stockName: 'BAUTO', code: '5248', market: 'MY', currency: 'MYR', startOfYearValue: 4831.45, endOfYearValue: 4831.45, dividendReceived: 140.00 },
  { id: 'v2025_3', year: 2025, stockName: 'PENERGY', code: '5133', market: 'MY', currency: 'MYR', startOfYearValue: 3940.18, endOfYearValue: 7430.23, dividendReceived: 120.00 },
  { id: 'v2025_4', year: 2025, stockName: 'DXN', code: '5318', market: 'MY', currency: 'MYR', startOfYearValue: 3030.91, endOfYearValue: 3191.46, dividendReceived: 165.30 },
  { id: 'v2025_5', year: 2025, stockName: 'SUNWAY PA', code: '5211PA', market: 'MY', currency: 'MYR', startOfYearValue: 120.00, endOfYearValue: 120.00, dividendReceived: 5.57 },

  // 2024
  { id: 'v2024_1', year: 2024, stockName: 'BAUTO', code: '5248', market: 'MY', currency: 'MYR', startOfYearValue: 4831.45, endOfYearValue: 4831.45, dividendReceived: 445.00 },
  { id: 'v2024_2', year: 2024, stockName: 'FPI', code: '9172', market: 'MY', currency: 'MYR', startOfYearValue: 5975.79, endOfYearValue: 11448.43, dividendReceived: 460.00 },
  { id: 'v2024_3', year: 2024, stockName: 'SUNWAY PA', code: '5211PA', market: 'MY', currency: 'MYR', startOfYearValue: 120.00, endOfYearValue: 120.00, dividendReceived: 6.30 },

  // 2023
  { id: 'v2023_1', year: 2023, stockName: 'FPI', code: '9172', market: 'MY', currency: 'MYR', startOfYearValue: 5975.79, endOfYearValue: 5975.79, dividendReceived: 420.00 },
  { id: 'v2023_2', year: 2023, stockName: 'SUNWAY PA', code: '5211PA', market: 'MY', currency: 'MYR', startOfYearValue: 120.00, endOfYearValue: 120.00, dividendReceived: 3.15 },
  { id: 'v2023_3', year: 2023, stockName: 'TENAGA', code: '5347', market: 'MY', currency: 'MYR', startOfYearValue: 9602.42, endOfYearValue: 9673.09, dividendReceived: 260.00 },

  // 2022
  { id: 'v2022_1', year: 2022, stockName: 'GENTING', code: '3182', market: 'MY', currency: 'MYR', startOfYearValue: 7025.00, endOfYearValue: 7032.88, dividendReceived: 154.00 },
  { id: 'v2022_2', year: 2022, stockName: 'SUNWAY PA', code: '5211PA', market: 'MY', currency: 'MYR', startOfYearValue: 120.00, endOfYearValue: 120.00, dividendReceived: 6.30 },
  { id: 'v2022_3', year: 2022, stockName: 'SUN RIET', code: '5176', market: 'MY', currency: 'MYR', startOfYearValue: 1450.00, endOfYearValue: 1550.00, dividendReceived: 64.90 },
  { id: 'v2022_4', year: 2022, stockName: 'TENAGA', code: '5347', market: 'MY', currency: 'MYR', startOfYearValue: 9602.42, endOfYearValue: 9602.42, dividendReceived: 380.00 }
];

export const initialDividends: DividendRecord[] = [
  // 2019
  { id: 'd2019_1', year: 2019, stockName: 'GENTING', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 14.00, May: 0, Jun: 0, Jul: 12.00, Aug: 0, Sep: 0, Oct: 0, Nov: 26.00, Dec: 0 }, totalMarketValue: 2500 },
  { id: 'd2019_2', year: 2019, stockName: 'KPJ', monthlyPayouts: { Jan: 0, Feb: 0.50, Mar: 0, Apr: 0.50, May: 0, Jun: 0, Jul: 0.50, Aug: 0, Sep: 0, Oct: 0.50, Nov: 10.42, Dec: 0 }, totalMarketValue: 1000 },

  // 2020
  { id: 'd2020_1', year: 2020, stockName: 'GENTING', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 38.00, May: 0, Jun: 0, Jul: 24.00, Aug: 0, Sep: 0, Oct: 26.00, Nov: 0, Dec: 0 }, totalMarketValue: 2500 },
  { id: 'd2020_2', year: 2020, stockName: 'IGB REIT', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 9.88, Apr: 0, May: 0, Jun: 8.75, Jul: 0, Aug: 0, Sep: 2.81, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 2000 },
  { id: 'd2020_3', year: 2020, stockName: 'KPJ', monthlyPayouts: { Jan: 0, Feb: 0.50, Mar: 0, Apr: 0.50, May: 0, Jun: 0.50, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 1000 },

  // 2021
  { id: 'd2021_1', year: 2021, stockName: 'GENTING', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 34.00, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 2500 },
  { id: 'd2021_2', year: 2021, stockName: 'SUNWAY PA', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 0.50, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 500 },
  { id: 'd2021_3', year: 2021, stockName: 'SUN RIET', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 7.31, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 34.98, Nov: 0, Dec: 0 }, totalMarketValue: 2000 },

  // 2022
  { id: 'd2022_1', year: 2022, stockName: 'GENTING', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 154.00, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 7000 },
  { id: 'd2022_2', year: 2022, stockName: 'SUNWAY PA', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 3.15, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 3.15, Nov: 0, Dec: 0 }, totalMarketValue: 120 },
  { id: 'd2022_3', year: 2022, stockName: 'SUN RIET', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 25.38, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 1500 },
  { id: 'd2022_4', year: 2022, stockName: 'TENAGA', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 180.00, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 39.52, Oct: 200.00, Nov: 0, Dec: 0 }, totalMarketValue: 9600 },

  // 2023
  { id: 'd2023_1', year: 2023, stockName: 'FPI', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 420.00, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 5975 },
  { id: 'd2023_2', year: 2023, stockName: 'SUNWAY PA', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 3.15, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 120 },
  { id: 'd2023_3', year: 2023, stockName: 'TENAGA', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 260.00, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 9600 },

  // 2024
  { id: 'd2024_1', year: 2024, stockName: 'BAUTO', monthlyPayouts: { Jan: 0, Feb: 60.00, Mar: 0, Apr: 0, May: 35.00, Jun: 0, Jul: 0, Aug: 235.00, Sep: 0, Oct: 0, Nov: 70.00, Dec: 140.00 }, totalMarketValue: 4831 },
  { id: 'd2024_2', year: 2024, stockName: 'FPI', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 460.00, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 11448 },
  { id: 'd2024_3', year: 2024, stockName: 'Sunway PA', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 3.15, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 3.15, Nov: 0, Dec: 0 }, totalMarketValue: 120 },

  // 2025
  { id: 'd2025_1', year: 2025, stockName: 'BAUTO', monthlyPayouts: { Jan: 0, Feb: 25.00, Mar: 0, Apr: 0, May: 35.00, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 4831 },
  { id: 'd2025_2', year: 2025, stockName: 'DXN', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 57.00, Apr: 0, May: 0, Jun: 57.00, Jul: 0, Aug: 0, Sep: 0, Oct: 3.15, Nov: 0, Dec: 0 }, totalMarketValue: 3191 },
  { id: 'd2025_3', year: 2025, stockName: 'FPI', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 720.00, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 11448 },
  { id: 'd2025_4', year: 2025, stockName: 'Sunway PA', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 3.99, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 120 },
  { id: 'd2025_5', year: 2025, stockName: 'PENERGY', monthlyPayouts: { Jan: 0, Feb: 0, Mar: 0, Apr: 120.00, May: 0, Jun: 0, Jul: 30.00, Aug: 0, Sep: 0, Oct: 0, Nov: 15.00, Dec: 0 }, totalMarketValue: 7430 },

  // 2026
  { id: 'd2026_1', year: 2026, stockName: 'BAUTO', monthlyPayouts: { Jan: 0, Feb: 25.00, Mar: 0, Apr: 0, May: 35.00, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 4831 },
  { id: 'd2026_2', year: 2026, stockName: 'DXN', monthlyPayouts: { Jan: 0, Feb: 50.40, Mar: 0, Apr: 0, May: 44.10, Jun: 0, Jul: 0, Aug: 51.30, Sep: 0, Oct: 1.58, Nov: 2.40, Dec: 0 }, totalMarketValue: 3191 },
  { id: 'd2026_3', year: 2026, stockName: 'FPI', monthlyPayouts: { Jan: 3200.00, Feb: 0, Mar: 0, Apr: 400.00, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 11448 },
  { id: 'd2026_4', year: 2026, stockName: 'PENERGY', monthlyPayouts: { Jan: 60.00, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, totalMarketValue: 7430 },
];

export const initialCreditCards: CreditCard[] = [
  {
    id: 'hsbc_5458',
    cardName: 'HSBC (5458)',
    bank: 'HSBC',
    accountNo: '5458',
    minMonthlySpend: 1000,
    notes: 'Requires min RM1,000 monthly total spend to trigger 7.8% tier rate (otherwise 0.2% base rate applies).',
    categories: [
      {
        id: 'c1',
        name: 'Retail',
        ratePercent: 0.2,
        eligibleItems: ['All generic retail point-of-sale transactions', 'Departmental stores', 'Local boutiques', 'General merchandise'],
        conditions: 'Base rate with no monthly cap.',
        excludedItems: ['Government tax & penalties', 'JomPAY billers', 'Cash advance', 'Crypto exchanges']
      },
      {
        id: 'c2',
        name: 'E-Wallet',
        ratePercent: 7.8,
        capRM: 50,
        eligibleItems: ["Touch 'n Go eWallet (TNG)", 'GrabPay Reload', 'Boost Wallet', 'BigPay Reload', 'ShopeePay'],
        conditions: 'Requires min monthly card spend of RM1,000. Capped at RM50/month combined.',
        excludedItems: ['Direct peer-to-peer FPX transfers', 'Non-MYR foreign e-wallets']
      },
      {
        id: 'c3',
        name: 'Groceries',
        ratePercent: 7.8,
        capRM: 50,
        eligibleItems: ["Lotus's / Tesco", 'Giant Hypermarket', 'Mydin', 'AEON Supermarket', 'AEON BiG', 'Jaya Grocer', 'Village Grocer', 'Cold Storage', 'Mercato', "Ben's Independent Grocer"],
        conditions: 'MCC 5411 (Grocery Stores/Supermarkets). Min RM1,000 total spend threshold.',
        excludedItems: ['Convenience stores (7-Eleven, FamilyMart)', 'Wholesale clubs (e.g. bulk B2B)']
      },
      {
        id: 'c4',
        name: 'Petrol',
        ratePercent: 7.8,
        capRM: 50,
        eligibleItems: ['Shell Station & Shell App', 'Petronas Mesra & Setel App', 'Caltex Journey', 'BHPetrol & eCard', 'Petron Miles'],
        conditions: 'MCC 5541 / 5542 (Service Stations & Automated Fuel Dispensers).',
        excludedItems: ['Commercial transport bulk diesel fuel distributors']
      },
    ],
  },
  {
    id: 'uob_visa_2052',
    cardName: 'UOB (2052)',
    bank: 'UOB',
    accountNo: '2052',
    minMonthlySpend: 1500,
    notes: 'Tiered cashback up to 10% when monthly retail spend >= RM1,500.',
    categories: [
      {
        id: 'c5',
        name: 'Retail',
        ratePercent: 0.2,
        eligibleItems: ['General retail purchases', 'Hardware stores', 'Fashion & apparel', 'Bookstores'],
        conditions: 'Unlimited base cashback for all non-special categories.',
        excludedItems: ['LHDN tax payments', 'JomPAY', 'Casino / Gambling', 'Crypto top-ups']
      },
      {
        id: 'c6',
        name: 'Grab',
        ratePercent: 10.0,
        capRM: 15,
        eligibleItems: ['GrabFood Orders', 'Grab Rides / Transport', 'GrabMart grocery deliveries', 'GrabExpress'],
        conditions: 'Transactions via Grab App directly charged to card. Cap RM15/mo.',
        excludedItems: ['GrabPay wallet balance manual cash reloads']
      },
      {
        id: 'c7',
        name: 'Groceries',
        ratePercent: 10.0,
        capRM: 15,
        eligibleItems: ['AEON BiG', 'Cold Storage', 'Jaya Grocer', 'Mercato', 'Village Grocer', "Sam's Groceria"],
        conditions: 'MCC 5411. Min monthly spend tier RM1,500 required for 10%.',
        excludedItems: ['Sundry shops / Pasar malam without standard MCC']
      },
      {
        id: 'c8',
        name: 'Petrol',
        ratePercent: 10.0,
        capRM: 15,
        eligibleItems: ['Shell Stations', 'Petronas Service Stations', 'Caltex', 'Petron', 'BHPetrol'],
        conditions: 'Automated fuel dispenser or pump cashier POS. Cap RM15/mo.',
        excludedItems: ['Convenience mart purchases made without fuel link']
      },
      {
        id: 'c9',
        name: 'Dining',
        ratePercent: 10.0,
        capRM: 15,
        eligibleItems: ['Fast food (McDonalds, KFC, Texas)', 'Cafes (Starbucks, Zus, CBTL)', 'Casual dining & fine dining', 'Bistros & Japanese restaurants'],
        conditions: 'MCC 5812 / 5814 (Eating Places & Fast Food). Cap RM15/mo.',
        excludedItems: ['Hotel banquet catering billed under Hotel MCC']
      },
    ],
  },
  {
    id: 'uob_master_5565',
    cardName: 'UOB (5565)',
    bank: 'UOB',
    accountNo: '5565',
    minMonthlySpend: 1500,
    notes: 'Secondary card optimizer for additional monthly RM60 cashback pool.',
    categories: [
      {
        id: 'c10',
        name: 'Retail',
        ratePercent: 0.2,
        eligibleItems: ['General retail shopping', 'Electronics & gadgets', 'Pharmacy (Guardian, Watsons)'],
        conditions: 'Base rate with unlimited return.',
        excludedItems: ['Government utilities', 'JomPAY']
      },
      {
        id: 'c11',
        name: 'Grab',
        ratePercent: 10.0,
        capRM: 15,
        eligibleItems: ['GrabCar rides', 'GrabFood delivery', 'GrabMart orders'],
        conditions: 'Transactions charged directly to MasterCard in Grab app.',
        excludedItems: ['Peer-to-peer wallet transfers']
      },
      {
        id: 'c12',
        name: 'Groceries',
        ratePercent: 10.0,
        capRM: 15,
        eligibleItems: ["Lotus's", 'AEON Supermarket', 'Jaya Grocer', 'Village Grocer', 'Giant'],
        conditions: 'MCC 5411. Cap RM15/mo.',
        excludedItems: ['Non-registered merchant terminals']
      },
      {
        id: 'c13',
        name: 'Petrol',
        ratePercent: 10.0,
        capRM: 15,
        eligibleItems: ['Shell', 'Petronas', 'Caltex', 'Petron', 'BHPetrol'],
        conditions: 'Pump fuel transactions across Malaysia.',
        excludedItems: ['Commercial bulk freight fuel']
      },
      {
        id: 'c14',
        name: 'Dining',
        ratePercent: 10.0,
        capRM: 15,
        eligibleItems: ['Restaurants', 'Cafes', 'Foodpanda', 'Bakery chains (Lavender, RT Pastry)'],
        conditions: 'MCC 5812 / 5814.',
        excludedItems: ['Bar / Pub entertainment MCC 5813']
      },
    ],
  },
  {
    id: 'affin_5760',
    cardName: 'Affin (5760)',
    bank: 'Affin',
    accountNo: '5760',
    minMonthlySpend: 0,
    notes: 'No min spend requirement! Direct 3% cashback on digital, e-wallets, e-commerce, and auto-billings.',
    categories: [
      {
        id: 'c15',
        name: 'E-Wallet',
        ratePercent: 3.0,
        capRM: 30,
        eligibleItems: ["Touch 'n Go eWallet (TNG)", 'BigPay Reload', 'ShopeePay Reload', 'Boost eWallet', 'GrabPay Reload', 'Zapp / Setel Wallet'],
        conditions: '3% direct rebate on e-wallet top-ups. Cap RM30/month (Spend RM1,000 to maximize).',
        excludedItems: ['Direct merchant FPX']
      },
      {
        id: 'c16',
        name: 'Utilities',
        ratePercent: 3.0,
        capRM: 30,
        eligibleItems: ['Tenaga Nasional (TNB Auto-debit)', 'Indah Water Konsortium (IWK)', 'Unifi / TM Broadband', 'Maxis / Digi / Celcom Monthly Bills', 'Astro Satellite TV', 'Air Selangor'],
        conditions: 'Recurring auto-debit billing setup with service providers. Cap RM30/month.',
        excludedItems: ['Counter bill payments at Pos Malaysia']
      },
      {
        id: 'c17',
        name: 'Online Shopping',
        ratePercent: 3.0,
        capRM: 30,
        eligibleItems: ['Shopee Malaysia', 'Lazada Malaysia', 'TikTok Shop', 'Taobao / Tmall', 'Amazon.sg / Amazon.com', 'Zalora', 'Uniqlo Online App', 'Decathlon Online'],
        conditions: 'MCC 5311 / 5999 Online transactions in 3D Secure checkout. Cap RM30/mo.',
        excludedItems: ['Online betting & forex trading']
      },
      {
        id: 'c18',
        name: 'Subscriptions',
        ratePercent: 3.0,
        eligibleItems: ['Netflix', 'Spotify Premium', 'YouTube Premium', 'Apple Services (iCloud, Apple Music)', 'Google One / Play Store', 'ChatGPT Plus', 'Disney+ Hotstar'],
        conditions: 'Recurring card-on-file digital memberships.',
        excludedItems: ['One-off gaming gift cards']
      },
    ],
  },
  {
    id: 'rhb_shell_8881',
    cardName: 'RHB (8881)',
    bank: 'RHB',
    accountNo: '8881',
    minMonthlySpend: 2500,
    notes: 'Up to 12% cashback for Shell petrol with min RM2,500 total monthly retail spend.',
    categories: [
      {
        id: 'c19',
        name: 'Petrol',
        ratePercent: 12.0,
        capRM: 50,
        eligibleItems: ['Shell Fuel (FuelSave 95, V-Power 97, V-Power Racing)', 'Shell App Pay-at-Pump', 'Shell Helix Engine Oil at service station'],
        conditions: 'Spend >= RM2,500 triggers 12% (Cap RM50/mo). Spend RM1,000-RM2,499 gets 5% (Cap RM30). Spend <RM1,000 gets 0.2%.',
        excludedItems: ['Non-Shell brand petrol stations (Petronas, Caltex, Petron)']
      },
      {
        id: 'c20',
        name: 'Groceries',
        ratePercent: 0.2,
        eligibleItems: ['All other spending in Malaysia & overseas', 'Online shopping', 'Groceries', 'Utilities'],
        conditions: 'Unlimited base cashback to help hit the RM2,500 monthly tier threshold.',
        excludedItems: ['Government transactions', 'Charities / Donations']
      },
    ],
  },
];

export const initialMonthlyCardSpends: MonthlyCardSpend[] = [
  {
    id: 's_aug_hsbc',
    year: 2025,
    month: 'Aug',
    cardId: 'hsbc_5458',
    categorySpends: { c1: 200, c2: 300, c3: 400, c4: 150 },
  },
  {
    id: 's_aug_affin',
    year: 2025,
    month: 'Aug',
    cardId: 'affin_5760',
    categorySpends: { c15: 970.00, c16: 120.00, c17: 250.00, c18: 50.00 },
  },
  {
    id: 's_aug_rhb',
    year: 2025,
    month: 'Aug',
    cardId: 'rhb_shell_8881',
    categorySpends: { c19: 250.00, c20: 300.00 },
  },
];

export const initialIncomes: CashflowIncomeItem[] = [
  {
    id: 'inc1',
    category: 'Salary Income',
    monthlyAmount: {
      Jan: 9145, Feb: 9145, Mar: 9300, Apr: 9300, May: 9300, Jun: 9300, Jul: 9300, Aug: 9300, Sep: 9300, Oct: 9300, Nov: 9300, Dec: 9300
    },
  },
  {
    id: 'inc2',
    category: 'Part Time Income',
    monthlyAmount: {
      Jan: 2500, Feb: 2500, Mar: 3100, Apr: 2500, May: 2500, Jun: 2500, Jul: 2500, Aug: 2500, Sep: 2500, Oct: 2500, Nov: 2500, Dec: 2500
    },
  },
  {
    id: 'inc3',
    category: 'Rental Gain',
    monthlyAmount: {
      Jan: 1800, Feb: 1800, Mar: 1800, Apr: 1800, May: 1800, Jun: 1800, Jul: 1800, Aug: 1800, Sep: 1800, Oct: 1800, Nov: 1800, Dec: 1800
    },
  },
];

export const initialExpenses: CashflowExpenseItem[] = [
  { id: 'exp1', name: 'Long Term Bond Issued', monthlyAmount: { Jan: 1719.88, Feb: 1719.88, Mar: 1719.88, Apr: 1370.83, May: 1370.83, Jun: 720.83, Jul: 720.83, Aug: 720.83, Sep: 533.33, Oct: 533.33, Nov: 533.33, Dec: 533.33 } },
  { id: 'exp2', name: 'Auto Debit Versa', monthlyAmount: { Jan: 3150, Feb: 3150, Mar: 3150, Apr: 3150, May: 3150, Jun: 3150, Jul: 3150, Aug: 3150, Sep: 3150, Oct: 3150, Nov: 3150, Dec: 3150 } },
  { id: 'exp3', name: 'Mortgage', monthlyAmount: { Jan: 2000, Feb: 2000, Mar: 2000, Apr: 2000, May: 2000, Jun: 2000, Jul: 2000, Aug: 2000, Sep: 2000, Oct: 2000, Nov: 2000, Dec: 2000 } },
  { id: 'exp4', name: 'Mum Allowance', monthlyAmount: { Jan: 500, Feb: 500, Mar: 500, Apr: 500, May: 500, Jun: 500, Jul: 500, Aug: 500, Sep: 500, Oct: 500, Nov: 500, Dec: 500 } },
  { id: 'exp5', name: 'Education Debt (PTPTN)', monthlyAmount: { Jan: 200, Feb: 200, Mar: 200, Apr: 200, May: 200, Jun: 200, Jul: 200, Aug: 200, Sep: 200, Oct: 200, Nov: 200, Dec: 200 } },
  { id: 'exp6', name: 'MBA Program (One-off)', monthlyAmount: { Jan: 0, Feb: 0, Mar: 0, Apr: 9500, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 } },
  { id: 'exp7', name: 'Phone Bill', monthlyAmount: { Jan: 37.4, Feb: 37.4, Mar: 37.4, Apr: 37.4, May: 37.4, Jun: 37.4, Jul: 37.4, Aug: 37.4, Sep: 37.4, Oct: 37.4, Nov: 37.4, Dec: 37.4 } },
  { id: 'exp8', name: 'Spotify Subscription', monthlyAmount: { Jan: 30.9, Feb: 30.9, Mar: 30.9, Apr: 30.9, May: 30.9, Jun: 30.9, Jul: 30.9, Aug: 30.9, Sep: 30.9, Oct: 30.9, Nov: 30.9, Dec: 30.9 } },
  { id: 'exp9', name: 'UNICEF Donation', monthlyAmount: { Jan: 48, Feb: 48, Mar: 48, Apr: 48, May: 48, Jun: 48, Jul: 48, Aug: 48, Sep: 48, Oct: 48, Nov: 48, Dec: 48 } },
  { id: 'exp10', name: 'iPhone Instalment', monthlyAmount: { Jan: 208.3, Feb: 208.3, Mar: 208.3, Apr: 208.3, May: 208.3, Jun: 208.3, Jul: 208.3, Aug: 208.3, Sep: 208.3, Oct: 208.3, Nov: 208.3, Dec: 208.3 } },
  { id: 'exp11', name: 'iPad Instalment', monthlyAmount: { Jan: 28, Feb: 28, Mar: 28, Apr: 28, May: 28, Jun: 28, Jul: 28, Aug: 28, Sep: 28, Oct: 28, Nov: 28, Dec: 28 } },
  { id: 'exp12', name: 'Utilities', monthlyAmount: { Jan: 0, Feb: 0, Mar: 200, Apr: 200, May: 200, Jun: 200, Jul: 200, Aug: 200, Sep: 200, Oct: 200, Nov: 200, Dec: 200 } },
];

export const initialPassiveAccounts: PassiveIncomeAccount[] = [
  { id: 'p_stock', name: 'Stock Portfolio (MY)', principalAmount: 28210.50, annualInterestRate: 30.08, monthlyReturns: { Jan: 3260, Feb: 75.40, Mar: 0, Apr: 400, May: 79.10, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, category: 'Stock Principal' },
  { id: 'p_stock_us', name: 'Stock Portfolio (US)', principalAmount: 2751.00, annualInterestRate: 8.50, monthlyReturns: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, category: 'US Stock' },
  { id: 'p_asm1', name: 'ASM (Amanah Saham Malaysia)', principalAmount: 58413.84, annualInterestRate: 4.76, monthlyReturns: { Jan: 0, Feb: 0, Mar: 0, Apr: 2781.61, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, category: 'ASNB' },
  { id: 'p_asm2', name: 'ASM 2 Wawasan', principalAmount: 33461.88, annualInterestRate: 4.75, monthlyReturns: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 1589.44, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, category: 'ASNB' },
  { id: 'p_asm3', name: 'ASM 3 1Malaysia', principalAmount: 38202.49, annualInterestRate: 4.75, monthlyReturns: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 1814.62, Oct: 0, Nov: 0, Dec: 0 }, category: 'ASNB' },
  { id: 'p_digibank', name: 'Digital Banks (RYT + TNG + Boost + Webull + MAE)', principalAmount: 30790.59, annualInterestRate: 3.40, monthlyReturns: { Jan: 88.01, Feb: 111.85, Mar: 52.97, Apr: 48.20, May: 51.86, Jun: 79.78, Jul: 87.24, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, category: 'Digital Bank' },
  { id: 'p_kdi', name: 'KDI Save (Kenanga Digital)', principalAmount: 23801.45, annualInterestRate: 3.99, monthlyReturns: { Jan: 0, Feb: 31.88, Mar: 78.52, Apr: 76.24, May: 79.03, Jun: 35.78, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, category: 'Money Market' },
  { id: 'p_versa', name: 'Versa Cash & Yield', principalAmount: 35006.79, annualInterestRate: 3.86, monthlyReturns: { Jan: 193.42, Feb: 157.74, Mar: 98.85, Apr: 97.62, May: 230.87, Jun: 122.78, Jul: 91.37, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }, category: 'Money Market' },
];

export const initialAnnualReports: AnnualReportEntry[] = [
  { year: 2022, principal: 90984.90, passiveIncome: 4069.17, growthPPercent: 0.00, growthPIPercent: 0.00, projectedP: 100000.00, projectedPI: 5000.00, stockInvestment: 20220.06, stockPLPercent: 0.00 },
  { year: 2023, principal: 127721.51, passiveIncome: 5487.44, growthPPercent: 40.38, growthPIPercent: 34.85, projectedP: 120000.00, projectedPI: 9600.00, stockInvestment: 18320.00, stockPLPercent: -9.40 },
  { year: 2024, principal: 164046.66, passiveIncome: 8533.56, growthPPercent: 28.44, growthPIPercent: 55.51, projectedP: 180000.00, projectedPI: 9600.00, stockInvestment: 26603.70, stockPLPercent: 45.22 },
  { year: 2025, principal: 139849.60, passiveIncome: 8761.32, growthPPercent: -14.75, growthPIPercent: 2.67, projectedP: 200000.00, projectedPI: 100000.00, stockInvestment: 22856.68, stockPLPercent: -14.08 },
  { year: 2026, principal: 157802.42, passiveIncome: 11629.75, growthPPercent: 12.84, growthPIPercent: 32.74, projectedP: 200000.00, projectedPI: 10000.00, stockInvestment: 23601.50, stockPLPercent: 3.26 },
];
