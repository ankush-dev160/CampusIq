import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Award, AlertTriangle, BookOpen, ChevronRight,
  Star, TrendingDown, ChevronLeft, Sparkles, Brain, Target,
  CheckCircle2, Calendar, Activity, GraduationCap, ArrowUpRight,
  ShieldCheck, Zap, Info, Clock, MessageSquare, ArrowRight,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, AreaChart, Area
} from 'recharts';
import {
  MONTHLY_MARKS, MONTHLY_ATTENDANCE,
  ASSESSMENT_HISTORY, ATTENDANCE_CALENDAR_OCT, DAY_LECTURES
} from '../../data/portalData';
import { useStudentRecord } from '../../context/CurrentUserContext';
import { useTheme } from '../../context/ThemeContext';
import type { StudentPage } from '../../components/portal/StudentShell';
import OrbBot3D from '../../components/ai/OrbBot3D';
import { CampusNewsCard } from '../../components/news/CampusNewsCard';
import { fetchStudentAttempts } from '../../services/placementApi';
import type { StudentAttemptsSummary } from '../../types/placement';

// ─── Shared compact square metric tile ────────────────────────────────────────

interface CompactSquareMetricProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
  accent?: string;
  onClick?: () => void;
}

function CompactSquareMetric({
  icon,
  value,
  label,
  sub,
  badge,
  badgeColor,
  accent,
  onClick,
}: CompactSquareMetricProps) {
  return (
    <div
      onClick={onClick}
      className={`compact-square-card p-3.5 sm:p-4 flex flex-col justify-between aspect-square group select-none ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top: Minimalist Icon Capsule & Status Pill */}
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-xl bg-theme-secondary/70 border border-theme-border/70 flex items-center justify-center text-theme-muted group-hover:text-theme-accent transition-colors">
          {icon}
        </div>
        {badge && (
          <span
            className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
              badgeColor || 'bg-theme-secondary text-theme-muted border-theme-border'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Bottom: Typography Hierarchy */}
      <div className="pt-2">
        <div className={`text-xl sm:text-2xl font-extrabold tracking-tight ${accent || 'text-theme-text'}`}>
          {value}
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-theme-muted mt-0.5 truncate">
          {label}
        </div>
        {sub && (
          <div className="text-[10px] text-theme-muted/80 mt-0.5 truncate">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="panel p-5 sm:p-6 rounded-2xl border border-theme-border flex flex-col gap-4">
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-theme-border/60 pb-3">
          <div>
            {title && <h3 className="text-sm font-bold text-theme-text tracking-tight">{title}</h3>}
            {subtitle && <p className="text-[11px] text-theme-muted mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function MetricTile({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  accent?: string;
  sub?: string;
}) {
  return (
    <div className="panel p-4 rounded-xl border border-theme-border flex flex-col justify-between">
      <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">{label}</span>
      <div className="mt-2">
        <span className={`text-2xl font-extrabold ${accent || 'text-theme-text'}`}>{value}</span>
        {sub && <p className="text-[11px] text-theme-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

interface StudentDashboardProps {
  onNavigate?: (page: StudentPage) => void;
}

export function StudentDashboardPage({ onNavigate }: StudentDashboardProps) {
  const { chartPalette } = useTheme();
  const [perfTab, setPerfTab] = useState<'semester' | 'monthly'>('semester');
  const [calMonth] = useState('October 2025');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [placementAttempts, setPlacementAttempts] = useState<StudentAttemptsSummary | null>(null);

  const s = useStudentRecord();

  useEffect(() => {
    let active = true;
    const studentId = s.roll_no || s.id;
    fetchStudentAttempts(studentId)
      .then(res => { if (active) setPlacementAttempts(res); })
      .catch(() => {});
    return () => { active = false; };
  }, [s]);

  const bestSem  = s.sgpa_history.reduce((a, b) => a.sgpa > b.sgpa ? a : b);
  const worstSem = s.sgpa_history.reduce((a, b) => a.sgpa < b.sgpa ? a : b);
  const strongSub = [...s.subjects].sort((a, b) => b.internal_pct - a.internal_pct)[0];
  const weakSub   = [...s.subjects].sort((a, b) => a.internal_pct - b.internal_pct)[0];

  // Build calendar grid for Oct 2025 (starts Wednesday = col 3)
  const daysInOct = 31;
  const startDay  = 3; // Wed
  const calCells  = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInOct }, (_, i) => i + 1),
  ];

  const dayStatus = (day: number | null) => {
    if (!day) return null;
    const key = `2025-10-${String(day).padStart(2, '0')}`;
    return ATTENDANCE_CALENDAR_OCT[key] ?? null;
  };

  const statusColor: Record<string, string> = {
    present: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold',
    absent:  'bg-red-500/15 text-red-500 border-red-500/30 font-bold',
    partial: 'bg-amber-500/15 text-amber-500 border-amber-500/30 font-bold',
    holiday: 'bg-theme-secondary text-theme-muted border-theme-border font-medium',
  };

  return (
    <div className="space-y-6">
      {/* ─── Editorial Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-bento-in">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-text tracking-tight">
              Student Cockpit
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
              {s.semester}
            </span>
          </div>
          <p className="text-xs text-theme-muted mt-1">
            Welcome back, <strong className="text-theme-text font-semibold">{s.name}</strong> · {s.department} · Roll {s.roll_no}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-theme-surface/80 dark:bg-slate-900/70 border border-theme-border/80 dark:border-white/10 text-theme-muted text-[11px] font-medium backdrop-blur-md shadow-sm w-fit">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-theme-text font-semibold">Active Session · 2025–26</span>
          <span className="text-theme-border">|</span>
          <span className="text-blue-400 font-bold">Tier 1 Standing</span>
        </div>
      </div>

      {/* ─── 12-Column Bento Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4 sm:gap-5">

        {/* ── TOP ROW: 4 x 1x1 SQUARE KPI CARDS ─────────────────────────────────── */}

        {/* Square 1: Success Score with Circular Gauge */}
        <div
          onClick={() => onNavigate?.('ai-progress')}
          style={{ animationDelay: '50ms' }}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card p-5 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 flex flex-col justify-between group cursor-pointer animate-bento-in overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-colors" />

          {/* Top */}
          <div className="flex items-center justify-between z-10">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Tier 1
            </span>
          </div>

          {/* Center Circular Gauge + Metric */}
          <div className="my-2 flex items-center gap-4 z-10">
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="url(#scoreBentoGrad)"
                  strokeWidth="5"
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 * (1 - s.success_score / 100)}
                  strokeLinecap="round"
                  fill="none"
                />
                <defs>
                  <linearGradient id="scoreBentoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-extrabold text-theme-text">{s.success_score}</span>
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-theme-text tracking-tight group-hover:text-blue-400 transition-colors">
                {s.success_score}<span className="text-xs font-semibold text-theme-muted">/100</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +3 pts vs Sem 4
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="z-10 pt-2 border-t border-theme-border/60 dark:border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
              Success Score
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Square 2: Cumulative GPA with Mini Sparkline Progression */}
        <div
          onClick={() => onNavigate?.('analytics')}
          style={{ animationDelay: '100ms' }}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card p-5 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 flex flex-col justify-between group cursor-pointer animate-bento-in overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />

          {/* Top */}
          <div className="flex items-center justify-between z-10">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              Top 15%
            </span>
          </div>

          {/* Center */}
          <div className="my-2 z-10">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-theme-text tracking-tight group-hover:text-cyan-400 transition-colors">
                {s.cgpa.toFixed(2)}
              </span>
              <span className="text-xs text-theme-muted font-bold">/ 10.0</span>
            </div>

            {/* Mini Progress Bar with Sem milestones */}
            <div className="space-y-1 mt-2.5">
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                  style={{ width: `${(s.cgpa / 10) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-theme-muted font-medium pt-0.5">
                <span>Rank #12 Cohort</span>
                <span className="text-cyan-400 font-bold">Target 8.0</span>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="z-10 pt-2 border-t border-theme-border/60 dark:border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
              Cumulative GPA
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Square 3: Attendance Standing with Donut Meter */}
        <div
          onClick={() => onNavigate?.('attendance')}
          style={{ animationDelay: '150ms' }}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card p-5 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 flex flex-col justify-between group cursor-pointer animate-bento-in overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />

          {/* Top */}
          <div className="flex items-center justify-between z-10">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm group-hover:scale-105 transition-transform">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                s.overall_attendance >= 75
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/15 text-red-400 border-red-500/30'
              }`}
            >
              {s.overall_attendance >= 75 ? 'Safe Standing' : 'Review Required'}
            </span>
          </div>

          {/* Center */}
          <div className="my-2 flex items-center gap-4 z-10">
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke={s.overall_attendance >= 75 ? '#10b981' : '#ef4444'}
                  strokeWidth="5"
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 * (1 - s.overall_attendance / 100)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-sm font-extrabold ${s.overall_attendance >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {s.overall_attendance}%
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-theme-text">
                {s.classes_attended} / {s.classes_conducted} attended
              </div>
              <p className="text-[10px] text-theme-muted mt-0.5 leading-relaxed">
                4 classes to restore Networks to 75%
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="z-10 pt-2 border-t border-theme-border/60 dark:border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
              Attendance Health
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Square 4: Dynamic Skill Readiness Card */}
        <div
          onClick={() => onNavigate?.('placement' as any)}
          style={{ animationDelay: '200ms' }}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card p-5 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 flex flex-col justify-between group cursor-pointer animate-bento-in overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-colors" />

          {/* Top */}
          <div className="flex items-center justify-between z-10">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm group-hover:scale-105 transition-transform">
              <Brain className="w-4.5 h-4.5" />
            </div>
            {placementAttempts?.latestAttempt ? (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  placementAttempts.latestAttempt.level === 'Job-ready'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : placementAttempts.latestAttempt.level === 'Intermediate'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/15 text-red-400 border-red-500/30'
                }`}
              >
                {placementAttempts.latestAttempt.level}
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Placement Ready
              </span>
            )}
          </div>

          {/* Center: Latest Score or 'Take your first test' */}
          <div className="my-2 z-10">
            {placementAttempts?.latestAttempt ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black tracking-tight ${
                    placementAttempts.latestAttempt.level === 'Job-ready'
                      ? 'text-emerald-400'
                      : placementAttempts.latestAttempt.level === 'Intermediate'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}>
                    {placementAttempts.latestAttempt.percentage}%
                  </span>
                  <span className="text-xs text-theme-muted font-bold truncate max-w-[120px]">
                    {placementAttempts.latestAttempt.trackName}
                  </span>
                </div>
                <p className="text-[10px] text-theme-muted mt-1 leading-relaxed">
                  Score: {placementAttempts.latestAttempt.score} / {placementAttempts.latestAttempt.total} · Click to review
                </p>
              </div>
            ) : (
              <div>
                <div className="text-sm font-extrabold text-theme-text group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>Take your first test</span>
                </div>
                <p className="text-[10px] text-theme-muted mt-1 leading-relaxed">
                  Evaluate branch MCQ domain readiness in 10 minutes.
                </p>
              </div>
            )}
          </div>

          {/* Bottom */}
          <div className="z-10 pt-2 border-t border-theme-border/60 dark:border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
              Skill Readiness
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* ── HERO ROW: 2x2 LARGE RECTANGLE (3D BOT) + 1x2 TALL RECTANGLE (CALENDAR) ── */}

        {/* Hero Card: 3D AI Assistant Companion (2x2 Large Rectangle) */}
        <div
          style={{ animationDelay: '250ms' }}
          className="col-span-12 lg:col-span-8 bento-card bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 p-5 sm:p-6 rounded-[22px] flex flex-col justify-between animate-bento-in relative overflow-hidden shadow-2xl"
        >
          <OrbBot3D onNavigate={onNavigate} />
        </div>

        {/* Tall Rectangle 1: Personalised Campus News Feed (1x2 Tall Rectangle) */}
        <CampusNewsCard onNavigate={onNavigate} />

        {/* ── MIDDLE ROW: 2x1/3x1 WIDE RECTANGLE (CHARTS) + 1x2 TALL RECTANGLE (ATTENDANCE CALENDAR) ── */}

        {/* Wide Rectangle: Academic Performance Trajectory & Continuity (2x1 / 3x1 Wide) */}
        <div
          style={{ animationDelay: '350ms' }}
          className="col-span-12 lg:col-span-8 bento-card p-5 sm:p-6 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 rounded-[22px] space-y-5 animate-bento-in"
        >
          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-border/60 dark:border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-theme-text tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Academic Trajectory & Continuity</span>
              </h3>
              <p className="text-[11px] text-theme-muted mt-0.5">
                Semester SGPA progression benchmarked alongside monthly continuous evaluations
              </p>
            </div>

            <div className="flex gap-2">
              {(['semester', 'monthly'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setPerfTab(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    perfTab === t
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-900/30'
                      : 'bg-theme-secondary/70 text-theme-muted hover:text-theme-text border border-theme-border/60'
                  }`}
                >
                  {t === 'semester' ? 'Semester SGPA' : 'Monthly Internals'}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Trend Chart */}
          <div className="h-56">
            {perfTab === 'semester' ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={s.sgpa_history}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
                  <XAxis dataKey="semester" tick={{ fill: chartPalette.text, fontSize: 11 }} />
                  <YAxis domain={[5, 10]} tick={{ fill: chartPalette.text, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartPalette.tooltipBg,
                      borderColor: chartPalette.tooltipBorder,
                      color: chartPalette.tooltipText,
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sgpa"
                    stroke={chartPalette.primary}
                    strokeWidth={3}
                    dot={{ fill: chartPalette.primary, r: 5 }}
                    activeDot={{ r: 7, fill: '#22d3ee' }}
                    name="SGPA"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_MARKS}>
                  <defs>
                    <linearGradient id="markBentoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
                  <XAxis dataKey="month" tick={{ fill: chartPalette.text, fontSize: 11 }} />
                  <YAxis domain={[60, 90]} tick={{ fill: chartPalette.text, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartPalette.tooltipBg,
                      borderColor: chartPalette.tooltipBorder,
                      color: chartPalette.tooltipText,
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="marks"
                    stroke={chartPalette.primary}
                    fill="url(#markBentoGrad)"
                    strokeWidth={2.5}
                    name="Internal Marks %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Secondary Strip: Monthly Attendance Continuity */}
          <div className="pt-3 border-t border-theme-border/60 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-theme-text flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Monthly Attendance Continuity (75% Minimum Benchmark)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Consistently Above Cutoff</span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_ATTENDANCE}>
                  <defs>
                    <linearGradient id="attBentoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
                  <XAxis dataKey="month" tick={{ fill: chartPalette.text, fontSize: 10 }} />
                  <YAxis domain={[60, 100]} tick={{ fill: chartPalette.text, fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartPalette.tooltipBg,
                      borderColor: chartPalette.tooltipBorder,
                      color: chartPalette.tooltipText,
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pct"
                    stroke="#06b6d4"
                    fill="url(#attBentoGrad)"
                    strokeWidth={2}
                    name="Attendance %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tall Rectangle 1: Interactive Lecture Attendance Calendar (Moved directly BELOW Campus News Card) */}
        <div
          style={{ animationDelay: '400ms' }}
          className="col-span-12 lg:col-span-4 bento-card p-5 sm:p-6 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 rounded-[22px] flex flex-col justify-between animate-bento-in"
        >
          <div>
            <div className="flex items-center justify-between border-b border-theme-border/60 dark:border-white/10 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-theme-text tracking-tight flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Attendance · {calMonth}</span>
                </h3>
                <p className="text-[10px] text-theme-muted mt-0.5">
                  Tap any date cell to view faculty check-in
                </p>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                Oct Active
              </span>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-[9px] font-bold text-theme-muted uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {calCells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                const st = dayStatus(day);
                const key = `2025-10-${String(day).padStart(2, '0')}`;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(selectedDate === key ? null : key)}
                    className={`aspect-square flex items-center justify-center text-xs rounded-xl border transition-all ${
                      st
                        ? statusColor[st]
                        : 'text-theme-muted border-transparent hover:bg-theme-secondary/80'
                    } ${selectedDate === key ? 'ring-2 ring-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.4)]' : ''}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-theme-border/60 dark:border-white/10 mt-3">
              {[
                ['present', 'Present', 'bg-emerald-500'],
                ['absent', 'Absent', 'bg-red-500'],
                ['partial', 'Partial', 'bg-amber-500'],
                ['holiday', 'Holiday', 'bg-slate-500'],
              ].map(([k, l, c]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${c}`} />
                  <span className="text-[10px] text-theme-muted">{l}</span>
                </div>
              ))}
            </div>

            {/* Selected day roster detail */}
            {selectedDate && DAY_LECTURES[selectedDate] && (
              <div className="mt-3 space-y-2 border-t border-theme-border/60 dark:border-white/10 pt-3">
                <p className="text-xs font-bold text-theme-text flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Roster for {selectedDate}</span>
                </p>
                {DAY_LECTURES[selectedDate].map((lec, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs p-2 rounded-xl bg-theme-secondary/40 border border-theme-border/60 dark:border-white/5"
                  >
                    <div>
                      <span className="font-semibold text-theme-text block text-[11px]">{lec.subject}</span>
                      <span className="text-[9.5px] text-theme-muted">{lec.time} · {lec.faculty}</span>
                    </div>
                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                        lec.status === 'Present'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {lec.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedDate && !DAY_LECTURES[selectedDate] && (
              <p className="text-xs text-theme-muted mt-3 border-t border-theme-border/60 dark:border-white/10 pt-2">
                No lecture detail recorded for this date.
              </p>
            )}
          </div>
        </div>

        {/* ── ASSESSMENT ROW: CONTINUOUS EVALUATIONS & PRIORITY ACTION ── */}
        <div
          style={{ animationDelay: '450ms' }}
          className="col-span-12 bento-card p-5 sm:p-6 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 rounded-[22px] animate-bento-in"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Left: Assessment Feed */}
            <div className="flex-1">
              <div className="flex items-center justify-between border-b border-theme-border/60 dark:border-white/10 pb-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-theme-text tracking-tight flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span>Assessment Feed</span>
                  </h3>
                  <p className="text-[10px] text-theme-muted mt-0.5">
                    Continuous evaluation & lab practicals
                  </p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Latest 5
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {ASSESSMENT_HISTORY.slice(0, 5).map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-theme-secondary/40 border border-theme-border/60 dark:border-white/5 hover:border-blue-500/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-theme-text truncate">{a.subject}</p>
                      <p className="text-[10px] text-theme-muted">{a.type} · {a.date}</p>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        a.pct >= 85
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : a.pct >= 70
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {a.score}/{a.max} ({a.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Actionable Warning Banner */}
            <div className="lg:w-80 flex-shrink-0 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col justify-between">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-red-300 leading-relaxed">
                  <strong className="text-red-400 font-bold block mb-0.5">Priority Attendance Action</strong>
                  Computer Networks is at <strong>71% attendance</strong>. Attending the next 4 scheduled lectures restores safe eligibility.
                </div>
              </div>
              <button
                onClick={() => onNavigate?.('attendance')}
                className="mt-3 text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors flex items-center justify-end gap-1"
              >
                <span>View Attendance Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>


        {/* ── BOTTOM ROW: 4 x 1x1 SQUARE SNAPSHOT CARDS ─────────────────────────── */}

        {/* Square Snapshot 1: Top Course */}
        <div
          style={{ animationDelay: '450ms' }}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card p-5 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 rounded-[22px] flex flex-col justify-between animate-bento-in"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400/30" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
              Top Course
            </span>
          </div>
          <div className="my-2">
            <div className="text-lg font-bold text-theme-text truncate">{strongSub.name}</div>
            <div className="text-xs font-bold text-blue-400 mt-0.5">{strongSub.internal_pct}% Internal Score</div>
            <div className="text-[10px] text-theme-muted mt-0.5">{strongSub.faculty}</div>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Grade A+ Projected
          </div>
        </div>

        {/* Square Snapshot 2: Priority Focus */}
        <div
          style={{ animationDelay: '500ms' }}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card p-5 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 rounded-[22px] flex flex-col justify-between animate-bento-in"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
              Focus Area
            </span>
          </div>
          <div className="my-2">
            <div className="text-lg font-bold text-theme-text truncate">{weakSub.name}</div>
            <div className="text-xs font-bold text-red-400 mt-0.5">{weakSub.internal_pct}% Internal Score</div>
            <div className="text-[10px] text-theme-muted mt-0.5">{weakSub.faculty}</div>
          </div>
          <div className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Action Plan Active
          </div>
        </div>

        {/* Square Snapshot 3: Peak SGPA Record */}
        <div
          style={{ animationDelay: '550ms' }}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card p-5 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 rounded-[22px] flex flex-col justify-between animate-bento-in"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Peak SGPA
            </span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-emerald-400">{bestSem.sgpa.toFixed(2)}</div>
            <div className="text-xs font-semibold text-theme-text mt-0.5">Highest Semester Record</div>
            <div className="text-[10px] text-theme-muted mt-0.5">{bestSem.semester} Milestone</div>
          </div>
          <div className="text-[10px] text-theme-muted">
            Institutional Benchmark: 8.00
          </div>
        </div>

        {/* Square Snapshot 4: Lowest Semester Benchmark */}
        <div
          style={{ animationDelay: '600ms' }}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card p-5 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 rounded-[22px] flex flex-col justify-between animate-bento-in"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-theme-secondary border border-theme-border flex items-center justify-center text-theme-muted">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-theme-secondary text-theme-muted border border-theme-border">
              Baseline Dip
            </span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-theme-text">{worstSem.sgpa.toFixed(2)}</div>
            <div className="text-xs font-semibold text-theme-muted mt-0.5">Turnaround Starting Point</div>
            <div className="text-[10px] text-theme-muted mt-0.5">{worstSem.semester} Milestone</div>
          </div>
          <div className="text-[10px] text-cyan-400 font-semibold">
            +1.30 SGPA turnaround since S1
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export function StudentAnalyticsPage() {
  const { chartPalette } = useTheme();
  const s = useStudentRecord();
  const [semFilter, setSemFilter] = useState('All');

  const subjectComparison = s.subjects.map(sub => ({
    subject: sub.name.split(' ').slice(-1)[0],
    internals: sub.internal_pct,
    attendance: s.subject_attendance.find(a => a.subject === sub.name)?.pct ?? 0,
  }));

  const monthDelta = MONTHLY_MARKS.map((m, i) => ({
    month: m.month,
    marks: m.marks,
    delta: i === 0 ? 0 : m.marks - MONTHLY_MARKS[i - 1].marks,
  }));

  const riskIndicators = [
    { label: 'Computer Networks attendance below 75%', level: 'High' as const, note: 'Currently 71%' },
    { label: 'Software Engineering attendance below 75%', level: 'High' as const, note: 'Currently 71%' },
    { label: 'Coding score (58/100) below placement threshold', level: 'Watch' as const, note: 'Target ≥65' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">Analytics</h1>
        <p className="text-sm text-theme-muted mt-0.5">Detailed academic and engagement analysis</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {['All','Sem 3','Sem 4','Sem 5'].map(v => (
          <button key={v} onClick={() => setSemFilter(v)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${semFilter === v ? 'btn-primary' : 'bg-theme-secondary text-theme-muted border border-theme-border hover:text-theme-text'}`}>
            {v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SGPA trend */}
        <SectionCard title="SGPA Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={s.sgpa_history}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
              <XAxis dataKey="semester" tick={{ fill: chartPalette.text, fontSize: 11 }} />
              <YAxis domain={[5, 10]} tick={{ fill: chartPalette.text, fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: chartPalette.tooltipBg,
                  borderColor: chartPalette.tooltipBorder,
                  color: chartPalette.tooltipText,
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="sgpa" stroke={chartPalette.accent} strokeWidth={2.5} dot={{ fill: chartPalette.accent, r: 4 }} name="SGPA" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Subject comparison */}
        <SectionCard title="Subject Comparison (Internals vs Attendance)">
          <div className="space-y-3">
            {subjectComparison.map((sub, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-theme-text font-medium">{sub.subject}</span>
                  <span className="text-theme-muted">{sub.internals}% int · {sub.attendance}% att</span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-theme-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${sub.internals}%`, backgroundColor: chartPalette.accent }} />
                  </div>
                  <div className="h-1.5 bg-theme-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${sub.attendance < 75 ? 'bg-red-400' : 'bg-emerald-400'}`} style={{ width: `${sub.attendance}%` }} />
                  </div>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-theme-muted italic">Accent = internals, Emerald/Red = attendance. Charts do not imply causation.</p>
          </div>
        </SectionCard>

        {/* Month-on-month delta */}
        <SectionCard title="Month-on-Month Internal Marks Change">
          <div className="grid grid-cols-5 gap-2">
            {monthDelta.map((m) => (
              <div key={m.month} className={`panel-raised p-3 rounded-xl border border-theme-border text-center ${m.delta > 0 ? 'bg-emerald-500/5 border-emerald-500/20' : m.delta < 0 ? 'bg-red-500/5 border-red-500/20' : ''}`}>
                <p className="text-[10px] text-theme-muted">{m.month}</p>
                <p className="text-sm font-bold text-theme-text">{m.marks}%</p>
                {m.delta !== 0 && (
                  <p className={`text-[10px] font-bold ${m.delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {m.delta > 0 ? '+' : ''}{m.delta}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Risk indicators */}
        <SectionCard title="Risk Indicators (Rule-Based)">
          <p className="text-[10px] text-theme-muted italic mb-2">These are rule-based threshold checks, not trained AI predictions.</p>
          <div className="space-y-2.5">
            {riskIndicators.map((r, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${r.level === 'High' ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${r.level === 'High' ? 'text-red-400' : 'text-amber-400'}`} />
                <div>
                  <p className={`text-xs font-semibold ${r.level === 'High' ? 'text-red-300' : 'text-amber-300'}`}>{r.label}</p>
                  <p className="text-[10px] text-theme-muted mt-0.5">{r.note}</p>
                </div>
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${r.level === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {r.level}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ─── Performance ─────────────────────────────────────────────────────────────

export function StudentPerformancePage() {
  const { chartPalette } = useTheme();
  const s = useStudentRecord();
  const [selSem, setSelSem] = useState('Sem 5');
  const curSgpa = s.sgpa_history.find(h => h.semester === selSem)?.sgpa ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">Performance</h1>
        <p className="text-sm text-theme-muted mt-0.5">Academic records, marks, and subject analysis</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile label="CGPA (Overall)" value={s.cgpa.toFixed(2)} accent="text-theme-accent" />
        <MetricTile label={`SGPA (${selSem})`} value={curSgpa.toFixed(2)} accent="text-theme-accent" />
        <MetricTile label="Internal Avg" value={`${s.internal_marks}%`} accent="text-emerald-400" />
        <MetricTile label="Active Backlogs" value={s.backlogs} accent={s.backlogs > 0 ? 'text-red-400' : 'text-emerald-400'} sub={s.backlogs === 0 ? 'Clear!' : 'Subjects with backlog'} />
      </div>

      {/* Semester selector */}
      <div className="flex gap-2 flex-wrap">
        {s.sgpa_history.map(h => (
          <button key={h.semester} onClick={() => setSelSem(h.semester)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selSem === h.semester ? 'btn-primary' : 'bg-theme-secondary text-theme-muted border border-theme-border hover:text-theme-text'}`}>
            {h.semester}
          </button>
        ))}
      </div>

      {/* SGPA bar chart */}
      <SectionCard title="Semester SGPA">
        <div className="flex items-end gap-2 h-32">
          {s.sgpa_history.map(h => {
            const pct = ((h.sgpa - 5) / 5) * 100;
            const isSelected = h.semester === selSem;
            return (
              <div key={h.semester} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs font-bold text-theme-text">{h.sgpa.toFixed(1)}</span>
                <div className="w-full relative" style={{ height: `${Math.max(pct, 10)}%` }}>
                  <div
                    className={`absolute inset-0 rounded-t-lg transition-all ${isSelected ? 'opacity-100 ring-2 ring-theme-accent' : 'opacity-40'}`}
                    style={{ backgroundColor: chartPalette.accent }}
                  />
                </div>
                <span className="text-[10px] text-theme-muted">{h.semester.replace('Sem ','S')}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-theme-muted">Best: {s.sgpa_history.reduce((a,b)=>a.sgpa>b.sgpa?a:b).semester} · Lowest: {s.sgpa_history.reduce((a,b)=>a.sgpa<b.sgpa?a:b).semester}</p>
      </SectionCard>

      {/* Subject table */}
      <SectionCard title="Subject Performance — Sem 5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-theme-border text-theme-muted">
                {['Subject','Test 1','Test 2','Assignment','Practical','Internal %','Grade','Status'].map(h => (
                  <th key={h} className="text-left py-2 px-2 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.subjects.map((sub, i) => (
                <tr key={i} className="border-b border-theme-border/50 hover:bg-theme-secondary/40 transition-colors">
                  <td className="py-2.5 px-2 font-semibold text-theme-text">{sub.name}</td>
                  <td className="py-2.5 px-2 text-theme-muted">{sub.test1}/20</td>
                  <td className="py-2.5 px-2 text-theme-muted">{sub.test2}/20</td>
                  <td className="py-2.5 px-2 text-theme-muted">{sub.assignment}/10</td>
                  <td className="py-2.5 px-2 text-theme-muted">{sub.practical}/25</td>
                  <td className="py-2.5 px-2 font-bold text-theme-text">{sub.internal_pct}%</td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 rounded bg-theme-accent/15 text-theme-accent font-bold">{sub.grade}</span>
                    <span className="text-[9px] text-theme-muted ml-1">(provisional)</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sub.status==='Safe' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Assessment history */}
      <SectionCard title="Assessment History">
        <div className="space-y-2">
          {ASSESSMENT_HISTORY.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-theme-border/50">
              <div>
                <p className="text-xs font-semibold text-theme-text">{a.subject} — {a.type}</p>
                <p className="text-[10px] text-theme-muted">{a.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-theme-text">{a.score}/{a.max}</p>
                <span className={`text-[10px] font-bold ${a.pct>=80?'text-emerald-400':a.pct>=60?'text-amber-400':'text-red-400'}`}>
                  {a.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
