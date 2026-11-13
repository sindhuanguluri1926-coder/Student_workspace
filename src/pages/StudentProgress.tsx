import React, { useEffect, useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  X,
  FileText,
  User,
} from 'lucide-react';
import { examService } from '../services/examService';
import { StudentProgressRecord } from '../types/system';

export default function StudentProgress() {
  const [records, setRecords] = useState<StudentProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examService.getStudentProgress();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch student progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleOpenDetails = async (rec: StudentProgressRecord) => {
    if (rec.status !== 'Submitted' || !rec.attemptId) {
      return;
    }
    try {
      // Find attempt from results
      const allResults = await examService.getAdminResults();
      const match = allResults.find((r) => r.id === rec.attemptId || (r as any)._id === rec.attemptId);
      setSelectedRecord(match || rec);
    } catch (e) {
      setSelectedRecord(rec);
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.examTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
          <Activity className="w-4 h-4" />
          <span>Evaluation Monitoring</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Progress & Attempt Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track attempt states across students and inspect individual answer sheets
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, reg no, or exam..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Attempt Statuses</option>
            <option value="Submitted">Submitted (Graded)</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading progress matrix...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No student progress records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Registration No</th>
                  <th className="py-3.5 px-4">Exam Title</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Score & Marks</th>
                  <th className="py-3.5 px-4">Percentage</th>
                  <th className="py-3.5 px-4">Result</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">{r.studentName}</td>
                    <td className="py-4 px-4 font-mono text-indigo-700 font-semibold">
                      {r.registrationNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{r.examTitle}</div>
                      <div className="text-[11px] text-slate-400">{r.subject}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          r.status === 'Submitted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      {r.status === 'Submitted' ? (
                        <span className="font-bold text-slate-900">
                          {r.score} / {r.totalMarks}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono">
                      {r.status === 'Submitted' ? (
                        <span className="font-bold text-indigo-600">{r.percentage}%</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {r.status === 'Submitted' ? (
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            r.result === 'Pass'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {r.result}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Pending</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {r.status === 'Submitted' ? (
                        <button
                          onClick={() => handleOpenDetails(r)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Sheet</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Not submitted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Answer Sheet Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Student Submission Sheet: {selectedRecord.studentName}
                </h3>
                <span className="text-xs text-indigo-600 font-mono">
                  {selectedRecord.registrationNumber} • {selectedRecord.examTitle}
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-500">Score: </span>
                  <strong className="text-base font-bold text-slate-900 font-mono">
                    {selectedRecord.score} / {selectedRecord.totalMarks} ({selectedRecord.percentage}%)
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Status: </span>
                  <strong
                    className={`font-bold ${
                      selectedRecord.result === 'Pass' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {selectedRecord.result?.toUpperCase()}
                  </strong>
                </div>
                {selectedRecord.timeTakenSeconds > 0 && (
                  <div>
                    <span className="text-slate-500">Time Taken: </span>
                    <strong className="text-slate-800 font-mono">
                      {Math.floor(selectedRecord.timeTakenSeconds / 60)}m {selectedRecord.timeTakenSeconds % 60}s
                    </strong>
                  </div>
                )}
              </div>

              <div className="font-bold text-slate-900 text-sm pt-2">
                Question Responses:
              </div>

              {selectedRecord.answers && selectedRecord.answers.length > 0 ? (
                <div className="space-y-3">
                  {selectedRecord.answers.map((ans: any, idx: number) => (
                    <div
                      key={ans.questionId || idx}
                      className={`p-3.5 rounded-xl border ${
                        ans.isCorrect
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-rose-200 bg-rose-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 font-bold text-slate-900">
                        <span>Q{idx + 1}: {ans.questionText || `Question ${idx + 1}`}</span>
                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded font-bold ${
                            ans.isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ans.marksAwarded} / {ans.totalMarks || 1} Marks
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-2">
                        <div>
                          Student selected:{' '}
                          <strong
                            className={ans.isCorrect ? 'text-emerald-700' : 'text-rose-700 font-bold'}
                          >
                            Option {ans.selectedOption || 'None'}
                          </strong>
                        </div>
                        <div>
                          Correct answer:{' '}
                          <strong className="text-emerald-700 font-bold">
                            Option {ans.correctAnswer}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400">
                  Full question breakdown not available for this record.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
