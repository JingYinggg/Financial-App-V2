import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  CreditCard,
  PieChart,
  Bot,
  Settings,
  Wallet,
  Calculator,
  Grid,
  X,
  Sparkles,
} from 'lucide-react';
import { QuickActionsGrid } from './QuickActionsGrid';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAi: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAi,
  onOpenSettings,
}) => {
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Report', fullLabel: 'Annual Report', icon: LayoutDashboard },
    { id: 'stocks', label: 'Stocks', fullLabel: 'Stock Portfolio', icon: TrendingUp },
    { id: 'dividends', label: 'Dividends', fullLabel: 'Dividend Yield', icon: DollarSign },
    { id: 'cashback', label: 'Cards', fullLabel: 'Cards', icon: CreditCard },
    { id: 'cashflow', label: 'Cash Flow', fullLabel: 'Cash Flow', icon: PieChart },
    { id: 'calculator', label: 'Calculator', fullLabel: 'Yield Calculator', icon: Calculator },
  ];

  const currentTabObj = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <>
      {/* Sleek, tablet-friendly & mobile-friendly top bar */}
      <header
        id="main-header"
        className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EBE4D8] text-[#2D2823] shadow-[0_2px_12px_rgba(45,40,35,0.03)]"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Left: Brand Identity + Active Page Indicator */}
            <div
              className="flex items-center space-x-2.5 cursor-pointer py-1 select-none shrink-0"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#B86B30] rounded-xl flex items-center justify-center text-white font-black shadow-xs shrink-0">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm sm:text-base tracking-tight text-[#2D2823]">
                    MY Fortune
                  </span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full bg-[#F1E9DC] text-[#854E20] font-bold uppercase tracking-wider border border-[#DFCFC0]">
                    Wealth
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop & Tablet Navigation Tabs on Top */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 ${
                      isActive
                        ? 'bg-[#EFE8DD] text-[#2D2823] font-bold shadow-xs border border-[#E0D5C3]'
                        : 'text-[#6B635A] hover:text-[#2D2823] hover:bg-[#F4EEE4]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B86B30]' : 'text-[#8C8379]'}`} />
                    <span className="hidden lg:inline">{tab.fullLabel}</span>
                    <span className="lg:hidden">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Quick Action Hub Trigger (Mobile only), AI Advisor, and Settings */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {/* Quick Actions Button (Mobile Only) */}
              <button
                id="btn-open-quick-actions"
                type="button"
                onClick={() => setShowQuickActionsModal(true)}
                className="flex md:hidden items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#F4EEE4] hover:bg-[#EBE4D8] text-[#3D3730] hover:text-[#2D2823] border border-[#E2DAD0] text-xs font-bold transition-all shadow-xs active:scale-95 min-h-[36px]"
                title="Open Quick Actions Hub"
              >
                <Grid className="w-4 h-4 text-[#B86B30]" />
                <span className="text-xs">Quick Actions</span>
              </button>

              {/* AI Advisor Button */}
              <button
                id="btn-open-ai"
                type="button"
                onClick={onOpenAi}
                className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#3D3731] hover:bg-[#2A2520] text-[#FAF8F5] text-xs font-bold transition-all shadow-xs active:scale-95 min-h-[36px]"
              >
                <Bot className="w-3.5 h-3.5 text-[#E6DCCE]" />
                <span className="hidden sm:inline text-xs">AI Advisor</span>
                <Sparkles className="w-3 h-3 text-[#D4984F] animate-pulse hidden sm:inline" />
              </button>

              {/* Settings Icon */}
              <button
                id="btn-open-settings"
                type="button"
                onClick={onOpenSettings}
                className="p-2 rounded-xl text-[#6B635A] hover:text-[#2D2823] hover:bg-[#F4EEE4] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center border border-transparent hover:border-[#E2DAD0]"
                title="Settings & Data Export"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions Modal / Drawer (Matches the sample 4-column quick action grid) */}
      {showQuickActionsModal && (
        <div className="fixed inset-0 z-50 bg-[#2D2823]/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div
            className="w-full max-w-lg bg-[#FAF8F5] text-[#2D2823] rounded-t-3xl sm:rounded-3xl border border-[#EAE3D6] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#F1E9DC] text-[#854E20] rounded-xl border border-[#DFCFC0]">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2D2823] tracking-tight">Quick Actions</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickActionsModal(false)}
                className="p-1.5 rounded-xl text-[#8C8379] hover:text-[#2D2823] hover:bg-[#EFE8DD] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions 4-Column Grid */}
            <div className="py-2">
              <QuickActionsGrid
                activeTab={activeTab}
                onSelectTab={tabId => {
                  setActiveTab(tabId);
                  setShowQuickActionsModal(false);
                }}
                onOpenAi={() => {
                  setShowQuickActionsModal(false);
                  onOpenAi();
                }}
                onOpenSettings={() => {
                  setShowQuickActionsModal(false);
                  onOpenSettings();
                }}
                onClose={() => setShowQuickActionsModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
