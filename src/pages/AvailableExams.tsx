import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  Lock,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Award,
  Sparkles,
  Eye,
} from 'lucide-react';
import { examService } from '../services/examService';
import { Exam } from '../types/system';

export default function AvailableExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examService.getAvailableExams();
      setExams(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch available exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-600 mb-1">
            <FileText className="w-4 h-4" />
            <span>Academic Examinations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Available Examinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official published tests assigned to your academic department and semester
          </p>
        </div>

        {/* Single Attempt Banner */}
        <div className="bg-purple-50 border border-purple-200/70 rounded-xl px-3.5 py-2 flex items-center space-x-2.5 text-xs text-purple-800">
          <Lock className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Single Attempt Policy: Once completed, tests are permanently locked.</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading assigned exams...</div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Exams Available</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            There are currently no active examinations published for your class. Check back later or contact your instructor.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className={`bg-white rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between ${
                exam.isCompleted
                  ? 'border-slate-200/90 shadow-sm'
                  : 'border-slate-200/90 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Subject & Duration Badges */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {exam.subject}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.duration} mins</span>
                  </div>
                </div>

                {/* Exam Title: NEVER WITH STRIKETHROUGH / LINE-THROUGH PER USER INSTRUCTION */}
                <div className="flex items-start space-x-2 mb-2">
                  {exam.isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {exam.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-3 mb-5 leading-relaxed">
                  {exam.description || 'Comprehensive evaluation covering course lectures, textbook readings, and lab assignments.'}
                </p>

                {/* Exam Meta Info */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 grid grid-cols-2 gap-2 mb-5">
                  <div>
                    <span className="text-slate-400">Total Questions: </span>
                    <strong className="text-slate-800 font-mono">{exam.questionsCount || 0}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Marks: </span>
                    <strong className="text-indigo-600 font-mono font-bold">{exam.totalMarks}</strong>
                  </div>
                  <div className="col-span-2 text-[11px] text-slate-500">
                    Deadline: {new Date(exam.endDate).toLocaleDateString()} at {new Date(exam.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Action Button & Status Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                {exam.isCompleted ? (
                  <>
                    {/* Score Badge */}
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Score: {exam.score}/{exam.totalMarks} ({exam.percentage}%)
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 uppercase">
                        {exam.result}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {exam.attemptId && (
                        <Link
                          to={`/student/results/${exam.attemptId}`}
                          className="px-3 py-2 text-xs font-semibold text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-xl transition-colors flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Review</span>
                        </Link>
                      )}

                      {/* DISABLED CLICK BUTTON PER USER'S EXACT SPECIFICATION */}
                      <button
                        type="button"
                        disabled={true}
                        aria-disabled="true"
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed opacity-75 shadow-none border border-slate-300/60 flex items-center space-x-1.5 select-none"
                        title="This exam has been completed and is locked. You cannot click or re-attempt."
                      >
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Completed (Locked)</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-slate-500">
                      Status: <strong className="text-amber-600 font-semibold">Not Attempted</strong>
                    </div>

                    <Link
                      to={`/student/exams/${exam.id}/take`}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all flex items-center space-x-1.5 group"
                    >
                      <span>Start Exam</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
