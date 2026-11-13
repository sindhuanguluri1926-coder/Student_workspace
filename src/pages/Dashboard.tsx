import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  CalendarDays,
  Flame,
  GraduationCap,
  Award,
} from 'lucide-react';
import { Assignment, StudentUser } from '../types/assignment.ts';
import StatsCard from '../components/StatsCard.tsx';
import AssignmentCard from '../components/AssignmentCard.tsx';
import { checkIsOverdue, getFormattedCurrentDate } from '../utils/dateUtils.ts';

interface DashboardProps {
  assignments: Assignment[];
  isLoading: boolean;
  currentUser?: StudentUser | null;
  onToggleStatus: (id: string, currentStatus: 'Pending' | 'Completed') => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  onViewDetails: (assignment: Assignment) => void;
  onTakeExam?: (assignment: Assignment) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  assignments,
  isLoading,
  currentUser,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewDetails,
  onTakeExam,
}) => {
  const navigate = useNavigate();

  // Dynamic statistics calculations
  const total = assignments.length;
  const pending = assignments.filter((a) => a.status === 'Pending').length;
  const completed = assignments.filter((a) => a.status === 'Completed').length;
  const overdue = assignments.filter((a) => checkIsOverdue(a)).length;

  // Upcoming deadlines / exams (pending assignments sorted by earliest deadline first)
  const upcomingAssignments = [...assignments]
    .filter((a) => a.status === 'Pending')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 6);

  // Recent assignments / exams (sorted by recently created first, latest 5)
  const recentAssignments = [...assignments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Dynamic motivational quote
  const getMotivationalMessage = () => {
    if (overdue > 0) {
      return `You have ${overdue} overdue exam${overdue > 1 ? 's' : ''} past deadline. Complete pending assessments to preserve your grade standing!`;
    }
    if (pending === 0 && completed > 0) {
      return "All scheduled exams & assignments completed! Your submissions have been logged to the academic registry.";
    }
    if (completionRate >= 50) {
      return `Great academic momentum! You have completed ${completionRate}% of your term assessments (${completed} of ${total}).`;
    }
    return 'Review exam details and complete your scheduled subject assessments on time.';
  };

  const studentName = currentUser?.name || 'Student';

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* A. Welcome Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-violet-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-indigo-100 border border-white/10">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{getFormattedCurrentDate()}</span>
              </div>
              {currentUser && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/10">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                  <span>{currentUser.studentId} · {currentUser.department.split('&')[0]}</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {studentName}!
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-normal">
              {getMotivationalMessage()}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/add"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Exam</span>
            </Link>

            <Link
              to="/all"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-sm text-white transition-all cursor-pointer"
            >
              <span>All Exams ({total})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mini progress strip inside welcome card */}
        {total > 0 && (
          <div className="relative z-10 mt-6 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-100">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                Assessment Completion: <strong className="text-white font-mono-numbers">{completionRate}%</strong> completed ({completed}/{total})
              </span>
            </div>
            <div className="w-full sm:w-64 bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* B. Statistics Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Exam & Assessment Statistics</h2>
          <span className="text-xs text-slate-500">Live database metrics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Exams"
            value={total}
            subtitle="All scheduled & completed exams"
            icon={Layers}
            variant="total"
            onClick={() => navigate('/all')}
          />
          <StatsCard
            title="Pending Exams"
            value={pending}
            subtitle={`${pending > 0 ? 'Exams pending student attempt' : 'All exams completed'}`}
            icon={Clock}
            variant="pending"
            onClick={() => navigate('/pending')}
          />
          <StatsCard
            title="Completed Exams"
            value={completed}
            subtitle={`${completionRate}% overall completion rate`}
            icon={CheckCircle2}
            variant="completed"
            onClick={() => navigate('/completed')}
          />
          <StatsCard
            title="Overdue Exams"
            value={overdue}
            subtitle={overdue > 0 ? 'Passed scheduled date' : 'Zero overdue assessments!'}
            icon={AlertTriangle}
            variant="overdue"
            onClick={() => navigate('/all?status=Overdue')}
          />
        </div>
      </section>

      {/* C & D: Main 2-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* D. Upcoming Deadlines / Exams (Ascending order) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Upcoming Exam Schedule</h2>
            </div>
            <Link
              to="/pending"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View all pending ({pending})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : upcomingAssignments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Pending Exams!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You have no pending exams awaiting submission. Completed exams are safely archived.
              </p>
              <Link
                to="/add"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule New Exam</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment._id || assignment.id}
                  assignment={assignment}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewDetails={onViewDetails}
                  onTakeExam={onTakeExam}
                />
              ))}
            </div>
          )}
        </section>

        {/* C. Recent Exams & Submissions */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Recent Exam Details</h2>
            </div>
            <Link
              to="/all"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>See all ({total})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : recentAssignments.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-500">No exams scheduled yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAssignments.map((assignment) => {
                const isItemCompleted = assignment.status === 'Completed';

                return (
                  <div
                    key={assignment._id || assignment.id}
                    className={`bg-white rounded-2xl p-4 border transition-all flex flex-col gap-2 ${
                      isItemCompleted
                        ? 'border-emerald-200/90 bg-emerald-50/15'
                        : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md truncate max-w-[160px]">
                        {assignment.subject}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isItemCompleted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : checkIsOverdue(assignment)
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {isItemCompleted
                          ? assignment.score !== undefined
                            ? `Completed (${assignment.score}%)`
                            : 'Completed'
                          : checkIsOverdue(assignment)
                          ? 'Overdue'
                          : 'Scheduled'}
                      </span>
                    </div>

                    {/* Clean title without strikethrough */}
                    <h3
                      onClick={() => onViewDetails(assignment)}
                      className="text-sm font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                    >
                      {assignment.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1 font-mono-numbers text-[11px]">
                        <span>Date:</span>
                        <span>{new Date(assignment.deadline).toLocaleDateString()}</span>
                      </div>

                      {/*
                        DISABLED BUTTON WHEN COMPLETED (USER SPECIFICATION)
                      */}
                      {isItemCompleted ? (
                        <button
                          type="button"
                          disabled
                          title="Exam is completed and submitted. Actions are locked."
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 opacity-90 cursor-not-allowed select-none flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Submitted</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (onTakeExam) {
                              onTakeExam(assignment);
                            } else {
                              onToggleStatus(assignment._id || assignment.id!, assignment.status);
                            }
                          }}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                        >
                          Take Exam
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
