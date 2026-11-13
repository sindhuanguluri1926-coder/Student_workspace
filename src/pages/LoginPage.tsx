import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { StudentUser } from '../types/assignment.ts';

interface LoginPageProps {
  onLogin: (user: StudentUser) => void;
}

const DEMO_STUDENTS: StudentUser[] = [
  {
    id: 'user_1',
    studentId: 'CS-2024-082',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    department: 'Computer Science & Engineering',
    semester: 'Year 3 · Fall 2026',
    avatarUrl: 'AJ',
  },
  {
    id: 'user_2',
    studentId: 'ENG-2024-019',
    name: 'Emma Watson',
    email: 'emma.watson@university.edu',
    department: 'Electrical & Software Engineering',
    semester: 'Year 2 · Fall 2026',
    avatarUrl: 'EW',
  },
  {
    id: 'user_3',
    studentId: 'MATH-2024-045',
    name: 'David Chen',
    email: 'david.chen@university.edu',
    department: 'Applied Mathematics & Statistics',
    semester: 'Year 4 · Fall 2026',
    avatarUrl: 'DC',
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('alex.johnson@university.edu');
  const [password, setPassword] = useState('student@2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your Student ID or University Email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your portal password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate authenticating student credentials
    setTimeout(() => {
      // Find matching demo student or create profile
      const matched = DEMO_STUDENTS.find(
        (s) =>
          s.email.toLowerCase() === identifier.trim().toLowerCase() ||
          s.studentId.toLowerCase() === identifier.trim().toLowerCase()
      );

      const student: StudentUser = matched || {
        id: 'user_custom',
        studentId: identifier.includes('@') ? 'ST-2026-' + Math.floor(100 + Math.random() * 900) : identifier.toUpperCase(),
        name: identifier.includes('@')
          ? identifier.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          : 'Enrolled Student',
        email: identifier.includes('@') ? identifier : `${identifier.toLowerCase()}@university.edu`,
        department: 'Academic Division',
        semester: 'Fall 2026 Term',
        avatarUrl: 'ST',
      };

      setIsLoading(false);
      onLogin(student);
    }, 400);
  };

  const handleSelectDemo = (student: StudentUser) => {
    setIdentifier(student.email);
    setPassword('student@2026');
    setError(null);
    onLogin(student);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand header */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight text-center">
            Student Exam & Assessment Portal
          </h1>
          <p className="mt-1 text-xs text-slate-500 text-center font-medium max-w-sm">
            Sign in to access your course dashboard, examine scheduled tests, and submit academic assessments.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="student-id"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Student ID or University Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="student-id"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. CS-2024-082 or student@university.edu"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Default: student@2026</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 select-none cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span>Remember on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Exam Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Student Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>One-Click Student Demo Accounts</span>
            </div>
            <div className="space-y-2">
              {DEMO_STUDENTS.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => handleSelectDemo(student)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {student.avatarUrl}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {student.studentId} · {student.department.split('&')[0].trim()}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Sign In →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Connected with MongoDB Atlas & University Academic Records</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
