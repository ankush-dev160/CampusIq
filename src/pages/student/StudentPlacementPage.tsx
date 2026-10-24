import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Brain,
  ShieldCheck,
  Search,
  ExternalLink,
  Target,
  Sparkles,
  Info,
  HelpCircle,
  FileCheck,
  Zap,
  RotateCcw,
  Check,
  Flag,
  BarChart2,
  ListFilter,
  ArrowRight,
  Database,
  Code,
  Globe,
  Cpu,
  Cloud,
  Radio,
  Layers,
  Wifi,
  Wrench,
  Activity,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useStudentRecord } from '../../context/CurrentUserContext';
import { useTheme } from '../../context/ThemeContext';
import {
  fetchTracks,
  startTest,
  submitTest,
  fetchStudentAttempts,
  saveQuestion,
} from '../../services/placementApi';
import {
  saveTestAttemptToFirestore,
  checkFirebaseConnection,
} from '../../lib/firebaseClient';
import type {
  PlacementTrack,
  ActiveTest,
  TestResult,
  StudentAttemptsSummary,
} from '../../types/placement';

export type PlacementTab = 'overview' | 'eligibility' | 'drives' | 'assessment' | 'results';

interface StudentPlacementPageProps {
  initialTab?: PlacementTab;
  onTabChange?: (tab: PlacementTab) => void;
}

// Icon helper for tracks
function getTrackIcon(iconName: string, className = 'w-5 h-5') {
  switch (iconName) {
    case 'Code': return <Code className={className} />;
    case 'Database': return <Database className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Cloud': return <Cloud className={className} />;
    case 'Radio': return <Radio className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Wifi': return <Wifi className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Building': return <Building className={className} />;
    case 'Brain':
    default:
      return <Brain className={className} />;
  }
}

export const StudentPlacementPage: React.FC<StudentPlacementPageProps> = ({
  initialTab = 'overview',
  onTabChange,
}) => {
  const student = useStudentRecord();
  const { chartPalette, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<PlacementTab>(initialTab);

  // Skill Test & Results State
  const [tracks, setTracks] = useState<PlacementTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [attemptsSummary, setAttemptsSummary] = useState<StudentAttemptsSummary | null>(null);
  const [activeTest, setActiveTest] = useState<ActiveTest | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  // Load Tracks & Attempts on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoadingTracks(true);
      try {
        const studentBranch = student.department || 'CSE';
        const trackData = await fetchTracks(studentBranch);
        if (isMounted) {
          setTracks(trackData.tracks);
        }

        const studentId = student.roll_no || student.id;
        const attempts = await fetchStudentAttempts(studentId);
        if (isMounted) {
          setAttemptsSummary(attempts);
        }
      } catch (err) {
        console.error('Failed to load placement data:', err);
      } finally {
        if (isMounted) setLoadingTracks(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [student]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSwitch = (tab: PlacementTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/placement/${tab}`);
    }
  };

  const tabs: { id: PlacementTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'eligibility', label: 'Eligibility', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'drives', label: 'Drives', icon: <Building2Icon className="w-4 h-4" />, badge: '6 Active' },
    { id: 'assessment', label: 'Skill Test', icon: <Brain className="w-4 h-4" /> },
    { id: 'results', label: 'My Results', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-theme-text tracking-tight flex items-center gap-2">
                Training & Placement Cell (TPO)
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Campus Recruitment Portal
                </span>
              </h1>
              <p className="text-xs text-theme-muted mt-0.5">
                Branch-wise MCQ evaluations, server-validated scoring, company drives, and domain job readiness.
              </p>
            </div>
          </div>
        </div>

        {/* Student Badge */}
        <div className="flex items-center gap-3 bg-theme-surface border border-theme-border rounded-xl px-3.5 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            {student.avatar_initials}
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-theme-text">{student.name}</div>
            <div className="text-[10px] text-theme-muted">{student.roll_no} · {student.academic_year}</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-theme-border/60 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                  : 'text-theme-muted hover:text-theme-text hover:bg-theme-secondary/50 border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-theme-secondary text-theme-muted border border-theme-border">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Views */}
      <div className="min-h-[460px]">
        {activeTab === 'overview' && (
          <OverviewTab
            student={student}
            onSwitchTab={handleTabSwitch}
            attemptsSummary={attemptsSummary}
          />
        )}

        {activeTab === 'eligibility' && <EligibilityTab student={student} />}

        {activeTab === 'drives' && <DrivesTab student={student} />}

        {activeTab === 'assessment' && (
          <SkillTestTab
            student={student}
            tracks={tracks}
            activeTest={activeTest}
            setActiveTest={setActiveTest}
            testResult={testResult}
            setTestResult={setTestResult}
            testError={testError}
            setTestError={setTestError}
            onTestComplete={async (result) => {
              setTestResult(result);
              setActiveTest(null);
              // Refetch attempts
              const studentId = student.roll_no || student.id;
              const updated = await fetchStudentAttempts(studentId);
              setAttemptsSummary(updated);
            }}
          />
        )}

        {activeTab === 'results' && (
          <MyResultsTab
            student={student}
            attemptsSummary={attemptsSummary}
            onRetakeTest={() => {
              setTestResult(null);
              setActiveTest(null);
              handleTabSwitch('assessment');
            }}
          />
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. OVERVIEW TAB
// ─────────────────────────────────────────────────────────────────────────────

function OverviewTab({
  student,
  onSwitchTab,
  attemptsSummary,
}: {
  student: any;
  onSwitchTab: (tab: PlacementTab) => void;
  attemptsSummary: StudentAttemptsSummary | null;
}) {
  const isUpperYear = student.academic_year === '3rd Year' || student.academic_year === '4th Year';
  const isCgpaEligible = (student.cgpa || 0) >= 6.0;
  const isBacklogEligible = (student.backlogs || 0) === 0;
  const isAttendanceEligible = (student.overall_attendance || 0) >= 75;
  const isOverallEligible = isUpperYear && isCgpaEligible && isBacklogEligible && isAttendanceEligible;

  const latestScore = attemptsSummary?.latestAttempt;
  const overallReadiness = attemptsSummary?.overallReadinessScore;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900/40 to-cyan-900/20 border border-blue-500/20 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                isOverallEligible
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}>
                {isOverallEligible ? 'Eligible for Campus Drives' : 'Eligibility in Progress'}
              </span>
              <span className="text-xs text-theme-muted">Recruitment Cycle 2026-27</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-theme-text">
              Welcome, {student.name}!
            </h2>
            <p className="text-xs text-theme-muted leading-relaxed">
              Verify your eligibility, take timed branch-wise skill evaluations with instant server-scored feedback, and target job-ready certification across core engineering tracks.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => onSwitchTab('eligibility')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-surface hover:bg-theme-secondary border border-theme-border text-theme-text transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Check Eligibility
            </button>
            <button
              onClick={() => onSwitchTab('assessment')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Brain className="w-3.5 h-3.5" />
              Take Skill Test
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Eligibility */}
        <div className="p-4 rounded-xl bg-theme-surface border border-theme-border space-y-2">
          <div className="flex items-center justify-between text-xs text-theme-muted">
            <span>Overall Eligibility</span>
            <ShieldCheck className={`w-4 h-4 ${isOverallEligible ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <div className={`text-xl font-black ${isOverallEligible ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isOverallEligible ? 'Eligible' : 'Action Required'}
          </div>
          <div className="text-[11px] text-theme-muted">
            {isOverallEligible ? 'Meets CGPA & Attendance criteria' : 'Review unmet rules in Eligibility tab'}
          </div>
        </div>

        {/* Active Drives */}
        <div className="p-4 rounded-xl bg-theme-surface border border-theme-border space-y-2">
          <div className="flex items-center justify-between text-xs text-theme-muted">
            <span>Active Drives</span>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-theme-text">6 Drives</div>
          <div className="text-[11px] text-theme-muted">
            3 Full-time, 3 Internships
          </div>
        </div>

        {/* Skill Readiness Score */}
        <div className="p-4 rounded-xl bg-theme-surface border border-theme-border space-y-2">
          <div className="flex items-center justify-between text-xs text-theme-muted">
            <span>Skill Readiness</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-theme-text">
            {overallReadiness !== null && overallReadiness !== undefined ? (
              <span className={
                overallReadiness >= 70 ? 'text-emerald-400' : overallReadiness >= 40 ? 'text-amber-400' : 'text-red-400'
              }>
                {overallReadiness}%
              </span>
            ) : (
              'No tests yet'
            )}
          </div>
          <div className="text-[11px] text-theme-muted">
            {latestScore ? (
              <span>Last: {latestScore.trackName} ({latestScore.percentage}%)</span>
            ) : (
              <button
                onClick={() => onSwitchTab('assessment')}
                className="text-blue-400 hover:underline font-medium"
              >
                Take your first test →
              </button>
            )}
          </div>
        </div>

        {/* Branch Suggested Tracks */}
        <div className="p-4 rounded-xl bg-theme-surface border border-theme-border space-y-2">
          <div className="flex items-center justify-between text-xs text-theme-muted">
            <span>Branch Alignment</span>
            <Brain className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-theme-text">
            {student.department?.includes('Computer') ? 'CSE Track' :
             student.department?.includes('Electronics') ? 'ECE Track' :
             student.department?.includes('Mechanical') ? 'ME Track' :
             student.department?.includes('Civil') ? 'CE Track' : 'Core Track'}
          </div>
          <div className="text-[11px] text-theme-muted">
            5 verified MCQ modules ready
          </div>
        </div>
      </div>

      {/* Quick Launch Card */}
      <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-theme-text">Ready for Domain Assessment?</div>
            <div className="text-xs text-theme-muted">
              Choose Quick Mode (10 questions, 10 min) or Standard Mode (20 questions, 20 min).
            </div>
          </div>
        </div>
        <button
          onClick={() => onSwitchTab('assessment')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Start Assessment Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SKILL TEST TAB (TEST ENGINE & FLOW)
// ─────────────────────────────────────────────────────────────────────────────

interface SkillTestTabProps {
  student: any;
  tracks: PlacementTrack[];
  activeTest: ActiveTest | null;
  setActiveTest: (test: ActiveTest | null) => void;
  testResult: TestResult | null;
  setTestResult: (res: TestResult | null) => void;
  testError: string | null;
  setTestError: (err: string | null) => void;
  onTestComplete: (result: TestResult) => void;
}

function SkillTestTab({
  student,
  tracks,
  activeTest,
  setActiveTest,
  testResult,
  setTestResult,
  testError,
  setTestError,
  onTestComplete,
}: SkillTestTabProps) {
  // Test Setup State
  const [selectedTrackId, setSelectedTrackId] = useState<string>('dsa');
  const [selectedMode, setSelectedMode] = useState<'quick' | 'standard'>('quick');
  const [startingTest, setStartingTest] = useState(false);

  // Auto-select first suggested track
  useEffect(() => {
    if (tracks.length > 0) {
      const suggested = tracks.find(t => t.isSuggested);
      if (suggested) {
        setSelectedTrackId(suggested.id);
      } else {
        setSelectedTrackId(tracks[0].id);
      }
    }
  }, [tracks]);

  // Test Runner State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [submittingTest, setSubmittingTest] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  // Timer Ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle Starting a Test
  const handleStartTest = async () => {
    setStartingTest(true);
    setTestError(null);
    try {
      const studentId = student.roll_no || student.id;
      const test = await startTest(studentId, selectedTrackId, selectedMode);
      setActiveTest(test);
      setTestResult(null);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setMarkedForReview({});
      setTimeLeftSeconds(test.timeLimitSeconds);
      setStartTime(Date.now());
    } catch (err: any) {
      setTestError(err.message || 'Failed to start test');
    } finally {
      setStartingTest(false);
    }
  };

  // Timer Countdown & Auto-Submit
  useEffect(() => {
    if (!activeTest) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Auto submit on time expiry
          triggerSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTest]);

  // Submit Handler
  const triggerSubmit = async (auto = false) => {
    if (!activeTest || submittingTest) return;
    setSubmittingTest(true);
    setShowConfirmModal(false);

    try {
      const studentId = student.roll_no || student.id;
      const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const result = await submitTest(activeTest.attemptId, studentId, answers, elapsedSeconds);

      // Save to Firebase Firestore asynchronously
      saveTestAttemptToFirestore({
        ...result,
        studentId,
        studentName: student.name,
        rollNo: student.roll_no,
        branch: student.department,
      }).catch(err => console.warn('Firebase attempt sync:', err));

      onTestComplete(result);
    } catch (err: any) {
      setTestError(err.message || 'Failed to submit test');
    } finally {
      setSubmittingTest(false);
    }
  };

  // 1. If Result exists, display Result Screen
  if (testResult) {
    return (
      <ResultDisplayScreen
        result={testResult}
        onRetakeTest={() => {
          setTestResult(null);
          setActiveTest(null);
        }}
      />
    );
  }

  // 2. If Active Test exists, display Active Test Screen
  if (activeTest) {
    const totalQuestions = activeTest.questions.length;
    const currentQ = activeTest.questions[currentQuestionIndex];
    const isAnswered = answers[currentQ.id] !== undefined;
    const isMarked = Boolean(markedForReview[currentQ.id]);

    const answeredCount = Object.keys(answers).length;
    const markedCount = Object.values(markedForReview).filter(Boolean).length;
    const unansweredCount = totalQuestions - answeredCount;

    const minutes = Math.floor(timeLeftSeconds / 60);
    const seconds = timeLeftSeconds % 60;
    const isUrgent = timeLeftSeconds <= 60;

    return (
      <div className="space-y-5 animate-fade-in">
        {/* Test Header: Track, Mode, Countdown Timer */}
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {activeTest.track.toUpperCase()}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-theme-secondary text-theme-muted border border-theme-border font-medium">
                  {activeTest.mode === 'quick' ? 'Quick Mode (10 Qs)' : 'Standard Mode (20 Qs)'}
                </span>
              </div>
              <h2 className="text-base font-bold text-theme-text mt-0.5">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold border transition-colors ${
            isUrgent
              ? 'bg-red-500/15 text-red-400 border-red-500/40 animate-pulse'
              : 'bg-theme-secondary text-theme-text border-theme-border'
          }`}>
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-400' : 'text-blue-400'}`} />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-sans text-theme-muted font-normal ml-1">remaining</span>
          </div>
        </div>

        {/* Main Test Grid: Question on Left, Navigator on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Question Box (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 sm:p-6 space-y-5">
              {/* Question Metadata */}
              <div className="flex items-center justify-between gap-2 border-b border-theme-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-theme-muted">
                    Topic: <span className="text-theme-text">{currentQ.topic}</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    currentQ.difficulty === 'Easy'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : currentQ.difficulty === 'Hard'
                      ? 'bg-red-500/15 text-red-400 border-red-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {currentQ.difficulty}
                  </span>
                </div>

                <button
                  onClick={() => setMarkedForReview(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    isMarked
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                      : 'text-theme-muted hover:text-theme-text hover:bg-theme-secondary/50 border border-transparent'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Question Statement */}
              <div className="text-sm sm:text-base font-medium text-theme-text leading-relaxed">
                {currentQ.question}
              </div>

              {/* 4 MCQ Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = answers[currentQ.id] === optIdx;
                  const optionLabel = ['A', 'B', 'C', 'D'][optIdx];

                  return (
                    <button
                      key={optIdx}
                      onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }))}
                      className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm transition-all border flex items-start gap-3 ${
                        isSelected
                          ? 'bg-blue-600/15 text-blue-400 border-blue-500/50 shadow-sm font-medium'
                          : 'bg-theme-secondary/40 hover:bg-theme-secondary text-theme-text border-theme-border'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border transition ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-theme-surface text-theme-muted border-theme-border'
                      }`}>
                        {optionLabel}
                      </div>
                      <div className="pt-0.5 leading-relaxed">{option}</div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons: Prev / Clear / Next */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-theme-border/60">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-surface hover:bg-theme-secondary border border-theme-border text-theme-text disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {answers[currentQ.id] !== undefined && (
                  <button
                    onClick={() => {
                      setAnswers(prev => {
                        const copy = { ...prev };
                        delete copy[currentQ.id];
                        return copy;
                      });
                    }}
                    className="text-xs text-theme-muted hover:text-red-400 transition underline underline-offset-4"
                  >
                    Clear Choice
                  </button>
                )}

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Finish Test</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Navigator (1 col) */}
          <div className="space-y-4">
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                Question Navigator
              </h3>

              {/* Status Legend */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-theme-muted border-b border-theme-border/60 pb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Review ({markedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <span>Unanswered ({unansweredCount})</span>
                </div>
              </div>

              {/* Grid of Numbered Bubbles */}
              <div className="grid grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
                {activeTest.questions.map((q, idx) => {
                  const qAns = answers[q.id] !== undefined;
                  const qMark = Boolean(markedForReview[q.id]);
                  const isCurrent = idx === currentQuestionIndex;

                  let bubbleClasses = 'bg-theme-secondary/40 text-theme-muted border-theme-border';
                  if (qAns) {
                    bubbleClasses = 'bg-blue-600 text-white border-blue-500 font-bold';
                  } else if (qMark) {
                    bubbleClasses = 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold';
                  }

                  if (isCurrent) {
                    bubbleClasses += ' ring-2 ring-blue-400 ring-offset-2 ring-offset-theme-surface';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-xl text-xs flex items-center justify-center border transition relative ${bubbleClasses}`}
                    >
                      <span>{idx + 1}</span>
                      {qMark && qAns && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-theme-surface" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit Test Button */}
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-2 shadow-sm mt-3"
              >
                <Check className="w-4 h-4" />
                <span>Submit & View Results</span>
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-theme-surface border border-theme-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 text-theme-text">
                <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Ready to Submit Test?</h3>
                  <p className="text-xs text-theme-muted">Scoring is executed securely on the server.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-theme-secondary/40 border border-theme-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-theme-muted">Questions Answered:</span>
                  <span className="font-bold text-blue-400">{answeredCount} of {totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-theme-muted">Marked for Review:</span>
                  <span className="font-bold text-amber-400">{markedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-theme-muted">Unanswered:</span>
                  <span className="font-bold text-red-400">{unansweredCount}</span>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="text-[11px] text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>You have unanswered questions. Unanswered questions count as 0 score.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  disabled={submittingTest}
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-surface hover:bg-theme-secondary border border-theme-border text-theme-text transition"
                >
                  Return to Test
                </button>
                <button
                  disabled={submittingTest}
                  onClick={() => triggerSubmit(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {submittingTest ? 'Scoring on Server...' : 'Yes, Submit Test'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Test Configuration & Track Selection Screen
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900/40 to-cyan-900/20 border border-blue-500/20 space-y-2 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Placement Domain Assessment
          </span>
          <span className="text-xs text-theme-muted">Anti-Tamper Server Scoring</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-theme-text">
          Select Your Technical Track & Assessment Mode
        </h2>
        <p className="text-xs text-theme-muted max-w-2xl leading-relaxed">
          Questions are selected randomly by the server and scored with zero client-side tampering. Your branch recommendations appear first, but you may evaluate your readiness in any technical track.
        </p>
      </div>

      {testError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{testError}</span>
        </div>
      )}

      {/* Mode Selector */}
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
          1. Choose Test Duration & Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedMode('quick')}
            className={`p-4 rounded-xl border text-left transition ${
              selectedMode === 'quick'
                ? 'bg-blue-600/15 text-blue-400 border-blue-500/50 shadow-sm font-semibold'
                : 'bg-theme-secondary/40 hover:bg-theme-secondary text-theme-text border-theme-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Quick Evaluation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                10 Minutes
              </span>
            </div>
            <div className="text-xs text-theme-muted mt-1">
              10 random questions · Mixed difficulty · Ideal for rapid placement check
            </div>
          </button>

          <button
            onClick={() => setSelectedMode('standard')}
            className={`p-4 rounded-xl border text-left transition ${
              selectedMode === 'standard'
                ? 'bg-blue-600/15 text-blue-400 border-blue-500/50 shadow-sm font-semibold'
                : 'bg-theme-secondary/40 hover:bg-theme-secondary text-theme-text border-theme-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Standard Assessment</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
                20 Minutes
              </span>
            </div>
            <div className="text-xs text-theme-muted mt-1">
              20 questions · In-depth topic accuracy radar · Company drive readiness
            </div>
          </button>
        </div>
      </div>

      {/* Track Selector */}
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
            2. Choose Technical Assessment Track
          </label>
          <span className="text-xs text-theme-muted">
            Suggested for {student.department || 'your branch'} highlighted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {tracks.map(track => {
            const isSelected = selectedTrackId === track.id;

            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 text-blue-400 shadow-sm'
                    : 'bg-theme-secondary/30 hover:bg-theme-secondary/60 border-theme-border text-theme-text'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-lg bg-theme-surface border border-theme-border text-blue-400">
                      {getTrackIcon(track.icon, 'w-4 h-4')}
                    </div>
                    {track.isSuggested && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold mt-2 text-theme-text">{track.name}</div>
                  <p className="text-[11px] text-theme-muted mt-1 line-clamp-2 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1 border-t border-theme-border/50 text-[10px] text-theme-muted">
                  {track.topics.slice(0, 3).map((topic, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-theme-surface border border-theme-border">
                      {topic}
                    </span>
                  ))}
                  {track.topics.length > 3 && (
                    <span className="px-1.5 py-0.5 text-theme-muted">+{track.topics.length - 3}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-end">
        <button
          disabled={startingTest}
          onClick={handleStartTest}
          className="px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          {startingTest ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Initializing Secure Test...</span>
            </>
          ) : (
            <>
              <span>Begin Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESULT DISPLAY SCREEN (IMMEDIATELY AFTER SUBMIT)
// ─────────────────────────────────────────────────────────────────────────────

interface ResultDisplayScreenProps {
  result: TestResult;
  onRetakeTest: () => void;
}

function ResultDisplayScreen({ result, onRetakeTest }: ResultDisplayScreenProps) {
  const [selectedReviewFilter, setSelectedReviewFilter] = useState<'all' | 'correct' | 'wrong'>('all');

  // Level status coloring rules:
  // Beginner < 40% (Red)
  // Intermediate 40-70% (Amber)
  // Job-ready > 70% (Green)
  const isJobReady = result.level === 'Job-ready';
  const isIntermediate = result.level === 'Intermediate';
  const isBeginner = result.level === 'Beginner';

  const levelColorClass = isJobReady
    ? 'text-emerald-400'
    : isIntermediate
    ? 'text-amber-400'
    : 'text-red-400';

  const levelBgClass = isJobReady
    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
    : isIntermediate
    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
    : 'bg-red-500/15 border-red-500/30 text-red-400';

  const minutesTaken = Math.floor(result.timeSpentSeconds / 60);
  const secondsTaken = result.timeSpentSeconds % 60;

  // Filter review items
  const filteredReview = useMemo(() => {
    if (selectedReviewFilter === 'correct') {
      return result.review.filter(r => r.isCorrect);
    }
    if (selectedReviewFilter === 'wrong') {
      return result.review.filter(r => !r.isCorrect);
    }
    return result.review;
  }, [result.review, selectedReviewFilter]);

  // Topic Bar Chart Data
  const chartData = useMemo(() => {
    return result.topicBreakdown.map(t => ({
      topic: t.topic.length > 18 ? t.topic.substring(0, 16) + '...' : t.topic,
      fullName: t.topic,
      accuracy: t.accuracy,
      correct: t.correct,
      total: t.total,
    }));
  }, [result.topicBreakdown]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Result Hero Banner */}
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Circular Score Gauge */}
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-theme-border/40"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - result.percentage / 100)}`}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ${
                    isJobReady ? 'text-emerald-500' : isIntermediate ? 'text-amber-500' : 'text-red-500'
                  }`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className={`text-3xl font-black ${levelColorClass}`}>
                  {result.percentage}%
                </div>
                <div className="text-xs text-theme-muted font-bold">
                  {result.score} / {result.total}
                </div>
              </div>
            </div>
          </div>

          {/* Result Summary Info */}
          <div className="flex-1 space-y-2.5 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${levelBgClass}`}>
                {result.level}
              </span>
              <span className="text-xs text-theme-muted uppercase tracking-wider font-semibold">
                Track: {result.track.toUpperCase()}
              </span>
              <span className="text-xs text-theme-muted">
                · {result.mode === 'quick' ? 'Quick Mode' : 'Standard Mode'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-theme-text">
              {isJobReady
                ? 'Outstanding! You demonstrated job-ready competence.'
                : isIntermediate
                ? 'Good effort! Review the weak topics below to achieve job-readiness.'
                : 'Foundations need reinforcement. Focus on weak topics below.'}
            </h2>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-theme-muted pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Time Taken: <strong className="text-theme-text">{minutesTaken}m {secondsTaken}s</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Correct: <strong className="text-theme-text">{result.score}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Incorrect: <strong className="text-theme-text">{result.total - result.score}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 w-full md:w-auto">
            <button
              onClick={onRetakeTest}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center justify-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Topic Accuracy Breakdown & What to Practise Next */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Topic-Wise Accuracy Chart */}
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              <span>Topic-Wise Accuracy</span>
            </h3>
            <span className="text-[11px] text-theme-muted">&gt;70% Job-Ready</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="topic" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Accuracy']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => {
                    const color = entry.accuracy >= 70 ? '#10b981' : entry.accuracy >= 40 ? '#f59e0b' : '#ef4444';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths, Weak Topics & What to Practise Next */}
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Strengths & Focus Areas</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold text-theme-muted mb-1.5">Demonstrated Strengths (≥70%):</div>
              <div className="flex flex-wrap gap-1.5">
                {result.strengths.length > 0 ? (
                  result.strengths.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-theme-muted italic">None yet above 70%</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-theme-muted mb-1.5">Weak Topics Needing Attention (&lt;70%):</div>
              <div className="flex flex-wrap gap-1.5">
                {result.weakTopics.length > 0 ? (
                  result.weakTopics.map((w, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium">
                      ⚠ {w}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-medium">No weak topics! All topics mastered.</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-theme-border/60">
              <div className="text-xs font-bold text-theme-text mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>What to Practise Next:</span>
              </div>
              <ul className="space-y-1.5">
                {result.whatToPractiseNext.map((rec, i) => (
                  <li key={i} className="text-xs text-theme-muted flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Question Review Accordion / List */}
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-border/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-theme-text">Detailed Question Review</h3>
            <p className="text-xs text-theme-muted">
              Verify your answer against correct solutions and technical explanations.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-theme-secondary/50 p-1 rounded-xl border border-theme-border text-xs">
            <button
              onClick={() => setSelectedReviewFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedReviewFilter === 'all'
                  ? 'bg-theme-surface text-theme-text shadow-sm'
                  : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              All ({result.review.length})
            </button>
            <button
              onClick={() => setSelectedReviewFilter('correct')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedReviewFilter === 'correct'
                  ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                  : 'text-theme-muted hover:text-emerald-400'
              }`}
            >
              Correct ({result.score})
            </button>
            <button
              onClick={() => setSelectedReviewFilter('wrong')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedReviewFilter === 'wrong'
                  ? 'bg-red-500/15 text-red-400 shadow-sm'
                  : 'text-theme-muted hover:text-red-400'
              }`}
            >
              Wrong ({result.total - result.score})
            </button>
          </div>
        </div>

        {/* Question Cards */}
        <div className="space-y-3.5">
          {filteredReview.map((item, idx) => {
            const isCorrect = item.isCorrect;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-xl border transition ${
                  isCorrect
                    ? 'bg-emerald-500/5 border-emerald-500/25'
                    : 'bg-red-500/5 border-red-500/25'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-theme-muted">Q{idx + 1}.</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-theme-surface border border-theme-border text-theme-muted">
                      {item.topic}
                    </span>
                  </div>

                  <span className={`text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                    isCorrect
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}</span>
                  </span>
                </div>

                <div className="text-sm font-medium text-theme-text mt-2 leading-relaxed">
                  {item.question}
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {item.options.map((opt, optIdx) => {
                    const isStudentPick = item.studentAnswer === optIdx;
                    const isCorrectAnswer = item.correctAnswer === optIdx;

                    let optStyle = 'bg-theme-surface/70 border-theme-border text-theme-muted';
                    if (isCorrectAnswer) {
                      optStyle = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-semibold';
                    } else if (isStudentPick && !isCorrect) {
                      optStyle = 'bg-red-500/15 border-red-500/40 text-red-400 font-semibold';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${optStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[11px] opacity-75">
                            {['A', 'B', 'C', 'D'][optIdx]}.
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isStudentPick && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-theme-surface border border-theme-border">
                            Your Pick
                          </span>
                        )}
                        {isCorrectAnswer && (
                          <span className="text-[10px] uppercase font-bold text-emerald-400">
                            ✓ Solution
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="mt-3 p-3 rounded-lg bg-theme-surface border border-theme-border/60 text-xs space-y-1">
                  <div className="font-semibold text-theme-text flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>Technical Explanation:</span>
                  </div>
                  <p className="text-theme-muted leading-relaxed pl-5">
                    {item.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MY RESULTS TAB (HISTORY & TREND CHARTS)
// ─────────────────────────────────────────────────────────────────────────────

interface MyResultsTabProps {
  student: any;
  attemptsSummary: StudentAttemptsSummary | null;
  onRetakeTest: () => void;
}

function MyResultsTab({ student, attemptsSummary, onRetakeTest }: MyResultsTabProps) {
  const attempts = attemptsSummary?.attempts || [];
  const bestScores = attemptsSummary?.bestScorePerTrack || {};
  const trackTrends = attemptsSummary?.trackTrends || {};

  // Formulate Trend Chart Data
  const trendTracks = Object.keys(trackTrends);
  const selectedTrendTrack = trendTracks[0] || 'dsa';
  const [activeTrendTrack, setActiveTrendTrack] = useState(selectedTrendTrack);

  useEffect(() => {
    if (trendTracks.length > 0 && !trendTracks.includes(activeTrendTrack)) {
      setActiveTrendTrack(trendTracks[0]);
    }
  }, [trendTracks, activeTrendTrack]);

  const activeTrendData = (trackTrends[activeTrendTrack] || []).map((pt, i) => ({
    attempt: `Attempt ${i + 1}`,
    date: pt.date,
    percentage: pt.percentage,
    score: pt.score,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Best Score Per Track Tiles */}
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Best Scores Per Track</span>
          </h3>
          <span className="text-xs text-theme-muted">
            {Object.keys(bestScores).length} Tracks Evaluated
          </span>
        </div>

        {Object.keys(bestScores).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(bestScores).map(([tId, best]) => {
              const isJobReady = best.level === 'Job-ready';
              const isInter = best.level === 'Intermediate';

              return (
                <div key={tId} className="p-3.5 rounded-xl bg-theme-secondary/40 border border-theme-border space-y-2">
                  <div className="text-xs font-bold text-theme-text line-clamp-1">
                    {best.trackName}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-xl font-black text-theme-text">
                      {best.percentage}%
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isJobReady
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : isInter
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}>
                      {best.level}
                    </span>
                  </div>
                  <div className="text-[10px] text-theme-muted">
                    Score: {best.bestScore} / {best.total}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-theme-muted">
            No test attempts completed yet. Take your first test to record track benchmarks!
          </div>
        )}
      </div>

      {/* Score Trend Chart Per Track */}
      {trendTracks.length > 0 && (
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Score Progression Trend</span>
            </h3>

            {/* Track Selector for Trend */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {trendTracks.map(tId => (
                <button
                  key={tId}
                  onClick={() => setActiveTrendTrack(tId)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    activeTrendTrack === tId
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-bold'
                      : 'text-theme-muted hover:text-theme-text bg-theme-secondary/40'
                  }`}
                >
                  {tId.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="attempt" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Score']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ fill: '#0284c7', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Attempt History Table */}
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
            Attempt History ({attempts.length})
          </h3>
          <button
            onClick={onRetakeTest}
            className="text-xs text-blue-400 hover:underline font-semibold"
          >
            + Take Another Test
          </button>
        </div>

        {attempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-theme-border text-theme-muted">
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold">Track</th>
                  <th className="pb-3 font-semibold">Mode</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Percentage</th>
                  <th className="pb-3 font-semibold">Readiness Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/50 text-theme-text">
                {attempts.map(a => {
                  const dateStr = a.submittedAt
                    ? new Date(a.submittedAt).toLocaleDateString()
                    : new Date(a.startedAt).toLocaleDateString();

                  const isJob = a.level === 'Job-ready';
                  const isInt = a.level === 'Intermediate';

                  return (
                    <tr key={a.attemptId} className="hover:bg-theme-secondary/20 transition">
                      <td className="py-3 text-theme-muted">{dateStr}</td>
                      <td className="py-3 font-semibold">{a.trackName}</td>
                      <td className="py-3 capitalize text-theme-muted">{a.mode}</td>
                      <td className="py-3 font-bold">{a.score} / {a.total}</td>
                      <td className="py-3 font-black text-sm">{a.percentage}%</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isJob
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : isInt
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-red-500/15 text-red-400 border-red-500/30'
                        }`}>
                          {a.level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-theme-muted">
            No completed attempts yet. Click below to start!
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. STUB TABS: ELIGIBILITY & DRIVES
// ─────────────────────────────────────────────────────────────────────────────

function EligibilityTab({ student }: { student: any }) {
  const isCgpa = (student.cgpa || 0) >= 6.0;
  const isBacklog = (student.backlogs || 0) === 0;
  const isAtt = (student.overall_attendance || 0) >= 75;

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border space-y-3">
        <h3 className="text-sm font-bold text-theme-text">Institutional Placement Eligibility Criteria</h3>
        <p className="text-xs text-theme-muted leading-relaxed">
          Students must satisfy minimum CGPA, backlog, and attendance rules set by the Training & Placement Cell.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-theme-secondary/40 border border-theme-border space-y-1">
            <div className="text-xs text-theme-muted">Min CGPA: 6.0</div>
            <div className="text-sm font-bold text-theme-text">Your CGPA: {student.cgpa || 'N/A'}</div>
            <div className={`text-[11px] font-bold ${isCgpa ? 'text-emerald-400' : 'text-red-400'}`}>
              {isCgpa ? '✓ Met' : '✗ Unmet'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-theme-secondary/40 border border-theme-border space-y-1">
            <div className="text-xs text-theme-muted">Active Backlogs: 0</div>
            <div className="text-sm font-bold text-theme-text">Your Backlogs: {student.backlogs || 0}</div>
            <div className={`text-[11px] font-bold ${isBacklog ? 'text-emerald-400' : 'text-red-400'}`}>
              {isBacklog ? '✓ Met' : '✗ Unmet'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-theme-secondary/40 border border-theme-border space-y-1">
            <div className="text-xs text-theme-muted">Min Attendance: 75%</div>
            <div className="text-sm font-bold text-theme-text">Your Attendance: {student.overall_attendance || 80}%</div>
            <div className={`text-[11px] font-bold ${isAtt ? 'text-emerald-400' : 'text-red-400'}`}>
              {isAtt ? '✓ Met' : '✗ Unmet'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DrivesTab({ student }: { student: any }) {
  const drives = [
    { company: 'Google Cloud India', role: 'Cloud Engineer / SRE', ctc: '22 LPA', date: 'Nov 14, 2026', type: 'Full-time' },
    { company: 'Microsoft IDC', role: 'Software Engineer', ctc: '24 LPA', date: 'Nov 18, 2026', type: 'Full-time' },
    { company: 'Qualcomm Wireless', role: 'Embedded Systems Engineer', ctc: '18 LPA', date: 'Nov 22, 2026', type: 'Full-time' },
    { company: 'Tata Advanced Systems', role: 'Design & Automation Engineer', ctc: '12 LPA', date: 'Nov 26, 2026', type: 'Full-time' },
    { company: 'L&T Infrastructure', role: 'Structural Engineering Trainee', ctc: '10 LPA', date: 'Dec 02, 2026', type: 'Full-time' },
    { company: 'Amazon AWS', role: 'Solutions Architect Intern', ctc: '80K / mo', date: 'Dec 08, 2026', type: 'Internship' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-theme-text">Active Campus Recruitment Drives (6)</h3>
        <span className="text-xs text-theme-muted">Placement Season 2026</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {drives.map((d, i) => (
          <div key={i} className="p-4 rounded-xl bg-theme-surface border border-theme-border flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-theme-text">{d.company}</div>
              <div className="text-xs text-blue-400 mt-0.5">{d.role}</div>
              <div className="text-[11px] text-theme-muted mt-2">Drive Date: {d.date}</div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {d.ctc}
              </span>
              <div className="text-[10px] text-theme-muted mt-2 capitalize">{d.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Building2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
