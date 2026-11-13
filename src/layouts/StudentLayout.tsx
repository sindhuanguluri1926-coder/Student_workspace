import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Award,
  User,
  LogOut,
  Menu,
  X,
  BookOpen,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Available Exams', to: '/student/exams', icon: FileText },
    { label: 'My Results', to: '/student/results', icon: Award },
    { label: 'Student Profile', to: '/student/profile', icon: User },
    { label: 'Assignment Workspace', to: '/assignments', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90 text-slate-700 shrink-0 select-none">
        {/* Brand */}
        <div className="p-5 border-b border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-slate-900 tracking-tight leading-tight truncate">
              Student Portal
            </div>
            <div className="text-[11px] text-purple-600 font-semibold tracking-wide uppercase">
              Examination Desk
            </div>
          </div>
        </div>

        {/* Student ID Badge */}
        <div className="p-3 mx-3 my-3 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-slate-900 truncate">
              {user?.name || 'Student'}
            </div>
            <div className="text-[10px] text-purple-700 font-mono font-medium truncate">
              {user?.registrationNumber || 'ST-2024-001'}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Single Attempt Rule Notice & Sign Out */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 leading-tight">
            <div className="font-semibold text-slate-700 mb-0.5 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Single Attempt Policy</span>
            </div>
            Once you submit an exam, it is locked permanently and cannot be retaken.
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-white text-slate-800 p-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900">Student Portal</div>
            <div className="text-[10px] text-purple-600 font-mono">{user?.registrationNumber}</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                  isActive ? 'bg-purple-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              {user?.name} ({user?.registrationNumber})
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-rose-600 font-semibold flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
