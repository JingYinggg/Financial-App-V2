import React, { useState } from 'react';
import { BalanceSheetView } from './BalanceSheetView';
import { QuickActionsGrid } from './QuickActionsGrid';
import { ChevronDown, ChevronUp, Sparkles, Grid } from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateTab?: (tab: string) => void;
  onOpenAi?: () => void;
  onOpenSettings?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  onOpenAi,
  onOpenSettings,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div id="dashboard-overview-container" className="space-y-5">
      {/* Quick Actions Card (Mobile Version) */}
      <div className="block md:hidden bg-[#FAF7F2] text-[#2D2823] rounded-3xl p-4 sm:p-5 border border-[#EAE3D6] shadow-[0_2px_12px_rgba(45,40,35,0.03)] relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#F1E9DC] text-[#854E20] rounded-xl border border-[#DFCFC0]">
                <Grid className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#2D2823] tracking-tight">
                Quick Actions
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-semibold text-[#8F4E1D] hover:text-[#733B10] flex items-center gap-1 transition-colors"
              >
                <span>{isExpanded ? 'Hide' : 'View All'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="pt-1">
              <QuickActionsGrid
                activeTab="dashboard"
                onSelectTab={tabId => onNavigateTab?.(tabId)}
                onOpenAi={() => onOpenAi?.()}
                onOpenSettings={() => onOpenSettings?.()}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Annual Report / Balance Sheet View */}
      <BalanceSheetView />
    </div>
  );
};
