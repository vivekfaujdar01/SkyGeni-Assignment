import { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, TrendingUp, Lightbulb, CheckCircle, XCircle, Sun, Moon } from 'lucide-react';
import SimulatorChart from './SimulatorChart';
import MetricsCards from './MetricsCards';
import Controls from './Controls';

function formatCurrency(num) {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
}

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [result, setResult] = useState(null);
  const [conversionDelta, setConversionDelta] = useState(0);
  const [dealSizeDelta, setDealSizeDelta] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    fetch('http://localhost:3001/metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setMetricsLoading(false);
        runSimulation(0, 0);
      })
      .catch(err => {
        setError('Cannot connect to backend. Make sure you ran: node index.js in the backend folder.');
        setMetricsLoading(false);
      });
  }, []);

  async function runSimulation(convDelta = conversionDelta, dealDelta = dealSizeDelta) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversionDelta: convDelta,
          dealSizeDelta: dealDelta,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Simulation failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setConversionDelta(0);
    setDealSizeDelta(0);
    runSimulation(0, 0);
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary font-sans selection:bg-accent/30 selection:text-textPrimary">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 bg-surface/80 border-b border-cardBorder backdrop-blur-xl shadow-sm">
        <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-10 h-10 text-accent drop-shadow-[0_0_8px_rgba(59,109,17,0.3)]" />
            <div>
              <h1 className="text-[22px] font-bold text-textPrimary tracking-tight flex items-center gap-2">
                SkyGeni <span className="text-accent">Revenue Simulator</span>
              </h1>
              <p className="text-[13px] text-textMuted font-medium">What-If Analysis for Q3 2025</p>
            </div>
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-cardBg border border-cardBorder text-textSecondary transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {error && (
        <div className="relative z-10 bg-negative/10 text-negative px-8 py-3 text-sm border-b border-negative/20 backdrop-blur-sm flex items-center justify-center gap-2 shadow-inner">
          <AlertTriangle className="w-5 h-5" /> <span className="font-medium">{error}</span>
        </div>
      )}

      <main className="relative z-10 max-w-[1200px] mx-auto px-8 py-8 flex flex-col gap-8">
        
        {metricsLoading ? (
          <div className="text-center text-textMuted py-10 font-medium animate-pulse">Loading metrics from backend...</div>
        ) : metrics ? (
          <MetricsCards metrics={metrics} />
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
          
          <Controls
            conversionDelta={conversionDelta}
            setConversionDelta={setConversionDelta}
            dealSizeDelta={dealSizeDelta}
            setDealSizeDelta={setDealSizeDelta}
            onRun={() => runSimulation()}
            onReset={handleReset}
            loading={loading}
            result={result}
            formatCurrency={formatCurrency}
          />

          <div className="bg-cardBg border border-cardBorder rounded-2xl p-6 backdrop-blur-sm shadow-lg">
            <h2 className="text-lg font-bold text-textPrimary mb-1">Q3 Weekly Revenue Projection</h2>
            <p className="text-[13px] text-textMuted mb-6 font-medium">
              {result ? `${result.q3_deals_count} open deals spread across 13 weeks` : 'Run a simulation to see the chart'}
            </p>
            {result ? (
              <SimulatorChart result={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-textMuted gap-4 bg-surface/30 rounded-xl border border-cardBorder border-dashed">
                <TrendingUp className="w-12 h-12 opacity-40 grayscale" />
                <p className="font-medium text-sm">Adjust sliders and click "Run Simulation"</p>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="bg-surface border border-accent rounded-2xl p-6 backdrop-blur-sm shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-[shimmer_2s_infinite]"></div>
            
            <h3 className="text-base font-bold text-accent mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" /> Simulation Insight
            </h3>
            
            <div className="flex flex-col gap-3">
              <p className="text-sm text-textSecondary leading-relaxed font-medium">
                {result.drivers.join(' · ')}
              </p>
              
              <div className="h-px bg-cardBorder my-1" />
              
              <p className="text-sm text-textPrimary">
                Baseline Q3 revenue: <strong className="text-textPrimary">{formatCurrency(result.baseline.total_revenue)}</strong>
                <span className="text-textMuted mx-2">→</span>
                Scenario revenue: <strong className={`${result.impact.absolute >= 0 ? 'text-positive' : 'text-negative'} drop-shadow-sm`}>
                  {formatCurrency(result.scenario.total_revenue)}
                </strong>
              </p>
              
              <p className={`text-[15px] font-bold flex items-center gap-1.5 ${result.impact.absolute >= 0 ? 'text-positive' : 'text-negative'}`}>
                {result.impact.absolute >= 0 ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                {result.impact.absolute >= 0
                  ? `Revenue improves by ${formatCurrency(result.impact.absolute)} (+${result.impact.percentage}%)`
                  : `Revenue drops by ${formatCurrency(Math.abs(result.impact.absolute))} (${result.impact.percentage}%)`
                }
              </p>
              
              <div className="flex items-center gap-4 mt-2">
                <span className="bg-cardBg px-3 py-1.5 rounded-lg border border-cardBorder text-xs text-textSecondary font-medium">
                  Conversion = <span className="text-textPrimary font-bold">{(result.scenario.conversion_rate * 100).toFixed(1)}%</span>
                </span>
                <span className="bg-cardBg px-3 py-1.5 rounded-lg border border-cardBorder text-xs text-textSecondary font-medium">
                  Avg Deal = <span className="text-textPrimary font-bold">{formatCurrency(result.scenario.avg_deal_size)}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
