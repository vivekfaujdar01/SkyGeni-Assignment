import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function CustomTooltip({ active, payload, label, formatCurrency }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-surface/95 border border-cardBorder rounded-xl p-4 text-[13px] text-textPrimary shadow-xl backdrop-blur-md">
      <p className="text-textSecondary mb-3 font-semibold">{label}</p>
      <div className="flex flex-col gap-2">
        {payload.map(entry => (
          <div key={entry.dataKey} className="flex gap-2 items-center">
            <span style={{ color: entry.color }}>●</span>
            <span className="text-textMuted min-w-[70px] font-medium">{entry.name}:</span>
            <span className="font-bold tracking-wide" style={{ color: entry.color }}>
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
        {payload.length === 2 && (
          <>
            <div className="h-px bg-cardBorder my-2" />
            <div className="flex gap-2 items-center">
              <span className="text-textMuted">↑</span>
              <span className="text-textMuted min-w-[70px] font-medium">Difference:</span>
              <span className={`font-bold tracking-wide ${payload[1].value >= payload[0].value ? 'text-positive' : 'text-negative'}`}>
                {payload[1].value >= payload[0].value ? '+' : ''}
                {formatCurrency(payload[1].value - payload[0].value)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SimulatorChart({ result, formatCurrency }) {
  const chartData = result.baseline.weekly_revenue.map((val, i) => ({
    week: `W${i + 1}`,
    Baseline: val,
    Scenario: result.scenario.weekly_revenue[i],
  }));

  function yAxisFormat(value) {
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  }

  const isPositive = result.impact.absolute >= 0;

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-[13px] font-medium text-textSecondary bg-cardBg px-3 py-1.5 rounded-full border border-cardBorder">
          <span className="w-2.5 h-2.5 rounded-full bg-chartBaseline" />
          <span>Baseline</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-textSecondary bg-cardBg px-3 py-1.5 rounded-full border border-cardBorder">
          <span className={`w-2.5 h-2.5 rounded-full ${isPositive ? 'bg-positive text-positive' : 'bg-negative text-negative'}`} />
          <span>Scenario</span>
        </div>
        <div className={`ml-auto px-3.5 py-1.5 rounded-full text-[13px] font-bold border flex items-center gap-1.5 transition-all
          ${isPositive ? 'bg-positive/10 border-positive/40 text-positive' : 'bg-negative/10 border-negative/40 text-negative'}
        `}>
          <span>{isPositive ? '▲' : '▼'}</span>
          <span>{isPositive ? '+' : ''}{result.impact.percentage}%</span>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--cardBorder)" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: 'var(--textMuted)', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: 'var(--cardBorder)' }}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={yAxisFormat}
              tick={{ fill: 'var(--textMuted)', fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={55}
              dx={-10}
            />
            <Tooltip
              content={<CustomTooltip formatCurrency={formatCurrency} />}
              cursor={{ stroke: 'var(--cardBorder)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Line
              type="monotone"
              dataKey="Baseline"
              stroke="var(--chartBaseline)"
              strokeWidth={3}
              dot={{ fill: 'var(--cardBg)', stroke: 'var(--chartBaseline)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'var(--chartBaseline)', stroke: 'var(--surface)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="Scenario"
              stroke={isPositive ? 'var(--positive)' : 'var(--negative)'}
              strokeWidth={3}
              strokeDasharray={result.impact.absolute === 0 ? '5 5' : undefined}
              dot={{ fill: 'var(--cardBg)', stroke: isPositive ? 'var(--positive)' : 'var(--negative)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: isPositive ? 'var(--positive)' : 'var(--negative)', stroke: 'var(--surface)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
