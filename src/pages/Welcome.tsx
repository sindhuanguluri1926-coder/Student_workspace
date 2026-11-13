import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  BookOpen,
  ArrowRight,
  Clock,
  Lock,
  Award,
  CheckCircle2,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Welcome() {
  const navigate = useNavigate();
  const { user, isAdmin, isStudent } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 text-slate-800 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                EduPortal
              </span>
              <span className="text-xs text-indigo-600 font-medium">
                Assignment & Examination Management System
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Logged in as <strong className="text-slate-800">{user.name}</strong> ({user.role})
                </span>
                <button
                  onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-600/20 flex items-center space-x-1.5"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors"
                >
                  Faculty Login
                </Link>
                <Link
                  to="/student/login"
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                >
                  Student Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Unified Academic Examination & Assignment Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight mb-5">
            Student Assignment & Examination Management System
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A single, connected university portal for instructors to create, publish, and monitor timed exams, and for students to attend assessments with single-attempt lock security, auto-grading, and instant results.
          </p>
        </div>

        {/* Dual Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
          {/* Admin / Faculty Portal Card */}
          <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                  Faculty Access
                </span>
                <span className="text-xs text-slate-400">• Persistent ID</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                Admin / Faculty Portal
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Create and manage exams with customizable multiple-choice questions, set time limits, monitor real-time student progress, view detailed student directory, and analyze overall results.
              </p>

              <div className="space-y-2.5 mb-8 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Exam Builder with draft, publish, and time controls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Live student progress & automated gradebook</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Persistent Faculty ID authentication (FACULTY-001)</span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 flex items-center justify-between text-xs text-slate-500">
                <span>Demo Admin ID: <strong className="text-slate-800 font-mono">FACULTY-001</strong></span>
                <span>Pass: <strong className="text-slate-800 font-mono">admin123</strong></span>
              </div>
              <Link
                to="/admin/login"
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-colors shadow-md shadow-indigo-600/20 group-hover:bg-indigo-700"
              >
                <span>Admin Login</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Student Portal Card */}
          <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-105 transition-transform">
                <UserCheck className="w-7 h-7" />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                  Student Access
                </span>
                <span className="text-xs text-slate-400">• Single Attempt Lock</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                Student Portal
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Access assigned examinations, answer timed MCQs with countdown alerts, submit tests securely, and view your graded performance with comprehensive review.
              </p>

              <div className="space-y-2.5 mb-8 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Interactive exam room with live countdown timer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>One Attempt Only lock: once submitted, button is disabled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant server-side grading and question review</span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 flex items-center justify-between text-xs text-slate-500">
                <span>Demo Reg No: <strong className="text-slate-800 font-mono">ST-2024-001</strong></span>
                <span>Pass: <strong className="text-slate-800 font-mono">student123</strong></span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/student/login"
                  className="py-3 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-purple-600/20"
                >
                  <span>Student Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/student/register"
                  className="py-3 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold text-sm flex items-center justify-center transition-colors text-center"
                >
                  <span>New Student? Register</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Feature: Direct Link to Student Assignment Workspace */}
        <div className="mt-12 max-w-5xl mx-auto w-full bg-white/70 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Student Assignment Workspace</h4>
              <p className="text-xs text-slate-500">Track deadlines, course priorities, and homework workloads in the full assignment dashboard.</p>
            </div>
          </div>
          <Link
            to="/assignments"
            className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
          >
            Open Assignment Workspace →
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto w-full">
          <div className="p-4 bg-white/60 rounded-xl border border-slate-200/60 text-center">
            <Lock className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-900">One-Attempt Lock</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Database enforced unique compound index</div>
          </div>
          <div className="p-4 bg-white/60 rounded-xl border border-slate-200/60 text-center">
            <Clock className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-900">Auto-Submit Timer</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Synchronized countdown with auto-grading</div>
          </div>
          <div className="p-4 bg-white/60 rounded-xl border border-slate-200/60 text-center">
            <Database className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-900">MongoDB Ready</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Supports Atlas URI & local persistent store</div>
          </div>
          <div className="p-4 bg-white/60 rounded-xl border border-slate-200/60 text-center">
            <Layers className="w-5 h-5 text-amber-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-900">Live Gradebook</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Automated calculation of pass rates & scores</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          Student Assignment & Examination Management System • Unified Portal with Node.js & MongoDB
        </div>
      </footer>
    </div>
  );
}
