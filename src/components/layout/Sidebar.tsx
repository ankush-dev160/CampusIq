import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  AlertTriangle,
  Users,
  LifeBuoy,
  Database,
  FileSpreadsheet,
  Settings,
  BookOpen,
  UserCheck,
  ShieldAlert,
  Briefcase,
} from 'lucide-react';
import { GlassySidebar, NavItemDef } from './GlassySidebar';

export type NavigationPage =
  | 'overview'
  | 'student-intelligence'
  | 'risk-analysis'
  | 'student-segments'
  | 'intervention-centre'
  | 'data-integration'
  | 'reports'
  | 'placement'
  | 'users'
  | 'departments'
  | 'assignments'
  | 'permissions'
  | 'settings';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenAnalyst?: () => void;
  onLogout?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  mobileOpen,
  setMobileOpen,
  onOpenAnalyst,
  onLogout,
  onCollapseChange,
}) => {
  const navItems: NavItemDef<NavigationPage>[] = [
    {
      id: 'overview',
      label: 'College Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: 'Live',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      section: 'analytics',
    },
    {
      id: 'student-intelligence',
      label: 'Student Intelligence',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: '50',
      section: 'analytics',
    },
    {
      id: 'risk-analysis',
      label: 'Risk Analysis',
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      badge: '4 High',
      badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30',
      section: 'analytics',
    },
    {
      id: 'student-segments',
      label: 'Student Segments',
      icon: <Users className="w-4 h-4" />,
      section: 'analytics',
    },
    {
      id: 'intervention-centre',
      label: 'Intervention Centre',
      icon: <LifeBuoy className="w-4 h-4" />,
      badge: '12 Active',
      badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      section: 'analytics',
    },
    {
      id: 'data-integration',
      label: 'Data Integration',
      icon: <Database className="w-4 h-4" />,
      badge: 'Synced',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      section: 'analytics',
    },
    {
      id: 'reports',
      label: 'Reports & Audits',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: 'New',
      section: 'analytics',
    },
    {
      id: 'placement',
      label: 'Placement Cell (TPO)',
      icon: <Briefcase className="w-4 h-4" />,
      badge: 'Drives',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      section: 'admin',
    },
    {
      id: 'users',
      label: 'Users & Rosters',
      icon: <UserCheck className="w-4 h-4" />,
      section: 'admin',
    },
    {
      id: 'departments',
      label: 'Departments & Subjects',
      icon: <BookOpen className="w-4 h-4" />,
      section: 'admin',
    },
    {
      id: 'assignments',
      label: 'Faculty Assignments',
      icon: <Users className="w-4 h-4" />,
      section: 'admin',
    },
    {
      id: 'permissions',
      label: 'Access Permissions',
      icon: <ShieldAlert className="w-4 h-4" />,
      section: 'admin',
    },
    {
      id: 'settings',
      label: 'Settings & Calibration',
      icon: <Settings className="w-4 h-4" />,
      section: 'admin',
    },
  ];

  const adminUser = {
    name: 'Dean Analytics',
    role: 'Administrator',
    workspace: 'Apex Engineering Institute',
    avatarInitials: 'DA',
  };

  return (
    <GlassySidebar<NavigationPage>
      title="CampusIQ"
      portalType="ADMIN"
      user={adminUser}
      navItems={navItems}
      currentPage={currentPage}
      onNavigate={onNavigate}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      onLogout={onLogout}
      onOpenAnalyst={onOpenAnalyst}
      storageKey="campusiq_admin_sidebar_collapsed"
      onCollapseChange={onCollapseChange}
    />
  );
};

export default Sidebar;
