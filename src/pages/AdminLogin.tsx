import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, KeyRound, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, isAdmin, user } = useAuth();

  const [adminId, setAdminId] = useState('FACULTY-001');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPasswordNote, setShowForgotPasswordNote] = useState(false);

  React.useEffect(() => {
    if (isAdmin && user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim() || !password) {
      setError('Please provide both Admin ID or Email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const res = await loginAdmin(adminId.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const autofillDemo = () => {
    setAdminId('FACULTY-001');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portals</span>
        </Link>

        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Faculty / Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in using your permanent faculty account credentials
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
              <label htmlFor="adminId" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin ID
              </label>
              <div className="relative">
                <input
                  id="adminId"
                  name="adminId"
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value.toUpperCase())}
                  placeholder="e.g. FACULTY-001"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Persistent identifier assigned to faculty members.
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={autofillDemo}
                className="text-indigo-600 hover:text-indigo-700 font-medium underline"
              >
                Autofill Demo Admin
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPasswordNote(!showForgotPasswordNote)}
                className="text-slate-500 hover:text-slate-700"
              >
                Forgot Password?
              </button>
            </div>

            {showForgotPasswordNote && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                To reset password for faculty accounts, use default password <code className="font-bold">admin123</code> for <code className="font-bold">FACULTY-001</code>, or contact system administration.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-sm shadow-indigo-600/30 flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Login to Faculty Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Persistent Account Credentials Reference */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-700 font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified System Admin Account</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-500 mt-1 text-[11px]">
                <div>Admin ID: <strong className="text-slate-800 font-mono">FACULTY-001</strong></div>
                <div>Password: <strong className="text-slate-800 font-mono">admin123</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Looking for student assessments?{' '}
          <Link to="/student/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Go to Student Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
