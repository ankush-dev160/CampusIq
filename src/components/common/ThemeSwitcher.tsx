import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'compact' | 'pill';
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-theme-border bg-theme-elevated text-theme-text hover:border-theme-accent transition-all duration-200 text-xs font-semibold select-none ${className}`}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-theme-accent" />
            <span>Dark: Electric Mint</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-theme-accent" />
            <span>Light: Royal Blue</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2 rounded-xl border border-theme-border bg-theme-elevated text-theme-text hover:text-theme-accent hover:border-theme-accent/50 hover:bg-theme-secondary transition-all duration-200 shadow-sm flex items-center justify-center ${className}`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
      title={`Active: ${isDark ? 'Dark (Electric Mint)' : 'Light (Royal Blue)'}. Click to switch.`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-theme-accent transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-theme-accent transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
};
