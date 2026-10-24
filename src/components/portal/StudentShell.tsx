import React, { useState } from 'react';
import {
  LayoutDashboard,
  BarChart2,
  BookOpen,
  Calendar,
  Brain,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  Search,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useStudentRecord } from '../../context/CurrentUserContext';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { GlassySidebar, NavItemDef } from '../layout/GlassySidebar';

export type StudentPage =
  | 'dashboard'
  | 'analytics'
  | 'performance'
  | 'attendance'
  | 'classroom'
  | 'placement'
  | 'ai-progress'
  | 'my-problem'
  | 'profile'
  | 'settings';

interface StudentShellProps {
  currentPage: StudentPage;
  onNavigate: (page: StudentPage) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const studentNavItems: NavItemDef<StudentPage>[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    badge: 'Live',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart2 className="w-4 h-4" />,
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: <Calendar className="w-4 h-4" />,
    badge: '71% Alert',
    badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
  {
    id: 'classroom',
    label: 'Classroom',
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    id: 'placement',
    label: 'TPO / Placement',
    icon: <Briefcase className="w-4 h-4" />,
    badge: 'Drives',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'ai-progress',
    label: 'AI Progress Tracker',
    icon: <Brain className="w-4 h-4 text-blue-400" />,
    badge: 'AI',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  {
    id: 'my-problem',
    label: 'My Problem',
    icon: <MessageSquare className="w-4 h-4" />,
    badge: '2 Active',
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: <User className="w-4 h-4" />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
  },
];

export const StudentShell: React.FC<StudentShellProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  children,
}) => {
  const student = useStudentRecord();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'Prof. Suresh Kumar responded to your request REQ-001', time: '2h ago', unread: true },
    { id: 2, text: 'Test 2 marks for Machine Learning have been uploaded (19/20)', time: '1d ago', unread: true },
    { id: 3, text: 'Attendance for Oct 7 marked — 3 absences recorded', time: '2d ago', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const studentUser = {
    name: student.name,
    role: 'Student',
    workspace: `${student.department} · ${student.semester}`,
    avatarInitials: student.avatar_initials,
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex transition-colors duration-200">
      {/* ── Collapsible Glassy Sidebar (Task 1) ── */}
      <GlassySidebar<StudentPage>
        title="CampusIQ"
        portalType="STUDENT"
        user={studentUser}
        navItems={studentNavItems}
        currentPage={currentPage}
        onNavigate={onNavigate}
        mobileOpen={sidebarOpen}
        setMobileOpen={setSidebarOpen}
        onLogout={onLogout}
        storageKey="campusiq_student_sidebar_collapsed"
        onCollapseChange={setIsSidebarCollapsed}
      />

      {/* ── Main Content Area with Dynamic Spring Margin ── */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSidebarCollapsed ? 'lg:pl-[5.25rem]' : 'lg:pl-[17.5rem]'
        }`}
      >
        {/* ── Top Bar: Greeting, Search, Notification Bell, Avatar ── */}
        <header className="sticky top-0 z-30 h-16 bg-theme-surface/85 backdrop-blur-md border-b border-theme-border flex items-center px-4 sm:px-6 gap-3 sm:gap-4 transition-colors duration-200">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-theme-muted hover:text-theme-text p-1.5 rounded-xl hover:bg-theme-secondary transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Editorial Greeting & Portal Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/15 to-emerald-500/15 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">Student Portal</span>
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-medium text-theme-muted">
                Academic Session 2025–26 · <strong className="text-theme-text font-bold">{student.semester}</strong>
              </span>
            </div>
          </div>

          <div className="flex-1" />

          {/* Quick Header Search */}
          <div className="hidden md:flex items-center relative w-64">
            <Search className="w-3.5 h-3.5 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search grades, lectures, faculty..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-theme-secondary border border-theme-border rounded-xl text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-accent transition-all"
            />
          </div>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-secondary transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-extrabold flex items-center justify-center shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-theme-elevated border border-theme-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-theme-border flex items-center justify-between">
                  <span className="text-sm font-bold text-theme-text">Notifications</span>
                  <button className="text-xs text-theme-accent font-semibold hover:underline">Mark all read</button>
                </div>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-theme-border/50 flex gap-3 ${
                      n.unread ? 'bg-theme-accent/5' : ''
                    }`}
                  >
                    {n.unread ? (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] flex-shrink-0 mt-1.5" />
                    ) : (
                      <div className="w-2 h-2 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-xs text-theme-text leading-snug">{n.text}</p>
                      <p className="text-[10px] text-theme-muted mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Card & Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-theme-secondary border border-theme-border hover:border-theme-accent transition-all active:scale-95"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-400 p-[1px] shadow-sm flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-theme-surface flex items-center justify-center text-cyan-300 text-xs font-bold">
                  {student.avatar_initials}
                </div>
              </div>
              <span className="text-xs font-bold text-theme-text hidden sm:block">{student.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-theme-muted" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-60 bg-theme-elevated border border-theme-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-4 bg-theme-secondary/50 border-b border-theme-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-400 p-[1px] mb-2">
                    <div className="w-full h-full rounded-full bg-theme-surface flex items-center justify-center text-cyan-300 font-bold">
                      {student.avatar_initials}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-theme-text">{student.name}</p>
                  <p className="text-xs text-theme-muted">{student.roll_no} · {student.department}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-theme-muted hover:bg-theme-secondary hover:text-theme-text transition-colors"
                  >
                    <User className="w-4 h-4" /> View Profile
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-theme-muted hover:bg-theme-secondary hover:text-theme-text transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Account Settings
                  </button>
                  <div className="border-t border-theme-border my-1" />
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ── Main Content Slot ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentShell;
