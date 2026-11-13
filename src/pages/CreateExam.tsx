import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus,
  Plus,
  Trash2,
  Eye,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { examService } from '../services/examService';
import { Question } from '../types/system';

export default function CreateExam() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState(
    '1. Read each question carefully before selecting an answer.\n2. Total time limit is enforced by an active countdown timer.\n3. Exam will auto-submit when the timer expires.\n4. You have ONE attempt only. Once submitted, answers are permanently locked.'
  );
  const [duration, setDuration] = useState<number>(30);
  const [assignedClass, setAssignedClass] = useState('All');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 16);
  });

  // Questions State
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q_init_1',
      question: 'What is the primary key in a relational database table?',
      optionA: 'An optional unique identifier for rows',
      optionB: 'A column or set of columns that uniquely identifies each row in a table',
      optionC: 'A foreign key pointing to an external entity',
      optionD: 'An index that permits duplicate null entries',
      correctAnswer: 'B',
      marks: 5,
    },
    {
      id: 'q_init_2',
      question: 'Which SQL statement is used to remove all records from a table without logging individual row deletions?',
      optionA: 'DELETE FROM table_name',
      optionB: 'REMOVE ALL table_name',
      optionC: 'TRUNCATE TABLE table_name',
      optionD: 'DROP table_name',
      correctAnswer: 'C',
      marks: 5,
    },
  ]);

  // Active question being added or edited
  const [currentQ, setCurrentQ] = useState<Question>({
    id: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: 5,
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto calculated totals
  const totalQuestions = questions.length;
  const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);

  const handleAddQuestion = () => {
    if (!currentQ.question.trim()) {
      setError('Please provide the question prompt text.');
      return;
    }
    if (!currentQ.optionA.trim() || !currentQ.optionB.trim() || !currentQ.optionC.trim() || !currentQ.optionD.trim()) {
      setError('All four options (A, B, C, and D) are required.');
      return;
    }

    const newQuestion: Question = {
      ...currentQ,
      id: `q_${Date.now()}_${questions.length + 1}`,
      question: currentQ.question.trim(),
      optionA: currentQ.optionA.trim(),
      optionB: currentQ.optionB.trim(),
      optionC: currentQ.optionC.trim(),
      optionD: currentQ.optionD.trim(),
      marks: Number(currentQ.marks) || 1,
    };

    setQuestions([...questions, newQuestion]);
    // Reset question form
    setCurrentQ({
      id: '',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: 5,
    });
    setError(null);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSaveExam = async (status: 'Draft' | 'Published') => {
    setError(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setError('Exam title is required.');
      return;
    }
    if (!subject.trim()) {
      setError('Subject is required.');
      return;
    }
    if (!endDate) {
      setError('Exam end date / deadline is required.');
      return;
    }
    if (questions.length === 0) {
      setError('You must add at least one question before saving or publishing.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        subject: subject.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        duration: Number(duration) || 30,
        assignedClass,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status,
        questions,
      };

      const res = await examService.createExam(payload);
      setSuccessMsg(
        status === 'Published'
          ? 'Exam published successfully! Students can now access it in their portal.'
          : 'Exam saved as Draft in the database.'
      );
      setTimeout(() => {
        navigate('/admin/exams');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
            <FilePlus className="w-4 h-4" />
            <span>Faculty Exam Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Assignment / Examination
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build timed multiple-choice evaluations with automated server-side grading
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Preview Exam</span>
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSaveExam('Draft')}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>Save as Draft</span>
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSaveExam('Published')}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/30 transition-colors disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span>Publish Exam</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Basic Exam Information */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          1. General Examination Details
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Exam Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Database Systems: Normalization & Query Optimization"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science (CS 330)"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the topics covered in this examination..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Exam Instructions
          </label>
          <textarea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions provided to students before starting the exam..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-slate-700 font-mono"
          />
        </div>

        <div className="grid sm:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Time Limit (Mins) *</span>
            </label>
            <input
              type="number"
              min="1"
              max="240"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Assign to Class
            </label>
            <select
              value={assignedClass}
              onChange={(e) => setAssignedClass(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Registered Students</option>
              <option value="CS-301">CS-301 (Year 3)</option>
              <option value="IT-302">IT-302 (Year 3)</option>
              <option value="EE-201">EE-201 (Year 2)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Live Exam Summary Pills */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-slate-500">Total Questions: </span>
              <strong className="text-slate-900 font-mono text-sm">{totalQuestions}</strong>
            </div>
            <div>
              <span className="text-slate-500">Total Marks: </span>
              <strong className="text-indigo-600 font-mono text-sm">{totalMarks}</strong>
            </div>
            <div>
              <span className="text-slate-500">Duration: </span>
              <strong className="text-slate-900 font-mono text-sm">{duration} minutes</strong>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Values calculated live</span>
        </div>
      </div>

      {/* Question Builder */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            2. Question Set Builder ({questions.length} Added)
          </h2>
          <span className="text-xs text-indigo-600 font-semibold">
            Multiple Choice Questions (A, B, C, D)
          </span>
        </div>

        {/* List of existing added questions */}
        {questions.length > 0 && (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{q.question}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
                      {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div className={q.correctAnswer === 'A' ? 'font-bold text-emerald-700' : ''}>
                      A) {q.optionA} {q.correctAnswer === 'A' && '✓ (Correct)'}
                    </div>
                    <div className={q.correctAnswer === 'B' ? 'font-bold text-emerald-700' : ''}>
                      B) {q.optionB} {q.correctAnswer === 'B' && '✓ (Correct)'}
                    </div>
                    <div className={q.correctAnswer === 'C' ? 'font-bold text-emerald-700' : ''}>
                      C) {q.optionC} {q.correctAnswer === 'C' && '✓ (Correct)'}
                    </div>
                    <div className={q.correctAnswer === 'D' ? 'font-bold text-emerald-700' : ''}>
                      D) {q.optionD} {q.correctAnswer === 'D' && '✓ (Correct)'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Question Form */}
        <div className="p-5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add Question #{questions.length + 1}</span>
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Question Prompt *
            </label>
            <input
              type="text"
              value={currentQ.question}
              onChange={(e) => setCurrentQ({ ...currentQ, question: e.target.value })}
              placeholder="e.g. Which CPU scheduling algorithm avoids process starvation through aging?"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Option A *</label>
              <input
                type="text"
                value={currentQ.optionA}
                onChange={(e) => setCurrentQ({ ...currentQ, optionA: e.target.value })}
                placeholder="Option A description"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Option B *</label>
              <input
                type="text"
                value={currentQ.optionB}
                onChange={(e) => setCurrentQ({ ...currentQ, optionB: e.target.value })}
                placeholder="Option B description"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Option C *</label>
              <input
                type="text"
                value={currentQ.optionC}
                onChange={(e) => setCurrentQ({ ...currentQ, optionC: e.target.value })}
                placeholder="Option C description"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Option D *</label>
              <input
                type="text"
                value={currentQ.optionD}
                onChange={(e) => setCurrentQ({ ...currentQ, optionD: e.target.value })}
                placeholder="Option D description"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correct Answer *
              </label>
              <select
                value={currentQ.correctAnswer}
                onChange={(e) => setCurrentQ({ ...currentQ, correctAnswer: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-semibold"
              >
                <option value="A">Option A is Correct</option>
                <option value="B">Option B is Correct</option>
                <option value="C">Option C is Correct</option>
                <option value="D">Option D is Correct</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Marks for this Question *
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={currentQ.marks}
                onChange={(e) => setCurrentQ({ ...currentQ, marks: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question to Exam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={() => navigate('/admin/exams')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          Cancel & Return to Exams
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSaveExam('Draft')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSaveExam('Published')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Publish Exam Now</span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{title || 'Exam Preview'}</h3>
                <span className="text-xs text-indigo-600">{subject || 'Subject'}</span>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 flex items-center justify-between">
                <span>Duration: <strong>{duration} mins</strong></span>
                <span>Total Questions: <strong>{questions.length}</strong></span>
                <span>Total Marks: <strong>{totalMarks}</strong></span>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-3.5 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 mb-2">
                      {idx + 1}. {q.question} ({q.marks} Marks)
                    </div>
                    <div className="space-y-1 pl-2">
                      <div className={q.correctAnswer === 'A' ? 'font-bold text-emerald-600' : ''}>
                        (A) {q.optionA}
                      </div>
                      <div className={q.correctAnswer === 'B' ? 'font-bold text-emerald-600' : ''}>
                        (B) {q.optionB}
                      </div>
                      <div className={q.correctAnswer === 'C' ? 'font-bold text-emerald-600' : ''}>
                        (C) {q.optionC}
                      </div>
                      <div className={q.correctAnswer === 'D' ? 'font-bold text-emerald-600' : ''}>
                        (D) {q.optionD}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
