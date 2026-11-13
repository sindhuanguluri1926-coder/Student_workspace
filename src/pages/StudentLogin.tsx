import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck, KeyRound, AlertCircle, ArrowLeft, CheckCircle2, UserPlus, Sparkles, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { loginStudent, isStudent, user } = useAuth();

  const [identifier, setIdentifier] = useState('ST-2024-001');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to the exam details dashboard
  useEffect(() => {
    if (isStudent && user) {
      navigate('/student/exams', { replace: true });
    }
  }, [isStudent, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please provide your Registration Number or University Email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const res = await loginStudent(identifier.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      // Navigate directly to the dashboard of exam details
      navigate('/student/exams');
    } else {
      setError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const selectQuickStudent = (idValue: string, pwd = 'student123') => {
    setIdentifier(idValue);
    setPassword(pwd);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portals</span>
        </Link>

        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Examination Login
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your university registration number or email to access your exams
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200/80 rounded-2xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="identifier" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Registration Number or Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. ST-2024-001 or student@university.edu"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                You can enter your Registration No (ST-2024-001) or university email.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Default: student123</span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-sm shadow-purple-600/30 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Exam Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Student Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                One-Click Test Accounts:
              </span>
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            </div>

            <div className="space-y-2">
              {/* Sindhu Profile */}
              <button
                type="button"
                onClick={() => selectQuickStudent('sindhuanguluri1926@gmail.com')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/60 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">Sindhu</div>
                  <div className="text-[11px] text-slate-500 font-mono">sindhuanguluri1926@gmail.com</div>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                  Select
                </span>
              </button>

              {/* Alex Johnson (Locked / Completed Exam) */}
              <button
                type="button"
                onClick={() => selectQuickStudent('ST-2024-001')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/60 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">Alex Johnson</div>
                  <div className="text-[11px] text-slate-500 font-mono">ST-2024-001 (Completed Exam Demo)</div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Completed
                </span>
              </button>

              {/* Emma Watson (Fresh student) */}
              <button
                type="button"
                onClick={() => selectQuickStudent('ST-2024-002')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/60 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">Emma Watson</div>
                  <div className="text-[11px] text-slate-500 font-mono">ST-2024-002 (Fresh Student Demo)</div>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                  Ready
                </span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/student/register"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New student? Register a new account</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Faculty / Examiner?{' '}
          <Link to="/admin/login" className="text-purple-600 hover:text-purple-700 font-semibold">
            Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
