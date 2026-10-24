import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  KeyRound,
  Activity,
} from 'lucide-react';
import type { PortalRole } from '../data/portalData';
import { useCurrentUser } from '../context/CurrentUserContext';
import { ThemeSwitcher } from '../components/common/ThemeSwitcher';

interface LoginPageProps {
  onSelectRole: (role: PortalRole, email: string) => void;
  onBackToHome?: () => void;
  initialRole?: PortalRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSelectRole,
  onBackToHome,
  initialRole,
}) => {
  const { login, isBackendConnected } = useCurrentUser();
  const [selectedRoleCard, setSelectedRoleCard] = useState<PortalRole>(initialRole || 'student');
  const [email, setEmail] = useState('ganesh.sharma22@edupulse.edu');
  const [password, setPassword] = useState('demo-password-2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDemoHelp, setShowDemoHelp] = useState(false);

  const handleRoleCardSelect = (role: PortalRole) => {
    setSelectedRoleCard(role);
    setErrorMessage(null);
    if (role === 'student') {
      setEmail('ganesh.sharma22@edupulse.edu');
      setPassword('student-demo-pass');
    } else if (role === 'faculty') {
      setEmail('priya.menon@edupulse.edu');
      setPassword('faculty-demo-pass');
    } else if (role === 'admin') {
      setEmail('dean.analytics@edupulse.edu');
      setPassword('admin-demo-pass');
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic inline validation
    if (!email.trim()) {
      setErrorMessage('Please enter your institutional email address.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid academic email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your portal password.');
      return;
    }

    setIsLoading(true);
    const result = await login(selectedRoleCard, email.trim(), password);
    setIsLoading(false);
    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      return;
    }
  };

  const roles = [
    {
      id: 'student' as PortalRole,
      title: 'Student Portal',
      icon: <GraduationCap className="w-5 h-5 text-blue-400" />,
      badge: 'Learner Access',
      description: 'Track your progress, attendance, and academic goals with explainable success breakdowns.',
      demoAccount: 'ganesh.sharma22@edupulse.edu',
    },
    {
      id: 'faculty' as PortalRole,
      title: 'Faculty Portal',
      icon: <Users className="w-5 h-5 text-cyan-400" />,
      badge: 'Academic Staff',
      description: 'Understand student performance, mark class attendance, and provide timely interventions.',
      demoAccount: 'priya.menon@edupulse.edu',
    },
    {
      id: 'admin' as PortalRole,
      title: 'Administrator Portal',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      badge: 'Campus Leadership',
      description: 'Explore institutional analytics, student intelligence, cohort segments, and CSV imports.',
      demoAccount: 'dean.analytics@edupulse.edu',
    },
  ];

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient radial glows */}
      <div className="absolute top-[-15%] left-[20%] w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[15%] w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle tech background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header bar */}
      <header className="relative z-10 px-6 sm:px-12 py-5 flex items-center justify-between border-b border-theme-border bg-theme-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-theme-surface rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-theme-text font-sans">
              CampusIQ
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest text-theme-muted px-2 py-0.5 rounded bg-theme-secondary border border-theme-border">
              Student Success Analytics
            </span>
            {isBackendConnected ? (
              <span className="ml-2 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                ● Supabase Connected
              </span>
            ) : (
              <span className="ml-2 text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                ○ Local Dataset Mode
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs font-semibold text-theme-muted hover:text-theme-text px-3.5 py-1.5 rounded-lg border border-theme-border bg-theme-surface hover:border-theme-accent/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Login Body */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-xl mx-auto space-y-6">
          {/* Spatial main login card */}
          <div className="panel border border-theme-border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-500" />

            {/* Header info */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Campus Authentication</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-text">
                Welcome to EduPulse
              </h1>
              <p className="text-xs sm:text-sm text-theme-muted">
                Sign in to turn campus insights into explainable student success.
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block">
                Select Your Role / Target Portal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => {
                  const isSelected = selectedRoleCard === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleCardSelect(r.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-theme-accent bg-theme-secondary shadow-md'
                          : 'border-theme-border bg-theme-surface hover:border-theme-accent/40 text-theme-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1 rounded-lg bg-theme-surface border border-theme-border">{r.icon}</div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-theme-accent shadow-sm" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-theme-text' : 'text-theme-muted'
                          }`}
                        >
                          {r.title.replace(' Portal', '')}
                        </div>
                        <div className="text-[10px] text-theme-muted truncate mt-0.5">
                          {r.badge}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-theme-text block mb-1.5">
                  Academic Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. ganesh.sharma22@edupulse.edu"
                    className="w-full bg-theme-secondary border border-theme-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-theme-text">
                    Portal Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        'Demo Notice: Single Sign-On and password recovery are managed via institutional Active Directory. Use Demo Mode access below.'
                      )
                    }
                    className="text-[11px] text-theme-accent hover:underline transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-theme-secondary border border-theme-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-theme-muted">
                <label className="flex items-center gap-2 cursor-pointer select-none text-theme-text">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-theme-border bg-theme-secondary text-theme-accent accent-theme-accent"
                  />
                  <span>Remember my session</span>
                </label>
                <span className="text-[11px] text-theme-muted">256-bit encryption</span>
              </div>

              {/* Submit Sign In button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider btn-primary text-white flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Portal Access...</span>
                  </>
                ) : (
                  <>
                    <span>Enter {selectedRoleCard.toUpperCase()} Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-theme-border" />
              </div>
              <span className="relative px-3 bg-theme-surface text-[10px] uppercase tracking-wider text-theme-muted font-bold">
                Or Continue Directly Via One-Click Role
              </span>
            </div>

            {/* Direct Instant Role Cards */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">
                Continue to Your Portal
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => onSelectRole(r.id, r.demoAccount)}
                    className="group p-3 rounded-xl border border-theme-border bg-theme-surface hover:bg-theme-secondary hover:border-theme-accent/50 transition-all text-left flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {r.icon}
                      <span className="text-xs font-bold text-theme-text group-hover:text-theme-accent transition">
                        {r.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-theme-muted line-clamp-2 leading-relaxed">
                      {r.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible Demo Access Credentials Box */}
          <div className="panel border border-theme-border rounded-xl p-4 space-y-2 text-xs">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowDemoHelp(!showDemoHelp)}
            >
              <div className="flex items-center gap-2 text-theme-accent font-bold text-xs">
                <KeyRound className="w-4 h-4" />
                <span>Demo Access Credentials</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-theme-accent/15 border border-theme-accent/30 text-theme-accent">
                  Competition Mode
                </span>
              </div>
              <span className="text-[11px] text-theme-muted hover:text-theme-text">
                {showDemoHelp ? 'Hide Details ▲' : 'Show Details ▼'}
              </span>
            </div>

            <p className="text-[11px] text-theme-muted">
              Notice: Access is in <strong>Pre-seeded Demo Mode</strong> with synthetic institutional data.
              No external Active Directory or student personal information is exposed.
            </p>

            {showDemoHelp && (
              <div className="pt-2 border-t border-theme-border grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-theme-secondary border border-theme-border">
                  <div className="font-bold text-theme-text">Student Demo</div>
                  <div className="text-theme-muted truncate">ganesh.sharma22@edupulse.edu</div>
                  <div className="text-[10px] text-theme-accent mt-0.5">Role: CS 3rd Year</div>
                </div>
                <div className="p-2.5 rounded-lg bg-theme-secondary border border-theme-border">
                  <div className="font-bold text-theme-text">Faculty Demo</div>
                  <div className="text-theme-muted truncate">priya.menon@edupulse.edu</div>
                  <div className="text-[10px] text-theme-accent mt-0.5">Role: Course Coordinator</div>
                </div>
                <div className="p-2.5 rounded-lg bg-theme-secondary border border-theme-border">
                  <div className="font-bold text-theme-text">Admin Demo</div>
                  <div className="text-theme-muted truncate">dean.analytics@edupulse.edu</div>
                  <div className="text-[10px] text-theme-accent mt-0.5">Role: College Executive</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs text-theme-muted border-t border-theme-border bg-theme-surface/80 backdrop-blur-md">
        CampusIQ · Student Success Analytics Platform · Spatial UI Redesign
      </footer>
    </div>
  );
};

