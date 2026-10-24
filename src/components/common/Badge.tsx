import React from 'react';
import { RiskLevel } from '../../types/risk';

interface BadgeProps {
  label: string;
  variant?: 'academicRisk' | 'placementRisk' | 'segment' | 'status' | 'default';
  riskLevel?: RiskLevel;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  riskLevel,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-semibold' : 'px-2.5 py-1 text-xs font-semibold';

  let colorClasses = 'bg-theme-elevated text-theme-muted border-theme-border';

  if (variant === 'academicRisk' || variant === 'placementRisk' || riskLevel) {
    const level = riskLevel || label;
    switch (level) {
      case 'High':
        colorClasses = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25';
        break;
      case 'Moderate':
        colorClasses = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';
        break;
      case 'Low':
        colorClasses = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25';
        break;
      case 'Insufficient Data':
        colorClasses = 'bg-theme-elevated text-theme-muted border-theme-border';
        break;
    }
  } else if (variant === 'status') {
    switch (label) {
      case 'Completed':
        colorClasses = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25';
        break;
      case 'In Progress':
        colorClasses = 'bg-theme-accent-muted text-theme-accent border-theme-accent-border';
        break;
      case 'Planned':
        colorClasses = 'bg-theme-elevated text-theme-muted border-theme-border';
        break;
      case 'Follow-up Needed':
        colorClasses = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg border tracking-tight transition-colors duration-150 ${sizeClasses} ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};
