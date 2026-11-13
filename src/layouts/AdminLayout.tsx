import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Users,
  Activity,
  Award,
  LogOut,
  Menu,
  X,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { examService } from '../services/examService';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReseed = async () => {
    if (confirm('Reset all exams, attempts, and students to initial clean demo data?')) {
      setIsReseeding(true);
      try {
        await examService.reseedSystem();
        window.location.reload();
      } catch (e: any) {
        alert(e.message || 'Failed to reseed');
      } finally {
        setIsReseeding(false);
      }
    }
  };

  const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Create Exam', to: '/admin/create-exam', icon: FilePlus },
    { label: 'All Exams', to: '/admin/exams', icon: FileText },
    { label: 'Student Details', to: '/admin/students', icon: Users },
    { label: 'Student Progress', to: '/admin/progress', icon: Activity },
    { label: 'Results & Grades', to: '/admin/results', icon: Award },
    { label: 'Assignment Workspace', to: '/assignments', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-white tracking-tight leading-tight truncate">
              Faculty Portal
            </div>
            <div className="text-[11px] text-indigo-400 font-semibold tracking-wide uppercase">
              Admin Console
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Reseed & User Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <button
            onClick={handleReseed}
            disabled={isReseeding}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/70 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Reset Demo Data</span>
          </button>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="flex items-center space-x-2.5 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {user?.name || 'Prof. Sarah Mitchell'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  ID: {user?.adminId || 'FACULTY-001'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm">Faculty Portal</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {user?.name} ({user?.adminId})
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-rose-400 font-semibold flex items-center space-x-1"
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
