import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Plus,
  Menu,
  X,
  Database,
  CheckCircle2,
  BookOpen,
  Clock,
  AlertCircle,
  LogOut,
  User,
} from 'lucide-react';
import { StudentUser } from '../types/assignment.ts';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenBackendModal: () => void;
  dbMode?: 'mongodb' | 'local_persistent';
  isMongoConnected?: boolean;
  totalPending?: number;
  currentUser?: StudentUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onOpenBackendModal,
  dbMode = 'local_persistent',
  isMongoConnected = false,
  totalPending = 0,
  currentUser,
  onLogout,
}) => {
  const location = useLocation();

  // Determine current section title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Exam & Assessment Dashboard';
      case '/all':
        return 'All Exams & Coursework';
      case '/add':
        return 'Schedule Exam';
      case '/pending':
        return 'Pending Exams';
      case '/completed':
        return 'Completed Exams';
      default:
        if (location.pathname.startsWith('/edit/')) return 'Edit Exam Details';
        return 'Exam Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Context breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile navigation"
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-bold text-slate-900 text-base">{getPageTitle()}</span>
            <span className="hidden sm:inline text-slate-300">/</span>
            <span className="hidden sm:inline text-xs font-semibold text-indigo-600">
              {currentUser?.studentId || 'Fall 2026 Term'}
            </span>
          </div>
        </div>

        {/* Center: Quick navigation links for desktop */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-medium">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              location.pathname === '/'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/all"
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              location.pathname === '/all'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Exams
          </Link>
          <Link
            to="/pending"
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              location.pathname === '/pending'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending
            {totalPending > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono-numbers">
                {totalPending}
              </span>
            )}
          </Link>
          <Link
            to="/completed"
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              location.pathname === '/completed'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </Link>
        </nav>

        {/* Right: Interactive DB & Backend status button + Student profile + Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Interactive Backend / Database Status Pill */}
          <button
            type="button"
            onClick={onOpenBackendModal}
            title="Backend Connected! Click to manage MongoDB Atlas or test API health."
            className="hidden sm:flex items-center gap-2 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-slate-300"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="font-semibold text-slate-800">Backend Connected</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-indigo-600 font-medium">
              {isMongoConnected ? 'MongoDB' : 'Storage'}
            </span>
          </button>

          {/* Student Profile & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono-numbers">
                  {currentUser.studentId}
                </span>
              </div>
              <div
                title={`${currentUser.name} (${currentUser.studentId})`}
                className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs"
              >
                {currentUser.avatarUrl || currentUser.name.substring(0, 2).toUpperCase()}
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sign Out of Student Account"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* New Assignment Action Button */}
          {location.pathname !== '/add' && (
            <Link
              to="/add"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Exam</span>
              <span className="sm:hidden">Add</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
