import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  CreditCard,
  PieChart,
  Calculator,
  Bot,
  Settings,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: 'promo' | 'hot' | 'ai' | 'new';
  onClick: () => void;
  isActive?: boolean;
}

interface QuickActionsGridProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAi: () => void;
  onOpenSettings: () => void;
  onClose?: () => void;
  compact?: boolean;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  activeTab,
  onSelectTab,
  onOpenAi,
  onOpenSettings,
  onClose,
  compact = false,
}) => {
  const actions: QuickActionItem[] = [
    {
      id: 'dashboard',
      title: 'Annual Report',
      icon: LayoutDashboard,
      isActive: activeTab === 'dashboard',
      onClick: () => {
        onSelectTab('dashboard');
        onClose?.();
      },
    },
    {
      id: 'stocks',
      title: 'Stock Portfolio',
      icon: TrendingUp,
      isActive: activeTab === 'stocks',
      onClick: () => {
        onSelectTab('stocks');
        onClose?.();
      },
    },
    {
      id: 'dividends',
      title: 'Dividend Yield',
      icon: DollarSign,
      isActive: activeTab === 'dividends',
      onClick: () => {
        onSelectTab('dividends');
        onClose?.();
      },
    },
    {
      id: 'cashback',
      title: 'Cards',
      badge: 'PROMO',
      badgeColor: 'promo',
      icon: CreditCard,
      isActive: activeTab === 'cashback',
      onClick: () => {
        onSelectTab('cashback');
        onClose?.();
      },
    },
    {
      id: 'cashflow',
      title: 'Cash Flow',
      icon: PieChart,
      isActive: activeTab === 'cashflow',
      onClick: () => {
        onSelectTab('cashflow');
        onClose?.();
      },
    },
    {
      id: 'calculator',
      title: 'Yield Calc',
      icon: Calculator,
      isActive: activeTab === 'calculator',
      onClick: () => {
        onSelectTab('calculator');
        onClose?.();
      },
    },
    {
      id: 'ai_advisor',
      title: 'AI Advisor',
      badge: 'AI',
      badgeColor: 'ai',
      icon: Bot,
      onClick: () => {
        onOpenAi();
        onClose?.();
      },
    },
    {
      id: 'settings',
      title: 'Data & Backup',
      icon: Settings,
      onClick: () => {
        onOpenSettings();
        onClose?.();
      },
    },
  ];

  return (
    <div className="w-full">
      {/* 4-column action grid styled identical to the MAE / modern mobile banking standard */}
      <div className={`grid grid-cols-4 ${compact ? 'gap-y-4 gap-x-2' : 'gap-y-5 gap-x-3 sm:gap-x-4'}`}>
        {actions.map(action => {
          const Icon = action.icon;
          const isCurrent = action.isActive;

          return (
            <button
              key={action.id}
              type="button"
              id={`quick-action-${action.id}`}
              onClick={action.onClick}
              className="flex flex-col items-center justify-start text-center group cursor-pointer relative focus:outline-none transition-transform active:scale-95"
            >
              {/* Icon Container with subtle rounded badge frame */}
              <div className="relative mb-1.5 sm:mb-2">
                {action.badge && (
                  <span
                    className={`absolute -top-2 -right-2 z-10 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-tight shadow-xs ${
                      action.badgeColor === 'promo'
                        ? 'bg-[#C45444] text-white'
                        : action.badgeColor === 'ai'
                        ? 'bg-[#3D3731] text-[#FAF8F5]'
                        : 'bg-[#B86B30] text-white'
                    }`}
                  >
                    {action.badge}
                  </span>
                )}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-xs ${
                    isCurrent
                      ? 'bg-[#B86B30] text-white ring-2 ring-[#B86B30] ring-offset-2 ring-offset-[#FAF8F5]'
                      : 'bg-[#F3EDE3] text-[#4A423B] border border-[#E4DCCF] group-hover:bg-[#EAE2D2] group-hover:border-[#D9CFC0] group-hover:text-[#2D2823]'
                  }`}
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isCurrent ? 'text-white' : 'text-[#5C544C] group-hover:scale-110 transition-transform'}`} />
                </div>
              </div>

              {/* Title label */}
              <span
                className={`text-[11px] sm:text-xs font-semibold leading-tight max-w-[76px] sm:max-w-[84px] text-center ${
                  isCurrent ? 'text-[#8F4E1D] font-bold' : 'text-[#5C544C] group-hover:text-[#2D2823]'
                }`}
              >
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
