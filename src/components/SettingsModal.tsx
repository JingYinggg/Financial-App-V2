import React, { useState } from 'react';
import { useWealth } from '../context/WealthContext';
import { X, Download, Upload, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { resetToDefault, exportBackupJSON, importBackupJSON, holdings, dividends, creditCards } = useWealth();

  const [importText, setImportText] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadJSON = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jy_peggy_wealth_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMsg('JSON Backup downloaded successfully!');
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += '--- STOCK HOLDINGS IN MARKET ---\n';
    csvContent += 'Code,Name,Buy Date,Units,Buy Price (RM),Market\n';
    holdings.forEach(h => {
      csvContent += `"${h.code}","${h.name}","${h.buyDate}",${h.units},${h.buyUnitPrice},"${h.market}"\n`;
    });

    csvContent += '\n--- DIVIDEND PAYOUT RECORDS ---\n';
    csvContent += 'Year,Stock,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec\n';
    dividends.forEach(d => {
      const p = d.monthlyPayouts;
      csvContent += `${d.year},"${d.stockName}",${p.Jan||0},${p.Feb||0},${p.Mar||0},${p.Apr||0},${p.May||0},${p.Jun||0},${p.Jul||0},${p.Aug||0},${p.Sep||0},${p.Oct||0},${p.Nov||0},${p.Dec||0}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encodedUri;
    a.download = `jy_peggy_portfolio_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setSuccessMsg('CSV spreadsheet downloaded!');
  };

  const handleImportJSON = () => {
    if (!importText.trim()) return;
    const ok = importBackupJSON(importText);
    if (ok) {
      setSuccessMsg('Data restored successfully!');
      setImportText('');
    } else {
      alert('Invalid JSON backup format!');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data back to the original PDF spreadsheet values?')) {
      resetToDefault();
      setSuccessMsg('Data reset to original Excel records!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2823]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#EAE3D6] rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto no-scrollbar touch-scroll">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6] shrink-0">
          <h3 className="font-bold text-[#2D2823] text-sm sm:text-base">Settings & Backup Manager</h3>
          <button onClick={onClose} className="p-2 text-[#8C8379] hover:text-[#2D2823] rounded-xl hover:bg-[#EFE8DD] min-w-[36px] min-h-[36px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-[#EEF4EE] border border-[#D5E4D4] text-[#3D633C] text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#3D633C] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          {/* Export section */}
          <div className="p-4 rounded-xl bg-white border border-[#E2DAD0] space-y-3 shadow-xs">
            <h4 className="font-bold text-[#2D2823] text-xs uppercase tracking-wider">Export Data & Spreadsheets</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDownloadJSON}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE2] text-[#2D2823] font-bold flex items-center justify-center space-x-1.5 border border-[#E2DAD0] shadow-xs transition-all min-h-[44px]"
              >
                <Download className="w-4 h-4 text-[#3D633C]" />
                <span>Download JSON Backup</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE2] text-[#2D2823] font-bold flex items-center justify-center space-x-1.5 border border-[#E2DAD0] shadow-xs transition-all min-h-[44px]"
              >
                <FileText className="w-4 h-4 text-[#8F4E1D]" />
                <span>Export CSV for Excel</span>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="p-4 rounded-xl bg-white border border-[#E2DAD0] space-y-2 shadow-xs">
            <h4 className="font-bold text-[#2D2823] text-xs uppercase tracking-wider">Restore / Import Backup JSON</h4>
            <textarea
              rows={3}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Paste JSON backup code here..."
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#E2DAD0] rounded-xl text-[#2D2823] font-mono text-[10px] focus:outline-none focus:ring-2 focus:ring-[#B86B30]"
            />
            <button
              onClick={handleImportJSON}
              className="w-full py-2.5 rounded-xl bg-[#B86B30] hover:bg-[#9E5720] text-white font-bold flex items-center justify-center space-x-1 shadow-xs transition"
            >
              <Upload className="w-4 h-4" />
              <span>Restore Data</span>
            </button>
          </div>

          {/* Reset section */}
          <div className="p-4 rounded-xl bg-[#FDF0EE] border border-[#F5C2BC] space-y-2">
            <h4 className="font-bold text-[#B54838] text-xs uppercase tracking-wider">Reset to Original Excel Records</h4>
            <p className="text-[11px] text-[#7A7268]">
              Restore all original holdings, 2019-2026 dividends, card cashback tiers, and projection data from your Excel PDFs.
            </p>
            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl bg-[#B54838] hover:bg-[#9A382A] text-white font-bold flex items-center justify-center space-x-1 shadow-xs transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
