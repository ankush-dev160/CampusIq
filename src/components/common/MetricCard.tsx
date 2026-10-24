import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trendText?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'warning';
  badge?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trendText,
  trendType = 'neutral',
  badge,
  onClick,
}) => {
  const getTrendStyle = () => {
    switch (trendType) {
      case 'positive':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'negative':
        return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-theme-muted bg-theme-elevated border-theme-border';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-theme-accent-border hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">{title}</p>
        <div className="p-2.5 rounded-xl bg-theme-elevated text-theme-accent border border-theme-border">
          {icon}
        </div>
      </div>
      <div className="mt-3.5 flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-text">{value}</h3>
        {badge && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-theme-elevated text-theme-muted border border-theme-border">
            {badge}
          </span>
        )}
      </div>
      {(subtitle || trendText) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-theme-muted">
          <span className="truncate mr-2">{subtitle}</span>
          {trendText && (
            <span className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-md border text-[11px] whitespace-nowrap ${getTrendStyle()}`}>
              {trendText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
