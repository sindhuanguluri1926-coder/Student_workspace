import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  Send,
  Flag,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { examService } from '../services/examService';
import { Exam, Question } from '../types/system';

export default function AttendExam() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Phases: 'instructions' | 'active' | 'submitting'
  const [phase, setPhase] = useState<'instructions' | 'active' | 'submitting'>('instructions');
  const [rulesAccepted, setRulesAccepted] = useState(false);

  // Active exam session state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // { questionId: 'A' | 'B' | 'C' | 'D' }
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(1800); // default 30 mins
  const [totalSeconds, setTotalSeconds] = useState<number>(1800);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch exam details
  useEffect(() => {
    if (!id) return;

    const loadExam = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await examService.getStudentExamForAttempt(id);
        setExam(data.exam);

        if (data.exam.isLocked || data.exam.attemptStatus === 'Submitted') {
          setIsLocked(true);
        }

        const durationSeconds = (data.exam.duration || 30) * 60;
        setSecondsLeft(durationSeconds);
        setTotalSeconds(durationSeconds);
      } catch (err: any) {
        setError(err.message || 'Failed to load examination');
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [id]);

  // Submit Handler
  const handleSubmitExam = useCallback(async () => {
    if (!id || !exam || isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const timeTaken = totalSeconds - secondsLeft;
      const formattedAnswers = (exam.questions || []).map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] || null,
      }));

      const res = await examService.submitExam(id, formattedAnswers, Math.max(1, timeTaken));

      setShowSubmitModal(false);
      // Navigate to result review
      const attemptId = res.result?.attemptId || res.attempt?.id;
      if (attemptId) {
        navigate(`/student/results/${attemptId}`);
      } else {
        navigate('/student/results');
      }
    } catch (err: any) {
      alert(err.message || 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  }, [id, exam, isSubmitting, totalSeconds, secondsLeft, answers, navigate]);

  // Countdown Timer
  useEffect(() => {
    if (phase !== 'active') return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // AUTO-SUBMIT ON EXPIRATION
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, handleSubmitExam]);

  // Start exam session
  const handleStartExam = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await examService.startExam(id);
      setPhase('active');
    } catch (err: any) {
      if (err.response?.data?.isLocked || err.message?.includes('already')) {
        setIsLocked(true);
      } else {
        alert(err.message || 'Failed to start exam');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const clearSelection = (questionId: string) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center space-y-3">
          <Clock className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <div className="text-xs font-semibold text-slate-500">Preparing examination workspace...</div>
        </div>
      </div>
    );
  }

  // If already locked / completed
  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Examination Locked</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            You have already completed this examination. In accordance with university single-attempt evaluation policies, tests cannot be repeated.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/student/results"
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold shadow-sm"
            >
              View Your Score & Review
            </Link>
            <Link
              to="/student/exams"
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Back to Available Exams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-lg space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Unable to Open Exam</h2>
          <p className="text-xs text-rose-600">{error || 'Exam not found'}</p>
          <Link
            to="/student/exams"
            className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Return to Available Exams
          </Link>
        </div>
      </div>
    );
  }

  const questions = exam.questions || [];
  const currentQuestion: Question | undefined = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = secondsLeft < 300; // under 5 minutes

  // -------------------------------------------------------------
  // PHASE 1: PRE-EXAM INSTRUCTIONS SCREEN
  // -------------------------------------------------------------
  if (phase === 'instructions') {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 flex flex-col justify-center items-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          <Link
            to="/student/exams"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel and return to exams</span>
          </Link>

          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              {exam.subject}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {exam.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {exam.description || 'Timed multiple-choice evaluation.'}
            </p>
          </div>

          {/* Test Specs Grid */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-center">
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400">Time Limit</div>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{exam.duration} mins</div>
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400">Questions</div>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{questions.length}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400">Total Marks</div>
              <div className="text-lg font-bold text-indigo-600 font-mono mt-0.5">{exam.totalMarks}</div>
            </div>
          </div>

          {/* Official Instructions */}
          <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-purple-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Important Instructions:</span>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-slate-600">{exam.instructions}</p>
          </div>

          {/* Integrity Warning */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <div className="font-bold">Single Attempt Lock Policy</div>
              <div>
                You are permitted only ONE attempt for this examination. When you finish or when the timer reaches 00:00, your exam will automatically submit and lock.
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <label className="flex items-start space-x-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={rulesAccepted}
              onChange={(e) => setRulesAccepted(e.target.checked)}
              className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-slate-700">
              I certify that I am ready to begin. I understand the timer will start immediately and that only one attempt is permitted.
            </span>
          </label>

          {/* Begin Button */}
          <button
            type="button"
            disabled={!rulesAccepted}
            onClick={handleStartExam}
            className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Begin Examination Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PHASE 2: ACTIVE TIMED EXAMINATION ROOM
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      {/* Top Fixed Exam Header with Timer */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">
            {exam.subject}
          </span>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
            {exam.title}
          </h1>
        </div>

        {/* Live Timer Display */}
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-mono text-sm sm:text-base font-extrabold border transition-colors ${
              isTimeCritical
                ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600' : 'text-purple-600'}`} />
            <span>{formatTime(secondsLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Exam</span>
          </button>
        </div>
      </header>

      {/* Main Exam Body */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left: Active Question Panel */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          {currentQuestion ? (
            <div className="space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-bold font-mono text-xs">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-slate-400">• {currentQuestion.marks} Mark{currentQuestion.marks > 1 ? 's' : ''}</span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    flagged[currentQuestion.id]
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flagged[currentQuestion.id] ? 'Flagged' : 'Flag for Review'}</span>
                </button>
              </div>

              {/* Question Prompt */}
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQuestion.question}
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-3 pt-2">
                {[
                  { key: 'A', text: currentQuestion.optionA },
                  { key: 'B', text: currentQuestion.optionB },
                  { key: 'C', text: currentQuestion.optionC },
                  { key: 'D', text: currentQuestion.optionD },
                ].map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.key;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => selectOption(currentQuestion.id, opt.key)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center space-x-3.5 ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/40 text-purple-950 font-medium'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className="text-xs sm:text-sm">{opt.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">No question selected</div>
          )}

          {/* Bottom Question Navigation Controls */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentQuestion && answers[currentQuestion.id] && (
              <button
                type="button"
                onClick={() => clearSelection(currentQuestion.id)}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Selection</span>
              </button>
            )}

            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors flex items-center space-x-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <span>Finish & Submit</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Navigation Palette */}
        <div className="w-full lg:w-80 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5 shrink-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Question Palette
              </h3>
              <span className="text-xs text-purple-600 font-mono font-bold">
                {answeredCount} / {questions.length} Answered
              </span>
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-3 gap-2 py-3 text-[10px] text-slate-500 border-b border-slate-100">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Flagged</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span>Unanswered</span>
              </div>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-5 gap-2 pt-3">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flagged[q.id];
                const isCurrent = idx === currentIdx;

                let btnBg = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                if (isAnswered) btnBg = 'bg-emerald-500 text-white font-bold';
                if (isFlagged) btnBg = 'bg-amber-400 text-white font-bold';

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl font-mono text-xs transition-all relative ${btnBg} ${
                      isCurrent ? 'ring-2 ring-purple-600 ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Entire Examination</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-center font-bold text-slate-900 text-lg">
              Confirm Final Submission
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <strong className="text-slate-900 font-mono">{questions.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <strong className="text-emerald-600 font-mono">{answeredCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Unanswered Questions:</span>
                <strong className="text-rose-600 font-mono">{questions.length - answeredCount}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center leading-relaxed">
              Once submitted, your answers will be graded by the server and locked immediately. You cannot edit or re-attempt.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Return to Exam
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitExam}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 disabled:opacity-60"
              >
                {isSubmitting ? 'Grading Answers...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
