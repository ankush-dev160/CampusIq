import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CampusDataProvider, useCampusData } from './context/CampusDataContext';
import { CurrentUserProvider, useCurrentUser } from './context/CurrentUserContext';
import { Sidebar, NavigationPage } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { FilterBar } from './components/layout/FilterBar';

// Admin Portal Pages
import { OverviewPage } from './pages/OverviewPage';
import { StudentIntelligencePage } from './pages/StudentIntelligencePage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { StudentSegmentsPage } from './pages/StudentSegmentsPage';
import { InterventionCentrePage } from './pages/InterventionCentrePage';
import { DataIntegrationPage } from './pages/DataIntegrationPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import {
  AdminUsersPage,
  AdminDepartmentsPage,
  AdminAssignmentsPage,
  AdminPermissionsPage,
} from './pages/AdminSupplementalPages';

// Global Overlays
import { StudentDrawer } from './components/student/StudentDrawer';
import { CampusAnalystModal } from './components/analyst/CampusAnalystModal';

// Entry & Other Portals
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { FacultyPortal } from './pages/FacultyPortal';
import { StudentShell, StudentPage } from './components/portal/StudentShell';
import {
  StudentDashboardPage,
  StudentAnalyticsPage,
  StudentPerformancePage,
} from './pages/student/StudentAcademicPages';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentProgressTrackerPage } from './pages/student/StudentProgressTrackerPage';
import {
  StudentMyProblemPage,
  StudentProfilePage,
  StudentSettingsPage,
} from './pages/student/StudentMiscPages';
import { StudentClassroomPage } from './pages/student/StudentClassroomPage';
import { StudentPlacementPage, PlacementTab } from './pages/student/StudentPlacementPage';
import { AdminPlacementPage } from './pages/admin/AdminPlacementPage';
import { PortalRole } from './data/portalData';

// ─── ADMIN PORTAL CONTENT ─────────────────────────────────────────────────────

const AdminPortalContent: React.FC<{ onSwitchPortal: () => void }> = ({ onSwitchPortal }) => {
  const { selectedStudent, setSelectedStudent } = useCampusData();

  const getInitialAdminPage = (): NavigationPage => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin/placement')) {
      return 'placement';
    }
    return 'overview';
  };

  const [currentPage, setCurrentPage] = useState<NavigationPage>(getInitialAdminPage);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAdminSidebarCollapsed, setIsAdminSidebarCollapsed] = useState(false);
  const [isAnalystOpen, setIsAnalystOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const handleAdminNavigate = (page: NavigationPage) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      if (page === 'placement') {
        window.history.pushState(null, '', '/admin/placement');
      } else if (window.location.pathname === '/admin/placement') {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'student-intelligence':
        return <StudentIntelligencePage />;
      case 'risk-analysis':
        return <RiskAnalysisPage />;
      case 'student-segments':
        return <StudentSegmentsPage />;
      case 'intervention-centre':
        return <InterventionCentrePage />;
      case 'data-integration':
        return <DataIntegrationPage />;
      case 'reports':
        return <ReportsPage />;
      case 'placement':
        return <AdminPlacementPage />;
      case 'users':
        return <AdminUsersPage />;
      case 'departments':
        return <AdminDepartmentsPage />;
      case 'assignments':
        return <AdminAssignmentsPage />;
      case 'permissions':
        return <AdminPermissionsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex transition-colors duration-200">
      {/* Persistent Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleAdminNavigate}
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
        onOpenAnalyst={() => setIsAnalystOpen(true)}
        onLogout={onSwitchPortal}
        onCollapseChange={setIsAdminSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isAdminSidebarCollapsed ? 'lg:pl-[5.25rem]' : 'lg:pl-[17.5rem]'
        }`}
      >
        {/* Header */}
        <Header
          currentPage={currentPage}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenAnalyst={() => setIsAnalystOpen(true)}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Global Filter Bar (Collapsible) */}
        {showFilters && <FilterBar />}

        {/* Main Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Student Drawer (Global) */}
      <StudentDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      {/* AI Campus Analyst Modal (Global) */}
      <CampusAnalystModal
        isOpen={isAnalystOpen}
        onClose={() => setIsAnalystOpen(false)}
        onNavigate={setCurrentPage}
      />
    </div>
  );
};

// ─── STUDENT PORTAL CONTENT ───────────────────────────────────────────────────

const getInitialStudentRouteState = (): {
  page: StudentPage;
  subjectId: string | null;
  placementTab: PlacementTab;
} => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path === '/classroom' || path === '/classroom/') {
      return { page: 'classroom', subjectId: null, placementTab: 'overview' };
    }
    const classMatch = path.match(/^\/classroom\/([a-zA-Z0-9_-]+)/);
    if (classMatch) {
      return { page: 'classroom', subjectId: classMatch[1], placementTab: 'overview' };
    }
    if (path === '/placement' || path === '/placement/') {
      return { page: 'placement', subjectId: null, placementTab: 'overview' };
    }
    const placeMatch = path.match(/^\/placement\/([a-zA-Z0-9_-]+)/);
    if (placeMatch) {
      const tab = placeMatch[1] as PlacementTab;
      return { page: 'placement', subjectId: null, placementTab: tab };
    }
    if (path === '/performance' || path === '/performance/') {
      return { page: 'performance', subjectId: null, placementTab: 'overview' };
    }
    if (path === '/attendance' || path === '/attendance/') {
      return { page: 'attendance', subjectId: null, placementTab: 'overview' };
    }
    if (path === '/analytics' || path === '/analytics/') {
      return { page: 'analytics', subjectId: null, placementTab: 'overview' };
    }
    if (path === '/ai-progress' || path === '/ai-progress/') {
      return { page: 'ai-progress', subjectId: null, placementTab: 'overview' };
    }
    if (path === '/my-problem' || path === '/my-problem/') {
      return { page: 'my-problem', subjectId: null, placementTab: 'overview' };
    }
    if (path === '/profile' || path === '/profile/') {
      return { page: 'profile', subjectId: null, placementTab: 'overview' };
    }
    if (path === '/settings' || path === '/settings/') {
      return { page: 'settings', subjectId: null, placementTab: 'overview' };
    }
  }
  return { page: 'dashboard', subjectId: null, placementTab: 'overview' };
};

const StudentPortalContent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [initialRoute] = useState(getInitialStudentRouteState);
  const [studentPage, setStudentPage] = useState<StudentPage>(initialRoute.page);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(initialRoute.subjectId);
  const [placementTab, setPlacementTab] = useState<PlacementTab>(initialRoute.placementTab);

  // Synchronize route with browser history / popstate
  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialStudentRouteState();
      setStudentPage(route.page);
      setSelectedSubjectId(route.subjectId);
      setPlacementTab(route.placementTab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: StudentPage) => {
    setStudentPage(page);
    setSelectedSubjectId(null);
    if (typeof window !== 'undefined') {
      const targetPath = page === 'dashboard' ? '/' : `/${page}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  const handleNavigateSubject = (subjectId: string | null) => {
    setSelectedSubjectId(subjectId);
    if (typeof window !== 'undefined') {
      if (subjectId) {
        window.history.pushState(null, '', `/classroom/${subjectId}`);
      } else {
        window.history.pushState(null, '', '/classroom');
      }
    }
  };

  const renderStudentPage = () => {
    switch (studentPage) {
      case 'dashboard':
        return <StudentDashboardPage onNavigate={handleNavigate} />;
      case 'analytics':
        return <StudentAnalyticsPage />;
      case 'performance':
        return <StudentPerformancePage />;
      case 'attendance':
        return <StudentAttendancePage />;
      case 'classroom':
        return (
          <StudentClassroomPage
            initialSubjectId={selectedSubjectId}
            onNavigateSubject={handleNavigateSubject}
          />
        );
      case 'placement':
        return (
          <StudentPlacementPage
            initialTab={placementTab}
            onTabChange={tab => setPlacementTab(tab)}
          />
        );
      case 'ai-progress':
        return <StudentProgressTrackerPage />;
      case 'my-problem':
        return <StudentMyProblemPage />;
      case 'profile':
        return <StudentProfilePage />;
      case 'settings':
        return <StudentSettingsPage />;
      default:
        return <StudentDashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <StudentShell currentPage={studentPage} onNavigate={handleNavigate} onLogout={onLogout}>
      {renderStudentPage()}
    </StudentShell>
  );
};

// ─── MAIN APP ROUTER ──────────────────────────────────────────────────────────

const MainAppRouter: React.FC = () => {
  const { activeRole, setActiveRole, login, logout, isLoading } = useCurrentUser();
  const [loginPreselectedRole, setLoginPreselectedRole] = useState<PortalRole>('student');

  const handleOpenLogin = (role?: PortalRole) => {
    if (role && role !== 'login' && role !== 'landing') {
      setLoginPreselectedRole(role);
    }
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/login');
    }
    setActiveRole('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center text-theme-accent">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium tracking-wide">Restoring session...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {activeRole === 'landing' && (
        <LandingPage
          onGoToLogin={handleOpenLogin}
        />
      )}

      {activeRole === 'login' && (
        <LoginPage
          onBackToHome={() => {
            if (typeof window !== 'undefined') {
              window.history.pushState(null, '', '/');
            }
            setActiveRole('landing');
          }}
          initialRole={loginPreselectedRole}
        />
      )}

      {activeRole === 'student' && (
        <StudentPortalContent onLogout={logout} />
      )}

      {activeRole === 'faculty' && (
        <FacultyPortal onLogout={logout} />
      )}

      {activeRole === 'admin' && (
        <AdminPortalContent onSwitchPortal={logout} />
      )}
    </>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <CampusDataProvider>
        <CurrentUserProvider>
          <MainAppRouter />
        </CurrentUserProvider>
      </CampusDataProvider>
    </ThemeProvider>
  );
}

export default App;
