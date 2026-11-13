import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, GraduationCap, CheckCircle } from 'lucide-react';
import AssignmentForm from '../components/AssignmentForm.tsx';
import { AssignmentFormData } from '../types/assignment.ts';

interface AddAssignmentProps {
  onAddAssignment: (formData: AssignmentFormData) => Promise<boolean>;
}

export const AddAssignment: React.FC<AddAssignmentProps> = ({ onAddAssignment }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: AssignmentFormData) => {
    setIsSubmitting(true);
    try {
      const success = await onAddAssignment(formData);
      if (success) {
        navigate('/all');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Breadcrumb back navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Schedule New Exam & Assessment
            </h1>
            <p className="text-xs text-slate-500">
              Fill in your course exam details, scheduled date and time, duration, and priority for your upcoming test.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <AssignmentForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/all')}
            isSubmitting={isSubmitting}
            isEditMode={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AddAssignment;
