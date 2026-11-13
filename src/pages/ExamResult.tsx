import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Calendar,
  Sparkles,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { examService } from '../services/examService';
import { ExamAttempt } from '../types/system';

export default function ExamResult() {
  const { attemptId } = useParams<{ attemptId?: string }>();
  const [resultsList, setResultsList] = useState<ExamAttempt[]>([]);
  const [currentResult, setCurrentResult] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        if (attemptId) {
          const detail = await examService.getStudentResultDetail(attemptId);
          setCurrentResult(detail);
        } else {
          const all = await examService.getStudentResults();
          setResultsList(all);
          if (all.length > 0) {
            setCurrentResult(all[0]);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch examination results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-400">
        Loading examination result report...
      </div>
    );
  }

  if (error || (!currentResult && resultsList.length === 0)) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <Award className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">No Examination Results Available</h2>
        <p className="text-xs text-slate-500">
          You haven't completed any examinations yet. Complete an exam in the Available Exams portal to review your score.
        </p>
        <Link
          to="/student/exams"
          className="inline-block px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold"
        >
          View Available Exams
        </Link>
      </div>
    );
  }

  const res = currentResult!;
  const isPass = res.result === 'Pass';

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/exams"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Available Exams</span>
        </Link>

        {resultsList.length > 1 && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">View other test:</span>
            <select
              value={res.id || (res as any)._id}
              onChange={(e) => {
                const found = resultsList.find((r) => r.id === e.target.value || (r as any)._id === e.target.value);
                if (found) setCurrentResult(found);
              }}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white"
            >
              {resultsList.map((r) => (
                <option key={r.id || (r as any)._id} value={r.id || (r as any)._id}>
                  {r.examTitle} ({r.percentage}%)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Hero Score Card */}
      <div
        className={`rounded-3xl p-8 border text-center space-y-4 shadow-sm ${
          isPass
            ? 'bg-gradient-to-b from-emerald-50/80 to-white border-emerald-200/90'
            : 'bg-gradient-to-b from-rose-50/80 to-white border-rose-200/90'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
            isPass
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-rose-600 text-white shadow-rose-600/20'
          }`}
        >
          {isPass ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
        </div>

        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            Examination {isPass ? 'Passed' : 'Needs Review'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {res.examTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{res.subject}</p>
        </div>

        {/* Big Score Number */}
        <div className="pt-2">
          <div className="text-4xl sm:text-6xl font-extrabold text-slate-900 font-mono tracking-tight">
            {res.score} <span className="text-2xl sm:text-3xl font-normal text-slate-400">/ {res.totalMarks}</span>
          </div>
          <div className="text-lg font-bold font-mono text-purple-700 mt-1">
            {res.percentage}% Score
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 border-t border-slate-100 max-w-lg mx-auto">
          {res.timeTakenSeconds > 0 && (
            <div className="flex items-center space-x-1.5 font-mono">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Time Taken: {Math.floor(res.timeTakenSeconds / 60)}m {res.timeTakenSeconds % 60}s</span>
            </div>
          )}
          {res.submittedAt && (
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Submitted: {new Date(res.submittedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">Question-by-Question Detailed Review</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {res.answers?.length || 0} Questions Total
          </span>
        </div>

        {res.answers && res.answers.length > 0 ? (
          <div className="space-y-4">
            {res.answers.map((ans, idx) => (
              <div
                key={ans.questionId || idx}
                className={`p-5 rounded-2xl border transition-all ${
                  ans.isCorrect
                    ? 'border-emerald-200/90 bg-emerald-50/20'
                    : 'border-rose-200/90 bg-rose-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start space-x-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        ans.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="font-bold text-slate-900 text-sm leading-snug">
                      {ans.questionText || `Question ${idx + 1}`}
                    </div>
                  </div>

                  <span
                    className={`font-mono text-xs px-2.5 py-1 rounded-lg font-bold shrink-0 ${
                      ans.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    +{ans.marksAwarded} Marks
                  </span>
                </div>

                {/* Question Options Reference if available */}
                {(ans.optionA || ans.optionB) && (
                  <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600 my-3 pl-8">
                    <div className={ans.correctAnswer === 'A' ? 'font-bold text-emerald-700' : ''}>
                      A) {ans.optionA}
                    </div>
                    <div className={ans.correctAnswer === 'B' ? 'font-bold text-emerald-700' : ''}>
                      B) {ans.optionB}
                    </div>
                    <div className={ans.correctAnswer === 'C' ? 'font-bold text-emerald-700' : ''}>
                      C) {ans.optionC}
                    </div>
                    <div className={ans.correctAnswer === 'D' ? 'font-bold text-emerald-700' : ''}>
                      D) {ans.optionD}
                    </div>
                  </div>
                )}

                {/* Answers Comparison */}
                <div className="pl-8 pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-6 text-xs">
                  <div>
                    <span className="text-slate-400">Your choice: </span>
                    <strong
                      className={
                        ans.isCorrect ? 'text-emerald-700 font-mono font-bold' : 'text-rose-600 font-mono font-bold'
                      }
                    >
                      Option {ans.selectedOption || 'None (Unanswered)'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400">Correct answer: </span>
                    <strong className="text-emerald-700 font-mono font-bold">
                      Option {ans.correctAnswer}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            Detailed question responses were saved to database.
          </div>
        )}
      </div>
    </div>
  );
}
