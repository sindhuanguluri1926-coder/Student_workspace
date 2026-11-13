import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Lock,
  BookOpen,
} from 'lucide-react';
import { examService } from '../services/examService';
import { Exam, StudentDashboardStats } from '../types/system';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examService.getStudentDashboard();
      setStats(data.stats);
      setExams(data.exams || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch student dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-purple-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-purple-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-purple-200 text-xs sm:text-sm max-w-xl">
              Registration Number: <strong className="text-white font-mono">{user?.registrationNumber}</strong> • {user?.department || 'Computer Science & Engineering'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/student/exams"
              className="px-5 py-3 rounded-xl bg-white text-purple-700 hover:bg-purple-50 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>View Available Exams</span>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Exams Assigned */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Assigned Exams</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {loading ? '—' : stats?.totalAssigned ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Available to your class</div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
              {loading ? '—' : stats?.completedCount ?? 0}
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-1">Submitted & locked</div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
              {loading ? '—' : stats?.pendingCount ?? 0}
            </div>
            <div className="text-[11px] text-amber-700/80 mt-1">Ready to take</div>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Average Score</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 font-mono">
              {loading ? '—' : `${stats?.avgPercentage ?? 0}%`}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Across all completed tests</div>
          </div>
        </div>
      </div>

      {/* Assigned Examinations List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Assigned Examinations</h2>
            <p className="text-xs text-slate-500">
              Only published exams appear here. Each exam can only be taken once.
            </p>
          </div>
          <Link
            to="/student/exams"
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No exams currently assigned to your class.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="p-5 rounded-2xl border border-slate-200/90 hover:border-purple-200 bg-white hover:bg-slate-50/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                      {exam.subject}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{exam.duration} mins</span>
                    </span>
                  </div>

                  {/* NO LINE-THROUGH ON TITLE (per user request!) */}
                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {exam.description || 'Examination assessment.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{exam.totalMarks} Marks</span>
                    <span className="mx-1">•</span>
                    <span>{exam.questionsCount || 0} Questions</span>
                  </div>

                  {/* ONE ATTEMPT BUTTON LOGIC */}
                  {exam.isCompleted ? (
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-100 text-emerald-800">
                        {exam.score} / {exam.totalMarks} ({exam.percentage}%)
                      </span>
                      {/* Permanently DISABLED button per user request */}
                      <button
                        disabled
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 text-slate-500 cursor-not-allowed opacity-75 flex items-center space-x-1"
                        title="You have already completed this exam and cannot attempt it again."
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Completed (Locked)</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={`/student/exams/${exam.id}/take`}
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/20 transition-colors flex items-center space-x-1"
                    >
                      <span>Start Exam</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Workspace Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Manage Coursework & Homework</h4>
            <p className="text-xs text-slate-500">
              Need to track upcoming project deadlines and assignments?
            </p>
          </div>
        </div>
        <Link
          to="/assignments"
          className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors whitespace-nowrap"
        >
          Open Assignment Workspace →
        </Link>
      </div>
    </div>
  );
}
