import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  X,
  Calendar,
  BookOpen,
  FileText,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AssignmentFormData, PriorityLevel, StatusType } from '../types/assignment.ts';
import { toDateTimeLocalInput } from '../utils/dateUtils.ts';

interface AssignmentFormProps {
  initialData?: AssignmentFormData;
  onSubmit: (formData: AssignmentFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEditMode?: boolean;
}

// Popular academic subject presets for quick clicks
const SUBJECT_SUGGESTIONS = [
  'Computer Science (CS 401)',
  'Mathematics (MATH 215)',
  'Physics (PHYS 220)',
  'Chemistry (CHEM 302)',
  'Economics (ECON 202)',
  'English Literature (ENG 210)',
  'Biology (BIO 150)',
  'Data Structures (CS 330)',
];

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEditMode = false,
}) => {
  // Default values
  const defaultState: AssignmentFormData = {
    title: '',
    subject: '',
    description: '',
    deadline: toDateTimeLocalInput(
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    ), // Default 2 days from now at current hour
    priority: 'Medium',
    status: 'Pending',
  };

  const [formData, setFormData] = useState<AssignmentFormData>(initialData || defaultState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        deadline: toDateTimeLocalInput(initialData.deadline),
      });
    }
  }, [initialData]);

  // Validation
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required.';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject name is required.';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline date and time are required.';
    } else {
      const d = new Date(formData.deadline);
      if (isNaN(d.getTime())) {
        newErrors.deadline = 'Please provide a valid deadline.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubjectSelect = (sub: string) => {
    setFormData((prev) => ({ ...prev, subject: sub }));
    if (errors.subject) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.subject;
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, subject: true, deadline: true });

    if (!validate()) {
      return;
    }

    await onSubmit({
      ...formData,
      deadline: new Date(formData.deadline).toISOString(),
    });
  };

  const handleReset = () => {
    setFormData(defaultState);
    setErrors({});
    setTouched({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Title */}
      <div>
        <label
          htmlFor="assignment-title"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          Exam / Assessment Title <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            id="assignment-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            onBlur={() => handleBlur('title')}
            placeholder="e.g. Database Systems: Midterm Exam & Normalization"
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all ${
              errors.title && touched.title
                ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-400'
                : 'border-slate-300 focus:border-indigo-500'
            }`}
          />
        </div>
        {errors.title && touched.title && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.title}</span>
          </p>
        )}
      </div>

      {/* 2. Subject Name + Quick suggestions */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="subject-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            Subject / Course Name <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-slate-400">Type or choose below</span>
        </div>
        <div className="relative">
          <input
            id="subject-input"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            onBlur={() => handleBlur('subject')}
            placeholder="e.g. Computer Science (CS 401)"
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all ${
              errors.subject && touched.subject
                ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-400'
                : 'border-slate-300 focus:border-indigo-500'
            }`}
          />
        </div>
        {errors.subject && touched.subject && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.subject}</span>
          </p>
        )}

        {/* Quick subject suggestion chips */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {SUBJECT_SUGGESTIONS.map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => handleSubjectSelect(subj)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                formData.subject === subj
                  ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Deadline and Priority in 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Deadline Picker */}
        <div>
          <label
            htmlFor="deadline-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Deadline (Date & Time) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="deadline-input"
              name="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={handleChange}
              onBlur={() => handleBlur('deadline')}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono-numbers transition-all ${
                errors.deadline && touched.deadline
                  ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-400'
                  : 'border-slate-300 focus:border-indigo-500'
              }`}
            />
          </div>
          {errors.deadline && touched.deadline && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.deadline}</span>
            </p>
          )}
        </div>

        {/* Priority Segmented Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['High', 'Medium', 'Low'] as PriorityLevel[]).map((level) => {
              const isSelected = formData.priority === level;
              const getColor = () => {
                if (level === 'High') {
                  return isSelected
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-red-300 hover:text-red-600';
                }
                if (level === 'Medium') {
                  return isSelected
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:text-amber-600';
                }
                return isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-emerald-600';
              };

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, priority: level }))}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${getColor()}`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Status Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Initial Status
        </label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {(['Pending', 'Completed'] as StatusType[]).map((st) => {
            const isSelected = formData.status === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status: st }))}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? st === 'Completed'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="description-textarea"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            Description & Notes
          </label>
          <span className="text-[11px] text-slate-400">Optional</span>
        </div>
        <textarea
          id="description-textarea"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Include submission requirements, textbook problem numbers, rubric expectations, or reference links..."
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y"
        />
      </div>

      {/* Buttons */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleReset}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                ? 'Update Assignment'
                : 'Save Assignment'}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AssignmentForm;
