import React from 'react';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Edit2,
  Trash2,
  FileText,
} from 'lucide-react';
import { Assignment } from '../types/assignment.ts';
import {
  checkIsOverdue,
  formatDeadline,
  getDeadlineUrgency,
  getSubjectColor,
} from '../utils/dateUtils.ts';

interface AssignmentDetailsModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  onToggleStatus: (id: string, currentStatus: 'Pending' | 'Completed') => void;
}

export const AssignmentDetailsModal: React.FC<AssignmentDetailsModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (!isOpen || !assignment) return null;

  const isOverdue = checkIsOverdue(assignment);
  const urgency = getDeadlineUrgency(assignment.deadline, assignment.status);
  const subjectStyle = getSubjectColor(assignment.subject);
  const isCompleted = assignment.status === 'Completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Subject and badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${subjectStyle.bg} ${subjectStyle.text} ${subjectStyle.border}`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>{assignment.subject}</span>
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
              assignment.priority === 'High'
                ? 'bg-red-50 text-red-700 border-red-200'
                : assignment.priority === 'Medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {assignment.priority} Priority
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isOverdue
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {isCompleted ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
          {assignment.title}
        </h2>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl mb-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Deadline Due Date
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-mono-numbers">{formatDeadline(assignment.deadline)}</span>
            </div>
            <div className="text-[11px] font-semibold text-indigo-600">
              {urgency.label}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Created / Added
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-mono-numbers">{formatDeadline(assignment.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Assignment Description & Instructions</span>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
            {assignment.description || (
              <span className="text-slate-400 italic">No additional notes or description provided for this assignment.</span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onToggleStatus(assignment._id || assignment.id!, assignment.status);
              onClose();
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
              isCompleted
                ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Mark as Pending' : 'Mark as Completed'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(assignment);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4 text-slate-500" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(assignment);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailsModal;
