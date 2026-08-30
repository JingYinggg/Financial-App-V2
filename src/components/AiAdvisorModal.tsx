import React, { useState } from 'react';
import { useWealth } from '../context/WealthContext';
import { Bot, Send, Sparkles, X, Loader2 } from 'lucide-react';

export const AiAdvisorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { holdings, dividends, creditCards, monthlyCardSpends, incomes, expenses, passiveAccounts, annualReports } = useWealth();

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Analyze my credit card cashback caps and tell me which card to spend on for Groceries vs Petrol.',
    'Review my 2026 dividend yield (17.16%) and highlight which stocks contribute the highest payout.',
    'Suggest a step-by-step plan to reach $1,200/month passive income from my current $950/month.',
    'Evaluate my stock portfolio P/L trend and suggest diversification tips.',
  ];

  const handleAskAi = async (customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setLoading(true);
    setError(null);

    const contextData = {
      holdings,
      dividends: dividends.filter(d => d.year >= 2024),
      creditCards,
      monthlyCardSpends,
      incomes,
      expenses,
      passiveAccounts,
      annualReports,
    };

    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          contextData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      setResponse(data.result);
    } catch (err: any) {
      setError(err.message || 'Error communicating with AI Advisor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2823]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#EAE3D6] rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] space-y-4 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#B86B30] flex items-center justify-center text-white shadow-xs shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#2D2823] text-sm sm:text-base">MY Fortune Wealth AI Advisor</h3>
              <p className="text-[11px] sm:text-xs text-[#7A7268]">Powered by Gemini 2.5 Flash & Full Portfolio Context</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#8C8379] hover:text-[#2D2823] rounded-xl hover:bg-[#EFE8DD] min-w-[36px] min-h-[36px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar touch-scroll">
          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#7A7268] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#B86B30]" />
              Quick AI Financial Queries:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(q);
                    handleAskAi(q);
                  }}
                  className="text-left text-xs bg-white hover:bg-[#FAF7F2] border border-[#E2DAD0] p-2.5 rounded-xl text-[#2D2823] font-medium transition-all line-clamp-2 shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

        {/* Response Area */}
        <div className="flex-1 overflow-y-auto bg-white p-4 rounded-xl border border-[#E2DAD0] text-xs text-[#2D2823] min-h-[200px] leading-relaxed whitespace-pre-wrap shadow-xs">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full space-y-3 py-10 text-[#7A7268]">
              <Loader2 className="w-8 h-8 text-[#B86B30] animate-spin" />
              <p className="text-xs font-medium">Analyzing portfolio metrics & dividend streams...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-[#FDF0EE] border border-[#F5C2BC] text-[#B54838] font-bold">
              {error}
            </div>
          )}

          {!loading && !error && response && (
            <div className="prose prose-slate max-w-none text-xs text-[#2D2823]">
              {response}
            </div>
          )}

          {!loading && !error && !response && (
            <div className="flex flex-col items-center justify-center h-full text-[#9E958C] py-10">
              <Bot className="w-10 h-10 text-[#C7BFB5] mb-2" />
              <p>Ask anything about your stocks, dividends, card cashbacks, or net flow!</p>
            </div>
          )}
        </div>

          {/* Input Bar */}
          <div className="flex items-center space-x-2 pt-2 border-t border-[#EAE3D6] shrink-0">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskAi()}
              placeholder="Type your question about your portfolio or cashback strategy..."
              className="flex-1 px-4 py-2.5 bg-white border border-[#E2DAD0] rounded-xl text-xs text-[#2D2823] placeholder-[#A0988E] focus:outline-none focus:ring-2 focus:ring-[#B86B30]"
            />
            <button
              onClick={() => handleAskAi()}
              disabled={loading}
              className="p-2.5 rounded-xl bg-[#B86B30] hover:bg-[#9E5720] text-white font-bold disabled:opacity-50 transition-all shadow-xs shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
