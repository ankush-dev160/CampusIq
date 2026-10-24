import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  colorScheme?: 'teal' | 'blue' | 'dynamic' | 'red' | 'amber' | 'accent';
  height?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  showPercentage = true,
  colorScheme = 'dynamic',
  height = 'md',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const getColor = () => {
    if (colorScheme === 'accent') return 'bg-theme-accent';
    if (colorScheme === 'teal') return 'bg-emerald-500';
    if (colorScheme === 'blue') return 'bg-cyan-500';
    if (colorScheme === 'red') return 'bg-red-500';
    if (colorScheme === 'amber') return 'bg-amber-500';

    // Dynamic based on percentage
    if (percentage >= 75) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-theme-accent';
    if (percentage >= 45) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getHeight = () => {
    if (height === 'sm') return 'h-1.5';
    if (height === 'lg') return 'h-3';
    return 'h-2';
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="font-semibold text-theme-text">{label}</span>
          <div className="flex items-center gap-1.5">
            {sublabel && <span className="text-theme-subtle text-[11px]">{sublabel}</span>}
            {showPercentage && <span className="font-bold text-theme-text">{percentage}%</span>}
          </div>
        </div>
      )}
      <div className={`w-full bg-theme-secondary rounded-full overflow-hidden ${getHeight()}`}>
        <div
          className={`${getHeight()} rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
