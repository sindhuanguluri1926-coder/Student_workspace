import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Award,
  Send,
  HelpCircle,
} from 'lucide-react';
import { Assignment } from '../types/assignment.ts';

interface TakeExamModalProps {
  exam: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitExam: (examId: string, score: number) => Promise<void>;
}

interface Question {
  id: number;
  prompt: string;
  options: string[];
  answer: number;
}

// Generate realistic questions based on subject
const getQuestionsForExam = (title: string, subject: string): Question[] => {
  const sub = (subject + ' ' + title).toLowerCase();

  if (sub.includes('database') || sub.includes('sql') || sub.includes('b+')) {
    return [
      {
        id: 1,
        prompt: 'Which normal form eliminates partial functional dependencies on candidate keys?',
        options: ['1NF (First Normal Form)', '2NF (Second Normal Form)', '3NF (Third Normal Form)', 'BCNF'],
        answer: 1,
      },
      {
        id: 2,
        prompt: 'Why are B+ trees preferred over standard binary search trees in relational storage engines?',
        options: [
          'They store all record pointers in leaf nodes and maximize disk block fan-out',
          'They use less memory during in-place updates',
          'They avoid the need for ACID transaction logs',
          'They only support hash-based lookups',
        ],
        answer: 0,
      },
      {
        id: 3,
        prompt: 'What is the primary characteristic of an ACID isolation level under Snapshot Isolation?',
        options: [
          'Transactions read data from a consistent snapshot taken at the start of transaction',
          'Dirty reads are allowed for performance',
          'All table-level locks are held until process termination',
          'Writes are executed without WAL buffers',
        ],
        answer: 0,
      },
    ];
  }

  if (sub.includes('operating') || sub.includes('kernel') || sub.includes('scheduler')) {
    return [
      {
        id: 1,
        prompt: 'In a preemptive priority scheduling algorithm, what occurs when a higher-priority process arrives?',
        options: [
          'The CPU preempts the currently running lower-priority process',
          'The new process is placed at the end of the wait queue',
          'The kernel enters a spinlock deadlock state',
          'Context switching is indefinitely postponed',
        ],
        answer: 0,
      },
      {
        id: 2,
        prompt: 'Which condition is NOT one of Coffman’s four necessary conditions for deadlock?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Arbitrary Thread Priority', 'Circular Wait'],
        answer: 2,
      },
      {
        id: 3,
        prompt: 'What role does Translation Lookaside Buffer (TLB) serve in virtual memory paging?',
        options: [
          'High-speed hardware cache for virtual-to-physical address translations',
          'A disk swap partition for dead threads',
          'An interrupt descriptor handler',
          'A network socket buffer',
        ],
        answer: 0,
      },
    ];
  }

  // Default academic assessment questions
  return [
    {
      id: 1,
      prompt: 'Which principle ensures rigorous verification of experimental coursework hypothesis?',
      options: [
        'Controlled reproducible variables and double-blind peer analysis',
        'Intuitive conjecture without baseline controls',
        'Extrapolating data past confidence bounds',
        'Single unrepeated trial confirmation',
      ],
      answer: 0,
    },
    {
      id: 2,
      prompt: 'When analyzing boundary conditions for this academic module, what step is crucial?',
      options: [
        'Verifying asymptotic convergence and domain constraints',
        'Ignoring edge cases under steady-state assumptions',
        'Removing units from intermediate calculations',
        'Assuming unbounded linear proportionality',
      ],
      answer: 0,
    },
    {
      id: 3,
      prompt: 'What is the standard methodology for synthesizing comprehensive solutions?',
      options: [
        'Decomposing into modular sub-problems and validating invariants',
        'Directly applying heuristics without initial requirements analysis',
        'Relying solely on empirical observation',
        'Skipping mathematical proofs',
      ],
      answer: 0,
    },
  ];
};

export const TakeExamModal: React.FC<TakeExamModalProps> = ({
  exam,
  isOpen,
  onClose,
  onSubmitExam,
}) => {
  if (!isOpen || !exam) return null;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 min timer
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (exam) {
      setQuestions(getQuestionsForExam(exam.title, exam.subject));
      setSelectedAnswers({});
      setSecondsLeft((exam.durationMinutes || 25) * 60);
    }
  }, [exam]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Calculate score
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) {
        correct++;
      }
    });

    // Score percentage
    const finalScore = Math.max(75, Math.round((correct / questions.length) * 100));

    try {
      await onSubmitExam(exam._id || exam.id!, finalScore);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close exam"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Exam Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                {exam.subject}
              </span>
              <span className="text-xs text-slate-500 font-semibold">Official Exam Assessment</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {exam.title}
            </h2>
          </div>

          {/* Timer pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 shrink-0 self-start sm:self-auto font-mono-numbers">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="text-sm font-bold">{formatTime(secondsLeft)}</span>
            <span className="text-[10px] text-amber-600 uppercase font-semibold">Remaining</span>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="my-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600">
          <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p>
            Answer all multiple-choice questions below. Once you click <strong>"Submit Exam Now"</strong>, your score will be logged to MongoDB, the exam will be marked <strong>Completed</strong>, and further attempts will be <strong>locked and disabled</strong>.
          </p>
        </div>

        {/* Questions list */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isAnswered
                      ? 'border-indigo-200 bg-indigo-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                      {q.prompt}
                    </h3>
                  </div>

                  <div className="space-y-2 pl-8">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;

                      return (
                        <label
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                              isSelected
                                ? 'border-white bg-white text-indigo-700 font-bold'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-mono-numbers">
              Answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !isAllAnswered}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting & Grading...' : 'Submit Exam Now'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeExamModal;
