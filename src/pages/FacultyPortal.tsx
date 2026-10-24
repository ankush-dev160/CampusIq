import React, { useState } from 'react';
import {
  Users, BookOpen, Calendar, CheckSquare, AlertTriangle, MessageSquare,
  FileSpreadsheet, User, Bell, ChevronDown, LogOut, Menu, X, Save,
  CheckCircle2, Clock, Send, Download, Sparkles, Filter, Briefcase, ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid
} from 'recharts';
import {
  DEMO_FACULTY, FACULTY_STUDENTS, DEMO_PROBLEMS, DEMO_STUDENT, ATTENDANCE_CALENDAR_OCT
} from '../data/portalData';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitcher } from '../components/common/ThemeSwitcher';

export type FacultyPage =
  | 'dashboard'
  | 'subjects'
  | 'directory'
  | 'attendance-management'
  | 'attendance-calendar'
  | 'academic-performance'
  | 'at-risk'
  | 'placement-readiness'
  | 'problem-requests'
  | 'reports'
  | 'profile';

interface FacultyPortalProps {
  onLogout: () => void;
}

const navItems: { id: FacultyPage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Faculty Dashboard', icon: <Users className="w-5 h-5" /> },
  { id: 'subjects', label: 'My Subjects', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'directory', label: 'Student Directory', icon: <Users className="w-5 h-5" /> },
  { id: 'attendance-management', label: 'Attendance Management', icon: <CheckSquare className="w-5 h-5" /> },
  { id: 'attendance-calendar', label: 'Attendance Calendar', icon: <Calendar className="w-5 h-5" /> },
  { id: 'academic-performance', label: 'Academic Performance', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'at-risk', label: 'At-Risk Students', icon: <AlertTriangle className="w-5 h-5" /> },
  { id: 'placement-readiness', label: 'Placement Readiness', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'problem-requests', label: 'Problem Requests', icon: <MessageSquare className="w-5 h-5" /> },
  { id: 'reports', label: 'Reports & AI Insights', icon: <FileSpreadsheet className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile & Notifications', icon: <User className="w-5 h-5" /> },
];

export const FacultyPortal: React.FC<FacultyPortalProps> = ({ onLogout }) => {
  const { chartPalette } = useTheme();
  const [currentPage, setCurrentPage] = useState<FacultyPage>('dashboard');
  const [selectedFacultyIdx, setSelectedFacultyIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Attendance management state
  const [selectedSubject, setSelectedSubject] = useState('Machine Learning');
  const [selectedDate, setSelectedDate] = useState('2025-10-09');
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    FACULTY_STUDENTS.forEach((st, idx) => {
      init[st.roll] = idx % 5 !== 0; // ~80% present by default
    });
    return init;
  });
  const [attendanceSaveMessage, setAttendanceSaveMessage] = useState<string | null>(null);

  // Problem requests state
  const [requests, setRequests] = useState(DEMO_PROBLEMS);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [nextStepText, setNextStepText] = useState<Record<string, string>>({});

  const faculty = DEMO_FACULTY[selectedFacultyIdx];

  const handleToggleAttendance = (roll: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [roll]: !prev[roll],
    }));
  };

  const handleSaveAttendance = () => {
    setAttendanceSaveMessage(`Attendance successfully recorded for ${selectedSubject} on ${selectedDate} (${FACULTY_STUDENTS.length} students logged).`);
    setTimeout(() => setAttendanceSaveMessage(null), 4000);
  };

  const handleReplyProblem = (reqId: string) => {
    const reply = replyText[reqId] || '';
    const next = nextStepText[reqId] || '';
    if (!reply.trim()) return;

    setRequests(prev =>
      prev.map(r =>
        r.id === reqId
          ? { ...r, reply, next_step: next, status: 'Resolved' as const }
          : r
      )
    );
    setReplyText(prev => ({ ...prev, [reqId]: '' }));
    setNextStepText(prev => ({ ...prev, [reqId]: '' }));
  };

  // CSV export for faculty reports
  const handleExportCSV = () => {
    const headers = ['Roll No', 'Name', 'CGPA', 'Attendance %', 'Backlogs', 'Risk Status'];
    const rows = FACULTY_STUDENTS.map(s => [s.roll, s.name, s.cgpa, s.attendance, s.backlogs, s.risk]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Faculty_Report_${faculty.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Floating Spatial Glass Sidebar */}
      <aside
        className={`fixed z-50 flex flex-col rounded-2xl floating-glass-sidebar transition-all duration-300 ease-in-out
          top-2.5 bottom-2.5 left-2.5 w-[calc(100vw-1.25rem)] max-w-[16.5rem]
          lg:top-3 lg:bottom-3 lg:left-3 lg:w-64 lg:max-w-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-theme-border/60 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-theme-accent/25 via-theme-accent/10 to-transparent border border-theme-accent/30 flex items-center justify-center text-theme-accent shadow-sm">
              <Users className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-theme-text">CampusIQ</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-theme-accent/15 text-theme-accent border border-theme-accent/30 tracking-wider">
                  FACULTY
                </span>
              </div>
              <div className="text-[10px] text-theme-muted font-medium tracking-tight">Faculty Portal</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-secondary/60 lg:hidden transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                className={`relative group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 select-none outline-none focus-visible:ring-1 focus-visible:ring-theme-accent/50 active:scale-[0.985] ${
                  isActive
                    ? 'sidebar-item-active font-semibold'
                    : 'text-theme-muted hover:text-theme-text hover:bg-theme-secondary/50 font-medium'
                }`}
              >
                {isActive && <span className="sidebar-indicator" aria-hidden="true" />}
                <span className={`transition-colors duration-150 flex-shrink-0 ${isActive ? 'text-theme-accent' : 'text-theme-muted group-hover:text-theme-text'}`}>
                  {item.icon}
                </span>
                <span className="truncate flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-2.5 border-t border-theme-border/60 flex-shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-theme-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[17.5rem] flex flex-col min-h-screen">
        {/* Header with Faculty Switcher */}
        <header className="sticky top-0 z-30 h-16 bg-theme-surface/80 backdrop-blur-md border-b border-theme-border flex items-center px-4 sm:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-theme-muted hover:text-theme-text p-1">
            <Menu className="w-5 h-5" />
          </button>

          {/* Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-theme-muted hidden sm:inline">Logged in as:</span>
            <select
              value={selectedFacultyIdx}
              onChange={e => setSelectedFacultyIdx(Number(e.target.value))}
              className="bg-theme-secondary border border-theme-border text-xs font-bold text-theme-accent rounded-lg px-3 py-1.5 focus:border-theme-accent outline-none cursor-pointer"
            >
              {DEMO_FACULTY.map((f, idx) => (
                <option key={f.id} value={idx} className="bg-theme-surface text-theme-text">
                  {f.name} ({f.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1" />

          {/* Theme Switcher in Faculty Header */}
          <ThemeSwitcher />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-secondary relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-theme-accent rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 bg-theme-surface border border-theme-border rounded-xl shadow-xl p-4 z-50 text-xs space-y-2">
                <span className="font-bold text-theme-text block pb-2 border-b border-theme-border">Faculty Notifications</span>
                <p className="text-theme-text">1 student problem request pending review from Ganesh Sharma.</p>
                <p className="text-theme-text">Class attendance for yesterday pending submission.</p>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* 1. DASHBOARD */}
          {currentPage === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-theme-text">Faculty Dashboard</h1>
                <p className="text-sm text-theme-muted mt-0.5">Welcome, {faculty.name} · Department of {faculty.department}</p>
              </div>

              {/* 4 Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="panel border border-theme-border p-5">
                  <span className="text-[11px] font-semibold text-theme-muted uppercase">Assigned Students</span>
                  <div className="text-2xl font-extrabold text-theme-text mt-1">{FACULTY_STUDENTS.length}</div>
                  <span className="text-xs text-theme-muted">Across 2 courses</span>
                </div>
                <div className="panel border border-theme-border p-5">
                  <span className="text-[11px] font-semibold text-theme-muted uppercase">Class Avg Attendance</span>
                  <div className="text-2xl font-extrabold text-theme-accent mt-1">76.4%</div>
                  <span className="text-xs text-theme-muted">Institutional target 75%</span>
                </div>
                <div className="panel border border-theme-border p-5">
                  <span className="text-[11px] font-semibold text-theme-muted uppercase">Class Avg CGPA</span>
                  <div className="text-2xl font-extrabold text-blue-500 mt-1">7.31</div>
                  <span className="text-xs text-theme-muted">Range: 5.2 - 8.9</span>
                </div>
                <div className="panel border border-theme-border p-5">
                  <span className="text-[11px] font-semibold text-theme-muted uppercase">Students At-Risk</span>
                  <div className="text-2xl font-extrabold text-red-500 mt-1">
                    {FACULTY_STUDENTS.filter(s => s.risk === 'High' || s.risk === 'Moderate').length}
                  </div>
                  <span className="text-xs text-theme-muted">Require intervention</span>
                </div>
              </div>

              {/* Trend Chart + Academic Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 panel border border-theme-border p-5 space-y-4">
                  <h3 className="text-sm font-bold text-theme-text uppercase tracking-wide">Class CGPA Distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={FACULTY_STUDENTS.slice(0, 12)}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
                      <XAxis dataKey="roll" tick={{ fill: chartPalette.text, fontSize: 10 }} />
                      <YAxis domain={[0, 10]} tick={{ fill: chartPalette.text, fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: chartPalette.tooltipBg, borderColor: chartPalette.tooltipBorder, color: chartPalette.tooltipText, borderRadius: '8px' }} />
                      <Bar dataKey="cgpa" fill={chartPalette.accent} radius={[4, 4, 0, 0]} name="CGPA" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="panel border border-theme-border p-5 space-y-3">
                  <h3 className="text-sm font-bold text-theme-text uppercase tracking-wide">Academic Alerts</h3>
                  <div className="space-y-2">
                    {FACULTY_STUDENTS.filter(s => s.risk === 'High').slice(0, 3).map(s => (
                      <div key={s.roll} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
                        <div className="flex justify-between font-bold text-red-500">
                          <span>{s.name} ({s.roll})</span>
                          <span>{s.attendance}% Att</span>
                        </div>
                        <p className="text-[11px] text-theme-muted mt-1">Backlogs: {s.backlogs} · Critical attendance alert</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MY SUBJECTS */}
          {currentPage === 'subjects' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-theme-text">My Subjects</h1>
                <p className="text-sm text-theme-muted mt-0.5">Assigned courses and cohort rosters for this academic session</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faculty.subjects.map(subj => (
                  <div key={subj} className="panel border border-theme-border p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-theme-accent bg-theme-accent/15 px-2.5 py-1 rounded border border-theme-accent/30">
                        Active Course
                      </span>
                      <span className="text-xs text-theme-muted">{faculty.students_count} Enrolled</span>
                    </div>
                    <h3 className="text-lg font-bold text-theme-text">{subj}</h3>
                    <p className="text-xs text-theme-muted">
                      3 Lecture credits · 1 Lab practical · Department of {faculty.department}
                    </p>
                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={() => { setSelectedSubject(subj); setCurrentPage('attendance-management'); }}
                        className="btn-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
                      >
                        Log Attendance
                      </button>
                      <button
                        onClick={() => setCurrentPage('directory')}
                        className="bg-theme-secondary border border-theme-border text-theme-text text-xs font-bold px-4 py-2 rounded-xl hover:border-theme-accent/50"
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. STUDENT DIRECTORY */}
          {currentPage === 'directory' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-theme-text">Student Directory</h1>
                  <p className="text-sm text-theme-muted mt-0.5">Enrolled students in {faculty.department} courses</p>
                </div>
                <button onClick={handleExportCSV} className="btn-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export CSV Roster
                </button>
              </div>

              <div className="panel border border-theme-border p-5 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-theme-border text-theme-muted">
                      <th className="text-left py-2 px-3">Roll No</th>
                      <th className="text-left py-2 px-3">Student Name</th>
                      <th className="text-center py-2 px-3">CGPA</th>
                      <th className="text-center py-2 px-3">Attendance %</th>
                      <th className="text-center py-2 px-3">Backlogs</th>
                      <th className="text-right py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FACULTY_STUDENTS.map(s => (
                      <tr key={s.roll} className="border-b border-theme-border/40 hover:bg-theme-secondary">
                        <td className="py-2.5 px-3 font-semibold text-theme-accent">{s.roll}</td>
                        <td className="py-2.5 px-3 font-bold text-theme-text">{s.name}</td>
                        <td className="py-2.5 px-3 text-center text-theme-muted">{s.cgpa.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-theme-text">{s.attendance}%</td>
                        <td className="py-2.5 px-3 text-center text-theme-muted">{s.backlogs}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.risk === 'High' ? 'bg-red-500/15 text-red-500 border border-red-500/30' :
                            s.risk === 'Moderate' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' :
                            'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          }`}>
                            {s.risk} Risk
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. ATTENDANCE MANAGEMENT */}
          {currentPage === 'attendance-management' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-theme-text">Attendance Management</h1>
                <p className="text-sm text-theme-muted mt-0.5">Mark daily lecture attendance — click badge to toggle Present/Absent</p>
              </div>

              {attendanceSaveMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {attendanceSaveMessage}
                </div>
              )}

              {/* Selector Bar */}
              <div className="panel border border-theme-border p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <label className="text-[10px] text-theme-muted uppercase font-bold block mb-1">Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={e => setSelectedSubject(e.target.value)}
                      className="bg-theme-secondary border border-theme-border text-xs font-bold text-theme-text rounded-lg px-3 py-1.5 focus:border-theme-accent outline-none"
                    >
                      {faculty.subjects.map(s => (
                        <option key={s} value={s} className="bg-theme-surface text-theme-text">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-theme-muted uppercase font-bold block mb-1">Lecture Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="bg-theme-secondary border border-theme-border text-xs font-bold text-theme-text rounded-lg px-3 py-1.5 focus:border-theme-accent outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveAttendance}
                  className="btn-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" /> Save Attendance Roster
                </button>
              </div>

              {/* Toggle Table */}
              <div className="panel border border-theme-border p-5 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-theme-border text-theme-muted">
                      <th className="text-left py-2 px-3">Roll No</th>
                      <th className="text-left py-2 px-3">Student Name</th>
                      <th className="text-center py-2 px-3">Overall Att %</th>
                      <th className="text-right py-2 px-3">Mark for {selectedDate}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FACULTY_STUDENTS.map(s => {
                      const isPresent = attendanceRecords[s.roll] ?? true;
                      return (
                        <tr key={s.roll} className="border-b border-theme-border/40 hover:bg-theme-secondary">
                          <td className="py-2.5 px-3 font-semibold text-theme-accent">{s.roll}</td>
                          <td className="py-2.5 px-3 font-bold text-theme-text">{s.name}</td>
                          <td className="py-2.5 px-3 text-center text-theme-muted">{s.attendance}%</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleToggleAttendance(s.roll)}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                isPresent
                                  ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/40 hover:bg-emerald-500/25'
                                  : 'bg-red-500/15 text-red-500 border border-red-500/40 hover:bg-red-500/25'
                              }`}
                            >
                              {isPresent ? '✓ Present' : '✗ Absent'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. ATTENDANCE CALENDAR */}
          {currentPage === 'attendance-calendar' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-theme-text">Class Attendance Calendar</h1>
                <p className="text-sm text-theme-muted mt-0.5">Monthly overview of lecture dates and cohort attendance averages</p>
              </div>

              <div className="panel border border-theme-border p-5 space-y-4">
                <h3 className="text-sm font-bold text-theme-text">October 2025 Conducted Lectures</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { date: 'Oct 01, 2025', count: '29 / 32 present', pct: '90.6%' },
                    { date: 'Oct 02, 2025', count: '27 / 32 present', pct: '84.4%' },
                    { date: 'Oct 06, 2025', count: '28 / 32 present', pct: '87.5%' },
                    { date: 'Oct 07, 2025', count: '21 / 32 present', pct: '65.6%' },
                    { date: 'Oct 08, 2025', count: '30 / 32 present', pct: '93.8%' },
                    { date: 'Oct 09, 2025', count: '28 / 32 present', pct: '87.5%' },
                  ].map((d, i) => (
                    <div key={i} className="panel-raised p-4 rounded-xl border border-theme-border">
                      <span className="text-xs font-bold text-theme-text block">{d.date}</span>
                      <p className="text-xs text-theme-muted mt-1">{d.count}</p>
                      <span className="text-xs font-extrabold text-theme-accent block mt-1">{d.pct} Average</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. ACADEMIC PERFORMANCE */}
          {currentPage === 'academic-performance' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-theme-text">Academic Performance</h1>
                <p className="text-sm text-theme-muted mt-0.5">Assessment distributions and cohort performance across sections</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="panel-raised p-5 rounded-xl border border-theme-border text-center">
                  <span className="text-xs text-theme-muted font-semibold uppercase">Section Average CGPA</span>
                  <div className="text-3xl font-extrabold text-theme-accent mt-1">7.31</div>
                </div>
                <div className="panel-raised p-5 rounded-xl border border-theme-border text-center">
                  <span className="text-xs text-theme-muted font-semibold uppercase">Highest CGPA</span>
                  <div className="text-3xl font-extrabold text-emerald-500 mt-1">8.90</div>
                </div>
                <div className="panel-raised p-5 rounded-xl border border-theme-border text-center">
                  <span className="text-xs text-theme-muted font-semibold uppercase">Lowest CGPA</span>
                  <div className="text-3xl font-extrabold text-red-500 mt-1">5.20</div>
                </div>
              </div>

              <div className="panel border border-theme-border p-5">
                <h3 className="text-sm font-bold text-theme-text uppercase tracking-wide mb-4">CGPA Spread Across All Students</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={FACULTY_STUDENTS}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
                    <XAxis dataKey="roll" tick={{ fill: chartPalette.text, fontSize: 9 }} interval={1} />
                    <YAxis domain={[0, 10]} tick={{ fill: chartPalette.text, fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: chartPalette.tooltipBg, borderColor: chartPalette.tooltipBorder, color: chartPalette.tooltipText, borderRadius: '8px' }} />
                    <Bar dataKey="cgpa" fill={chartPalette.accent} radius={[3, 3, 0, 0]} name="CGPA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 7. AT-RISK STUDENTS */}
          {currentPage === 'at-risk' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-theme-text">At-Risk Students Roster</h1>
                <p className="text-sm text-theme-muted mt-0.5">Students triggered by rule-based attendance and academic thresholds</p>
              </div>

              <div className="panel border border-theme-border p-5 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-theme-border text-theme-muted">
                      <th className="text-left py-2 px-3">Student</th>
                      <th className="text-center py-2 px-3">CGPA</th>
                      <th className="text-center py-2 px-3">Attendance</th>
                      <th className="text-center py-2 px-3">Backlogs</th>
                      <th className="text-left py-2 px-3">Triggered Rule Reason</th>
                      <th className="text-right py-2 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FACULTY_STUDENTS.filter(s => s.risk !== 'Low').map(s => (
                      <tr key={s.roll} className="border-b border-theme-border/40 hover:bg-theme-secondary">
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-theme-text block">{s.name}</span>
                          <span className="text-[10px] text-theme-accent">{s.roll}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center text-theme-muted">{s.cgpa}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-red-500">{s.attendance}%</td>
                        <td className="py-2.5 px-3 text-center text-theme-muted">{s.backlogs}</td>
                        <td className="py-2.5 px-3 text-theme-text">
                          {s.attendance < 65 ? 'Critical attendance deficiency (<65%)' :
                           s.backlogs > 2 ? `Excess backlogs (${s.backlogs} active)` :
                           'Low attendance (<75%) & poor internals'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setCurrentPage('problem-requests')}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-theme-accent/15 text-theme-accent border border-theme-accent/30 hover:bg-theme-accent/25"
                          >
                            Create Intervention
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7B. PLACEMENT READINESS (Read-only view for faculty) */}
          {currentPage === 'placement-readiness' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-theme-text flex items-center gap-2.5">
                    Student Placement Readiness
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      Read-Only
                    </span>
                  </h1>
                  <p className="text-sm text-theme-muted mt-0.5">
                    Read-only readiness telemetry for students enrolled in {faculty.subjects.join(' & ')}. Individual test answers are privacy-protected.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-theme-muted bg-theme-surface border border-theme-border px-3 py-1.5 rounded-xl">
                    Department: <strong className="text-theme-text">{faculty.department}</strong>
                  </span>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="panel-raised p-4 rounded-xl border border-theme-border">
                  <span className="text-xs text-theme-muted font-semibold uppercase">Job-Ready Students</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">19 / 32</div>
                  <span className="text-[11px] text-theme-muted">Readiness score ≥ 70</span>
                </div>
                <div className="panel-raised p-4 rounded-xl border border-theme-border">
                  <span className="text-xs text-theme-muted font-semibold uppercase">Intermediate Readiness</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">9 / 32</div>
                  <span className="text-[11px] text-theme-muted">Score 40–70, needs domain practice</span>
                </div>
                <div className="panel-raised p-4 rounded-xl border border-theme-border">
                  <span className="text-xs text-theme-muted font-semibold uppercase">Needs Support</span>
                  <div className="text-2xl font-black text-red-400 mt-1">4 / 32</div>
                  <span className="text-[11px] text-theme-muted">Backlogs or low attendance</span>
                </div>
              </div>

              {/* Readiness Table */}
              <div className="panel border border-theme-border p-5 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-theme-border text-theme-muted">
                      <th className="text-left py-2 px-3">Student</th>
                      <th className="text-center py-2 px-3">CGPA</th>
                      <th className="text-center py-2 px-3">Attendance</th>
                      <th className="text-center py-2 px-3">Backlogs</th>
                      <th className="text-center py-2 px-3">Readiness Score</th>
                      <th className="text-center py-2 px-3">Status Tier</th>
                      <th className="text-left py-2 px-3">Suggested Domain Track</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FACULTY_STUDENTS.map(s => {
                      const readinessScore = Math.round(
                        Math.max(10, Math.min(98, (s.cgpa * 8) + (s.attendance * 0.25) - (s.backlogs * 15)))
                      );
                      const tier = readinessScore >= 70 ? 'Job-Ready' : readinessScore >= 45 ? 'Intermediate' : 'Not Job-Ready';
                      const badgeCls =
                        tier === 'Job-Ready'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : tier === 'Intermediate'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-red-500/15 text-red-400 border-red-500/30';

                      return (
                        <tr key={s.roll} className="border-b border-theme-border/40 hover:bg-theme-secondary/40 transition">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-theme-text block">{s.name}</span>
                            <span className="text-[10px] text-theme-muted">{s.roll} · Sem 5</span>
                          </td>
                          <td className="text-center py-2.5 px-3 font-semibold text-theme-text">{s.cgpa.toFixed(2)}</td>
                          <td className="text-center py-2.5 px-3 font-semibold text-theme-text">{s.attendance}%</td>
                          <td className="text-center py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.backlogs > 0 ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'text-theme-muted'
                            }`}>
                              {s.backlogs}
                            </span>
                          </td>
                          <td className="text-center py-2.5 px-3 font-bold text-theme-text">{readinessScore}/100</td>
                          <td className="text-center py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeCls}`}>
                              {tier}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-theme-muted">
                            DSA & Web Engineering
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. PROBLEM REQUESTS */}
          {currentPage === 'problem-requests' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-theme-text">Student Problem Requests</h1>
                <p className="text-sm text-theme-muted mt-0.5">Direct academic questions submitted by students</p>
              </div>

              <div className="space-y-4">
                {requests.map(req => (
                  <div key={req.id} className="panel border border-theme-border p-5 space-y-3">
                    <div className="flex items-start justify-between flex-wrap gap-2 border-b border-theme-border pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-theme-accent">{req.id}</span>
                          <span className="text-xs font-bold text-theme-text">{req.student} ({req.roll})</span>
                        </div>
                        <p className="text-[11px] text-theme-muted mt-0.5">Subject: {req.subject} · Submitted: {req.submitted}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        req.status === 'Resolved' ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30' :
                        'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-theme-accent">Topic: {req.topic}</p>
                      <p className="text-xs text-theme-text mt-1">{req.description}</p>
                    </div>

                    {req.reply ? (
                      <div className="p-3 rounded-lg bg-theme-secondary border border-emerald-500/30 space-y-1">
                        <span className="text-xs font-bold text-emerald-500">Response Recorded:</span>
                        <p className="text-xs text-theme-text">{req.reply}</p>
                        {req.next_step && <p className="text-[11px] text-theme-accent">Action: {req.next_step}</p>}
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2 border-t border-theme-border">
                        <textarea
                          rows={2}
                          placeholder="Type your response to the student..."
                          value={replyText[req.id] || ''}
                          onChange={e => setReplyText({ ...replyText, [req.id]: e.target.value })}
                          className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2.5 text-xs text-theme-text placeholder-theme-muted focus:border-theme-accent outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Next recommended step (e.g., Attend office hours on Thursday)"
                            value={nextStepText[req.id] || ''}
                            onChange={e => setNextStepText({ ...nextStepText, [req.id]: e.target.value })}
                            className="flex-1 bg-theme-secondary border border-theme-border rounded-lg p-2 text-xs text-theme-text placeholder-theme-muted focus:border-theme-accent outline-none"
                          />
                          <button
                            onClick={() => handleReplyProblem(req.id)}
                            className="btn-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" /> Send Response
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. REPORTS & AI INSIGHTS */}
          {currentPage === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-theme-text">Reports & AI Insights</h1>
                  <p className="text-sm text-theme-muted mt-0.5">Faculty course analytics and automated cohort summaries</p>
                </div>
                <button onClick={handleExportCSV} className="btn-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download Section Report (CSV)
                </button>
              </div>

              <div className="panel border border-theme-border p-5 space-y-4">
                <div className="flex items-center gap-2 text-theme-accent font-bold text-sm">
                  <Sparkles className="w-4 h-4" /> Automated Section Intelligence Digest
                </div>
                <p className="text-xs text-theme-text leading-relaxed">
                  Based on recent assessment scores, <strong>Machine Learning Section A</strong> displays an average internal score of 78%. 
                  However, 6 students have attendance below 70%, creating a direct exam eligibility risk. 
                  Recommended intervention: Schedule a remedial problem-solving review before Mid-Sem examinations.
                </p>
              </div>
            </div>
          )}

          {/* 10. PROFILE */}
          {currentPage === 'profile' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="text-2xl font-extrabold text-theme-text">Faculty Profile</h1>
                <p className="text-sm text-theme-muted mt-0.5">Faculty credentials and department assignments</p>
              </div>

              <div className="panel border border-theme-border p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-theme-accent to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {faculty.avatar_initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-theme-text">{faculty.name}</h3>
                    <p className="text-xs text-theme-muted">Department of {faculty.department}</p>
                    <span className="text-[10px] text-theme-accent bg-theme-accent/15 px-2 py-0.5 rounded border border-theme-accent/30 font-bold mt-1 inline-block">
                      Faculty ID: {faculty.id}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-theme-border space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-theme-border/50">
                    <span className="text-theme-muted">Designation</span>
                    <span className="text-theme-text font-medium">Associate Professor</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-border/50">
                    <span className="text-theme-muted">Institutional Email</span>
                    <span className="text-theme-text font-medium">{faculty.name.toLowerCase().replace(/\s+/g, '.')}@edupulse.edu</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-theme-muted">Assigned Courses</span>
                    <span className="text-theme-accent font-bold">{faculty.subjects.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

