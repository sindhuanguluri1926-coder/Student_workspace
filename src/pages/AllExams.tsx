import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  FilePlus,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  X,
  PlayCircle,
  PauseCircle,
} from 'lucide-react';
import { examService } from '../services/examService';
import { Exam } from '../types/system';

export default function AllExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examService.getAllAdminExams();
      setExams(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleTogglePublish = async (exam: Exam) => {
    const nextStatus = exam.status === 'Published' ? 'Draft' : 'Published';
    try {
      await examService.publishExam(exam.id, nextStatus);
      setExams(exams.map((e) => (e.id === exam.id ? { ...e, status: nextStatus } : e)));
    } catch (err: any) {
      alert(err.message || 'Failed to update exam status');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete exam "${title}" and all its student attempts?`)) {
      try {
        await examService.deleteAdminExam(id);
        setExams(exams.filter((e) => e.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete exam');
      }
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
            <FileText className="w-4 h-4" />
            <span>Curriculum Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            All Examinations & Tests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your draft and published exams, review submission rates, and toggle live availability
          </p>
        </div>

        <Link
          to="/admin/create-exam"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/30 transition-colors w-fit"
        >
          <FilePlus className="w-4 h-4" />
          <span>Create New Exam</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Exams Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading examinations...</div>
        ) : exams.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-sm font-semibold text-slate-700">No exams created yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click the button above to build your first examination with multiple-choice questions.
            </p>
            <Link
              to="/admin/create-exam"
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Build an Exam Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4">Exam Title & Subject</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Questions & Marks</th>
                  <th className="py-3.5 px-4">Submissions</th>
                  <th className="py-3.5 px-4">Average Score</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-sm">{exam.title}</div>
                      <div className="text-[11px] text-indigo-600 font-medium mt-0.5">
                        {exam.subject} • Class: {exam.assignedClass || 'All'}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          exam.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {exam.status === 'Published' && <Sparkles className="w-3 h-3 mr-1" />}
                        {exam.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono font-medium">
                      <div className="flex items-center space-x-1 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exam.duration} mins</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <div>{exam.questions?.length || 0} Questions</div>
                      <div className="text-[11px] text-slate-400 font-semibold">{exam.totalMarks} Total Marks</div>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <span className="font-bold text-slate-900">{exam.submissionCount ?? 0}</span>
                      <span className="text-slate-400 text-[11px]"> attempts</span>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      {exam.submissionCount && exam.submissionCount > 0 ? (
                        <span className="font-bold text-indigo-600">{exam.averageScore}%</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedExam(exam)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Preview Exam"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleTogglePublish(exam)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            exam.status === 'Published'
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={exam.status === 'Published' ? 'Unpublish (Set to Draft)' : 'Publish to Students'}
                        >
                          {exam.status === 'Published' ? (
                            <PauseCircle className="w-4 h-4" />
                          ) : (
                            <PlayCircle className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(exam.id, exam.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Exam"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Exam Preview Modal */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedExam.title}</h3>
                <span className="text-xs text-indigo-600 font-medium">
                  {selectedExam.subject} • {selectedExam.duration} mins • {selectedExam.totalMarks} Marks
                </span>
              </div>
              <button
                onClick={() => setSelectedExam(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">Instructions:</div>
                <p className="text-slate-600 whitespace-pre-line">{selectedExam.instructions}</p>
              </div>

              <div className="font-bold text-slate-900 text-sm pt-2">
                Questions ({selectedExam.questions?.length || 0}):
              </div>

              {selectedExam.questions?.map((q, idx) => (
                <div key={q.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="font-bold text-slate-900 mb-2">
                    {idx + 1}. {q.question} ({q.marks} Marks)
                  </div>
                  <div className="space-y-1 pl-2">
                    <div className={q.correctAnswer === 'A' ? 'font-bold text-emerald-700' : ''}>
                      A) {q.optionA} {q.correctAnswer === 'A' && '✓'}
                    </div>
                    <div className={q.correctAnswer === 'B' ? 'font-bold text-emerald-700' : ''}>
                      B) {q.optionB} {q.correctAnswer === 'B' && '✓'}
                    </div>
                    <div className={q.correctAnswer === 'C' ? 'font-bold text-emerald-700' : ''}>
                      C) {q.optionC} {q.correctAnswer === 'C' && '✓'}
                    </div>
                    <div className={q.correctAnswer === 'D' ? 'font-bold text-emerald-700' : ''}>
                      D) {q.optionD} {q.correctAnswer === 'D' && '✓'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedExam(null)}
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
