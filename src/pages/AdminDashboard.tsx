import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  FilePlus,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { examService } from '../services/examService';
import { AdminDashboardStats, Exam } from '../types/system';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [activeExams, setActiveExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examService.getAdminDashboard();
      setStats(data.stats);
      setRecentSubmissions(data.recentSubmissions || []);
      setActiveExams(data.activeExamsList || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Faculty Administration Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Performance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time live examination metrics and student attempt statistics synchronized with MongoDB
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/create-exam"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <FilePlus className="w-4 h-4" />
            <span>Create New Exam</span>
          </Link>
          <Link
            to="/admin/exams"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold transition-colors"
          >
            <span>All Exams</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="text-xs font-semibold text-rose-800 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Live Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {loading ? '—' : stats?.totalStudents ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Enrolled & registered</div>
          </div>
        </div>

        {/* Total Exams */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Exams</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {loading ? '—' : stats?.totalExams ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Created in database</div>
          </div>
        </div>

        {/* Active Exams */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Active Exams</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
              {loading ? '—' : stats?.activeExams ?? 0}
            </div>
            <div className="text-[11px] text-emerald-600/80 mt-1">Published to students</div>
          </div>
        </div>

        {/* Completed Attempts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {loading ? '—' : stats?.completedAttempts ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Submitted & graded</div>
          </div>
        </div>

        {/* Pending Attempts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
              {loading ? '—' : stats?.pendingAttempts ?? 0}
            </div>
            <div className="text-[11px] text-amber-700/80 mt-1">Awaiting submission</div>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Avg Score</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono">
              {loading ? '—' : `${stats?.averageScore ?? 0}%`}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Pass Rate: <strong className="text-slate-700 font-semibold">{stats?.passRate ?? 0}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Published Exams & Recent Student Submissions */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Published Exams */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Active Published Exams</h2>
              </div>
              <Link
                to="/admin/exams"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading active exams...</div>
            ) : activeExams.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500">
                No published exams found. Click "Create New Exam" to publish an exam.
              </div>
            ) : (
              <div className="space-y-3">
                {activeExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/20 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 mb-0.5">{exam.title}</div>
                      <div className="text-[11px] text-indigo-600 font-medium">
                        {exam.subject} • {exam.duration} mins • {exam.totalMarks} Marks
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      Published
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Only published exams appear in student portals</span>
            <Link
              to="/admin/create-exam"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              + Add Exam
            </Link>
          </div>
        </div>

        {/* Recent Student Submissions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-bold text-slate-900">Recent Student Submissions</h2>
              </div>
              <Link
                to="/admin/results"
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
              >
                <span>Full Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading submissions...</div>
            ) : recentSubmissions.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500">
                No submitted attempts yet. As students take exams, grades will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{sub.studentName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({sub.registrationNumber})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                        {sub.examTitle}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-slate-900">
                        {sub.score} / {sub.totalMarks} ({sub.percentage}%)
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          sub.result === 'Pass'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sub.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Auto-graded on server upon submission</span>
            <Link
              to="/admin/progress"
              className="text-xs font-semibold text-purple-600 hover:text-purple-800"
            >
              View Progress Grid →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
