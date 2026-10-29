import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  Brain,
  GraduationCap,
  Users,
  Target,
  CheckCircle2,
  Database,
  BarChart3,
  Award,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Layers,
  HelpCircle,
  FileText,
  Clock,
  Calendar,
  CreditCard,
  MessageSquare,
  User,
  Settings,
  FolderOpen,
  Check,
  Search,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import type { PortalRole } from '../data/portalData';
import { ThemeSwitcher } from '../components/common/ThemeSwitcher';

interface LandingPageProps {
  onGoToLogin: (initialRole?: PortalRole) => void;
}

// ─── HOOK: Respect Prefers Reduced Motion ────────────────────────────────────
function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reducedMotion;
}

// ─── HOOK: Scroll Progress (0 to 100) ────────────────────────────────────────
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
      setProgress(pct);
      setScrolled(current > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, scrolled };
}

// ─── HOOK: While In View Trigger (once: true) ────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── COMPONENT: Count-Up Stat ───────────────────────────────────────────────
function CountUpStat({ end, suffix = '', duration = 1200 }: { end: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView(0.2);

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setVal(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setVal(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

// ─── COMPACT RECHARTS MOCKUP DATA ───────────────────────────────────────────
const MOCK_MONTHLY_DATA = [
  { month: 'Jun', score: 68 },
  { month: 'Jul', score: 72 },
  { month: 'Aug', score: 70 },
  { month: 'Sep', score: 75 },
  { month: 'Oct', score: 78 },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const { progress, scrolled } = useScrollProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Parallax/Tilt state for Hero Mockup
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8; // max 4 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  // In-View hooks for staggered sections
  const heroInView = useInView(0.1);
  const featuresInView = useInView(0.1);
  const howItWorksInView = useInView(0.1);
  const rolesInView = useInView(0.1);
  const statsInView = useInView(0.1);
  const faqInView = useInView(0.1);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden transition-colors duration-200">
      {/* ─── 0. TOP SCROLL PROGRESS BAR (Thin Progress Line) ────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-gradient-to-r from-[#014BAA] via-cyan-400 to-[#014BAA] transition-all duration-100 ease-out"
        style={{
          width: `${progress}%`,
          opacity: scrolled ? 1 : 0,
        }}
      />

      {/* ─── 1. STICKY NAVBAR (Blur & Shrink on Scroll) ──────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-theme-surface/90 backdrop-blur-xl border-b border-theme-border shadow-[0_12px_32px_rgba(0,0,0,0.25)]'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#014BAA] to-[#0EA5E9] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-theme-text">CampusIQ</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  2.0
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider text-theme-muted uppercase -mt-0.5">
                Smart Campus Analytics
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-bold text-theme-muted">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-cyan-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-cyan-400 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="hover:text-cyan-400 transition-colors"
            >
              For Roles
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-cyan-400 transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeSwitcher />

            <button
              onClick={() => onGoToLogin()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-theme-text bg-theme-elevated border border-theme-border hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
            >
              Portal Login
            </button>

            <button
              onClick={() => onGoToLogin('student')}
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_4px_20px_rgba(59,130,246,0.35)] transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-theme-elevated border border-theme-border text-theme-muted hover:text-theme-text"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-theme-surface/95 backdrop-blur-2xl border-b border-theme-border px-4 py-5 space-y-3 mt-3 animate-fade-in">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-xs font-bold text-theme-muted hover:text-cyan-400"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-xs font-bold text-theme-muted hover:text-cyan-400"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="block w-full text-left py-2 text-xs font-bold text-theme-muted hover:text-cyan-400"
            >
              For Roles
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left py-2 text-xs font-bold text-theme-muted hover:text-cyan-400"
            >
              FAQ
            </button>
            <div className="pt-2 border-t border-theme-border grid grid-cols-2 gap-2">
              <button
                onClick={() => onGoToLogin()}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-theme-text bg-theme-elevated border border-theme-border text-center"
              >
                Portal Login
              </button>
              <button
                onClick={() => onGoToLogin('student')}
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-cyan-500 text-center"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── 2. HERO SECTION WITH PARALLAX MOCKUP ────────────────────────────── */}
      <section
        ref={heroInView.ref}
        className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden"
      >
        {/* Ambient Brand Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#014BAA]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className="text-center max-w-3xl mx-auto space-y-5 transition-all duration-700"
            style={{
              opacity: heroInView.inView || reducedMotion ? 1 : 0,
              transform: heroInView.inView || reducedMotion ? 'translateY(0)' : 'translateY(32px)',
            }}
          >
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(14,165,233,0.18)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-extrabold text-cyan-400 tracking-wide">
                Autonomous Student & Faculty Intelligence
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-theme-text leading-[1.12]">
              Turn Fragmented Campus Data Into{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-[#014BAA] to-[#0EA5E9] bg-clip-text text-transparent">
                Student Success
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-theme-muted leading-relaxed max-w-2xl mx-auto">
              CampusIQ continuously correlates attendance, continuous assessment tests, LMS engagement, and career telemetry into transparent, explainable success scores with deterministic early risk interventions.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onGoToLogin('student')}
                className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_4px_24px_rgba(59,130,246,0.35)] transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>Get Started (Portal Login)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onGoToLogin('student')}
                className="px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-theme-text bg-theme-elevated border border-theme-border hover:border-cyan-500/40 hover:bg-theme-secondary transition-all"
              >
                Student Portal Login
              </button>

              <button
                onClick={() => onGoToLogin('faculty')}
                className="px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-theme-muted hover:text-theme-text hover:bg-theme-secondary/50 rounded-2xl border border-transparent hover:border-theme-border transition-all"
              >
                Faculty Portal Login
              </button>
            </div>
          </div>

          {/* ─── HERO PREVIEW CARD (Dashboard Preview Mockup from Real UI Components) ─── */}
          <div
            className="mt-14 sm:mt-16 relative mx-auto max-w-5xl transition-all duration-700"
            style={{
              opacity: heroInView.inView || reducedMotion ? 1 : 0,
              transform: heroInView.inView || reducedMotion
                ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(0)`
                : 'perspective(1000px) translateY(40px)',
              transition: reducedMotion ? 'none' : 'transform 0.15s ease-out, opacity 0.7s ease-out',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Top Border Glow Accent */}
            <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-[#014BAA] via-cyan-400 to-[#014BAA] opacity-35 blur-md pointer-events-none" />

            {/* Card Body */}
            <div className="relative rounded-[26px] bg-[#141414]/95 dark:bg-[#0e0c18]/95 border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl p-5 sm:p-7 space-y-6 text-[#f8fafc]">
              {/* Header Bar of Mockup */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#014BAA] to-[#0EA5E9] text-white flex items-center justify-center font-black text-sm">
                    GS
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-white">Ganesh Sharma</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        Roll: CS21B022
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Computer Science · 3rd Year · Sem 5</p>
                  </div>
                </div>

                {/* Illustrative Demo Data Tag */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300">
                    Illustrative demo data
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-extrabold text-cyan-400">
                    In Good Standing
                  </span>
                </div>
              </div>

              {/* Bento Grid Metrics inside Mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Success Score */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Composite Success Score
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-black text-white">78</span>
                    <span className="text-xs text-cyan-400 font-bold">/ 100</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>Verified: 0 Backlogs</span>
                  </div>
                </div>

                {/* 2. Attendance Health */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Attendance Health
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-black text-cyan-400">78%</span>
                    <span className="text-xs text-slate-400 font-bold">94/120</span>
                  </div>
                  <div className="mt-2 text-[10px] text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Watch: Networks (71%)</span>
                  </div>
                </div>

                {/* 3. Internal Mark Progress */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Continuous Internals
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-black text-white">72%</span>
                    <span className="text-xs text-slate-400 font-bold">Grade B+</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-cyan-400" />
                    <span>Top: OS (84% - Grade A)</span>
                  </div>
                </div>

                {/* 4. Placement Readiness */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Placement Readiness
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-black text-white">65%</span>
                    <span className="text-xs text-cyan-400 font-bold">Active</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>Mock Interview Cleared</span>
                  </div>
                </div>
              </div>

              {/* Lower Section inside Mockup */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
                {/* Enrolled Courses Strip */}
                <div className="lg:col-span-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Enrolled Subjects & Faculty Workspaces</span>
                    </span>
                    <span className="text-[10px] text-slate-500">5 Active Courses</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { code: 'CS501', name: 'Machine Learning', faculty: 'Dr. Priya Menon', att: '85%' },
                      { code: 'CS502', name: 'Computer Networks', faculty: 'Prof. Suresh Kumar', att: '71%' },
                      { code: 'CS503', name: 'Operating Systems', faculty: 'Dr. Anita Bose', att: '88%' },
                      { code: 'CS504', name: 'Database Systems', faculty: 'Dr. Priya Menon', att: '75%' },
                    ].map(sub => (
                      <div
                        key={sub.code}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono text-[10px] font-bold text-cyan-400 mr-1.5">
                            {sub.code}
                          </span>
                          <span className="font-bold text-white text-[11px]">{sub.name}</span>
                          <p className="text-[10px] text-slate-400">{sub.faculty}</p>
                        </div>
                        <span className="text-[11px] font-bold text-slate-300">{sub.att}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Trajectory Chart inside Mockup */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Semester Trend</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold">+10% Growth</span>
                  </div>
                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MOCK_MONTHLY_DATA} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                        <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[50, 100]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#141414', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                        />
                        <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. HONEST STATS STRIP (No Fake User Counts) ─────────────────────── */}
      <section
        ref={statsInView.ref}
        className="py-12 border-y border-theme-border bg-theme-surface/50 transition-all duration-700"
        style={{
          opacity: statsInView.inView || reducedMotion ? 1 : 0,
          transform: statsInView.inView || reducedMotion ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {/* Stat 1 */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-theme-text flex items-center justify-center gap-1">
                <CountUpStat end={7} />
              </div>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Deterministic Domains
              </p>
              <p className="text-[11px] text-theme-muted">
                Academics, Attendance, LMS, Skills, Placement, Co-curricular, Feedback
              </p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-theme-text flex items-center justify-center gap-1">
                <span>0%</span>
              </div>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Penitent Skew
              </p>
              <p className="text-[11px] text-theme-muted">
                Missing metrics never penalized as zero; dynamic weight re-normalization
              </p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-theme-text flex items-center justify-center gap-1">
                <CountUpStat end={100} suffix="%" />
              </div>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Explainable Scoring
              </p>
              <p className="text-[11px] text-theme-muted">
                Transparent rubric audit viewable by students, faculty, and deans
              </p>
            </div>

            {/* Stat 4 */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-theme-text flex items-center justify-center gap-1">
                <CountUpStat end={4} />
              </div>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Actionable Risk Tiers
              </p>
              <p className="text-[11px] text-theme-muted">
                Low, Moderate, High, and Insufficient Data cohorts with intervention center
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. FEATURES BENTO (Covering ALL 11 App Features) ────────────────── */}
      <section
        id="features"
        ref={featuresInView.ref}
        className="py-20 sm:py-28 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center max-w-3xl mx-auto space-y-3 mb-14 transition-all duration-700"
            style={{
              opacity: featuresInView.inView || reducedMotion ? 1 : 0,
              transform: featuresInView.inView || reducedMotion ? 'translateY(0)' : 'translateY(24px)',
            }}
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              Comprehensive Campus Ecosystem
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-theme-text tracking-tight">
              One Unified Platform Across Every Student Need
            </h2>
            <p className="text-xs sm:text-sm text-theme-muted max-w-xl mx-auto">
              Every critical dimension of campus life united in an interconnected cyber glass interface without fragmented portals.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Student Dashboard */}
            <div className="panel p-6 rounded-2xl border border-theme-border hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(14,165,233,0.14)] transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#014BAA]/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                1. Student Dashboard
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Adaptive bento overview showcasing composite success score, real-time risk indicators, attendance health, and daily lecture rosters.
              </p>
            </div>

            {/* 2. Academic Analytics */}
            <div className="panel p-6 rounded-2xl border border-theme-border hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(14,165,233,0.14)] transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#014BAA]/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                2. Academic Analytics
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Longitudinal SGPA history across semesters, multi-dimensional radar profiles, percentile ranking within department cohorts.
              </p>
            </div>

            {/* 3. Performance Hub */}
            <div className="panel p-6 rounded-2xl border border-theme-border hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(14,165,233,0.14)] transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#014BAA]/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                3. Performance Hub
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Continuous internal assessment breakdown (CAT 1, CAT 2, Lab Practicals, Assignments), backlog alerts, and grade trajectories.
              </p>
            </div>

            {/* 4. Attendance Telemetry */}
            <div className="panel p-6 rounded-2xl border border-theme-border hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(14,165,233,0.14)] transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#014BAA]/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                4. Attendance Telemetry
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Day-by-day interactive calendar, early warning alerts before falling under the 75% threshold, and exact classes needed to restore standing.
              </p>
            </div>

            {/* 5. Classroom Ecosystem (Large Span) */}
            <div className="panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-theme-surface to-theme-elevated lg:col-span-2 space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  New 6-Tab Ecosystem
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                  5. Classroom & Subject Workspaces
                </h3>
                <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                  Dedicated classrooms for each enrolled course with 6 fully integrated interactive sections:
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-theme-elevated border border-theme-border">
                  <span className="font-bold text-cyan-400 block text-[11px]">Coursework</span>
                  <span className="text-[10px] text-theme-muted">Unit & topic accordions with lecture hours</span>
                </div>
                <div className="p-2.5 rounded-xl bg-theme-elevated border border-theme-border">
                  <span className="font-bold text-cyan-400 block text-[11px]">Resources</span>
                  <span className="text-[10px] text-theme-muted">Faculty file drops & reference material</span>
                </div>
                <div className="p-2.5 rounded-xl bg-theme-elevated border border-theme-border">
                  <span className="font-bold text-cyan-400 block text-[11px]">Assignments</span>
                  <span className="text-[10px] text-theme-muted">Deadlines, rubrics, and submission tracking</span>
                </div>
                <div className="p-2.5 rounded-xl bg-theme-elevated border border-theme-border">
                  <span className="font-bold text-cyan-400 block text-[11px]">Assessment Results</span>
                  <span className="text-[10px] text-theme-muted">Published vs Pending exams & feedback</span>
                </div>
                <div className="p-2.5 rounded-xl bg-theme-elevated border border-theme-border">
                  <span className="font-bold text-cyan-400 block text-[11px]">Quizzes</span>
                  <span className="text-[10px] text-theme-muted">Automated diagnostic checks & scores</span>
                </div>
                <div className="p-2.5 rounded-xl bg-theme-elevated border border-theme-border">
                  <span className="font-bold text-cyan-400 block text-[11px]">Discussion Forum</span>
                  <span className="text-[10px] text-theme-muted">Real-time doubts & faculty peer replies</span>
                </div>
              </div>
            </div>

            {/* 6. AI Progress Tracker */}
            <div className="panel p-6 rounded-2xl border border-theme-border hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(14,165,233,0.14)] transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#014BAA]/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                6. AI Progress Tracker
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Algorithmic recommendation engine generating personalized recovery steps, coding practice milestones, and industry certification targets.
              </p>
            </div>

            {/* 7. My Problem (Helpdesk) */}
            <div className="panel p-6 rounded-2xl border border-theme-border hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(14,165,233,0.14)] transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#014BAA]/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                7. My Problem (Helpdesk)
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Structured academic grievance channel with priority levels (Normal/Important) and transparent faculty response logs.
              </p>
            </div>

            {/* 8. Fees Management */}
            <div className="panel p-6 rounded-2xl border border-theme-border hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(14,165,233,0.14)] transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#014BAA]/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                8. Fees & Institutional Dues
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Comprehensive tuition ledger, merit scholarship disbursements, paid status, and download-ready receipt records.
              </p>
            </div>

            {/* 9. Feedback Loops */}
            <div className="panel p-6 rounded-2xl border border-theme-border hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(14,165,233,0.14)] transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#014BAA]/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                9. Feedback & Evaluations
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Continuous faculty evaluation surveys, student satisfaction scores (1–5 scale), and closed-loop mentorship feedback.
              </p>
            </div>

            {/* 10. Student Profile */}
            <div className="panel p-6 rounded-2xl border border-theme-border hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(14,165,233,0.14)] transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#014BAA]/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                10. Unified Student Profile
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Consolidated institutional identity card, verified credentials, department enrollment, and contact records.
              </p>
            </div>

            {/* 11. Calibration & Settings */}
            <div className="panel p-6 rounded-2xl border border-theme-border hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(14,165,233,0.14)] transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#014BAA]/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-theme-text group-hover:text-cyan-400 transition-colors">
                11. Platform Calibration & Settings
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Configurable scoring engine weights, dark/light theme switcher, multi-channel notification controls, and session managers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. HOW IT WORKS (With Scroll-Filling Progress Line) ──────────────── */}
      <section
        id="how-it-works"
        ref={howItWorksInView.ref}
        className="py-20 sm:py-28 bg-theme-surface/40 border-t border-theme-border relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center max-w-3xl mx-auto space-y-3 mb-16 transition-all duration-700"
            style={{
              opacity: howItWorksInView.inView || reducedMotion ? 1 : 0,
              transform: howItWorksInView.inView || reducedMotion ? 'translateY(0)' : 'translateY(24px)',
            }}
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              Deterministic Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-theme-text tracking-tight">
              How CampusIQ Works in 4 Steps
            </h2>
            <p className="text-xs sm:text-sm text-theme-muted max-w-xl mx-auto">
              From raw campus databases to closed-loop interventions without speculative AI hallucination.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Scroll-Filling Connecting Line */}
            <div className="hidden md:block absolute top-6 bottom-6 left-[23px] w-[2px] bg-theme-border">
              <div
                className="w-full bg-gradient-to-b from-cyan-400 to-[#014BAA] transition-all duration-300"
                style={{
                  height: howItWorksInView.inView ? '100%' : '0%',
                }}
              />
            </div>

            <div className="space-y-10">
              {[
                {
                  step: '01',
                  title: 'Multi-Source Data Ingestion & Sync',
                  desc: 'Seamless ingestion of SIS records, biometrics, LMS logs, and exam databases. Automatic range verification and duplicate handling prevent corrupted analytics.',
                },
                {
                  step: '02',
                  title: 'Deterministic Normalization & Scoring',
                  desc: 'Each metric is weighted against institutional policy. Missing fields are never penalized as zero — the engine transparently re-normalizes available weights.',
                },
                {
                  step: '03',
                  title: 'Early Warning Risk Cohort Matrix',
                  desc: 'Students are automatically categorized into High, Moderate, and Low risk cohorts across academics and placement readiness weeks before exam debarment.',
                },
                {
                  step: '04',
                  title: 'Closed-Loop Mentorship & Interventions',
                  desc: 'Faculty assign remedial actions, track student acknowledgement, and measure outcome improvements directly through the intervention hub.',
                },
              ].map((item, idx) => (
                <div key={item.step} className="flex items-start gap-6 relative">
                  <div className="w-12 h-12 rounded-2xl bg-[#014BAA] text-cyan-400 border-2 border-cyan-500/40 flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-[#014BAA]/30 z-10">
                    {item.step}
                  </div>
                  <div className="panel p-5 sm:p-6 rounded-2xl border border-theme-border flex-1 space-y-1.5">
                    <h3 className="text-base font-extrabold text-theme-text">{item.title}</h3>
                    <p className="text-xs text-theme-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. FOR STUDENTS & FOR FACULTY (Two Columns) ─────────────────────── */}
      <section
        id="roles"
        ref={rolesInView.ref}
        className="py-20 sm:py-28 border-t border-theme-border relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center max-w-3xl mx-auto space-y-3 mb-16 transition-all duration-700"
            style={{
              opacity: rolesInView.inView || reducedMotion ? 1 : 0,
              transform: rolesInView.inView || reducedMotion ? 'translateY(0)' : 'translateY(24px)',
            }}
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              Role-Tailored Portals
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-theme-text tracking-tight">
              Tailored for Students and Faculty
            </h2>
            <p className="text-xs sm:text-sm text-theme-muted max-w-xl mx-auto">
              Designed around the workflows of students striving for growth and faculty dedicated to mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For Students */}
            <div className="panel p-6 sm:p-8 rounded-2xl border border-theme-border space-y-5">
              <div className="flex items-center gap-3 border-b border-theme-border pb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-theme-text">For Students</h3>
                  <p className="text-xs text-theme-muted">Empowerment through transparent progress</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-theme-muted">
                {[
                  'Live composite score with transparent, explainable component breakdown.',
                  'Real-time attendance recovery formula before exam debarment thresholds.',
                  '6-tab Classroom workspace with Coursework units, files, and discussion doubts.',
                  'Personalized career & placement roadmap with skill assessment checkpoints.',
                  'Direct student-faculty doubt submissions with tracked response timelines.',
                ].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-theme-text">{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => onGoToLogin('student')}
                  className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all text-center"
                >
                  Student Portal Login
                </button>
              </div>
            </div>

            {/* For Faculty */}
            <div className="panel p-6 sm:p-8 rounded-2xl border border-theme-border space-y-5">
              <div className="flex items-center gap-3 border-b border-theme-border pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#014BAA]/20 text-cyan-400 border border-[#014BAA] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-theme-text">For Faculty & Mentors</h3>
                  <p className="text-xs text-theme-muted">Targeted mentoring and cohort analytics</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-theme-muted">
                {[
                  'Early warning risk matrix highlighting at-risk students across sections.',
                  'Batch attendance entry and fast attendance management workflows.',
                  'Direct problem request resolution desk with reply thread support.',
                  'Student directory with holistic multi-dimensional risk audits.',
                  'Automated intervention creation and prescriptive action tracking.',
                ].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#014BAA] dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-theme-text">{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => onGoToLogin('faculty')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-theme-text bg-theme-elevated border border-theme-border hover:border-cyan-500/40 transition-all text-center"
                >
                  Faculty Portal Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FAQ ACCORDION ────────────────────────────────────────────────── */}
      <section
        id="faq"
        ref={faqInView.ref}
        className="py-20 sm:py-28 bg-theme-surface/30 border-t border-theme-border"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center space-y-3 mb-14 transition-all duration-700"
            style={{
              opacity: faqInView.inView || reducedMotion ? 1 : 0,
              transform: faqInView.inView || reducedMotion ? 'translateY(0)' : 'translateY(24px)',
            }}
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-theme-text tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does CampusIQ calculate the Student Success Score?',
                a: 'The Student Success Score is calculated via a deterministic algorithm across 7 core verified domains: Academic CGPA & internals, Attendance telemetry, LMS engagement, Skills evaluations, Placement readiness, Co-curricular certifications, and Faculty feedback. Every component is weighted according to institutional calibration.',
              },
              {
                q: 'What happens if a student has missing data (e.g. newly transferred or no LMS data)?',
                a: 'Missing indicators are never penalized as zero. The engine transparently re-normalizes the weights across present, verified data points to guarantee an accurate score without distorting administrative decisions.',
              },
              {
                q: 'Can students communicate directly with subject faculty?',
                a: 'Yes. The Classroom section features a dedicated Discussion Forum for subject-specific questions, while the My Problem page enables private academic doubts to be submitted with Priority levels (Normal/Important) and official faculty response tracking.',
              },
              {
                q: 'How is attendance calculated and how are debarment warnings handled?',
                a: 'Attendance is calculated live from institutional class logs. If a subject drops below 75%, an alert badge is highlighted and CampusIQ automatically calculates the exact number of consecutive classes required to restore good standing.',
              },
              {
                q: 'Is student data isolated and protected by role permissions?',
                a: 'Strict role-based boundaries ensure students can only view their own records. Faculty can view students enrolled in their assigned courses, and administrators manage institutional cohort weights with role isolation.',
              },
              {
                q: 'Does CampusIQ replace our existing ERP/LMS?',
                a: 'No, CampusIQ integrates with existing ERPs, Google Classrooms, and LMS databases via CSV/Excel ingestion or Supabase/REST APIs, acting as the intelligent analytical layer.',
              },
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="panel rounded-2xl border border-theme-border overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-theme-secondary/40 transition-colors"
                  >
                    <span className="text-sm font-bold text-theme-text pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-theme-muted leading-relaxed border-t border-theme-border/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 8. FINAL HIGH-IMPACT CTA ────────────────────────────────────────── */}
      <section className="py-20 border-t border-theme-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#014BAA]/20 via-transparent to-[#0EA5E9]/10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-theme-text tracking-tight">
            Ready to Experience Autonomous Campus Analytics?
          </h2>
          <p className="text-xs sm:text-sm text-theme-muted max-w-xl mx-auto">
            Experience the student, faculty, and administrative portals with instant demo accounts or sign in with your institutional credentials.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onGoToLogin('student')}
              className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_4px_24px_rgba(59,130,246,0.35)] transition-all flex items-center gap-2"
            >
              <span>Sign In (Portal Login)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onGoToLogin('student')}
              className="px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-theme-text bg-theme-elevated border border-theme-border hover:border-cyan-500/40 transition-all"
            >
              Student Portal Login
            </button>

            <button
              onClick={() => onGoToLogin('faculty')}
              className="px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-theme-muted hover:text-theme-text hover:bg-theme-secondary/40 rounded-2xl border border-theme-border transition-all"
            >
              Faculty Portal Login
            </button>
          </div>
        </div>
      </section>

      {/* ─── 9. FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-theme-border bg-theme-surface/70 text-xs text-theme-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#014BAA] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-theme-text text-sm">CampusIQ</span>
            <span className="text-theme-subtle">· Smart Campus Analytics</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[11px] font-semibold">
            <button onClick={() => scrollToSection('features')} className="hover:text-theme-text transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-theme-text transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection('roles')} className="hover:text-theme-text transition-colors">
              For Roles
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-theme-text transition-colors">
              FAQ
            </button>
            <button onClick={() => onGoToLogin()} className="hover:text-cyan-400 font-bold transition-colors">
              Portal Login
            </button>
          </div>

          <p className="text-[11px] text-theme-subtle">
            © {new Date().getFullYear()} CampusIQ Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
