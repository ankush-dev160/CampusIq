import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type ThemeMode = 'dark' | 'light';

export interface ChartPalette {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  neutral: string;
  grid: string;
  text: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  tooltipMuted: string;
  textMuted: string;
  cursorFill: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  chartPalette: ChartPalette;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'edupulse-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('campusiq-theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    }
    // Default to 'dark'
    return 'dark';
  });

  // Keep DOM updated with .dark or .light class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage might be restricted
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  const chartPalette: ChartPalette = useMemo(() => {
    if (isDark) {
      return {
        primary: '#2563EB',       // Blue
        secondary: '#0EA5E9',     // Sky
        accent: '#10B981',        // Green
        success: '#16A34A',       // Green
        warning: '#F59E0B',       // Amber
        danger: '#EF4444',        // Pure Risk Red (Dark)
        neutral: '#64748B',       // Slate
        grid: 'rgba(148, 163, 184, 0.12)',
        text: '#8FA3BF',
        tooltipBg: '#0F1A2E',
        tooltipBorder: 'rgba(148, 163, 184, 0.2)',
        tooltipText: '#E6EDF7',
        tooltipMuted: '#8FA3BF',
        textMuted: '#8FA3BF',
        cursorFill: 'rgba(37, 99, 235, 0.08)',
      };
    }
    return {
      primary: '#014BAA',         // Royal Blue
      secondary: '#0EA5E9',       // Sky
      accent: '#059669',          // Green
      success: '#16A34A',         // Green
      warning: '#F59E0B',         // Amber
      danger: '#DC2626',          // Pure Risk Red (Light)
      neutral: '#64748B',         // Slate
      grid: 'rgba(15, 23, 42, 0.08)',
      text: '#475569',
      tooltipBg: '#FFFFFF',
      tooltipBorder: '#DDE5F0',
      tooltipText: '#0F172A',
      tooltipMuted: '#64748B',
      textMuted: '#64748B',
      cursorFill: 'rgba(1, 75, 170, 0.06)',
    };
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark, chartPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
