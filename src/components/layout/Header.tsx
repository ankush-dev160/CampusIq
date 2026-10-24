import React from 'react';
import { Menu, Sparkles, Filter, RefreshCw, Shield } from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext';
import { NavigationPage } from './Sidebar';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

interface HeaderProps {
  currentPage: NavigationPage;
  onOpenMobileNav: () => void;
  onOpenAnalyst: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const PAGE_METADATA: Record<NavigationPage, { title: string; subtitle: string }> = {
  overview: {
    title: 'College Overview',
    subtitle: 'Institutional metrics, distributions, and calculated priority insights.',
  },
  'student-intelligence': {
    title: 'Student Intelligence',
    subtitle: 'Holistic multi-dimensional student profiles, explainable scores, and telemetry.',
  },
  'risk-analysis': {
    title: 'Risk Analysis Matrix',
    subtitle: 'Early warning indicators across academic criteria and placement readiness.',
  },
  'student-segments': {
    title: 'Student Segments',
    subtitle: 'Targeted cohorts categorized by academic standing and career preparation.',
  },
  'intervention-centre': {
    title: 'Intervention Centre',
    subtitle: 'Prescriptive action plans, mentoring assignments, and outcome tracking.',
  },
  'data-integration': {
    title: 'Data Integration Hub',
    subtitle: 'Multi-source CSV ingestion, range validation, duplicate handling, and schema sync.',
  },
  reports: {
    title: 'Institutional Reports',
    subtitle: 'Exportable student profiles, departmental audits, and print-ready documentation.',
  },
  placement: {
    title: 'Placement Cell (TPO)',
    subtitle: 'Campus recruitment drives, eligibility rules, branch skill assessments, and batch readiness.',
  },
  users: {
    title: 'User Management',
    subtitle: 'Manage enrolled student rosters, faculty credentials, and role status.',
  },
  departments: {
    title: 'Departments & Subjects',
    subtitle: 'Curriculum structure, department heads, and academic offerings.',
  },
  assignments: {
    title: 'Faculty Course Assignments',
    subtitle: 'Teaching assignments, section allocations, and instructional workload.',
  },
  permissions: {
    title: 'Role-Based Access Permissions',
    subtitle: 'Enforce portal boundaries and feature authorization across roles.',
  },
  settings: {
    title: 'Platform Settings & Calibration',
    subtitle: 'Configure scoring weights, risk thresholds, and manage demo datasets.',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobileNav,
  onOpenAnalyst,
  showFilters,
  setShowFilters,
}) => {
  const { students, filteredStudents, resetFilters, filters } = useCampusData();
  const pageMeta = PAGE_METADATA[currentPage] || { title: 'CampusIQ', subtitle: 'Smart Campus Analytics' };

  const hasActiveFilters =
    filters.department !== 'All' ||
    filters.academic_year !== 'All' ||
    filters.semester !== 'All' ||
    filters.academic_risk !== 'All' ||
    filters.placement_risk !== 'All' ||
    filters.segment !== 'All' ||
    filters.searchQuery.trim() !== '';

  return (
    <header className="sticky top-0 z-30 bg-theme-surface/85 backdrop-blur-md border-b border-theme-border px-4 sm:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="p-1.5 text-theme-muted hover:text-theme-text rounded-xl hover:bg-theme-elevated lg:hidden transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-theme-text tracking-tight">{pageMeta.title}</h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-theme-accent-muted border border-theme-accent-border text-[11px] font-bold text-theme-accent">
                <Shield className="w-3 h-3" /> Admin
              </span>
            </div>
            <p className="text-xs text-theme-muted hidden sm:block mt-0.5">{pageMeta.subtitle}</p>
          </div>
        </div>

        {/* Right: Actions, Theme Switcher & Cohort Counts */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Cohort size pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-theme-elevated border border-theme-border text-xs">
            <span className="font-bold text-theme-accent">{filteredStudents.length}</span>
            <span className="text-theme-subtle">/</span>
            <span className="text-theme-muted">{students.length} students</span>
          </div>

          {/* Toggle Filter Bar */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-theme-accent-muted text-theme-accent border-theme-accent-border font-bold'
                : 'bg-theme-elevated text-theme-text border-theme-border hover:border-theme-accent-border'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
            )}
          </button>

          {/* Clear filters if active */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="p-1.5 text-theme-muted hover:text-theme-text rounded-xl hover:bg-theme-elevated transition-colors"
              title="Reset all filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Dark / Light Theme Switcher */}
          <ThemeSwitcher />

          {/* Campus Analyst Button */}
          <button
            onClick={onOpenAnalyst}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold btn-primary shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Campus Analyst</span>
          </button>
        </div>
      </div>
    </header>
  );
};
