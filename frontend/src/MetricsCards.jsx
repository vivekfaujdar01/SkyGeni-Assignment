import { Target, DollarSign, Clock, ClipboardList, BarChart2 } from 'lucide-react';

export default function MetricsCards({ metrics }) {
  const cards = [
    {
      label: 'Conversion Rate',
      value: `${(metrics.conversionRate * 100).toFixed(1)}%`,
      sub: `${metrics.totalWon} won / ${metrics.totalLost} lost`,
      icon: <Target className="w-6 h-6 text-accent" />,
      colorClass: 'text-textPrimary',
      bgClass: 'bg-accent',
      borderClass: 'border-cardBorder',
    },
    {
      label: 'Avg Deal Size',
      value: `₹${metrics.avgDealSize.toLocaleString('en-IN')}`,
      sub: 'Per won deal',
      icon: <DollarSign className="w-6 h-6 text-positive" />,
      colorClass: 'text-textPrimary',
      bgClass: 'bg-positive',
      borderClass: 'border-cardBorder',
    },
    {
      label: 'Avg Sales Cycle',
      value: `${metrics.avgCycleDays} days`,
      sub: 'From created to closed',
      icon: <Clock className="w-6 h-6 text-accent" />,
      colorClass: 'text-textPrimary',
      bgClass: 'bg-accent',
      borderClass: 'border-cardBorder',
    },
    {
      label: 'Total Closed Deals',
      value: metrics.totalWon + metrics.totalLost,
      sub: 'Q1 + Q2 history',
      icon: <ClipboardList className="w-6 h-6 text-accent" />,
      colorClass: 'text-textPrimary',
      bgClass: 'bg-accent',
      borderClass: 'border-cardBorder',
    },
  ];

  return (
    <div>
      <p className="text-[13px] text-textMuted mb-3 font-medium flex items-center gap-1.5"><BarChart2 className="w-4 h-4" /> Baseline Metrics — Learned from Q1 + Q2 closed deals</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className={`bg-cardBg border ${card.borderClass} rounded-2xl p-5 backdrop-blur-sm shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:bg-surface`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-base">{card.icon}</span>
              <span className={`w-2 h-2 rounded-full ${card.bgClass} shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
            </div>
            <div className={`text-[28px] font-bold mb-1 tracking-tight ${card.colorClass}`}>{card.value}</div>
            <div className="text-[13px] text-textSecondary font-semibold mb-0.5">{card.label}</div>
            <div className="text-[11px] text-textMuted">{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
