import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Edit2,
  Trash2,
  ExternalLink,
  BookOpen,
  Play,
  Lock,
  Award,
  FileCheck2,
} from 'lucide-react';
import { Assignment, PriorityLevel } from '../types/assignment.ts';
import {
  checkIsOverdue,
  formatDeadline,
  getDeadlineUrgency,
  getSubjectColor,
} from '../utils/dateUtils.ts';

interface AssignmentCardProps {
  assignment: Assignment;
  onToggleStatus: (id: string, currentStatus: 'Pending' | 'Completed') => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  onViewDetails?: (assignment: Assignment) => void;
  onTakeExam?: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewDetails,
  onTakeExam,
}) => {
  const isOverdue = checkIsOverdue(assignment);
  const urgency = getDeadlineUrgency(assignment.deadline, assignment.status);
  const subjectStyle = getSubjectColor(assignment.subject);
  const isCompleted = assignment.status === 'Completed';

  // Priority color styling
  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Status color styling
  const getStatusBadge = () => {
    if (isCompleted) {
      return {
        label: assignment.score !== undefined ? `Completed (${assignment.score}%)` : 'Completed',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
      };
    }
    if (isOverdue) {
      return {
        label: 'Overdue',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: AlertTriangle,
      };
    }
    return {
      label: 'Scheduled',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Clock,
    };
  };

  const statusInfo = getStatusBadge();
  const StatusIcon = statusInfo.icon;

  return (
    <div
      className={`group relative bg-white rounded-2xl border p-5 transition-all duration-200 shadow-xs hover:shadow-md ${
        isCompleted
          ? 'border-emerald-200/90 bg-emerald-50/15 ring-1 ring-emerald-100'
          : isOverdue
          ? 'border-rose-200 bg-white ring-1 ring-rose-100'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Row: Subject & Status / Priority */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${subjectStyle.bg} ${subjectStyle.text} ${subjectStyle.border}`}
        >
          <BookOpen className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-[180px] sm:max-w-[220px]">{assignment.subject}</span>
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Priority */}
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getPriorityBadge(
              assignment.priority
            )}`}
          >
            {assignment.priority}
          </span>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${statusInfo.badge}`}
          >
            <StatusIcon className="w-3 h-3" />
            <span>{statusInfo.label}</span>
          </span>
        </div>
      </div>

      {/* Main Title & Description (NEVER strikethrough per user requirement!) */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-start gap-2.5">
          {/* Status indicator icon (shows checkmark if completed) */}
          <div className="mt-0.5 shrink-0">
            {isCompleted ? (
              <div
                title="Exam Completed and Submitted"
                className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center cursor-default"
              >
                <CheckCircle2 className="w-4 h-4 fill-emerald-100 text-emerald-600" />
              </div>
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
                title="Click to take/start exam"
                className="text-slate-400 hover:text-indigo-600 focus:outline-hidden transition-colors cursor-pointer"
                aria-label="Start exam"
              >
                <Circle className="w-5 h-5 hover:text-indigo-600" />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title: Pure, clean typography with NO line-through */}
            <h3
              onClick={() => onViewDetails && onViewDetails(assignment)}
              className="text-base font-bold text-slate-900 leading-snug cursor-pointer hover:text-indigo-600 transition-colors"
            >
              {assignment.title}
            </h3>
            {assignment.description && (
              <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {assignment.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Exam Details strip: Duration, Marks, Date */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono-numbers">{formatDeadline(assignment.deadline)}</span>
          </div>

          {/* Exam duration badge if present */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-mono-numbers">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{assignment.durationMinutes || 60}m</span>
          </div>
        </div>

        {/* Urgency indicator or Score badge */}
        <div className="flex items-center gap-1">
          {isCompleted && assignment.score !== undefined && (
            <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1 font-mono-numbers">
              <Award className="w-3 h-3 text-emerald-600" />
              <span>Score: {assignment.score}/100</span>
            </span>
          )}
          {!isCompleted && urgency.urgency === 'overdue' && (
            <span className="text-rose-600 font-semibold text-[11px] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              {urgency.label}
            </span>
          )}
          {!isCompleted && urgency.urgency === 'due-today' && (
            <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {urgency.label}
            </span>
          )}
          {!isCompleted && urgency.urgency === 'due-soon' && (
            <span className="text-indigo-700 font-semibold text-[11px] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              {urgency.label}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/*
          CRITICAL USER SPECIFICATION:
          "after cpomplete the exam it will come like diable to click no need to come like above i given image"
          When completed: BUTTON IS DISABLED TO CLICK (cursor-not-allowed, disabled attribute, no strikethrough on title).
          When pending: ACTIVE "Take Exam" BUTTON!
        */}
        {isCompleted ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="This exam has been completed and submitted. Actions are locked."
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50/90 text-emerald-700 opacity-90 cursor-not-allowed inline-flex items-center gap-1.5 shadow-2xs select-none"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Exam Completed (Submitted)</span>
            <Lock className="w-3 h-3 text-emerald-500 shrink-0 ml-0.5" />
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
            title="Start taking this exam now"
            className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Take Exam</span>
          </button>
        )}

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(assignment)}
              title="View full exam details"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="View Exam Details"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {!isCompleted && (
            <button
              type="button"
              onClick={() => onEdit(assignment)}
              title="Edit exam"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Edit Exam"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(assignment)}
            title="Delete exam"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            aria-label="Delete Exam"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
