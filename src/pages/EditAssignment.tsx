import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Loader2 } from 'lucide-react';
import AssignmentForm from '../components/AssignmentForm.tsx';
import { Assignment, AssignmentFormData } from '../types/assignment.ts';
import assignmentService from '../services/assignmentService.ts';

interface EditAssignmentProps {
  onUpdateAssignment: (id: string, formData: AssignmentFormData) => Promise<boolean>;
}

export const EditAssignment: React.FC<EditAssignmentProps> = ({ onUpdateAssignment }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await assignmentService.getById(id);
        setAssignment(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load assignment details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const handleSubmit = async (formData: AssignmentFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const success = await onUpdateAssignment(id, formData);
      if (success) {
        navigate('/all');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading assignment details...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          {error || 'Assignment not found.'}
        </div>
        <button
          onClick={() => navigate('/all')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to All Assignments
        </button>
      </div>
    );
  }

  const initialFormData: AssignmentFormData = {
    title: assignment.title,
    subject: assignment.subject,
    description: assignment.description || '',
    deadline: assignment.deadline,
    priority: assignment.priority,
    status: assignment.status,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Assignments</span>
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Edit Assignment
            </h1>
            <p className="text-xs text-slate-500">
              Update assignment parameters, adjust deadlines, or change priority status.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <AssignmentForm
            initialData={initialFormData}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/all')}
            isSubmitting={isSubmitting}
            isEditMode={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditAssignment;
