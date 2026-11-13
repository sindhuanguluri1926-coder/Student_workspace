import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
} from 'lucide-react';
import { Assignment, StatusType } from '../types/assignment.ts';
import AssignmentCard from '../components/AssignmentCard.tsx';
import { checkIsOverdue } from '../utils/dateUtils.ts';

interface PendingAssignmentsProps {
  assignments: Assignment[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentStatus: StatusType) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  onViewDetails: (assignment: Assignment) => void;
  onTakeExam?: (assignment: Assignment) => void;
}

export const PendingAssignments: React.FC<PendingAssignmentsProps> = ({
  assignments,
  isLoading,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewDetails,
  onTakeExam,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortOption, setSortOption] = useState<'deadline_asc' | 'priority_high'>('deadline_asc');

  // Filter for Pending only
  const pendingAssignments = useMemo(() => {
    return assignments
      .filter((a) => a.status === 'Pending')
      .filter((a) => {
        if (searchTerm.trim()) {
          const t = searchTerm.toLowerCase();
          const matchTitle = a.title.toLowerCase().includes(t);
          const matchSub = a.subject.toLowerCase().includes(t);
          if (!matchTitle && !matchSub) return false;
        }

        if (priorityFilter !== 'All' && a.priority !== priorityFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'priority_high') {
          const weight = { High: 3, Medium: 2, Low: 1 };
          return (weight[b.priority] || 0) - (weight[a.priority] || 0);
        }
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
  }, [assignments, searchTerm, priorityFilter, sortOption]);

  const overdueCount = pendingAssignments.filter((a) => checkIsOverdue(a)).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pending Assignments
            </h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono-numbers">
              {pendingAssignments.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Focus on active tasks awaiting your submission. Check off assignments as you finish them.
          </p>
        </div>

        <Link
          to="/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </Link>
      </div>

      {/* Overdue alert banner if any */}
      {overdueCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-rose-800 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              <strong>Attention:</strong> You have {overdueCount} overdue assignment
              {overdueCount > 1 ? 's' : ''} past their scheduled deadline.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
            High Urgency
          </span>
        </div>
      )}

      {/* Toolbar: Search, Filter, Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pending tasks..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Sort option */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="deadline_asc">Due Date (Earliest)</option>
            <option value="priority_high">Priority (Highest)</option>
          </select>
        </div>
      </div>

      {/* List of cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : pendingAssignments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Zero Pending Assignments!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You're all caught up with your academic deadlines. Great job maintaining your coursework flow!
            </p>
          </div>
          <Link
            to="/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Assignment</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingAssignments.map((assignment) => (
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
    </div>
  );
};

export default PendingAssignments;
