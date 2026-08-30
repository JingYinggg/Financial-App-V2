import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Trash2, Calendar, X, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface YearSelectorProps {
  years: number[];
  selectedYear: number | 'ALL';
  onSelectYear: (year: number | 'ALL') => void;
  showAllOption?: boolean;
  allLabel?: string;
  label?: string;
  onAddYear?: (year: number, cloneFromYear?: number) => void;
  onDeleteYear?: (year: number) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  years,
  selectedYear,
  onSelectYear,
  showAllOption = false,
  allLabel = 'All Years',
  label = 'Year',
  onAddYear,
  onDeleteYear
}) => {
  // Context Menu for right click delete
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    year: number;
  } | null>(null);

  // Expand / collapse for older years beyond latest 3
  const [isExpanded, setIsExpanded] = useState(false);

  // Add Year Modal / Popover
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newYearInput, setNewYearInput] = useState<string>(
    years.length > 0 ? (Math.max(...years) + 1).toString() : '2027'
  );
  const [cloneYearInput, setCloneYearInput] = useState<string>('none');

  // Delete Confirmation Modal
  const [deleteConfirmYear, setDeleteConfirmYear] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sort years in ascending order
  const sortedYears = useMemo(() => {
    return Array.from(new Set<number>(years)).sort((a: number, b: number) => a - b);
  }, [years]);

  // Determine latest 3 years vs older years
  const { latest3Years, olderYears, visibleYears } = useMemo(() => {
    if (sortedYears.length <= 3) {
      return {
        latest3Years: sortedYears,
        olderYears: [] as number[],
        visibleYears: sortedYears
      };
    }

    const latest3 = sortedYears.slice(-3);
    const older = sortedYears.slice(0, -3);

    if (isExpanded) {
      return {
        latest3Years: latest3,
        olderYears: older,
        visibleYears: sortedYears
      };
    }

    // When collapsed: display latest 3. If an older year is currently selected, include it as well
    const list = [...latest3];
    if (typeof selectedYear === 'number' && older.includes(selectedYear) && !list.includes(selectedYear)) {
      list.unshift(selectedYear);
      list.sort((a, b) => a - b);
    }

    return {
      latest3Years: latest3,
      olderYears: older,
      visibleYears: list
    };
  }, [sortedYears, isExpanded, selectedYear]);

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = () => {
      if (contextMenu) setContextMenu(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [contextMenu]);

  const handleContextMenu = (e: React.MouseEvent, yr: number) => {
    if (!onDeleteYear) return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      year: yr
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yr = parseInt(newYearInput, 10);
    if (!isNaN(yr) && yr >= 2000 && yr <= 2099) {
      const cloneFrom = cloneYearInput === 'none' ? undefined : parseInt(cloneYearInput, 10);
      onAddYear?.(yr, cloneFrom);
      onSelectYear(yr);
      setIsAddOpen(false);
      setCloneYearInput('none');
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmYear && onDeleteYear) {
      onDeleteYear(deleteConfirmYear);
      setDeleteConfirmYear(null);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#EAE3D6] shadow-xs flex-wrap">
      {label && (
        <span className="text-[10px] font-bold text-[#8C8379] uppercase tracking-wider px-2 shrink-0">
          {label}:
        </span>
      )}

      {showAllOption && (
        <button
          onClick={() => onSelectYear('ALL')}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            selectedYear === 'ALL'
              ? 'bg-[#B86B30] text-white shadow-xs'
              : 'text-[#6B635A] hover:text-[#2D2823] hover:bg-[#EFE8DD]'
          }`}
        >
          {allLabel}
        </button>
      )}

      {/* Visible Years (Latest 3 or All if Expanded) */}
      {visibleYears.map(yr => (
        <button
          key={yr}
          id={`year-btn-${yr}`}
          onClick={() => onSelectYear(yr)}
          onContextMenu={e => handleContextMenu(e, yr)}
          title="Right-click to delete this year"
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 relative group ${
            selectedYear === yr
              ? 'bg-[#B86B30] text-white shadow-xs'
              : 'text-[#6B635A] hover:text-[#2D2823] hover:bg-[#EFE8DD]'
          }`}
        >
          {yr}
        </button>
      ))}

      {/* Expand / Collapse Button for Older Years */}
      {sortedYears.length > 3 && (
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="px-2 py-1 text-[11px] font-bold text-[#8C8379] hover:text-[#8F4E1D] hover:bg-[#EFE8DD] rounded-lg transition-all flex items-center gap-1 shrink-0"
          title={isExpanded ? 'Show only latest 3 years' : `Show ${olderYears.length} older year${olderYears.length > 1 ? 's' : ''} (${olderYears.join(', ')})`}
        >
          <span>{isExpanded ? 'Less' : `+${olderYears.length} more`}</span>
          {isExpanded ? (
            <ChevronUp className="w-3 h-3 text-[#8F4E1D]" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      )}

      {onAddYear && (
        <button
          onClick={() => setIsAddOpen(true)}
          className="p-1 px-2 text-xs font-bold text-[#8F4E1D] hover:text-[#2D2823] hover:bg-[#EFE8DD] rounded-lg transition-all flex items-center gap-1 shrink-0"
          title="Add New Year"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Year</span>
        </button>
      )}

      {/* Floating Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: Math.min(contextMenu.y, window.innerHeight - 80),
            left: Math.min(contextMenu.x, window.innerWidth - 180),
            zIndex: 9999
          }}
          className="bg-[#FAF8F5] border border-[#EAE3D6] shadow-xl rounded-xl p-1.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-2 py-1 text-[10px] font-bold text-[#8C8379] uppercase tracking-wider border-b border-[#EAE3D6] mb-1">
            Year {contextMenu.year}
          </div>
          <button
            onClick={() => {
              const yrToDelete = contextMenu.year;
              setContextMenu(null);
              setDeleteConfirmYear(yrToDelete);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-[#B54838] hover:bg-[#FDF0EE] rounded-lg transition-all text-left"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Year {contextMenu.year}</span>
          </button>
        </div>
      )}

      {/* Add Year Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-[#2D2823]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE3D6] p-5 max-w-xs w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#F1E9DC] text-[#854E20] rounded-xl border border-[#DFCFC0]">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#2D2823]">Add New Year</h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-[#8C8379] hover:text-[#2D2823] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C544C] mb-1">
                  Enter Year (e.g. 2027)
                </label>
                <input
                  type="number"
                  min="2000"
                  max="2099"
                  value={newYearInput}
                  onChange={e => setNewYearInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E2DAD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B86B30] font-mono font-bold text-[#2D2823]"
                  autoFocus
                />
              </div>

              {years.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#5C544C] mb-1">
                    Clone data from (Optional)
                  </label>
                  <select
                    value={cloneYearInput}
                    onChange={e => setCloneYearInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E2DAD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B86B30] font-bold text-[#2D2823]"
                  >
                    <option value="none">-- Do not clone --</option>
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-xs font-bold text-[#6B635A] hover:bg-[#EFE8DD] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-[#B86B30] text-white hover:bg-[#9E5720] rounded-xl shadow-xs"
                >
                  Add Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmYear && (
        <div className="fixed inset-0 bg-[#2D2823]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE3D6] p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FDF0EE] text-[#B54838] rounded-xl">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2D2823]">Delete Year {deleteConfirmYear}?</h3>
                <p className="text-xs text-[#7A7268] mt-0.5">
                  This will remove records for year {deleteConfirmYear}. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmYear(null)}
                className="px-3.5 py-1.5 text-xs font-bold text-[#6B635A] hover:bg-[#EFE8DD] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 text-xs font-bold bg-[#B54838] text-white hover:bg-[#9B3728] rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Year</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
