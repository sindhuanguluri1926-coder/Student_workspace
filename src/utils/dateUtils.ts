import { Assignment } from '../types/assignment.ts';

/**
 * Checks if an assignment is overdue.
 * An assignment is NEVER overdue if it has status 'Completed'.
 */
export const checkIsOverdue = (assignment: { deadline: string; status: string }): boolean => {
  if (assignment.status === 'Completed') return false;
  const deadlineDate = new Date(assignment.deadline);
  return deadlineDate.getTime() < Date.now();
};

/**
 * Formats date into readable string, e.g., "Nov 6, 2026 · 11:59 PM"
 */
export const formatDeadline = (dateString: string): string => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Invalid date';

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' should be '12'

    return `${month} ${day}, ${year} · ${hours}:${minutes} ${ampm}`;
  } catch {
    return dateString;
  }
};

/**
 * Formats date for HTML datetime-local input (YYYY-MM-DDTHH:mm)
 */
export const toDateTimeLocalInput = (dateString?: string): string => {
  const d = dateString ? new Date(dateString) : new Date();
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Get human relative urgency and label
 */
export const getDeadlineUrgency = (
  deadlineStr: string,
  status: string
): { label: string; urgency: 'overdue' | 'due-today' | 'due-soon' | 'upcoming' | 'completed' } => {
  if (status === 'Completed') {
    return { label: 'Completed', urgency: 'completed' };
  }

  const now = new Date();
  const target = new Date(deadlineStr);
  const diffMs = target.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    const label = overdueDays <= 1 ? 'Overdue today' : `Overdue by ${overdueDays} days`;
    return { label, urgency: 'overdue' };
  }

  // Check if calendar date is today
  const isToday =
    now.getDate() === target.getDate() &&
    now.getMonth() === target.getMonth() &&
    now.getFullYear() === target.getFullYear();

  if (isToday) {
    return { label: 'Due today', urgency: 'due-today' };
  }

  if (diffDays === 1) {
    return { label: 'Due tomorrow', urgency: 'due-soon' };
  }

  if (diffDays <= 3) {
    return { label: `Due in ${diffDays} days`, urgency: 'due-soon' };
  }

  return { label: `Due in ${diffDays} days`, urgency: 'upcoming' };
};

/**
 * Get formatted current date for dashboard welcome section
 */
export const getFormattedCurrentDate = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date().toLocaleDateString('en-US', options);
};

/**
 * Subject badge colors
 */
export const getSubjectColor = (subject: string): { bg: string; text: string; border: string } => {
  const s = subject.toLowerCase();
  if (s.includes('cs') || s.includes('computer') || s.includes('code') || s.includes('database')) {
    return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' };
  }
  if (s.includes('math') || s.includes('calculus') || s.includes('algebra') || s.includes('stat')) {
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' };
  }
  if (s.includes('phys') || s.includes('chem') || s.includes('bio') || s.includes('science')) {
    return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' };
  }
  if (s.includes('econ') || s.includes('finance') || s.includes('business')) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' };
  }
  if (s.includes('eng') || s.includes('writing') || s.includes('lit') || s.includes('history')) {
    return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' };
  }
  return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
};
