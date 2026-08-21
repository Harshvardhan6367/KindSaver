import React from 'react';

interface TopHeaderNavProps {
  currentView: 'citizen' | 'admin';
  onToggleView: (view: 'citizen' | 'admin') => void;
  onSimulateReport: () => void;
  onResetData: () => void;
}

export const TopHeaderNav: React.FC<TopHeaderNavProps> = ({
  currentView,
  onToggleView,
  onSimulateReport,
  onResetData
}) => {
  return (
    <header className="bg-[#1a1c1b] text-white py-2 px-4 sticky top-0 z-50 border-b border-white/10 shadow-md">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
            Active Screen View:
          </span>
          <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1 border border-white/10">
            <button
              onClick={() => onToggleView('citizen')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                currentView === 'citizen'
                  ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                smartphone
              </span>
              Citizen Live Waste Map
            </button>

            <button
              onClick={() => onToggleView('admin')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                currentView === 'admin'
                  ? 'bg-[#1b5e20] text-white shadow-sm ring-1 ring-emerald-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                desktop_windows
              </span>
              Admin Operations Command Center
            </button>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onSimulateReport}
            className="bg-white/10 hover:bg-white/20 text-emerald-300 hover:text-white px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1 font-semibold transition-colors"
            title="Simulate incoming citizen waste alert"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Simulate Citizen Alert
          </button>

          <button
            onClick={onResetData}
            className="text-gray-400 hover:text-gray-200 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Reset default data"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          </button>
        </div>
      </div>
    </header>
  );
};
