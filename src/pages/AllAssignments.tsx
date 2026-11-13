import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Assignment, PriorityLevel, StatusType } from '../types/assignment.ts';
import AssignmentCard from '../components/AssignmentCard.tsx';
import { checkIsOverdue, formatDeadline, getSubjectColor } from '../utils/dateUtils.ts';

interface AllAssignmentsProps {
  assignments: Assignment[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentStatus: StatusType) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  onViewDetails: (assignment: Assignment) => void;
  onTakeExam?: (assignment: Assignment) => void;
}

export const AllAssignments: React.FC<AllAssignmentsProps> = ({
  assignments,
  isLoading,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewDetails,
  onTakeExam,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search, filter, sort and view states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [subjectFilter, setSubjectFilter] = useState(searchParams.get('subject') || 'All');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || 'All');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'deadline_asc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync with searchParams if URL changes
  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl && ['Pending', 'Completed', 'Overdue', 'All'].includes(statusFromUrl)) {
      setStatusFilter(statusFromUrl);
    }
  }, [searchParams]);

  // Extract unique subjects for dropdown
  const uniqueSubjects = useMemo(() => {
    const set = new Set<string>();
    assignments.forEach((a) => {
      if (a.subject) set.add(a.subject);
    });
    return Array.from(set).sort();
  }, [assignments]);

  // Filter and sort assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      // 1. Search term (title, subject, or description)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(term);
        const matchesSubject = a.subject.toLowerCase().includes(term);
        const matchesDesc = (a.description || '').toLowerCase().includes(term);
        if (!matchesTitle && !matchesSubject && !matchesDesc) return false;
      }

      // 2. Subject filter
      if (subjectFilter !== 'All' && a.subject !== subjectFilter) {
        return false;
      }

      // 3. Priority filter
      if (priorityFilter !== 'All' && a.priority !== priorityFilter) {
        return false;
      }

      // 4. Status filter
      if (statusFilter === 'Pending' && a.status !== 'Pending') {
        return false;
      }
      if (statusFilter === 'Completed' && a.status !== 'Completed') {
        return false;
      }
      if (statusFilter === 'Overdue') {
        if (!checkIsOverdue(a)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'deadline_desc') {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      }
      if (sortOption === 'created_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'created_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // Default: deadline_asc (earliest first)
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [assignments, searchTerm, subjectFilter, priorityFilter, statusFilter, sortOption]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, subjectFilter, priorityFilter, statusFilter, sortOption]);

  // Paginated items
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage) || 1;
  const paginatedAssignments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAssignments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAssignments, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSubjectFilter('All');
    setPriorityFilter('All');
    setStatusFilter('All');
    setSortOption('deadline_asc');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    subjectFilter !== 'All' ||
    priorityFilter !== 'All' ||
    statusFilter !== 'All' ||
    sortOption !== 'deadline_asc';

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header title & Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            All Assignments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, search, sort, and manage your full academic course repository.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              title="Card View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Assignment</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        {/* Top: Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by assignment title, course subject, or description keywords..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Bottom: Filter dropdowns and sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Subject Filter */}
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
              Course / Subject
            </label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Subjects ({assignments.length})</option>
              {uniqueSubjects.map((sub) => {
                const count = assignments.filter((a) => a.subject === sub).length;
                return (
                  <option key={sub} value={sub}>
                    {sub} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Only</option>
              <option value="Completed">Completed Only</option>
              <option value="Overdue">Overdue Only</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="deadline_asc">Deadline: Earliest First</option>
              <option value="deadline_desc">Deadline: Latest First</option>
              <option value="created_desc">Recently Created</option>
              <option value="created_asc">Oldest Created</option>
            </select>
          </div>
        </div>

        {/* Active Filter summary + Reset button */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900 font-mono-numbers">{filteredAssignments.length}</strong> of{' '}
              <span className="font-mono-numbers">{assignments.length}</span> assignments
            </span>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content View (Cards or Table) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No matching assignments found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any assignments matching your current search or filter criteria. Try adjusting your filters.
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedAssignments.map((assignment) => (
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
      ) : (
        /* Professional Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Title & Subject</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Added Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {paginatedAssignments.map((assignment) => {
                  const isOverdue = checkIsOverdue(assignment);
                  const isCompleted = assignment.status === 'Completed';
                  const subjectStyle = getSubjectColor(assignment.subject);

                  return (
                    <tr
                      key={assignment._id || assignment.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Status column */}
                      <td className="py-3.5 px-4 text-center">
                        {isCompleted ? (
                          <div
                            title="Exam Completed and Submitted"
                            className="inline-flex items-center justify-center cursor-default"
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              onTakeExam
                                ? onTakeExam(assignment)
                                : onToggleStatus(assignment._id || assignment.id!, assignment.status)
                            }
                            className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                            title="Start Exam"
                          >
                            <Clock className="w-5 h-5 text-indigo-500" />
                          </button>
                        )}
                      </td>

                      {/* Title & Subject (NO STRIKETHROUGH) */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div
                          onClick={() => onViewDetails(assignment)}
                          className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer text-sm truncate"
                        >
                          {assignment.title}
                        </div>
                        <div className="mt-0.5">
                          <span
                            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${subjectStyle.bg} ${subjectStyle.text} ${subjectStyle.border}`}
                          >
                            {assignment.subject}
                          </span>
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4 font-mono-numbers whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {formatDeadline(assignment.deadline)}
                        </div>
                        {isOverdue && !isCompleted && (
                          <span className="text-[10px] font-bold text-rose-600 uppercase">
                            Overdue
                          </span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                            assignment.priority === 'High'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : assignment.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {assignment.priority}
                        </span>
                      </td>

                      {/* Created date */}
                      <td className="py-3.5 px-4 font-mono-numbers text-slate-500 whitespace-nowrap">
                        {new Date(assignment.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/*
                            DISABLED ACTION BUTTON WHEN COMPLETED (USER SPECIFICATION)
                          */}
                          {isCompleted ? (
                            <button
                              disabled
                              title="Exam is completed and submitted. Actions are locked."
                              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg opacity-85 cursor-not-allowed select-none"
                            >
                              ✓ Submitted
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                onTakeExam
                                  ? onTakeExam(assignment)
                                  : onToggleStatus(assignment._id || assignment.id!, assignment.status)
                              }
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-2xs"
                            >
                              Take Exam
                            </button>
                          )}

                          <button
                            onClick={() => onViewDetails(assignment)}
                            className="px-2 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          {!isCompleted && (
                            <button
                              onClick={() => onEdit(assignment)}
                              className="px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(assignment)}
                            className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-600">
          <div>
            Page <strong className="text-slate-900 font-mono-numbers">{currentPage}</strong> of{' '}
            <span className="font-mono-numbers">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl font-semibold font-mono-numbers transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAssignments;
