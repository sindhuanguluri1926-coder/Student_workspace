import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  Clock,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  X,
  BookOpen,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { StudentUser } from '../types/assignment.ts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pendingCount?: number;
  completedCount?: number;
  totalCount?: number;
  currentUser?: StudentUser | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  pendingCount = 0,
  completedCount = 0,
  totalCount = 0,
  currentUser,
  onLogout,
}) => {
  const navItems = [
    {
      to: '/assignments',
      label: 'Assignment Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/assignments/all',
      label: 'All Coursework',
      icon: Layers,
      badge: totalCount > 0 ? totalCount : null,
      badgeClass: 'bg-slate-100 text-slate-700',
    },
    {
      to: '/assignments/add',
      label: 'Schedule Task',
      icon: PlusCircle,
      badge: null,
    },
    {
      to: '/assignments/pending',
      label: 'Pending Tasks',
      icon: Clock,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeClass: 'bg-amber-100 text-amber-800',
    },
    {
      to: '/assignments/completed',
      label: 'Completed Archive',
      icon: CheckCircle2,
      badge: completedCount > 0 ? completedCount : null,
      badgeClass: 'bg-emerald-100 text-emerald-800',
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight">
              StudyFlow
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Assignment Workspace</p>
          </div>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Gateway Switcher Link */}
      <div className="px-3 pt-3">
        <Link
          to="/"
          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Portal Gateway</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Coursework & Homework
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/assignments'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full font-mono-numbers ${
                    item.badgeClass || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Student Academic Card in footer */}
      <div className="p-3.5 m-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span className="text-xs font-bold text-slate-900">Academic Task Sync</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Assignments and deadlines synchronized with MongoDB persistent store.
        </p>
      </div>

      {/* Footer Profile with Student Details and Logout */}
      <div className="p-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
            {currentUser?.avatarUrl || currentUser?.name?.substring(0, 2).toUpperCase() || 'ST'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-slate-900 truncate">
              {currentUser?.name || 'Enrolled Student'}
            </div>
            <div className="text-[11px] text-slate-500 truncate font-mono-numbers">
              {currentUser?.studentId || 'Fall 2026'}
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Return to Welcome Portals"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Return to Portals"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col shrink-0 min-h-screen">
        <div className="sticky top-0 h-screen">{content}</div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 w-64 max-w-xs h-full shadow-2xl bg-white">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
