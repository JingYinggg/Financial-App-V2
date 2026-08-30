import React, { useState } from 'react';
import { WealthProvider } from './context/WealthContext';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { StockPortfolio } from './components/StockPortfolio';
import { DividendTracker } from './components/DividendTracker';
import { CreditCardCashback } from './components/CreditCardCashback';
import { CashflowPlanner } from './components/CashflowPlanner';
import { ProductReturnCalculator } from './components/ProductReturnCalculator';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <WealthProvider>
      <div className="min-h-screen bg-[#FAF8F5] text-[#2D2823] font-sans antialiased selection:bg-[#B86B30] selection:text-white">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAi={() => setIsAiOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onNavigateTab={setActiveTab}
              onOpenAi={() => setIsAiOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}
          {activeTab === 'stocks' && <StockPortfolio />}
          {activeTab === 'dividends' && <DividendTracker />}
          {activeTab === 'cashback' && <CreditCardCashback />}
          {activeTab === 'cashflow' && <CashflowPlanner />}
          {activeTab === 'calculator' && <ProductReturnCalculator />}
        </main>

        <AiAdvisorModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </WealthProvider>
  );
}

