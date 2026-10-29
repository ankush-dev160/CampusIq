import React, { useState, useEffect } from 'react';
import {
  Activity,
  ChevronLeft,
  Search,
  Sparkles,
  LogOut,
  ChevronRight,
  X,
  Zap,
} from 'lucide-react';

export interface NavItemDef<T extends string = string> {
  id: T;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  section?: string;
}

interface UserCardDef {
  name: string;
  role: string;
  workspace: string;
  avatarInitials: string;
}

interface GlassySidebarProps<T extends string = string> {
  title: string;
  portalType: string;
  user: UserCardDef;
  navItems: NavItemDef<T>[];
  currentPage: T;
  onNavigate: (page: T) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onLogout?: () => void;
  onOpenAnalyst?: () => void;
  storageKey?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function GlassySidebar<T extends string = string>({
  title,
  portalType,
  user,
  navItems,
  currentPage,
  onNavigate,
  mobileOpen,
  setMobileOpen,
  onLogout,
  onOpenAnalyst,
  storageKey = 'campus_iq_sidebar_collapsed',
  onCollapseChange,
}: GlassySidebarProps<T>) {
  // Collapsed state persisted in localStorage
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      return saved === 'true';
    }
    return false;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(next));
    }
    onCollapseChange?.(next);
  };

  useEffect(() => {
    onCollapseChange?.(collapsed);
  }, [collapsed, onCollapseChange]);

  // Filter items by search query
  const filteredNavItems = navItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <>
      {/* ── Mobile Backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Main Collapsible Floating Glass Sidebar ── */}
      <aside
        className={`fixed z-50 flex flex-col rounded-3xl floating-glass-sidebar transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          top-3 bottom-3 left-3
          ${mobileOpen ? 'translate-x-0 w-[calc(100vw-1.5rem)] max-w-[260px]' : '-translate-x-[115%] lg:translate-x-0'}
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
        `}
      >
        {/* ── Edge Round Toggle Button (Desktop Only) ── */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3.5 top-12 w-7 h-7 rounded-full bg-theme-surface border border-theme-border shadow-md items-center justify-center text-theme-text hover:text-theme-accent hover:border-theme-accent/50 transition-all duration-200 z-50 cursor-pointer hover:scale-110 active:scale-95"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar (260px)' : 'Collapse sidebar (72px)'}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {/* ── Brand Logo Header ── */}
        <div className="p-4 border-b border-theme-border/60 flex items-center justify-between flex-shrink-0 relative overflow-hidden">
          <div className="flex items-center gap-3 min-w-0">
            {/* Glowing Logo Icon */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-700 to-emerald-400 p-[1px] shadow-lg shadow-blue-900/20 flex-shrink-0">
              <div className="w-full h-full rounded-2xl bg-theme-surface flex items-center justify-center text-theme-accent">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Logo Text (Collapses Smoothly) */}
            <div
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-theme-text">{title}</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 tracking-wider">
                  {portalType}
                </span>
              </div>
              <p className="text-[10px] text-theme-muted font-medium tracking-tight">AI Success Platform</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-secondary/60 lg:hidden transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── User / Workspace Card (Hides in collapsed mode) ── */}
        <div
          className={`transition-all duration-300 overflow-hidden px-3.5 flex-shrink-0 ${
            collapsed ? 'max-h-0 opacity-0 py-0' : 'max-h-24 opacity-100 py-3 border-b border-theme-border/60'
          }`}
        >
          <div className="p-2.5 rounded-2xl bg-theme-secondary/40 border border-theme-border/60 flex items-center gap-3 backdrop-blur-md">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-[1px] shadow-sm flex-shrink-0">
                <div className="w-full h-full rounded-xl bg-theme-surface flex items-center justify-center text-theme-accent text-xs font-bold">
                  {user.avatarInitials}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-theme-surface" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-theme-text truncate">{user.name}</div>
              <div className="text-[10px] text-theme-muted truncate">{user.workspace}</div>
            </div>
          </div>
        </div>

        {/* ── Integrated Search Input (Hides smoothly when collapsed) ── */}
        <div
          className={`transition-all duration-300 overflow-hidden px-3 flex-shrink-0 ${
            collapsed ? 'max-h-0 opacity-0 py-0' : 'max-h-16 opacity-100 py-2.5'
          }`}
        >
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search navigation..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-theme-secondary/40 border border-theme-border/60 rounded-xl text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ── MENU Label ── */}
        <div
          className={`px-4 pt-1 transition-all duration-200 overflow-hidden ${
            collapsed ? 'opacity-0 h-0' : 'opacity-100 h-5'
          }`}
        >
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-theme-muted select-none">
            Menu
          </span>
        </div>

        {/* ── Navigation List ── */}
        <nav className="flex-1 px-2.5 py-1.5 space-y-1 overflow-y-auto scrollbar-thin">
          {filteredNavItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileOpen(false);
                  }}
                  className={`group relative w-full flex items-center rounded-2xl text-xs transition-all duration-200 select-none outline-none focus-visible:ring-1 focus-visible:ring-theme-accent active:scale-[0.98] ${
                    collapsed ? 'justify-center px-0 py-2.5 h-11' : 'gap-3 px-3 py-2.5'
                  } ${
                    isActive
                      ? 'sidebar-item-active font-bold border border-theme-accent/25 shadow-sm'
                      : 'text-theme-muted hover:text-theme-text hover:bg-theme-secondary/60 hover:translate-x-0.5'
                  }`}
                  aria-label={item.label}
                >
                  {/* Glowing Vertical Left Accent Bar */}
                  {isActive && (
                    <span
                      className="sidebar-indicator"
                      aria-hidden="true"
                    />
                  )}

                  {/* Icon */}
                  <span
                    className={`transition-colors duration-150 flex-shrink-0 ${
                      isActive ? 'text-theme-accent' : 'text-theme-muted group-hover:text-theme-text'
                    }`}
                  >
                    {item.icon}
                  </span>

                  {/* Label (hides when collapsed) */}
                  <span
                    className={`truncate text-left font-medium transition-all duration-300 ${
                      collapsed ? 'w-0 opacity-0 hidden' : 'flex-1 opacity-100 block'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Badge */}
                  {item.badge && (
                    <>
                      {/* Expanded Badge */}
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border transition-all duration-300 ${
                          collapsed ? 'hidden' : 'block'
                        } ${
                          item.badgeColor ||
                          'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-400/25'
                        }`}
                      >
                        {item.badge}
                      </span>

                      {/* Collapsed Badge (Small Glowing Dot) */}
                      {collapsed && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-theme-accent shadow-[0_0_6px_var(--sidebar-indicator-glow)]" />
                      )}
                    </>
                  )}
                </button>

                {/* Floating Tooltip in Collapsed State */}
                {collapsed && hoveredItem === item.id && (
                  <div className="hidden lg:flex fixed left-[84px] z-50 items-center gap-2 px-3 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text text-xs font-bold shadow-2xl backdrop-blur-xl whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-theme-accent/15 text-theme-accent border border-theme-accent/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Bottom Section: AI Callout / Pro Upgrade & Logout ── */}
        <div className="p-3 border-t border-theme-border/60 flex-shrink-0 space-y-2">
          {/* AI Campus Assistant Callout Card (Admin) */}
          {onOpenAnalyst && !collapsed && (
            <div className="p-3 rounded-2xl border border-blue-200 dark:border-blue-500/30 bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 dark:from-blue-900/30 dark:via-slate-900/40 dark:to-emerald-900/20 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-300" />
                <span className="text-xs font-bold text-theme-text">AI Campus Analyst</span>
              </div>
              <p className="text-[10px] text-theme-muted leading-relaxed mb-2">
                Deterministic cohort queries & risk synthesis.
              </p>
              <button
                onClick={() => {
                  onOpenAnalyst();
                  setMobileOpen(false);
                }}
                className="w-full text-xs font-bold py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Ask Analyst</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Pro Upgrade Card (Hidden when collapsed) */}
          {!collapsed && (
            <div className="p-2.5 rounded-2xl bg-theme-secondary/40 border border-theme-border/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-theme-text">CampusIQ Pro</div>
                  <div className="text-[9px] text-theme-muted">Analytics v2.4 Active</div>
                </div>
              </div>
            </div>
          )}

          {/* Logout / Switch Portal */}
          {onLogout && (
            <button
              onClick={onLogout}
              className={`w-full flex items-center rounded-2xl text-xs font-semibold text-theme-muted hover:bg-red-500/10 hover:text-red-500 transition-colors ${
                collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
              }`}
              title="Switch Portal / Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className={`truncate ${collapsed ? 'hidden' : 'block'}`}>
                Switch Portal / Log Out
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default GlassySidebar;
