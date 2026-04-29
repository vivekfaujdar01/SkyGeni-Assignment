import { Sliders, RefreshCw, Play } from 'lucide-react';

export default function Controls({
  conversionDelta,
  setConversionDelta,
  dealSizeDelta,
  setDealSizeDelta,
  onRun,
  onReset,
  loading,
  result,
  formatCurrency,
}) {
  function deltaColorText(val) {
    if (val > 0) return 'text-positive';
    if (val < 0) return 'text-negative';
    return 'text-textMuted';
  }

  function deltaLabel(val) {
    if (val > 0) return `+${val}%`;
    if (val < 0) return `${val}%`;
    return '0% (no change)';
  }

  return (
    <div className="bg-cardBg border border-cardBorder rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-md shadow-lg relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-[19px] font-semibold text-textPrimary flex items-center gap-2">
          <Sliders className="w-5 h-5 text-accent" /> What-If Controls
        </h2>
        <p className="text-[13px] text-textMuted font-medium">Adjust sliders to simulate scenarios</p>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-textSecondary">Conversion Rate Change</label>
          <span className={`text-sm font-bold ${deltaColorText(conversionDelta)}`}>
            {deltaLabel(conversionDelta)}
          </span>
        </div>
        <p className="text-[11px] text-textMuted italic">
          "What if we close deals more / fewer % of the time?"
        </p>
        <input
          type="range"
          min="-50"
          max="50"
          step="1"
          value={conversionDelta}
          onChange={e => setConversionDelta(Number(e.target.value))}
          className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-[11px] text-textMuted font-medium pt-1">
          <span>-50%</span><span>0</span><span>+50%</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 relative z-10 mt-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-textSecondary">Avg Deal Size Change</label>
          <span className={`text-sm font-bold ${deltaColorText(dealSizeDelta)}`}>
            {deltaLabel(dealSizeDelta)}
          </span>
        </div>
        <p className="text-[11px] text-textMuted italic">
          "What if our average deal value is higher / lower?"
        </p>
        <input
          type="range"
          min="-50"
          max="50"
          step="1"
          value={dealSizeDelta}
          onChange={e => setDealSizeDelta(Number(e.target.value))}
          className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-[11px] text-textMuted font-medium pt-1">
          <span>-50%</span><span>0</span><span>+50%</span>
        </div>
      </div>

      <div className="flex gap-3 mt-4 relative z-10">
        <button
          onClick={onRun}
          disabled={loading}
          className={`flex-1 flex justify-center items-center gap-2 py-3.5 bg-accent text-cardBg border-none rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-accent/25 transition-all hover:bg-accentHover hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm ${loading ? 'opacity-70 pointer-events-none' : ''}`}
        >
          {loading ? 'Simulating...' : <><Play className="w-4 h-4 fill-current" /> Run Simulation</>}
        </button>
        <button 
          onClick={onReset} 
          className="px-5 py-3.5 bg-surface text-textSecondary border border-cardBorder rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:bg-cardBg hover:text-textPrimary active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      {result && (
        <div className="bg-surface border border-cardBorder rounded-xl p-5 flex flex-col gap-3.5 mt-2 relative z-10 shadow-inner">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-textMuted font-medium">Baseline Revenue</span>
            <span className="text-[15px] font-semibold text-textPrimary">{formatCurrency(result.baseline.total_revenue)}</span>
          </div>
          <div className="h-px bg-cardBorder" />
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-textMuted font-medium">Scenario Revenue</span>
            <span className={`text-[15px] font-bold ${result.impact.absolute >= 0 ? 'text-positive' : 'text-negative'}`}>
              {formatCurrency(result.scenario.total_revenue)}
            </span>
          </div>
          <div className="h-px bg-cardBorder" />
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-textMuted font-medium">Revenue Impact</span>
            <span className={`text-[15px] font-extrabold flex items-center gap-1 ${result.impact.absolute >= 0 ? 'text-positive' : 'text-negative'}`}>
              {result.impact.absolute >= 0 ? '▲' : '▼'} 
              {result.impact.absolute >= 0 ? '+' : ''}
              {formatCurrency(result.impact.absolute)}
              <span className="opacity-80 text-xs ml-1">({result.impact.percentage >= 0 ? '+' : ''}{result.impact.percentage}%)</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
