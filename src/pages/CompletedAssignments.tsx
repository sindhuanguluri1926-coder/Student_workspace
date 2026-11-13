import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  Calendar,
  Layers,
} from 'lucide-react';
import { Assignment, StatusType } from '../types/assignment.ts';
import AssignmentCard from '../components/AssignmentCard.tsx';

interface CompletedAssignmentsProps {
  assignments: Assignment[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentStatus: StatusType) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  onViewDetails: (assignment: Assignment) => void;
}

export const CompletedAssignments: React.FC<CompletedAssignmentsProps> = ({
  assignments,
  isLoading,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter for Completed only
  const completedAssignments = useMemo(() => {
    return assignments
      .filter((a) => a.status === 'Completed')
      .filter((a) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
          a.title.toLowerCase().includes(term) ||
          a.subject.toLowerCase().includes(term) ||
          (a.description || '').toLowerCase().includes(term)
        );
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [assignments, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Completed Assignments
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono-numbers">
              {completedAssignments.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Archived record of all successfully submitted assignments. You can mark any task back to Pending at any time.
          </p>
        </div>

        {completedAssignments.length > 0 && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-emerald-800 text-xs font-semibold">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>Well Done! Coursework Accomplished</span>
          </div>
        )}
      </div>

      {/* Search Toolbar */}
      {completedAssignments.length > 0 && (
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search completed assignments..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-mono-numbers">
            {completedAssignments.length} completed
          </span>
        </div>
      )}

      {/* Grid of completed assignments */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : completedAssignments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No completed assignments yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once you finish assignments in your Pending queue and check them off, they will appear here in your achievements archive.
            </p>
          </div>
          <Link
            to="/pending"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Go to Pending Tasks</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id || assignment.id}
              assignment={assignment}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedAssignments;
